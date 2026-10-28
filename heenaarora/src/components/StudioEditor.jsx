import { useState } from 'react'

const silhouettes = [
    {
        id: 'saree',
        name: 'Pre-Draped Silk Saree',
        desc: 'Pre-pleated fluid drape with tailored structural pallu cinch',
        icon: '🥻',
        priceRange: '₹24,000 – ₹32,000',
        basePrice: 24000,
        timeline: '8–12 days',
        img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=80',
    },
    {
        id: 'lehenga',
        name: 'Flared Royal Lehenga',
        desc: '16-kali artisanal flare with can-can volume and custom waist yoke',
        icon: '👑',
        priceRange: '₹48,000 – ₹75,000',
        basePrice: 48000,
        timeline: '18–24 days',
        img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=700&q=80',
    },
    {
        id: 'anarkali',
        name: 'Anarkali & Trouser Set',
        desc: 'Floor-length flared silhouette paired with scalloped silk pants',
        icon: '✨',
        priceRange: '₹22,000 – ₹34,000',
        basePrice: 22000,
        timeline: '10–14 days',
        img: 'https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=700&q=80',
    },
    {
        id: 'fusion',
        name: 'Indo-Western Cape Set',
        desc: 'Dual-tone floor cape over tailored corset bustier and flared trousers',
        icon: '🌙',
        priceRange: '₹26,000 – ₹36,000',
        basePrice: 26000,
        timeline: '10–14 days',
        img: 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=700&q=80',
    },
]

const colorPalettes = [
    { name: 'Royal Burgundy', hex: '#4A0A19', accent: '#7A152E', glow: 'rgba(74, 10, 25, 0.45)' },
    { name: 'Champagne Gold', hex: '#E2C799', accent: '#C8A366', glow: 'rgba(226, 199, 153, 0.45)' },
    { name: 'Peacock Emerald', hex: '#0B4739', accent: '#156B58', glow: 'rgba(11, 71, 57, 0.45)' },
    { name: 'Blush Rose Ivory', hex: '#D89E9E', accent: '#A95E6F', glow: 'rgba(216, 158, 158, 0.45)' },
    { name: 'Midnight Obsidian', hex: '#1C1F2B', accent: '#373E54', glow: 'rgba(28, 31, 43, 0.45)' },
    { name: 'Sunset Rust Ochre', hex: '#9E4D1D', accent: '#C46A31', glow: 'rgba(158, 77, 29, 0.45)' },
]

const fabricTypes = [
    { name: 'Pure Mulberry Silk', desc: 'Liquid sheen with rich drape and heirloom longevity' },
    { name: 'Tissue Sheer Organza', desc: 'Whisper-light ethereal weave with radiant ambient luster' },
    { name: 'Handloom Chanderi Brocade', desc: 'Feather-soft woven texture with micro gold zari warps' },
    { name: 'Heavy Modal Satin', desc: 'Modern sculptural fluidity with crease-resistant comfort' },
]

const embroideryTypes = [
    { name: 'Handcrafted Zardozi & Dabka', desc: 'Heavy metallic bullion work with french knots & micro-beads' },
    { name: 'Delicate Gota Patti & Foil', desc: 'Heritage geometric ribbon appliqués reflecting festive warmth' },
    { name: 'Tone-on-Tone Resham Flora', desc: 'Intricate silk thread needlework with subtle matte finish' },
    { name: 'Minimal Zari & Contrast Piping', desc: 'Clean architectural lines tailored for contemporary soirees' },
]

const necklineOptions = [
    { name: 'Sweetheart Neck · Elbow Sleeve', desc: 'Classic regal bodice with piped sleeve hems' },
    { name: 'Royal Mandarin Collar · Sheer Sleeve', desc: 'High collar neckline with gossamer organza sleeves' },
    { name: 'Modern Plunge V · Sleeveless', desc: 'Contemporary crisp V cut with scalloped edges' },
    { name: 'Broad Curved Scoop · Bell Sleeve', desc: 'Statement romantic flare at wrists' },
]

