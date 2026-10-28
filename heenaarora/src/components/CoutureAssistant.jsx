import { useState, useRef, useEffect } from 'react'

const skinToneOptions = [
    {
        id: 'fair-cool',
        name: 'Fair / Cool',
        undertone: 'Rosy & Porcelain',
        hex: '#F7DFD4',
        bestColors: 'Ruby Red, Emerald, Royal Sapphire, Icy Lavender, Silver',
    },
    {
        id: 'fair-warm',
        name: 'Fair / Warm',
        undertone: 'Peach & Ivory',
        hex: '#F3D2B8',
        bestColors: 'Coral, Rust Orange, Warm Burgundy, Sage, Warm Gold',
    },
    {
        id: 'wheatish-warm',
        name: 'Wheatish / Golden',
        undertone: 'Warm Golden & Honey',
        hex: '#DEAC85',
        bestColors: 'Peacock Blue, Deep Teal, Mustard, Crimson, Antique Gold',
    },
    {
        id: 'olive-neutral',
        name: 'Olive / Neutral',
        undertone: 'Earthy Olive & Tan',
        hex: '#C6956D',
        bestColors: 'Plum, Forest Green, Deep Wine, Warm Ivory, Champagne Gold',
    },
    {
        id: 'dusky-warm',
        name: 'Dusky / Bronze',
        undertone: 'Warm Bronze & Caramel',
        hex: '#9E6843',
        bestColors: 'Fuchsia Pink, Cobalt Blue, Burnt Ochre, Tangerine, Rich Gold',
    },
    {
        id: 'deep-rich',
        name: 'Deep / Espresso',
        undertone: 'Rich Espresso & Deep Bronze',
        hex: '#583928',
        bestColors: 'Vibrant Jewel Tones, Crimson, Canary Yellow, Bright Gold, Pure Silk Ivory',
    },
]

const bodyTypeOptions = [
    {
        id: 'hourglass',
        name: 'Hourglass',
        desc: 'Balanced bust & hips with a defined waist',
        icon: '⌛',
        keyTip: 'Fitted waists, pre-draped sarees, belted kurta sets',
    },
    {
        id: 'pear',
        name: 'Pear / Triangle',
        desc: 'Curvier hips & thighs, narrower shoulders',
        icon: '🍐',
        keyTip: 'A-line lehengas, statement embroidered blouses, cape sets',
    },
    {
        id: 'apple',
        name: 'Apple / Round',
        desc: 'Fuller midsection & bust, slender legs',
        icon: '🍎',
        keyTip: 'Empire waist anarkalis, vertical zardozi piping, flowing dupattas',
    },
    {
        id: 'rectangle',
        name: 'Rectangle / Athletic',
        desc: 'Even proportions, straight waistline',
        icon: '▮',
        keyTip: 'Flared tiered lehengas, peplum kurtas, belted fusion drapes',
    },
    {
        id: 'inverted-triangle',
        name: 'Inverted Triangle',
        desc: 'Broader shoulders & bust, narrower hips',
        icon: '🔻',
        keyTip: 'Voluminous flared skirts, V-necklines, subtle shoulder accents',
    },
    {
        id: 'petite',
        name: 'Petite',
        desc: 'Delicate frame, height under 5\'3"',
        icon: '✨',
        keyTip: 'Monochrome palettes, high-waisted silhouettes, vertical borders',
    },
]

const occasionOptions = [
    'Wedding & Bridal',
    'Cocktail & Reception',
    'Mehendi & Sangeet',
    'Dinner & Evening Soirée',
    'Festive Family Gathering',
    'Contemporary Daywear',
]

// Compress image on canvas to max 800x800 JPEG for efficient upload
function compressImage(fileOrBlob, maxWidth = 800, maxHeight = 800, quality = 0.82) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = reject
        reader.onload = () => {
            const img = new Image()
            img.onerror = reject
            img.onload = () => {
                let { width, height } = img
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
                }

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                const dataUrl = canvas.toDataURL('image/jpeg', quality)
                resolve({
                    dataUrl,
                    base64: dataUrl.split(',')[1],
                    mimeType: 'image/jpeg',
                })
            }
            img.src = reader.result
        }
        reader.readAsDataURL(fileOrBlob)
    })
}

