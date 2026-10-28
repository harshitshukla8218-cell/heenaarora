const MAX_IMAGE_BYTES = 1.5 * 1024 * 1024
const MAX_REQUEST_BYTES = 4.5 * 1024 * 1024
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

async function getRequestBody(request) {
    if (request.body && typeof request.body === 'object') return request.body

    const chunks = []
    let size = 0
    for await (const chunk of request) {
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
        size += buffer.length
        if (size > MAX_REQUEST_BYTES) {
            const error = new Error('Request body is too large.')
            error.statusCode = 413
            throw error
        }
        chunks.push(buffer)
    }

    return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
}

function sendJson(response, status, body) {
    response.statusCode = status
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(body))
}

function validateImage(image) {
    if (!image || typeof image.data !== 'string' || typeof image.mimeType !== 'string') {
        return { error: 'Upload a valid image to continue.' }
    }
    if (!ALLOWED_MIME_TYPES.has(image.mimeType)) {
        return { error: 'Use a JPEG, PNG, or WebP image.' }
    }
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(image.data) || image.data.length % 4 !== 0) {
        return { error: 'The uploaded image could not be read. Please choose another image.' }
    }

    const bytes = Buffer.from(image.data, 'base64')
    if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) {
        return { error: 'Each image must be smaller than 1.5 MB after processing.' }
    }

    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    const isPng = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    const isWebp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP'
    const signatureMatches = image.mimeType === 'image/jpeg' ? isJpeg
        : image.mimeType === 'image/png' ? isPng
            : isWebp

    if (!signatureMatches) {
        return { error: 'The image format does not match the uploaded file. Please choose another image.' }
    }

    return { data: image.data, mimeType: image.mimeType }
}

export default async function tryOn(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        return sendJson(response, 405, { error: 'Use POST to generate a try-on image.' })
    }

    let body
    try {
        body = await getRequestBody(request)
    } catch (error) {
        const status = error.statusCode === 413 ? 413 : 400
        const message = status === 413
            ? 'The request is too large. Reduce the image size and try again.'
            : 'Send a valid image request.'
        return sendJson(response, status, { error: message })
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return sendJson(response, 400, { error: 'Send a valid image request.' })
    }

    const garmentImage = validateImage(body.garmentImage)
    if (garmentImage.error) return sendJson(response, 400, { error: garmentImage.error })

    let modelImage = null
    if (body.modelImage) {
        modelImage = validateImage(body.modelImage)
        if (modelImage.error) return sendJson(response, 400, { error: modelImage.error })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return sendJson(response, 503, { error: 'AI image generation is not configured. Add GEMINI_API_KEY to the server environment.' })
    }

    const framing = body.framing === 'upper-body' ? 'upper-body portrait' : 'full-body fashion photograph'
    const prompt = [
        'Create a photorealistic virtual fashion try-on image using the supplied garment reference.',
        'Treat the garment image as the authoritative source for the garment. Preserve its recognizable colors, print, embroidery, fabric texture, cut, logos, and distinctive details as faithfully as possible.',
        modelImage
            ? 'Use the person in the second reference image as the person wearing the garment. Keep their face, identity, pose, body proportions, and visible setting consistent; change only the clothing needed to wear the referenced garment naturally.'
            : 'Show the garment worn by a tasteful adult fashion model with natural proportions and a neutral, elegant studio pose.',
        `Compose the result as a ${framing}.`,
        'Fit and drape the garment naturally with realistic folds, shadows, lighting, and perspective. Do not invent extra garments, accessories, text, or design details. Create one clean finished photograph, not a collage or a side-by-side comparison.',
        'This is a visual styling preview, not a representation or guarantee of exact physical fit.',
    ].join(' ')

    const input = [
        { type: 'text', text: prompt },
        { type: 'image', mime_type: garmentImage.mimeType, data: garmentImage.data },
    ]
    if (modelImage) {
        input.push({ type: 'image', mime_type: modelImage.mimeType, data: modelImage.data })
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)

    try {
        const providerResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                model: process.env.GEMINI_IMAGE_MODEL || 'gemini-nano-banana-2.1',
                input,
            }),
            signal: controller.signal,
        })

        if (!providerResponse.ok) {
            if (providerResponse.status === 429) {
                return sendJson(response, 429, {
                    error: 'Gemini image generation is rate-limited or out of quota. Wait and retry if this is temporary, or check your Google AI Studio project’s image-model quota and billing.',
                })
            }
            if (providerResponse.status === 401 || providerResponse.status === 403) {
                return sendJson(response, 503, { error: 'The image service credentials are missing or invalid. Check GEMINI_API_KEY.' })
            }
            if (providerResponse.status === 400 || providerResponse.status === 413) {
                return sendJson(response, 422, { error: 'The image service could not use these images. Try a clear photo of one garment.' })
            }
            console.error('Gemini image generation returned status', providerResponse.status)
            return sendJson(response, 502, { error: 'Image generation failed. Please try again shortly.' })
        }

        const result = await providerResponse.json()
        const outputImage = result.output_image
            || (Array.isArray(result.output) ? result.output.find((item) => item.type === 'image' && item.data) : null)
        if (
            typeof outputImage?.data !== 'string'
            || !/^[A-Za-z0-9+/]+={0,2}$/.test(outputImage.data)
            || outputImage.data.length % 4 !== 0
            || !ALLOWED_MIME_TYPES.has(outputImage.mime_type)
        ) {
            return sendJson(response, 502, { error: 'The image service did not return a usable try-on image. Please try again.' })
        }
        const generatedBytes = Buffer.from(outputImage.data, 'base64')
        if (!generatedBytes.length || generatedBytes.length > 20 * 1024 * 1024) {
            return sendJson(response, 502, { error: 'The image service did not return a usable try-on image. Please try again.' })
        }

        return sendJson(response, 200, {
            image: {
                data: outputImage.data,
                mimeType: outputImage.mime_type,
            },
        })
    } catch (error) {
        if (error.name === 'AbortError') {
            return sendJson(response, 504, { error: 'Image generation took too long. Please try again.' })
        }
        console.error('Gemini image generation request failed:', error.name || 'Unknown error')
        return sendJson(response, 502, { error: 'Could not reach the image service. Check your connection and try again.' })
    } finally {
        clearTimeout(timeout)
    }
}
