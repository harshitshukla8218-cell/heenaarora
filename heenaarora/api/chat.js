const instructions = `You are the chief couture styling director and personal fashion consultant for Heena Arora, a contemporary Indian luxury fashion house based in Ghaziabad and Delhi NCR.

Your expertise includes:
1. Indian skin tone colorimetry & undertone harmony (cool rosy, warm golden/peachy, wheatish/honey, olive/neutral, dusky bronze, deep espresso).
2. Body shape styling & structural cuts (Hourglass, Pear, Apple/Round, Rectangle/Athletic, Inverted Triangle, Petite).
3. Indian ethnic, bridal, and Indo-Western couture (sarees, lehengas, kurta sets, anarkalis, kaftans, fusion drapes).
4. Fabrics, textures & embroideries (handwoven silk, raw silk, organza, modal satin, georgette, zardozi, gota patti, threadwork).

When advising clients:
- Be warm, sophisticated, encouraging, and clear.
- Recommend specific, highly flattering COLOR COMBINATIONS:
  * Primary outfit colors (e.g., deep burgundy, sage green, ivory-gold, peacock blue, burnt rust, dusty rose).
  * Contrast accent / dupatta / blouse colors.
  * Metallic accents (antique gold, champagne gold, silver, oxidised copper, rose gold) suited to their skin undertone.
- Recommend flattering SILHOUETTES & CUTS suited to their body type (necklines, waistlines, lehenga flair, kurta length, drape style).
- Recommend suitable pieces inspired by Heena Arora's signature collections:
  * Aabha Silk Saree (handwoven silk statement)
  * Meher Kurta Set (embroidered festive set)
  * Gulnaar Draped Saree (pre-draped modern satin)
  * Chandni Organza Set (pearl organza kurta set)
  * Noor Collection (liquid silk & delicate radiance)
  * Bespoke Studio Customisation for custom measurements & embroidery.
- If a photo is attached, visually analyze their complexion, features, or outfit details with elegance and tact.
- Format your response with clear, elegant markdown headings and bullet points for readability.`

async function getRequestBody(request) {
    if (request.body && typeof request.body === 'object') return request.body

    let rawBody = ''
    for await (const chunk of request) {
        rawBody += chunk
        if (rawBody.length > 10000000) throw new Error('Request body is too large.')
    }
    return JSON.parse(rawBody || '{}')
}

function sendJson(response, status, body) {
    response.statusCode = status
    response.setHeader('Content-Type', 'application/json; charset=utf-8')
    response.end(JSON.stringify(body))
}

export default async function chat(request, response) {
    if (request.method !== 'POST') {
        response.setHeader('Allow', 'POST')
        return sendJson(response, 405, { error: 'Use POST to send a message.' })
    }

    let body
    try {
        body = await getRequestBody(request)
    } catch {
        return sendJson(response, 400, { error: 'Send a valid JSON message.' })
    }

    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const bodyType = typeof body.bodyType === 'string' ? body.bodyType.trim() : ''
    const skinTone = typeof body.skinTone === 'string' ? body.skinTone.trim() : ''
    const occasion = typeof body.occasion === 'string' ? body.occasion.trim() : ''
    const image = body.image && typeof body.image.data === 'string' ? body.image : null

    if (!message && !bodyType && !skinTone && !image) {
        return sendJson(response, 400, { error: 'Please provide a message, select styling options, or upload a photo.' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
        return sendJson(response, 503, { error: 'The assistant is not configured yet. Add GEMINI_API_KEY to the server environment.' })
    }

    // Build structured styling prompt
    const promptSections = []
    if (skinTone) promptSections.push(`- Skin Tone / Complexion: ${skinTone}`)
    if (bodyType) promptSections.push(`- Body Type / Shape: ${bodyType}`)
    if (occasion) promptSections.push(`- Occasion / Event: ${occasion}`)
    if (image) promptSections.push(`- Client Image: Photo attached for visual analysis.`)
    if (message) promptSections.push(`- Client Request / Goal: ${message}`)
    else promptSections.push(`- Client Request / Goal: Please provide personalized color combinations, flattering silhouettes, and outfit recommendations tailored to these attributes.`)

    const promptText = `Please advise this client for Heena Arora Couture:\n\n${promptSections.join('\n')}\n\nProvide:\n1. Recommended Color Combinations (Primary + Contrast + Metallic accent)\n2. Flattering Silhouettes & Drapery Tips\n3. Curated Outfit & Fabric Recommendations from Heena Arora\n4. Styling & Jewellery Finishing Touches`

    const userParts = []
    if (image?.data) {
        const cleanBase64 = image.data.replace(/^data:image\/[a-zA-Z+]+;base64,/, '')
        userParts.push({
            inlineData: {
                mimeType: image.mimeType || 'image/jpeg',
                data: cleanBase64,
            },
        })
    }
    userParts.push({ text: promptText })

    const candidateModels = Array.from(new Set([
        process.env.GEMINI_MODEL,
        'gemini-flash-latest',
        'gemini-flash-lite-latest',
        'gemini-3.8-flash',
    ].filter(Boolean)))

    let lastError = ''
    for (const currentModel of candidateModels) {
        try {
            const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(currentModel)}:generateContent?key=${encodeURIComponent(apiKey)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: instructions }] },
                    contents: [{ role: 'user', parts: userParts }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 900 },
                }),
            })

            if (!geminiResponse.ok) {
                const errText = await geminiResponse.text().catch(() => '')
                console.warn(`Model ${currentModel} returned ${geminiResponse.status}:`, errText)
                lastError = errText
                continue
            }

            const result = await geminiResponse.json()
            const reply = result.candidates?.[0]?.content?.parts
                ?.map((part) => part.text || '')
                .join('')
                .trim()

            if (reply) {
                return sendJson(response, 200, { reply })
            }
        } catch (err) {
            console.warn(`Error with model ${currentModel}:`, err)
            lastError = err.message
        }
    }

    if (lastError) {
        console.error('All Gemini model candidates failed. Last error:', lastError)
    }
    return sendJson(response, 502, { error: 'Gemini is currently experiencing high demand. Please try again in a few moments.' })
}