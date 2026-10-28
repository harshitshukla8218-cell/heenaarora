import { useState, useMemo } from 'react'
import { catalogueItems } from '../data/catalogueData'

export default function CataloguePage({
    onBackToHome,
    onQuickView,
    onAddToBag,
    WhatsAppIcon,
    WA_PHONE = '918340319206',
}) {
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [selectedOccasion, setSelectedOccasion] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('featured')
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'lookbook'
    const [downloadModalOpen, setDownloadModalOpen] = useState(false)
    const [downloadEmail, setDownloadEmail] = useState('')
    const [downloadSuccess, setDownloadSuccess] = useState(false)

    const categories = ['All', 'Sarees', 'Lehengas', 'Kurta Sets', 'Indo-Western', 'Jewellery']
    const occasions = ['All', 'Bridal', 'Festive', 'Cocktail', 'Contemporary']

    const filteredItems = useMemo(() => {
        let result = catalogueItems.filter((item) => {
            const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
            const matchesOccasion = selectedOccasion === 'All' || item.occasion === selectedOccasion
            const matchesSearch =
                !searchQuery.trim() ||
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.craft.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase())

            return matchesCategory && matchesOccasion && matchesSearch
        })

        if (sortBy === 'price-low') {
            result.sort((a, b) => a.numericPrice - b.numericPrice)
        } else if (sortBy === 'price-high') {
            result.sort((a, b) => b.numericPrice - a.numericPrice)
        }

        return result
    }, [selectedCategory, selectedOccasion, searchQuery, sortBy])

    const getCatalogueWaLink = (item) => {
        const text = `Hi Heena Arora Fashion, I am inquiring from your 2026 Catalogue about: ${item.name} (${item.code}) - ${item.price}.\nFabric: ${item.fabric}\nCraft: ${item.craft}.\nCould you please share more pictures and sizing details?`
        return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`
    }

    const generalCatalogueWaLink = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
        'Hi Heena Arora Fashion, please send me the complete 2026 Couture Catalogue & Lookbook with price lists.'
    )}`

    const handleDownloadCatalogue = (e) => {
        e.preventDefault()
        setDownloadSuccess(true)
        // Trigger synthetic text file download summarizing the catalogue
        const content = `HEENA ARORA - HOUSE OF FASHION\nCOUTURE CATALOGUE & LOOKBOOK 2026\nSiddharth Vihar, Ghaziabad | WhatsApp: +91 83403 19206\n\n` +
            catalogueItems.map((item, i) => `${i + 1}. [${item.code}] ${item.name}\n   Category: ${item.category} | Occasion: ${item.occasion}\n   Fabric: ${item.fabric}\n   Craft: ${item.craft}\n   Price: ${item.price}\n   Timeline: ${item.timeline}\n`).join('\n')

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'Heena-Arora-Catalogue-2026.txt'
        link.click()
        URL.revokeObjectURL(url)

        setTimeout(() => {
            setDownloadModalOpen(false)
            setDownloadSuccess(false)
        }, 2200)
    }

    return (
        <div className="catalogue-page">
            {/* Top Navigation Bar */}
            <div className="catalogue-nav-bar">
                <button type="button" className="catalogue-back-btn" onClick={onBackToHome}>
                    ← Back to Boutique
                </button>
                <div className="catalogue-breadcrumbs">
                    <span onClick={onBackToHome}>Home</span>
                    <span className="sep">/</span>
                    <strong className="current">Couture Catalogue 2026</strong>
                </div>
                <div className="catalogue-view-toggles">
                    <button
                        type="button"
                        className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                        title="Grid View"
                    >
                        ⊞ Grid
                    </button>
                    <button
                        type="button"
                        className={`view-toggle-btn ${viewMode === 'lookbook' ? 'active' : ''}`}
                        onClick={() => setViewMode('lookbook')}
                        title="Lookbook Editorial View"
                    >
                        ⊟ Lookbook
                    </button>
                </div>
            </div>

            {/* Catalogue Hero Section */}
            <header className="catalogue-hero">
                <div className="catalogue-hero-content">
                    <p className="eyebrow">The 2026 Lookbook &amp; Archive</p>
                    <h1>
                        Heena Arora<br />
                        <em>Couture Catalogue</em>
                    </h1>
                    <p className="catalogue-hero-desc">
                        A curated archive of handcrafted Indian couture, fluid silk silhouettes,
                        zardozi embroidery, and bespoke tailoring from our Siddharth Vihar studio.
                    </p>

                    <div className="catalogue-stats-pill">
                        <span>✦ 12 Curated Masterpieces</span>
                        <span className="dot">•</span>
                        <span>100% Hand-Tailored in Delhi</span>
                        <span className="dot">•</span>
                        <span>Complimentary Worldwide Styling Advice</span>
                    </div>

                    <div className="catalogue-hero-actions">
                        <button
                            type="button"
                            className="button button-light"
                            onClick={() => setDownloadModalOpen(true)}
                        >
                            📥 Download Digital Catalogue <span>↗</span>
                        </button>
                        <a
                            href={generalCatalogueWaLink}
                            target="_blank"
                            rel="noreferrer"
                            className="button button-whatsapp"
                        >
                            {WhatsAppIcon && <WhatsAppIcon size={18} />}
                            Request Lookbook on WhatsApp <span>↗</span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Filter & Search Bar */}
            <div className="catalogue-filter-bar">
                <div className="catalogue-search-box">
                    <span className="search-icon">⌕</span>
                    <input
                        type="search"
                        placeholder="Search by piece, code (e.g. HA-CAT-01), fabric, or work..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Search catalogue"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            className="clear-search-btn"
                            onClick={() => setSearchQuery('')}
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="catalogue-category-tabs">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Occasion & Sort Row */}
                <div className="catalogue-sub-filter-row">
                    <div className="occasion-filter-group">
                        <span className="sub-filter-label">Occasion:</span>
                        {occasions.map((occ) => (
                            <button
                                key={occ}
                                type="button"
                                className={`occ-pill ${selectedOccasion === occ ? 'active' : ''}`}
                                onClick={() => setSelectedOccasion(occ)}
                            >
                                {occ}
                            </button>
                        ))}
                    </div>

                    <div className="sort-filter-group">
                        <label htmlFor="cat-sort">Sort:</label>
                        <select
                            id="cat-sort"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="featured">Featured Edit</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="catalogue-count-info">
                    <span>Showing {filteredItems.length} of {catalogueItems.length} designs</span>
                    {(selectedCategory !== 'All' || selectedOccasion !== 'All' || searchQuery) && (
                        <button
                            type="button"
                            className="reset-filters-btn"
                            onClick={() => {
                                setSelectedCategory('All')
                                setSelectedOccasion('All')
                                setSearchQuery('')
                            }}
                        >
                            Reset filters ↺
                        </button>
                    )}
                </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' ? (
                <div className="catalogue-grid-container">
                    {filteredItems.length ? (
                        <div className="catalogue-grid">
                            {filteredItems.map((item) => (
                                <article className="catalogue-card" key={item.id}>
                                    <div className="catalogue-card-media">
                                        <img src={item.image} alt={item.name} loading="lazy" />
                                        <div className="card-top-badges">
                                            <span className="card-code-badge">{item.code}</span>
                                            <span className="card-tag-badge">{item.tag}</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="catalogue-quick-btn"
                                            onClick={() => onQuickView && onQuickView(item)}
                                        >
                                            Quick View
                                        </button>
                                    </div>

                                    <div className="catalogue-card-content">
                                        <div className="card-occasion-meta">
                                            <span className="card-cat">{item.category}</span>
                                            <span className="card-occ">✦ {item.occasion}</span>
                                        </div>

                                        <h3 className="card-title">{item.name}</h3>

                                        <div className="card-specs-list">
                                            <p><strong>Fabric:</strong> {item.fabric}</p>
                                            <p><strong>Craft:</strong> {item.craft}</p>
                                            <p><strong>Timeline:</strong> {item.timeline}</p>
                                        </div>

                                        <div className="card-price-row">
                                            <strong className="card-price">{item.price}</strong>
                                            <span className="card-tax-note">Taxes included</span>
                                        </div>

                                        <div className="catalogue-card-actions">
                                            <button
                                                type="button"
                                                className="button button-dark catalogue-add-btn"
                                                onClick={() => onAddToBag && onAddToBag(item)}
                                            >
                                                Add to bag <span>+</span>
                                            </button>

                                            <a
                                                href={getCatalogueWaLink(item)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="catalogue-wa-btn"
                                                title={`Inquire about ${item.name} on WhatsApp`}
                                                aria-label={`Inquire about ${item.name} on WhatsApp`}
                                            >
                                                {WhatsAppIcon && <WhatsAppIcon size={18} />}
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="catalogue-empty">
                            <p>No catalogue designs match your current filters.</p>
                            <button
                                type="button"
                                className="button button-light"
                                onClick={() => {
                                    setSelectedCategory('All')
                                    setSelectedOccasion('All')
                                    setSearchQuery('')
                                }}
                            >
                                View full collection <span>↗</span>
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Lookbook Editorial View */
                <div className="catalogue-lookbook-container">
                    {filteredItems.map((item, index) => (
                        <section className="lookbook-spread" key={item.id}>
                            <div className="lookbook-image-pane">
                                <img src={item.image} alt={item.name} loading="lazy" />
                                <span className="lookbook-serial">
                                    LOOK {String(index + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                                </span>
                            </div>
                            <div className="lookbook-text-pane">
                                <span className="lookbook-code">{item.code}</span>
                                <p className="eyebrow">{item.category} • {item.occasion}</p>
                                <h2>{item.name}</h2>
                                <p className="lookbook-desc">{item.description}</p>

                                <div className="lookbook-attributes">
                                    <div className="lookbook-attr-col">
                                        <span>Artisanal Fabric</span>
                                        <strong>{item.fabric}</strong>
                                    </div>
                                    <div className="lookbook-attr-col">
                                        <span>Embroidery Work</span>
                                        <strong>{item.craft}</strong>
                                    </div>
                                    <div className="lookbook-attr-col">
                                        <span>Palette</span>
                                        <strong>{item.color}</strong>
                                    </div>
                                    <div className="lookbook-attr-col">
                                        <span>Production Timeline</span>
                                        <strong>{item.timeline}</strong>
                                    </div>
                                </div>

                                <div className="lookbook-price-bar">
                                    <strong>{item.price}</strong>
                                </div>

                                <div className="lookbook-action-row">
                                    <button
                                        type="button"
                                        className="button button-dark"
                                        onClick={() => onAddToBag && onAddToBag(item)}
                                    >
                                        Add to bag <span>+</span>
                                    </button>
                                    <a
                                        href={getCatalogueWaLink(item)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="button button-whatsapp"
                                    >
                                        {WhatsAppIcon && <WhatsAppIcon size={16} />}
                                        Inquire on WhatsApp <span>↗</span>
                                    </a>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>
            )}

            {/* Atelier Consultation Footer */}
            <div className="catalogue-consultation-banner">
                <div className="consultation-text">
                    <p className="eyebrow">Bespoke Design Service</p>
                    <h3>Seeking a bespoke custom fit or bridal trousseau consultation?</h3>
                    <p>
                        Heena Arora creates tailored garments made to your exact dimensions,
                        fabric desires, and personal occasion aesthetics.
                    </p>
                </div>
                <div className="consultation-cta">
                    <a
                        href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(
                            'Hi Heena Arora, I would like to book a bespoke bridal/trousseau design consultation.'
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="button button-light"
                    >
                        Book Studio Appointment <span>↗</span>
                    </a>
                </div>
            </div>

            {/* Download Catalogue Modal */}
            {downloadModalOpen && (
                <div className="overlay" onClick={() => setDownloadModalOpen(false)}>
                    <div className="download-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="modal-close"
                            onClick={() => setDownloadModalOpen(false)}
                            aria-label="Close"
                        >
                            ×
                        </button>
                        <p className="eyebrow">Direct Download &amp; Archive</p>
                        <h2>Download 2026 Catalogue</h2>
                        <p>
                            Get the complete Heena Arora 2026 Collection Catalogue containing
                            detailed garment specifications, hand-embroidery notes, and atelier pricing.
                        </p>

                        <form onSubmit={handleDownloadCatalogue}>
                            <input
                                type="email"
                                required
                                placeholder="Enter your email address"
                                value={downloadEmail}
                                onChange={(e) => setDownloadEmail(e.target.value)}
                                aria-label="Email address"
                            />
                            <button type="submit" className="button button-dark full-button">
                                Download Catalogue File Now <span>📥</span>
                            </button>
                        </form>

                        {downloadSuccess && (
                            <div className="download-success-msg">
                                ✓ Catalogue downloaded successfully! Our concierge is available on WhatsApp for any questions.
                            </div>
                        )}

                        <div className="download-or-wa">
                            <span>or have it sent directly:</span>
                            <a
                                href={generalCatalogueWaLink}
                                target="_blank"
                                rel="noreferrer"
                                className="button button-whatsapp full-button"
                            >
                                {WhatsAppIcon && <WhatsAppIcon size={18} />}
                                Send Catalogue to My WhatsApp <span>↗</span>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