const presets = [
    {
        title: '👑 The Royal Bride',
        silhouette: 'Flared Royal Lehenga',
        color: 'Royal Burgundy',
        fabric: 'Pure Mulberry Silk',
        embroidery: 'Handcrafted Zardozi & Dabka',
        cut: 'Sweetheart Neck · Elbow Sleeve',
    },
    {
        title: '🍸 Cocktail Radiance',
        silhouette: 'Pre-Draped Silk Saree',
        color: 'Champagne Gold',
        fabric: 'Heavy Modal Satin',
        embroidery: 'Minimal Zari & Contrast Piping',
        cut: 'Modern Plunge V · Sleeveless',
    },
    {
        title: '✨ Modern Sangeet Edit',
        silhouette: 'Indo-Western Cape Set',
        color: 'Peacock Emerald',
        fabric: 'Tissue Sheer Organza',
        embroidery: 'Delicate Gota Patti & Foil',
        cut: 'Royal Mandarin Collar · Sheer Sleeve',
    },
]

export default function StudioEditor({ onAddCustomToBag, WhatsAppIcon }) {
    const [selectedSilhouette, setSelectedSilhouette] = useState(silhouettes[0])
    const [selectedColor, setSelectedColor] = useState(colorPalettes[0])
    const [selectedFabric, setSelectedFabric] = useState(fabricTypes[0])
    const [selectedEmbroidery, setSelectedEmbroidery] = useState(embroideryTypes[0])
    const [selectedCut, setSelectedCut] = useState(necklineOptions[0])
    const [sizingType, setSizingType] = useState('Bespoke Made-to-Measure')
    const [addedNotification, setAddedNotification] = useState(false)

    const applyPreset = (preset) => {
        const sil = silhouettes.find((s) => s.name === preset.silhouette) || silhouettes[0]
        const col = colorPalettes.find((c) => c.name === preset.color) || colorPalettes[0]
        const fab = fabricTypes.find((f) => f.name === preset.fabric) || fabricTypes[0]
        const emb = embroideryTypes.find((e) => e.name === preset.embroidery) || embroideryTypes[0]
        const cut = necklineOptions.find((n) => n.name === preset.cut) || necklineOptions[0]

        setSelectedSilhouette(sil)
        setSelectedColor(col)
        setSelectedFabric(fab)
        setSelectedEmbroidery(emb)
        setSelectedCut(cut)
    }

    const waText = encodeURIComponent(
        `Hi Heena Arora Fashion! I designed a custom look in your Couture Editor:\n` +
        `• Silhouette: ${selectedSilhouette.name}\n` +
        `• Fabric: ${selectedFabric.name}\n` +
        `• Color: ${selectedColor.name}\n` +
        `• Embroidery Work: ${selectedEmbroidery.name}\n` +
        `• Cut & Sleeves: ${selectedCut.name}\n` +
        `• Sizing Preference: ${sizingType}\n` +
        `• Estimated Atelier Range: ${selectedSilhouette.priceRange}\n\n` +
        `Could you please share fabric swatches and consultation availability?`
    )

    const handleAddToBag = () => {
        const customProduct = {
            id: `custom-${Date.now()}`,
            name: `Bespoke ${selectedSilhouette.name}`,
            type: `${selectedFabric.name} · ${selectedColor.name}`,
            price: `₹${selectedSilhouette.basePrice.toLocaleString('en-IN')}`,
            image: selectedSilhouette.img,
            size: sizingType === 'Bespoke Made-to-Measure' ? 'Custom' : 'M',
            customSpecs: {
                silhouette: selectedSilhouette.name,
                color: selectedColor.name,
                fabric: selectedFabric.name,
                embroidery: selectedEmbroidery.name,
                neckline: selectedCut.name,
            },
        }

        if (onAddCustomToBag) {
            onAddCustomToBag(customProduct)
            setAddedNotification(true)
            setTimeout(() => setAddedNotification(false), 3000)
        }
    }

    return (
        <section className="section editor-section" id="editor">
            <div className="section-heading">
                <div>
                    <p className="eyebrow">Virtual Atelier &amp; Studio</p>
                    <h2>
                        The Couture Editor<br />
                        <em>Craft your bespoke signature look</em>
                    </h2>
                </div>
                <p className="editor-lead">
                    No standard sizing, no compromises. Select your silhouette, silk fabric,
                    color palette, and embroidery to co-design your one-of-a-kind ensemble.
                </p>
            </div>

            {/* Curated Style Presets */}
            <div className="editor-presets-bar">
                <span className="preset-label">Curated Editor Styles:</span>
                <div className="presets-list">
                    {presets.map((preset) => (
                        <button
                            key={preset.title}
                            className="preset-pill"
                            onClick={() => applyPreset(preset)}
                            type="button"
                        >
                            {preset.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="editor-studio-grid">
                {/* Left Column: Interactive Controls */}
                <div className="editor-controls-column">
                    {/* 1. Silhouette */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>01</span> Select Silhouette
                        </label>
                        <div className="silhouette-selector-grid">
                            {silhouettes.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`silhouette-card ${selectedSilhouette.id === item.id ? 'active' : ''}`}
                                    onClick={() => setSelectedSilhouette(item)}
                                >
                                    <span className="silhouette-icon">{item.icon}</span>
                                    <div className="silhouette-meta">
                                        <h4>{item.name}</h4>
                                        <p>{item.desc}</p>
                                    </div>
                                    <span className="silhouette-check">✓</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 2. Color Palette */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>02</span> Color Palette &amp; Tone
                        </label>
                        <div className="color-swatches-row">
                            {colorPalettes.map((c) => (
                                <button
                                    key={c.name}
                                    type="button"
                                    className={`color-swatch-btn ${selectedColor.name === c.name ? 'active' : ''}`}
                                    onClick={() => setSelectedColor(c)}
                                    title={c.name}
                                >
                                    <span
                                        className="swatch-circle"
                                        style={{ backgroundColor: c.hex, boxShadow: `0 3px 10px ${c.glow}` }}
                                    />
                                    <span className="swatch-name">{c.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 3. Luxury Fabric */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>03</span> Silk &amp; Textile Selection
                        </label>
                        <div className="option-pills-grid">
                            {fabricTypes.map((fab) => (
                                <button
                                    key={fab.name}
                                    type="button"
                                    className={`editor-pill-card ${selectedFabric.name === fab.name ? 'active' : ''}`}
                                    onClick={() => setSelectedFabric(fab)}
                                >
                                    <strong>{fab.name}</strong>
                                    <small>{fab.desc}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 4. Hand Embroidery */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>04</span> Artisanal Embroidery Work
                        </label>
                        <div className="option-pills-grid">
                            {embroideryTypes.map((emb) => (
                                <button
                                    key={emb.name}
                                    type="button"
                                    className={`editor-pill-card ${selectedEmbroidery.name === emb.name ? 'active' : ''}`}
                                    onClick={() => setSelectedEmbroidery(emb)}
                                >
                                    <strong>{emb.name}</strong>
                                    <small>{emb.desc}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 5. Neckline & Sleeve Cut */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>05</span> Neckline &amp; Sleeve Profile
                        </label>
                        <div className="option-pills-grid">
                            {necklineOptions.map((cut) => (
                                <button
                                    key={cut.name}
                                    type="button"
                                    className={`editor-pill-card ${selectedCut.name === cut.name ? 'active' : ''}`}
                                    onClick={() => setSelectedCut(cut)}
                                >
                                    <strong>{cut.name}</strong>
                                    <small>{cut.desc}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 6. Measurement Preference */}
                    <div className="editor-group">
                        <label className="editor-group-title">
                            <span>06</span> Fit &amp; Tailoring Mode
                        </label>
                        <div className="size-mode-selector">
                            {['Bespoke Made-to-Measure', 'Standard Sizing (XS–XXL)'].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    className={`size-mode-btn ${sizingType === mode ? 'active' : ''}`}
                                    onClick={() => setSizingType(mode)}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Atelier Preview Board */}
                <div className="editor-preview-column">
                    <div className="atelier-board-card">
                        <div className="atelier-board-header">
                            <span className="atelier-badge">ATELIER SPECIFICATION SHEET</span>
                            <span className="atelier-serial">NO. HA-BESPOKE-{selectedSilhouette.id.toUpperCase()}</span>
                        </div>

                        {/* Visual Presentation Area */}
                        <div className="atelier-visual-wrapper">
                            <img
                                src={selectedSilhouette.img}
                                alt={selectedSilhouette.name}
                                className="atelier-visual-img"
                            />
                            <div
                                className="atelier-color-indicator"
                                style={{
                                    borderColor: selectedColor.accent,
                                    background: `linear-gradient(135deg, ${selectedColor.hex} 0%, rgba(20, 2, 6, 0.9) 100%)`,
                                }}
                            >
                                <span className="indicator-dot" style={{ backgroundColor: selectedColor.hex }} />
                                <span>{selectedColor.name}</span>
                            </div>
                        </div>

                        {/* Configuration Specifications */}
                        <div className="atelier-specs-body">
                            <h3>{selectedSilhouette.name}</h3>
                            <p className="atelier-specs-tagline">
                                Customized in {selectedFabric.name} with {selectedEmbroidery.name}
                            </p>

                            <div className="atelier-specs-grid">
                                <div className="spec-row">
                                    <span>Silhouette</span>
                                    <strong>{selectedSilhouette.name}</strong>
                                </div>
                                <div className="spec-row">
                                    <span>Fabric</span>
                                    <strong>{selectedFabric.name}</strong>
                                </div>
                                <div className="spec-row">
                                    <span>Palette</span>
                                    <strong style={{ color: selectedColor.hex === '#1C1F2B' ? '#bbb' : selectedColor.hex }}>
                                        {selectedColor.name}
                                    </strong>
                                </div>
                                <div className="spec-row">
                                    <span>Embroidery</span>
                                    <strong>{selectedEmbroidery.name}</strong>
                                </div>
                                <div className="spec-row">
                                    <span>Neckline &amp; Cut</span>
                                    <strong>{selectedCut.name}</strong>
                                </div>
                                <div className="spec-row">
                                    <span>Handcrafting Time</span>
                                    <strong>{selectedSilhouette.timeline}</strong>
                                </div>
                                <div className="spec-row price-spec-row">
                                    <span>Estimated Atelier Price</span>
                                    <strong className="atelier-price">{selectedSilhouette.priceRange}</strong>
                                </div>
                            </div>

                            {/* Direct Actions */}
                            <div className="atelier-actions">
                                <a
                                    href={`https://wa.me/918340319206?text=${waText}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="button button-whatsapp full-button atelier-wa-btn"
                                >
                                    {WhatsAppIcon && <WhatsAppIcon size={18} />}
                                    Order Custom Look on WhatsApp <span>↗</span>
                                </a>

                                <button
                                    type="button"
                                    className="button button-dark full-button"
                                    onClick={handleAddToBag}
                                >
                                    Add Custom Configuration to Bag <span>+</span>
                                </button>

                                {addedNotification && (
                                    <div className="atelier-toast">
                                        ✓ Bespoke design saved to your shopping bag!
                                    </div>
                                )}
                            </div>

                            {/* Editor's Letter */}
                            <div className="editor-memo">
                                <p className="memo-quote">
                                    “Every body is sculpted differently. When you choose your silhouette and cut,
                                    we drape and stitch it precisely to your posture and comfort.”
                                </p>
                                <p className="memo-author">— <strong>Heena Arora</strong>, Creative Director &amp; Founder</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
