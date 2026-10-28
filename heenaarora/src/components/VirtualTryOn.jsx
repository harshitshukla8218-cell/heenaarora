import { useRef, useState } from 'react'
import './VirtualTryOn.css'

const MAX_SOURCE_BYTES = 12 * 1024 * 1024
const MAX_PROCESSED_BYTES = 1.4 * 1024 * 1024
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

async function processImage(file) {
    if (!ACCEPTED_TYPES.has(file.type)) {
        throw new Error('Choose a JPEG, PNG, or WebP image.')
    }
    if (file.size > MAX_SOURCE_BYTES) {
        throw new Error('Choose an image smaller than 12 MB.')
    }

    let bitmap
    try {
        bitmap = await createImageBitmap(file)
    } catch {
        throw new Error('This image could not be opened. Try another photo.')
    }

    try {
        const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(bitmap.width * scale))
        canvas.height = Math.max(1, Math.round(bitmap.height * scale))
        const context = canvas.getContext('2d')
        if (!context) throw new Error('Image processing is unavailable in this browser.')
        context.fillStyle = '#fff'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

        let quality = 0.88
        let dataUrl = canvas.toDataURL('image/jpeg', quality)
        while (dataUrl.length * 0.75 > MAX_PROCESSED_BYTES && quality > 0.5) {
            quality -= 0.1
            dataUrl = canvas.toDataURL('image/jpeg', quality)
        }
        if (dataUrl.length * 0.75 > MAX_PROCESSED_BYTES) {
            throw new Error('This image is too detailed to process. Choose a smaller image.')
        }

        return {
            data: dataUrl.split(',')[1],
            dataUrl,
            mimeType: 'image/jpeg',
        }
    } finally {
        bitmap.close()
    }
}

function ImageUploader({ title, description, image, onChange, onRemove, inputRef, optional = false }) {
    const [dragging, setDragging] = useState(false)
    const [error, setError] = useState('')

    const loadFile = async (file) => {
        setError('')
        try {
            onChange(await processImage(file))
        } catch (uploadError) {
            setError(uploadError.message)
        }
    }

    return (
        <section className="try-on-upload-section">
            <div className="try-on-label">
                <div>
                    <h3>{title}{optional && <span className="try-on-optional">Optional</span>}</h3>
                    <p>{description}</p>
                </div>
            </div>
            {image ? (
                <div className="try-on-image-preview">
                    <img src={image.dataUrl} alt={`${title} preview`} />
                    <div className="try-on-image-actions">
                        <button type="button" className="try-on-secondary" onClick={() => inputRef.current?.click()}>
                            Replace image
                        </button>
                        <button type="button" className="try-on-remove" onClick={onRemove}>Remove</button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    className={`try-on-dropzone ${dragging ? 'is-dragging' : ''}`}
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => {
                        event.preventDefault()
                        setDragging(true)
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(event) => {
                        event.preventDefault()
                        setDragging(false)
                        const file = event.dataTransfer.files?.[0]
                        if (file) loadFile(file)
                    }}
                    aria-label={`Upload ${title.toLowerCase()}`}
                >
                    <span className="try-on-upload-icon" aria-hidden="true">＋</span>
                    <strong>Choose an image or drag it here</strong>
                    <small>JPEG, PNG or WebP · up to 12 MB</small>
                </button>
            )}
            <input
                ref={inputRef}
                className="try-on-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (file) loadFile(file)
                    event.target.value = ''
                }}
                aria-label={`Select ${title.toLowerCase()} file`}
            />
            {error && <p className="try-on-inline-error" role="alert">{error}</p>}
        </section>
    )
}

