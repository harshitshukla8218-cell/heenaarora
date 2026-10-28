import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import tryOn from './try-on.js'

const originalApiKey = process.env.GEMINI_API_KEY
const originalImageModel = process.env.GEMINI_IMAGE_MODEL
const originalFetch = globalThis.fetch
const pngData = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]).toString('base64')

function createRequest(body, method = 'POST') {
    return { method, body }
}

function createResponse() {
    return {
        headers: {},
        statusCode: 0,
        setHeader(name, value) {
            this.headers[name] = value
        },
        end(value) {
            this.body = JSON.parse(value)
        },
    }
}

async function callApi(body, method) {
    const response = createResponse()
    await tryOn(createRequest(body, method), response)
    return response
}

async function callApiWithStream(chunks) {
    const request = {
        method: 'POST',
        async *[Symbol.asyncIterator]() {
            yield* chunks
        },
    }
    const response = createResponse()
    await tryOn(request, response)
    return response
}

afterEach(() => {
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    if (originalImageModel === undefined) delete process.env.GEMINI_IMAGE_MODEL
    else process.env.GEMINI_IMAGE_MODEL = originalImageModel
    globalThis.fetch = originalFetch
})

describe('POST /api/try-on', () => {
    it('rejects methods other than POST', async () => {
        const response = await callApi({}, 'GET')
        assert.equal(response.statusCode, 405)
        assert.equal(response.headers.Allow, 'POST')
    })

    it('requires a valid garment image', async () => {
        const response = await callApi({})
        assert.equal(response.statusCode, 400)
        assert.match(response.body.error, /valid image/)
    })

    it('rejects invalid JSON and oversized request bodies', async () => {
        const invalidJson = await callApiWithStream(['{'])
        assert.equal(invalidJson.statusCode, 400)
        const oversized = await callApiWithStream([Buffer.alloc(4.5 * 1024 * 1024 + 1)])
        assert.equal(oversized.statusCode, 413)
    })

    it('rejects a MIME type that does not match the image bytes', async () => {
        const response = await callApi({
            garmentImage: { data: pngData, mimeType: 'image/jpeg' },
        })
        assert.equal(response.statusCode, 400)
        assert.match(response.body.error, /format/)
    })

    it('reports when the server API key is missing', async () => {
        delete process.env.GEMINI_API_KEY
        const response = await callApi({
            garmentImage: { data: pngData, mimeType: 'image/png' },
        })
        assert.equal(response.statusCode, 503)
    })

    it('sends image references to Gemini and returns the generated image', async () => {
        process.env.GEMINI_API_KEY = 'test-key'
        process.env.GEMINI_IMAGE_MODEL = 'test-image-model'
        let providerRequest
        globalThis.fetch = async (url, options) => {
            providerRequest = { url, options, body: JSON.parse(options.body) }
            return {
                ok: true,
                json: async () => ({
                    output_image: { data: pngData, mime_type: 'image/png' },
                }),
            }
        }

        const response = await callApi({
            garmentImage: { data: pngData, mimeType: 'image/png' },
            modelImage: { data: pngData, mimeType: 'image/png' },
            framing: 'upper-body',
        })

        assert.equal(response.statusCode, 200)
        assert.deepEqual(response.body.image, { data: pngData, mimeType: 'image/png' })
        assert.equal(providerRequest.url, 'https://generativelanguage.googleapis.com/v1beta/interactions')
        assert.equal(providerRequest.options.headers['x-goog-api-key'], 'test-key')
        assert.equal(providerRequest.body.model, 'test-image-model')
        assert.equal(providerRequest.body.input.filter((part) => part.type === 'image').length, 2)
    })

    it('returns a rate-limit message from the provider', async () => {
        process.env.GEMINI_API_KEY = 'test-key'
        globalThis.fetch = async () => ({ ok: false, status: 429 })
        const response = await callApi({
            garmentImage: { data: pngData, mimeType: 'image/png' },
        })
        assert.equal(response.statusCode, 429)
        assert.match(response.body.error, /quota/)
    })
})
