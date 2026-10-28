import { afterEach, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import chat from './chat.js'

const originalApiKey = process.env.GEMINI_API_KEY
const originalModel = process.env.GEMINI_MODEL
const originalFetch = globalThis.fetch

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

afterEach(() => {
    if (originalApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = originalApiKey
    if (originalModel === undefined) delete process.env.GEMINI_MODEL
    else process.env.GEMINI_MODEL = originalModel
    globalThis.fetch = originalFetch
})

describe('POST /api/chat', () => {
    it('falls back to currently supported Gemini text models', async () => {
        process.env.GEMINI_API_KEY = 'test-key'
        process.env.GEMINI_MODEL = 'gemini-flash-latest'
        const modelNames = []
        globalThis.fetch = async (url) => {
            modelNames.push(decodeURIComponent(url.match(/models\/([^:]+)/)[1]))
            if (modelNames.length === 1) {
                return {
                    ok: false,
                    status: 503,
                    text: async () => 'temporarily unavailable',
                }
            }
            return {
                ok: true,
                json: async () => ({
                    candidates: [{ content: { parts: [{ text: 'A warm, elegant palette.' }] } }],
                }),
            }
        }

        const response = createResponse()
        await chat({ method: 'POST', body: { message: 'Suggest wedding colors.' } }, response)

        assert.equal(response.statusCode, 200)
        assert.equal(response.body.reply, 'A warm, elegant palette.')
        assert.deepEqual(modelNames, ['gemini-flash-latest', 'gemini-flash-lite-latest'])
        assert.ok(!modelNames.includes('gemini-1.5-flash'))
        assert.ok(!modelNames.includes('gemini-2.5-flash'))
    })
})