export default function CoutureAssistant({ isOpen, onClose }) {
    const [selectedSkinTone, setSelectedSkinTone] = useState('')
    const [selectedBodyType, setSelectedBodyType] = useState('')
    const [selectedOccasion, setSelectedOccasion] = useState('Wedding & Bridal')
    const [userPrompt, setUserPrompt] = useState('')
    const [attachedImage, setAttachedImage] = useState(null) // { dataUrl, base64, mimeType }

    // Camera states
    const [cameraActive, setCameraActive] = useState(false)
    const [cameraFacing, setCameraFacing] = useState('user') // 'user' or 'environment'
    const [cameraError, setCameraError] = useState('')

    // AI states
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState('')
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState('studio') // 'studio' or 'result'

    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const fileInputRef = useRef(null)
    const nativeCameraInputRef = useRef(null)

    // Stop camera stream tracks directly without state mutation
    const stopCameraTracks = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
            streamRef.current = null
        }
    }

    // Stop camera stream and reset UI state
    const stopCamera = () => {
        stopCameraTracks()
        setCameraActive(false)
        setCameraError('')
    }

    // Start camera stream
    const startCamera = async (facing = cameraFacing) => {
        setCameraError('')
        stopCamera()
        try {
            if (!navigator?.mediaDevices?.getUserMedia) {
                // Fallback to native capture input
                if (nativeCameraInputRef.current) {
                    nativeCameraInputRef.current.click()
                } else {
                    setCameraError('Camera access is not supported on this browser.')
                }
                return
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facing,
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                },
                audio: false,
            })

            streamRef.current = stream
            setCameraActive(true)
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                await videoRef.current.play().catch(() => {})
            }
        } catch (err) {
            console.error('Camera error:', err)
            setCameraError('Could not access camera. Please check permissions or upload a photo instead.')
            setCameraActive(false)
        }
    }

    // Toggle camera front/back
    const toggleCameraFacing = () => {
        const nextFacing = cameraFacing === 'user' ? 'environment' : 'user'
        setCameraFacing(nextFacing)
        startCamera(nextFacing)
    }

    // Capture photo from camera stream
    const capturePhoto = () => {
        if (!videoRef.current) return
        const video = videoRef.current
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 480
        const ctx = canvas.getContext('2d')
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setAttachedImage({
            dataUrl,
            base64: dataUrl.split(',')[1],
            mimeType: 'image/jpeg',
        })
        stopCamera()
    }

    // Handle file upload
    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const compressed = await compressImage(file)
            setAttachedImage({
                dataUrl: compressed.dataUrl,
                base64: compressed.base64,
                mimeType: compressed.mimeType,
            })
        } catch (err) {
            console.error('Image compression failed:', err)
            setError('Could not process the uploaded photo. Please try another image.')
        } finally {
            if (e.target) e.target.value = ''
        }
    }

    // Cleanup camera tracks when component unmounts
    useEffect(() => {
        return () => {
            stopCameraTracks()
        }
    }, [])

    const handleModalClose = () => {
        stopCamera()
        onClose()
    }

    // Submit styling request to AI
    const handleStylingSubmit = async (customPrompt) => {
        const promptToUse = customPrompt || userPrompt
        setLoading(true)
        setError('')
        setActiveTab('result')

        try {
            const skinToneObj = skinToneOptions.find((s) => s.id === selectedSkinTone)
            const bodyTypeObj = bodyTypeOptions.find((b) => b.id === selectedBodyType)

            const payload = {
                message: promptToUse.trim(),
                bodyType: bodyTypeObj ? `${bodyTypeObj.name} (${bodyTypeObj.desc})` : '',
                skinTone: skinToneObj ? `${skinToneObj.name} (${skinToneObj.undertone})` : '',
                occasion: selectedOccasion,
                image: attachedImage
                    ? {
                          data: attachedImage.base64,
                          mimeType: attachedImage.mimeType,
                      }
                    : null,
            }

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await response.json()
            if (!response.ok) {
                throw new Error(data.error || 'The assistant could not complete your styling consultation.')
            }

            setResult(data.reply)
        } catch (err) {
            setError(err.message || 'Unable to connect to the styling assistant. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const resetStyling = () => {
        setSelectedSkinTone('')
        setSelectedBodyType('')
        setAttachedImage(null)
        setUserPrompt('')
        setResult('')
        setError('')
        setActiveTab('studio')
        stopCamera()
    }

    if (!isOpen) return null

    const currentSkin = skinToneOptions.find((s) => s.id === selectedSkinTone)
    const currentBody = bodyTypeOptions.find((b) => b.id === selectedBodyType)

    // Pre-filled WhatsApp message
    const waText = encodeURIComponent(
        `Hello Heena Arora Studio, I used your AI Styling Assistant!\n` +
        (selectedSkinTone ? `• Complexion: ${currentSkin?.name}\n` : '') +
        (selectedBodyType ? `• Body Type: ${currentBody?.name}\n` : '') +
        (selectedOccasion ? `• Occasion: ${selectedOccasion}\n` : '') +
        `I would love to explore outfits and bespoke tailoring for this.`
    )

    return (
        <div className="overlay assistant-overlay" onClick={handleModalClose}>
            <aside className="assistant-chat assistant-studio-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="assistant-chat-head">
                    <div className="assistant-brand-tag">
                        <span className="studio-pill">COUTURE AI STUDIO</span>
                        <h2>Personal Styling Director</h2>
                    </div>
                    <button className="assistant-close-btn" onClick={handleModalClose} aria-label="Close styling assistant">×</button>
                </div>

                {/* Mode Tabs */}
                <div className="studio-tabs">
                    <button
                        className={`studio-tab ${activeTab === 'studio' ? 'active' : ''}`}
                        onClick={() => setActiveTab('studio')}
                    >
                        1. Your Profile &amp; Photo
                    </button>
                    <button
                        className={`studio-tab ${activeTab === 'result' ? 'active' : ''}`}
                        onClick={() => setActiveTab('result')}
                    >
                        2. AI Styling Guide {result && '✓'}
                    </button>
                </div>

                {/* TAB 1: STUDIO CONTROLS */}
                {activeTab === 'studio' && (
                    <div className="studio-body">
                        {/* 1. Photo & Camera Section */}
                        <div className="studio-section">
                            <div className="section-label-row">
                                <span className="section-step">01</span>
                                <div>
                                    <h4>Your Photo or Outfit Reference</h4>
                                    <p>Take a selfie or upload an outfit to analyze colors and tones.</p>
                                </div>
                            </div>

                            {/* Camera Viewfinder (if camera open) */}
                            {cameraActive && (
                                <div className="camera-viewport">
                                    <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
                                    <div className="camera-overlay-frame">
                                        <span className="corner tl" />
                                        <span className="corner tr" />
                                        <span className="corner bl" />
                                        <span className="corner br" />
                                    </div>
                                    <div className="camera-controls">
                                        <button type="button" className="camera-btn flip" onClick={toggleCameraFacing} title="Switch Camera">
                                            ↻ Flip
                                        </button>
                                        <button type="button" className="camera-btn shutter" onClick={capturePhoto} title="Capture Photo">
                                            <span className="shutter-dot" />
                                        </button>
                                        <button type="button" className="camera-btn close" onClick={stopCamera} title="Cancel">
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                            {cameraError && <div className="studio-alert error">{cameraError}</div>}

                            {/* Photo attached preview */}
                            {attachedImage && !cameraActive && (
                                <div className="photo-preview-card">
                                    <img src={attachedImage.dataUrl} alt="Your attached reference" className="preview-thumb" />
                                    <div className="preview-details">
                                        <span className="preview-tag">✓ Photo Attached</span>
                                        <small>Ready for AI color &amp; silhouette analysis</small>
                                    </div>
                                    <div className="preview-actions">
                                        <button type="button" className="retake-btn" onClick={() => startCamera()}>Retake</button>
                                        <button type="button" className="remove-btn" onClick={() => setAttachedImage(null)}>✕ Remove</button>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons: Camera & Upload */}
                            {!cameraActive && !attachedImage && (
                                <div className="photo-action-grid">
                                    <button
                                        type="button"
                                        className="photo-action-btn camera-action"
                                        onClick={() => startCamera()}
                                    >
                                        <span className="action-icon">📷</span>
                                        <div>
                                            <strong>Take Live Photo</strong>
                                            <small>Use camera to check skin &amp; outfit</small>
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        className="photo-action-btn upload-action"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <span className="action-icon">🖼️</span>
                                        <div>
                                            <strong>Upload Image</strong>
                                            <small>Select from gallery or files</small>
                                        </div>
                                    </button>
                                </div>
                            )}

                            {/* Hidden file inputs */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                            <input
                                ref={nativeCameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="user"
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />
                        </div>

                        {/* 2. Skin Tone Selector */}
                        <div className="studio-section">
                            <div className="section-label-row">
                                <span className="section-step">02</span>
                                <div>
                                    <h4>Skin Tone &amp; Undertone</h4>
                                    <p>Select your complexion to discover your ideal flattering palette.</p>
                                </div>
                            </div>

                            <div className="skin-grid">
                                {skinToneOptions.map((tone) => {
                                    const isSelected = selectedSkinTone === tone.id
                                    return (
                                        <button
                                            key={tone.id}
                                            type="button"
                                            className={`skin-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedSkinTone(isSelected ? '' : tone.id)}
                                        >
                                            <span
                                                className="skin-swatch"
                                                style={{ backgroundColor: tone.hex }}
                                                aria-hidden="true"
                                            />
                                            <div className="skin-info">
                                                <strong>{tone.name}</strong>
                                                <small>{tone.undertone}</small>
                                            </div>
                                            {isSelected && <span className="skin-check">✓</span>}
                                        </button>
                                    )
                                })}
                            </div>

                            {currentSkin && (
                                <div className="palette-preview-pill">
                                    <span className="pill-dot" style={{ backgroundColor: currentSkin.hex }} />
                                    <span><strong>Ideal palette preview:</strong> {currentSkin.bestColors}</span>
                                </div>
                            )}
                        </div>

                        {/* 3. Body Type Selector */}
                        <div className="studio-section">
                            <div className="section-label-row">
                                <span className="section-step">03</span>
                                <div>
                                    <h4>Body Type &amp; Silhouettes</h4>
                                    <p>Select your body shape for tailored cuts, drapery, and proportions.</p>
                                </div>
                            </div>

                            <div className="body-type-grid">
                                {bodyTypeOptions.map((shape) => {
                                    const isSelected = selectedBodyType === shape.id
                                    return (
                                        <button
                                            key={shape.id}
                                            type="button"
                                            className={`body-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setSelectedBodyType(isSelected ? '' : shape.id)}
                                        >
                                            <span className="body-icon">{shape.icon}</span>
                                            <div className="body-meta">
                                                <strong>{shape.name}</strong>
                                                <small>{shape.desc}</small>
                                            </div>
                                            {isSelected && <span className="body-check">✓</span>}
                                        </button>
                                    )
                                })}
                            </div>

                            {currentBody && (
                                <div className="silhouette-preview-pill">
                                    <span>💡 <strong>Tailoring Focus:</strong> {currentBody.keyTip}</span>
                                </div>
                            )}
                        </div>

                        {/* 4. Occasion Selector */}
                        <div className="studio-section">
                            <div className="section-label-row">
                                <span className="section-step">04</span>
                                <div>
                                    <h4>Occasion</h4>
                                    <p>Where will you be wearing this look?</p>
                                </div>
                            </div>

                            <div className="occasion-chip-row">
                                {occasionOptions.map((occ) => (
                                    <button
                                        key={occ}
                                        type="button"
                                        className={`occasion-chip ${selectedOccasion === occ ? 'active' : ''}`}
                                        onClick={() => setSelectedOccasion(occ)}
                                    >
                                        {occ}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Custom Inquiry & Action */}
                        <div className="studio-section studio-action-box">
                            <label htmlFor="user-styling-note" className="custom-note-label">
                                Any specific fabric, colour preference or question? (Optional)
                            </label>
                            <input
                                id="user-styling-note"
                                className="custom-note-input"
                                value={userPrompt}
                                onChange={(e) => setUserPrompt(e.target.value)}
                                placeholder="E.g., Looking for a pastel silk saree or a draped lehenga..."
                            />

                            <div className="quick-action-row">
                                <button
                                    type="button"
                                    className="quick-preset-btn"
                                    onClick={() => handleStylingSubmit('Provide best color combinations and contrast pairing for my skin tone')}
                                    disabled={loading}
                                >
                                    🎨 Best Color Combinations
                                </button>
                                <button
                                    type="button"
                                    className="quick-preset-btn"
                                    onClick={() => handleStylingSubmit('Recommend flattering silhouettes and drape styles for my body type')}
                                    disabled={loading}
                                >
                                    👗 Flattering Silhouettes
                                </button>
                            </div>

                            <button
                                type="button"
                                className="button button-dark studio-submit-btn"
                                onClick={() => handleStylingSubmit()}
                                disabled={loading}
                            >
                                {loading ? 'Analyzing with Couture AI…' : '✨ Get Personalized Color & Outfit Guide ↗'}
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB 2: AI STYLING RESULTS */}
                {activeTab === 'result' && (
                    <div className="studio-body result-body">
                        {loading && (
                            <div className="styling-loading-card">
                                <div className="loading-spinner" />
                                <h3>Curating your personalized look…</h3>
                                <p>Our Couture AI is harmonizing your skin tone, body proportions, and Heena Arora's signature craftsmanship.</p>
                                <div className="loading-tags">
                                    {currentSkin && <span>Complexion: {currentSkin.name}</span>}
                                    {currentBody && <span>Body: {currentBody.name}</span>}
                                    {attachedImage && <span>Photo: Attached</span>}
                                </div>
                            </div>
                        )}

                        {error && !loading && (
                            <div className="studio-alert error">
                                <h4>Unable to complete consultation</h4>
                                <p>{error}</p>
                                <button
                                    type="button"
                                    className="button button-light"
                                    onClick={() => handleStylingSubmit()}
                                    style={{ marginTop: 10 }}
                                >
                                    Try Again
                                </button>
                            </div>
                        )}

                        {result && !loading && (
                            <div className="styling-result-card">
                                <div className="result-header">
                                    <span className="eyebrow">HEENA ARORA COUTURE ADVICE</span>
                                    <h3>Your Tailored Styling Guide</h3>
                                    <div className="selected-summary-pills">
                                        {currentSkin && <span className="summary-pill">🎨 {currentSkin.name}</span>}
                                        {currentBody && <span className="summary-pill">👗 {currentBody.name}</span>}
                                        {selectedOccasion && <span className="summary-pill">✨ {selectedOccasion}</span>}
                                        {attachedImage && <span className="summary-pill">📷 Photo Analyzed</span>}
                                    </div>
                                </div>

                                <div className="result-text-content">
                                    {result.split('\n\n').map((paragraph, idx) => {
                                        // Highlight headings
                                        if (paragraph.startsWith('#') || paragraph.match(/^[0-9]\./)) {
                                            return <div key={idx} className="result-section-block"><strong>{paragraph}</strong></div>
                                        }
                                        return <p key={idx}>{paragraph}</p>
                                    })}
                                </div>

                                <div className="result-cta-group">
                                    <a
                                        className="button button-dark wa-btn"
                                        href={`https://wa.me/918340319206?text=${waText}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        💬 Discuss This Look on WhatsApp <span>↗</span>
                                    </a>

                                    <div className="result-secondary-actions">
                                        <button
                                            type="button"
                                            className="text-link-btn"
                                            onClick={() => setActiveTab('studio')}
                                        >
                                            ← Adjust Skin Tone &amp; Body Type
                                        </button>
                                        <button
                                            type="button"
                                            className="text-link-btn"
                                            onClick={resetStyling}
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!loading && !result && !error && (
                            <div className="empty-result-prompt">
                                <span style={{ fontSize: '36px' }}>✨</span>
                                <h3>No consultation yet</h3>
                                <p>Select your skin tone, body shape, or take a photo to generate an instant color and outfit recommendation.</p>
                                <button
                                    type="button"
                                    className="button button-dark"
                                    onClick={() => setActiveTab('studio')}
                                >
                                    Open Styling Studio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </aside>
        </div>
    )
}