export default function VirtualTryOn({ isOpen, onClose }) {
    const [garmentImage, setGarmentImage] = useState(null)
    const [modelImage, setModelImage] = useState(null)
    const [framing, setFraming] = useState('full-body')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const garmentInputRef = useRef(null)
    const modelInputRef = useRef(null)
    const inFlightRef = useRef(false)

    if (!isOpen) return null

    const generateTryOn = async () => {
        if (!garmentImage || inFlightRef.current) return
        inFlightRef.current = true
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await fetch('/api/try-on', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    garmentImage: { data: garmentImage.data, mimeType: garmentImage.mimeType },
                    modelImage: modelImage ? { data: modelImage.data, mimeType: modelImage.mimeType } : null,
                    framing,
                }),
            })
            let data
            try {
                data = await response.json()
            } catch {
                throw new Error('The image service returned an unreadable response. Please try again.')
            }
            if (!response.ok) throw new Error(data.error || 'Try-on generation failed. Please try again.')
            setResult(`data:${data.image.mimeType};base64,${data.image.data}`)
        } catch (requestError) {
            setError(requestError.message || 'Could not reach the image service. Check your connection and try again.')
        } finally {
            inFlightRef.current = false
            setLoading(false)
        }
    }

    const startAnother = () => {
        setResult(null)
        setGarmentImage(null)
        setError('')
    }

    const handleClose = () => {
        if (!loading) onClose()
    }

    return (
        <div className="try-on-overlay" onClick={handleClose}>
            <section
                className="try-on-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="try-on-title"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="try-on-header">
                    <div>
                        <span className="try-on-eyebrow">HEENA ARORA · COUTURE STUDIO</span>
                        <h2 id="try-on-title">AI Virtual Try-On</h2>
                        <p>A visual preview of a piece styled on a model, created from your garment photo.</p>
                    </div>
                    <button type="button" className="try-on-close" onClick={handleClose} disabled={loading} aria-label="Close virtual try-on">×</button>
                </header>

                {result ? (
                    <div className="try-on-result-view">
                        <img className="try-on-result-image" src={result} alt="AI-generated virtual try-on preview" />
                        <p className="try-on-disclaimer">AI-generated styling preview only; it does not guarantee exact fit, fabric behavior, or physical appearance.</p>
                        <div className="try-on-result-actions">
                            <a
                                className="try-on-primary"
                                href={result}
                                download={`heena-arora-virtual-try-on.${result.startsWith('data:image/jpeg') ? 'jpg' : result.startsWith('data:image/webp') ? 'webp' : 'png'}`}
                            >
                                Download preview
                            </a>
                            <button type="button" className="try-on-secondary" onClick={startAnother}>Try another garment</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="try-on-form">
                            <ImageUploader
                                title="Garment photo"
                                description="Use a clear image of one item, laid flat or on a hanger."
                                image={garmentImage}
                                onChange={setGarmentImage}
                                onRemove={() => setGarmentImage(null)}
                                inputRef={garmentInputRef}
                            />
                            <ImageUploader
                                title="Model reference"
                                description="Optionally add a person photo to guide the preview. Otherwise, a model is generated."
                                image={modelImage}
                                onChange={setModelImage}
                                onRemove={() => setModelImage(null)}
                                inputRef={modelInputRef}
                                optional
                            />
                            <label className="try-on-framing">
                                Preview framing
                                <select value={framing} onChange={(event) => setFraming(event.target.value)}>
                                    <option value="full-body">Full body</option>
                                    <option value="upper-body">Upper body</option>
                                </select>
                            </label>
                        </div>
                        <p className="try-on-privacy">Your images are processed for this request and are not saved by this app.</p>
                        {error && <p className="try-on-error" role="alert">{error}</p>}
                        {loading && (
                            <div className="try-on-loading" role="status">
                                <span className="try-on-spinner" aria-hidden="true" />
                                <span>Creating your preview… This can take up to a minute.</span>
                            </div>
                        )}
                        <div className="try-on-footer">
                            <button type="button" className="try-on-primary" onClick={generateTryOn} disabled={!garmentImage || loading}>
                                {loading ? 'Generating…' : 'Generate Try-On'}
                            </button>
                            <span>AI preview · not a fit guarantee</span>
                        </div>
                    </>
                )}
            </section>
        </div>
    )
}
