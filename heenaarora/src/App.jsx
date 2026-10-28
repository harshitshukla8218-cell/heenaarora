import { useState, useEffect } from 'react'
import CoutureAssistant from './components/CoutureAssistant'
import StudioEditor from './components/StudioEditor'
import CataloguePage from './components/CataloguePage'
import VirtualTryOn from './components/VirtualTryOn'
import './App.css'

const products = [
    { id: 1, name: 'Aabha Silk Saree', type: 'Handwoven silk saree', price: '₹24,500', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85', tag: 'New arrival' },
    { id: 2, name: 'Meher Kurta Set', type: 'Embroidered kurta set', price: '₹18,900', image: 'https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=900&q=85', tag: 'Bestseller' },
    { id: 3, name: 'Gulnaar Draped Saree', type: 'Pre-draped satin saree', price: '₹29,500', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=900&q=85', tag: 'Limited edition' },
    { id: 4, name: 'Chandni Organza Set', type: 'Pearl organza kurta set', price: '₹21,500', image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=900&q=85', tag: 'Ready to ship' },
]
const categories = [
    { name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85' },
    { name: 'Lehengas', image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=85' },
    { name: 'Kurta Sets', image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=85' },
    { name: 'Jewellery', image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=85' },
]
const menuGroups = {
    Women: ['Sarees', 'Lehengas', 'Kurta Sets', 'Dresses', 'Kaftans', 'Sharara Sets', 'Anarkalis', 'Co-ord Sets', 'Fusion Wear', 'Festive Wear', 'Party Wear'],
    Men: ['Kurtas', 'Kurta Sets', 'Nehru Jackets', 'Bandi Sets', 'Sherwanis', 'Indo-Western', 'Festive Shirts', 'Wedding Edit'],
    Bridal: ['Bridal Lehengas', 'Bridal Sarees', 'Reception', 'Engagement', 'Mehendi', 'Sangeet', 'Bridesmaids', 'Wedding Guest'],
    Jewellery: ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Bangles', 'Cuffs', 'Bridal Jewellery', 'Statement Jewellery'],
    Collections: ['Noor', 'Meher', 'Gulnaar', 'Aabha', 'Zariya', 'Chandni', 'Rangrez'],
}
const bestSellers = products.map((product, index) => ({ ...product, id: product.id + 10, tag: index === 0 ? 'Bestseller' : 'Most loved' }))
const instagramImages = ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=600&q=80']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const footerSections = [
    { title: 'Brand', links: ['About Us', 'Our Story', 'Our Philosophy', 'Our Craftsmanship', 'Our Heritage', 'Founder / Designer', 'Behind the Brand'] },
    { title: 'Shopping', links: ['Catalogue 2026', 'Couture Editor', 'Shop All', 'New Arrivals', 'Collections', 'Bestsellers', 'Bridal', 'Couture', 'Ready to Ship', 'Bespoke / Custom Orders', 'Size Guide'] },
    { title: 'Craft & Production', links: ['Our Craft', 'Production Process', 'Embroidery', 'Handwork', 'Fabrics & Textiles', 'Made-to-Order', 'From Sketch to Garment', 'Behind the Scenes'] },
    { title: 'Customer Support', links: ['Contact Us', 'FAQs', 'Shipping & Delivery', 'Returns & Exchanges', 'Order Tracking', 'Cancellation Policy', 'Payment Information', 'International Orders'] },
    { title: 'Journal', links: ['Blog', 'Journal', 'Fashion Stories', 'Heritage & Culture', 'Styling Guide', 'Bridal Journal', 'Press / Media', 'Events'] },
    { title: 'Business', links: ['Careers', 'Collaborations', 'Press', 'Stockists', 'Wholesale', 'Become a Partner', 'Influencer / Creator Collaborations', 'Corporate Enquiries'] },
    { title: 'Legal', links: ['Privacy Policy', 'Terms & Conditions', 'Shipping Policy', 'Return & Refund Policy', 'Cookie Policy', 'Accessibility', 'Disclaimer'] },
    { title: 'The House', links: ['Our Showroom', 'Store Locator', 'Trunk Shows', 'Appointments', 'Personal Styling', 'Concierge', 'Customisation', 'Book an Appointment', 'Gift Cards', 'Loyalty / Membership'] },
]

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span> }
function WhatsAppIcon({ size = 20, className = '' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill="currentColor"
            style={{ stroke: 'none' }}
            className={className}
            aria-hidden="true"
        >
            <path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .4 5.3.4 11.8c0 2.1.5 4.1 1.6 5.9L.3 24l6.5-1.7a11.8 11.8 0 0 0 5.3 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6-3.5-8.3Zm-8.4 18.1h-.1a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 0 1-1.5-5.1c0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9a9.8 9.8 0 0 1 2.9 6.9c0 5.5-4.4 9.9-9.5 9.9Zm5.4-7.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-1.5-.7-2.5-1.3-3.5-2.9-.3-.5.3-.5.8-1.7.1-.2 0-.4 0-.5 0-.2-.7-1.7-.9-2.3-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5 1.9.8 2.6.9 3.5.8.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4Z" />
        </svg>
    )
}
function SocialIcon({ type }) {
    if (type === 'instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" className="social-dot" /></svg>
    if (type === 'facebook') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3.3 0-5 1.8-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1Z" /></svg>
    return <WhatsAppIcon size={18} />
}
function App() {
    const [currentPage, setCurrentPage] = useState('home') // 'home' | 'catalogue'
    const [bag, setBag] = useState([]); const [wishlist, setWishlist] = useState([]); const [bagOpen, setBagOpen] = useState(false); const [searchOpen, setSearchOpen] = useState(false); const [menuOpen, setMenuOpen] = useState(false); const [activeMenu, setActiveMenu] = useState(null); const [query, setQuery] = useState(''); const [quickView, setQuickView] = useState(null); const [selectedSize, setSelectedSize] = useState('M'); const [assistantOpen, setAssistantOpen] = useState(false); const [tryOnOpen, setTryOnOpen] = useState(false)
    const visibleProducts = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
    const addToBag = (product, size = selectedSize) => { setBag((items) => [...items, { ...product, size }]); setBagOpen(true) }
    const toggleWishlist = (id) => setWishlist((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])

    const WA_PHONE = '918340319206'
    const getProductWaLink = (product, size) => {
        const text = `Hi Heena Arora Fashion, I am interested in inquiring/ordering: ${product.name}${size ? ` (Size: ${size})` : ''} - ${product.price}. Could you please share more details?`
        return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`
    }
    const getCartWaLink = () => {
        const itemsList = bag.map((item, idx) => `${idx + 1}. ${item.name} (${item.size || 'M'}) - ${item.price}`).join('\n')
        const total = bag.reduce((sum, item) => sum + Number(item.price.replace(/[₹,]/g, '')), 0).toLocaleString('en-IN')
        const text = `Hi Heena Arora Fashion, I would like to place an order for the items in my shopping bag:\n${itemsList}\nTotal: ₹${total}`
        return `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(text)}`
    }
    const websiteWaLink = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Hi Heena Arora Fashion, I am visiting your website and would love assistance with your designer collection.')}`

    useEffect(() => {
        const handleHash = () => {
            if (window.location.hash === '#catalogue') {
                setCurrentPage('catalogue')
                window.scrollTo({ top: 0, behavior: 'smooth' })
            } else if (window.location.hash === '#editor') {
                setCurrentPage('home')
                setTimeout(() => {
                    document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
                }, 80)
            } else if (window.location.hash === '#top' || window.location.hash === '#home' || !window.location.hash) {
                setCurrentPage('home')
            }
        }
        handleHash()
        window.addEventListener('hashchange', handleHash)
        return () => window.removeEventListener('hashchange', handleHash)
    }, [])

    const navigateToHome = () => {
        setCurrentPage('home')
        window.location.hash = '#top'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const navigateToCatalogue = () => {
        setCurrentPage('catalogue')
        window.location.hash = '#catalogue'
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    const navigateToEditor = () => {
        if (currentPage !== 'home') {
            setCurrentPage('home')
            window.location.hash = '#editor'
            setTimeout(() => {
                document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
            }, 80)
        } else {
            document.getElementById('editor')?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    return <div className="site-shell">
        <div className="announcement">Complimentary shipping across India <span>•</span> Easy returns on eligible products</div>
        <header className="header"><div className="header-top"><button className="text-button mobile-menu" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Icon>☰</Icon></button><button className="text-button" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search"><Icon>⌕</Icon><span className="desktop-only">Search</span></button><a href="#top" className="wordmark" onClick={(e) => { e.preventDefault(); navigateToHome() }}><span>HEENA ARORA</span><strong>FASHION</strong></a><div className="header-actions"><button className="text-button desktop-only"><Icon>♙</Icon> Account</button><button className="text-button desktop-only" onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); document.getElementById('new-arrivals')?.scrollIntoView() }}><Icon>♡</Icon> Wishlist</button><button className="text-button" onClick={() => setBagOpen(true)} aria-label="Open shopping bag"><Icon>♧</Icon><span className="desktop-only">Bag</span><b>{bag.length}</b></button></div></div>{searchOpen && <div className="search-bar"><Icon>⌕</Icon><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sarees, collections, craft..." /><button onClick={() => { setQuery(''); setSearchOpen(false) }}>Close</button></div>}<nav className="nav"><button className={`nav-trigger ${currentPage === 'home' ? 'active-nav' : ''}`} onClick={navigateToHome}>Home</button>{['Women', 'Men', 'Bridal', 'Jewellery', 'Collections'].map((item) => <button className="nav-trigger" key={item} onMouseEnter={() => setActiveMenu(item)} onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); setActiveMenu(activeMenu === item ? null : item) }}>{item}</button>)}<button className={`nav-trigger nav-highlight ${currentPage === 'catalogue' ? 'active-nav' : ''}`} onClick={navigateToCatalogue}>Catalogue <span className="nav-badge">2026</span></button><button className="nav-trigger" onClick={navigateToEditor}>Couture Editor</button><a href="#new-arrivals" onClick={() => { if (currentPage !== 'home') setCurrentPage('home') }}>New arrivals</a><a className="sale" href="#new-arrivals" onClick={() => { if (currentPage !== 'home') setCurrentPage('home') }}>Sale</a></nav>{activeMenu && menuGroups[activeMenu] && <div className="mega-menu" onMouseLeave={() => setActiveMenu(null)}><div><p className="eyebrow">Explore the edit</p><h3>{activeMenu}<br /><em>by Heena Arora</em></h3><a href="#new-arrivals" onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); setActiveMenu(null) }} className="underlined">Shop all <span>↗</span></a></div><div className="mega-links">{menuGroups[activeMenu].map((item) => <a href="#new-arrivals" key={item} onClick={() => { if (currentPage !== 'home') setCurrentPage('home'); setActiveMenu(null) }}>{item}<span>↗</span></a>)}</div><img src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=85" alt="Heena Arora editorial" /></div>}</header>
        {currentPage === 'catalogue' ? (
            <CataloguePage
                onBackToHome={navigateToHome}
                onQuickView={(item) => setQuickView(item)}
                onAddToBag={(item) => addToBag(item)}
                WhatsAppIcon={WhatsAppIcon}
                WA_PHONE={WA_PHONE}
            />
        ) : (
            <main id="top">
                <section className="hero" id="hero-campaign">
                    <a href="#new-arrivals" className="hero-banner-link" aria-label="Heena Arora Fashion - Explore New Arrivals Collection">
                        <picture className="hero-picture">
                            <source media="(max-width: 640px)" srcSet="/front-page-mobile.png" />
                            <source media="(max-width: 1024px) and (orientation: portrait)" srcSet="/front-page-tablet.png" />
                            <source media="(min-width: 641px)" srcSet="/front-page-desktop.png" />
                            <img
                                src="/front-page-desktop.png"
                                alt="Heena Arora Fashion - Magical. Mesmerising. Majestic. Explore Collection"
                                className="hero-img"
                                loading="eager"
                                fetchPriority="high"
                            />
                        </picture>
                        <span className="sr-only">Explore Heena Arora New Arrivals Collection</span>
                    </a>
                </section>
                <section className="try-on-promo">
                    <div>
                        <p className="eyebrow">A new way to explore</p>
                        <h2>See a piece in a new light.</h2>
                        <p>Upload a garment photo and create an AI-generated styling preview on a model.</p>
                    </div>
                    <button className="button button-light" onClick={() => setTryOnOpen(true)}>Try on an outfit <span>↗</span></button>
                </section>
                <section className="section categories" id="categories"><div className="section-heading"><div><p className="eyebrow">Find your occasion</p><h2>Shop by category</h2></div><a className="underlined" href="#new-arrivals">View all pieces <span>↗</span></a></div><div className="category-grid">{categories.map((category) => <a className="category-card" href="#new-arrivals" key={category.name}><img loading="lazy" src={category.image} alt={category.name} /><div><span>{category.name}</span><b>↗</b></div></a>)}</div></section>
                <section className="collection-banner" id="collection"><img loading="lazy" src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1800&q=85" alt="Editorial portrait from the Noor collection" /><div><p className="eyebrow">A study in light and movement</p><h2>The Noor<br /><em>collection</em></h2><p>An ode to quiet radiance, shaped in liquid silk and hand-finished detail.</p><a className="button button-light" href="#new-arrivals">Explore collection <span>↗</span></a></div></section>
                <section className="section products-section" id="new-arrivals"><div className="section-heading"><div><p className="eyebrow">Just landed</p><h2>New arrivals</h2></div><div className="product-note">{query ? `${visibleProducts.length} results for “${query}”` : 'The pieces we are wearing now'} <a className="underlined" href="#new-arrivals">Shop all <span>↗</span></a></div></div><div className="product-grid">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img loading="lazy" src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><button className={`heart ${wishlist.includes(product.id) ? 'active' : ''}`} onClick={() => toggleWishlist(product.id)} aria-label={`Wishlist ${product.name}`}>{wishlist.includes(product.id) ? '♥' : '♡'}</button><button className="quick-view" onClick={() => setQuickView(product)}>Quick view</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{product.price}</strong></div><div className="product-actions-bar"><button className="add-button" onClick={() => addToBag(product)}>Add to bag · M <span>+</span></button><a className="card-whatsapp-button" href={getProductWaLink(product, 'M')} target="_blank" rel="noreferrer" aria-label={`Inquire about ${product.name} on WhatsApp`} title="Inquire on WhatsApp"><WhatsAppIcon size={16} /></a></div></article>)}</div></section>
                <section className="editorial-split" id="editorial"><div className="editorial-image"><img loading="lazy" src="https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=1100&q=85" alt="Detail of an Indian fashion look" /><span>02 / 05</span></div><div className="editorial-copy"><p className="eyebrow">The Heena Arora edit</p><h2>For the woman<br />who <em>moves</em><br />with the times.</h2><p>Stories in texture, colour and proportion. Pieces that hold a room, then become part of your story.</p><a className="underlined" href="#new-arrivals">Discover the edit <span>↗</span></a><div className="editorial-links"><a href="#new-arrivals">01 <span>The modern Indian woman</span></a><a href="#bridal">02 <span>The bride</span></a><a href="#new-arrivals">03 <span>The evening edit</span></a></div></div></section>
                <StudioEditor onAddCustomToBag={(customItem) => addToBag(customItem)} WhatsAppIcon={WhatsAppIcon} />
                <section className="about-house section" id="about"><div className="section-heading"><div><p className="eyebrow">About us</p><h2>Heena Arora<br /><em>House of Fashion</em></h2></div><p className="about-lead">Welcome to the House of Personalised Elegance.</p></div><div className="about-intro"><p>At Heena Arora - House of Fashion, we believe that every outfit has a story, and every design is crafted with love. Nestled in the heart of Siddharth Vihar, Ghaziabad, our boutique is a premium destination for women who refuse to settle for standard off-the-rack sizing and want their wardrobe to reflect their unique personality.</p><p>Founded and led by experienced fashion designer Heena Arora, our studio bridges the gap between high fashion and perfect structural fits. We take pride in building a journey of trust with our clients, transforming fine fabrics into tailored clothing.</p></div><div className="about-columns"><div><p className="eyebrow">Our signature collections</p><ul><li><strong>Ethnic &amp; Festive Wear</strong><span>Handcrafted designer suits, custom blouses, and wedding dresses featuring zardozi and precise piping.</span></li><li><strong>Indo-Western &amp; Western Fusion</strong><span>Modern silhouettes, luxury dual-tone co-ord sets in silk and modal satins, and striking evening gowns.</span></li><li><strong>Curated Accessories</strong><span>A handpicked collection of premium ladies' bags and fashion accessories to complete your look.</span></li></ul></div><div><p className="eyebrow">Why choose us</p><ul><li><strong>Tailored Just For You</strong><span>From your dream fabric palette to precise cuts and custom sleeve accents, every preference matters.</span></li><li><strong>Artisanal Care &amp; Detail</strong><span>Support a localized dream and an artisanal craft with unparalleled personalised care.</span></li><li><strong>Luxury Within Reach</strong><span>High-end, premium hand-embroidered custom fits without breaking the bank.</span></li></ul></div></div><div className="studio-contact"><div><p className="eyebrow">Connect with our studio</p><h3>Come into the House<br /><em>of Fashion.</em></h3></div><div className="studio-details"><p><strong>Visit us</strong><br />Shop No. 5 &amp; 7, Gaur Siddhartham Commercial Complex, Siddharth Vihar, Ghaziabad - 201009.</p><p><strong>Hours</strong><br />Monday to Sunday, 10:00 AM - 9:30 PM.</p><p><strong>Book an order / inquiry</strong><br /><a href="tel:+918340319206">+91 83403 19206</a></p></div></div></section>
                <section className="editors-choice" id="editors-choice"><div className="editors-choice-image"><img loading="lazy" src={products[0].image} alt="Aabha Silk Saree, Editor's Choice" /><span>Editor's choice / 01</span></div><div className="editors-choice-copy"><p className="eyebrow">Selected by Heena</p><h2>Aabha Silk<br /><em>Saree</em></h2><p>A handwoven silk statement with a quiet glow. Chosen for its fluid drape, warm ivory palette and effortless place in every celebration.</p><div className="editors-choice-meta"><span>Handwoven silk saree</span><strong>{products[0].price}</strong></div><div className="button-row"><button className="button button-light" onClick={() => setQuickView(products[0])}>View the piece <span>↗</span></button><button className="button button-ghost" onClick={() => addToBag(products[0])}>Add to bag <span>+</span></button><a href={getProductWaLink(products[0])} target="_blank" rel="noreferrer" className="button button-whatsapp" style={{ minWidth: 'auto', marginTop: 0 }}><WhatsAppIcon size={16} /> WhatsApp <span>↗</span></a></div></div></section>
                <section className="look-section section"><div className="section-heading"><div><p className="eyebrow">One look, four stories</p><h2>Shop the look</h2></div><p className="look-intro">A considered edit for evenings that deserve a little more.</p></div><div className="look-stage"><img loading="lazy" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=85" alt="Model in a complete Heena Arora look" /><button className="hotspot hotspot-one" onClick={() => setQuickView(products[0])} aria-label="View Aabha Silk Saree">+</button><button className="hotspot hotspot-two" onClick={() => setQuickView(products[3])} aria-label="View Chandni Organza Set">+</button><div className="look-label">Aabha silk saree<br /><span>View the pieces ↗</span></div></div></section>
                <section className="edit-grid section"><div className="section-heading"><div><p className="eyebrow">A point of view</p><h2>The Heena Arora edit</h2></div></div><div className="masonry"><a className="masonry-tall" href="#bridal"><img loading="lazy" src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=900&q=85" alt="The modern bride" /><span>The modern bride <b>↗</b></span></a><a href="#new-arrivals"><img loading="lazy" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85" alt="The festive woman" /><span>The festive woman <b>↗</b></span></a><a href="#editorial"><img loading="lazy" src="https://images.unsplash.com/photo-1618375531912-867984bdfd87?auto=format&fit=crop&w=900&q=85" alt="The evening edit" /><span>The evening edit <b>↗</b></span></a><a className="masonry-wide" href="#editorial"><img loading="lazy" src="https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=85" alt="The modern groom" /><span>The modern groom <b>↗</b></span></a></div></section>
                <section className="bridal" id="bridal"><img loading="lazy" src="https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1800&q=85" alt="Bridal fashion editorial" /><div><p className="eyebrow">For every beginning</p><h2>The Heena<br /><em>Arora bride</em></h2><p>A look worth remembering, made with patience and a little bit of magic.</p><div className="button-row"><a className="button button-light" href="#new-arrivals">Explore bridal <span>↗</span></a><a className="button button-ghost" href="mailto:studio@heenaarora.com">Book a consultation</a></div></div></section>
                <section className="section products-section loved"><div className="section-heading"><div><p className="eyebrow">The pieces that stay with you</p><h2>Most loved</h2></div><a className="underlined" href="#new-arrivals">Shop best sellers <span>↗</span></a></div><div className="product-grid">{bestSellers.map((product) => <article className="product-card" key={product.id}><div className="product-image"><img loading="lazy" src={product.image} alt={product.name} /><span className="product-tag">{product.tag}</span><button className="heart" onClick={() => toggleWishlist(product.id)} aria-label={`Wishlist ${product.name}`}>♡</button><button className="quick-view" onClick={() => setQuickView(product)}>Quick view</button></div><div className="product-info"><div><h3>{product.name}</h3><p>{product.type}</p></div><strong>{product.price}</strong></div><div className="product-actions-bar"><button className="add-button" onClick={() => addToBag(product)}>Add to bag <span>+</span></button><a className="card-whatsapp-button" href={getProductWaLink(product)} target="_blank" rel="noreferrer" aria-label={`Inquire about ${product.name} on WhatsApp`} title="Inquire on WhatsApp"><WhatsAppIcon size={16} /></a></div></article>)}</div></section>
                <section className="stories section"><div className="section-heading"><div><p className="eyebrow">From our journal</p><h2>Fashion stories</h2></div><a className="underlined" href="#stories">Read the journal <span>↗</span></a></div><div className="story-grid"><a href="#stories"><img loading="lazy" src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85" alt="Saree craftsmanship" /><p className="eyebrow">Craft / 01</p><h3>The art of the Indian saree</h3></a><a href="#stories"><img loading="lazy" src="https://images.unsplash.com/photo-1605763240000-7e93b172d754?auto=format&fit=crop&w=900&q=85" alt="Bridal embroidery" /><p className="eyebrow">Bridal / 02</p><h3>Crafted for the modern bride</h3></a><a href="#stories"><img loading="lazy" src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=85" alt="Contemporary Indian wardrobe" /><p className="eyebrow">Style / 03</p><h3>From tradition to tomorrow</h3></a></div></section>
                <section className="newsletter"><p className="eyebrow">A little something special</p><h2>Enter the world<br /><em>of Heena Arora</em></h2><p>First access to new collections, private previews and stories worth knowing.</p><form onSubmit={(event) => event.preventDefault()}><input type="email" placeholder="Your email address" aria-label="Email address" /><button type="submit">Subscribe <span>↗</span></button></form><a className="newsletter-phone" href="tel:+918340319206">Call / WhatsApp: +91 83403 19206</a></section>
                <section className="instagram section"><div className="section-heading"><div><p className="eyebrow">A glimpse into our world</p><h2>Follow @heenaarorafashion</h2></div><a className="underlined" href="#top">Instagram <span>↗</span></a></div><div className="instagram-grid">{instagramImages.map((image, index) => <a href="#top" key={image}><img loading="lazy" src={image} alt={`Heena Arora Fashion journal image ${index + 1}`} /></a>)}</div></section>
            </main>
        )}
        <footer>
            <div className="footer-main"><div className="footer-column"><p className="footer-title">Details</p><a className="footer-logo" href="#top" onClick={(e) => { e.preventDefault(); navigateToHome() }}>HEENA ARORA <small>FASHION</small></a><p>Contemporary Indian fashion<br />rooted in timeless elegance.</p><address>Shop no 7, Gaur Siddhartham Commercial Complex,<br />Siddharth Vihar, Ghaziabad - 201009</address><p>CIN: U74110MH2014PTC257909</p></div><div className="footer-column"><p className="footer-title">Policies</p>{footerSections.find((section) => section.title === 'Legal').links.slice(0, 4).map((link) => <a href="#top" key={link}>{link}</a>)}</div><div className="footer-column"><p className="footer-title">Information</p>{footerSections.find((section) => section.title === 'Brand').links.slice(0, 3).map((link) => <a href={link === 'About Us' ? '#about' : '#top'} key={link} onClick={() => { if (currentPage !== 'home') setCurrentPage('home') }}>{link}</a>)}<a href="#new-arrivals" onClick={() => { if (currentPage !== 'home') setCurrentPage('home') }}>Shop all collections</a><button type="button" className="footer-inline-link" onClick={navigateToCatalogue}>Couture Catalogue 2026</button><button type="button" className="footer-inline-link" onClick={navigateToEditor}>Bespoke Couture Editor</button></div><div className="footer-column"><p className="footer-title">Need help</p><a href="#top">⌖ &nbsp; Store locator</a><a href="mailto:heenaarorafashion@gmail.com">✉ &nbsp; heenaarorafashion@gmail.com</a><a href="tel:+918340319206">♧ &nbsp; +91 83403 19206</a><a href="mailto:heenaarorafashion@gmail.com">▣ &nbsp; Customer enquiries</a><strong>Grievance and Nodal Officer</strong><a href="mailto:heenaarorafashion@gmail.com">heenaarorafashion@gmail.com</a></div></div><div className="footer-bottom"><div className="social-links"><a href="https://www.instagram.com/heenaarora.fashiondesigner?stkn=NzJrenBuNnpucGxu" target="_blank" rel="noreferrer" aria-label="Instagram"><SocialIcon type="instagram" /></a><a href="https://www.facebook.com/share/1KDbwKvdSu/?mibextid=wwXIfr" target="_blank" rel="noreferrer" aria-label="Facebook"><SocialIcon type="facebook" /></a><a href="https://wa.me/message/C335BQWLINBKI1" target="_blank" rel="noreferrer" aria-label="WhatsApp"><SocialIcon type="whatsapp" /></a></div><span>© 2026 Heena Arora Fashion. All rights reserved.</span><div className="payment-marks"><i>VISA</i><i>MC</i><i>UPI</i></div></div></footer>
        {bagOpen && <div className="overlay" onClick={() => setBagOpen(false)}><aside className="bag-drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><p className="eyebrow">Your edit</p><h2>Shopping bag <small>({bag.length})</small></h2></div><button onClick={() => setBagOpen(false)} aria-label="Close bag">×</button></div>{bag.length ? <>{bag.map((item, index) => <div className="bag-item" key={`${item.id}-${index}`}><img src={item.image} alt="" /><div><h3>{item.name}</h3><p>{item.type} <span className="bag-size">Size {item.size || 'M'}</span></p><strong>{item.price}</strong></div></div>)}<div className="bag-total"><span>Subtotal</span><strong>₹{bag.reduce((sum, item) => sum + Number(item.price.replace(/[₹,]/g, '')), 0).toLocaleString('en-IN')}</strong></div><p className="checkout-note">Complimentary shipping available</p><button className="button button-dark full-button">Proceed to checkout <span>↗</span></button><a href={getCartWaLink()} target="_blank" rel="noreferrer" className="button button-whatsapp full-button"><WhatsAppIcon size={18} /> Order Bag via WhatsApp <span>↗</span></a></> : <div className="empty-bag"><p>Your bag is waiting for something special.</p><a href="#new-arrivals" onClick={() => { setBagOpen(false); if (currentPage !== 'home') setCurrentPage('home') }} className="underlined">Explore new arrivals <span>↗</span></a></div>}</aside></div>}
        {quickView && <div className="overlay" onClick={() => setQuickView(null)}><div className="quick-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setQuickView(null)}>×</button><img src={quickView.image} alt={quickView.name} /><div><p className="eyebrow">{quickView.tag || quickView.code}</p><h2>{quickView.name}</h2><p>{quickView.type || quickView.fabric}. Designed in Delhi and finished by hand.</p><strong>{quickView.price}</strong><label className="size-label" htmlFor="quick-size">Select size</label><select id="quick-size" value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)}>{sizes.map((size) => <option key={size}>{size}</option>)}</select><button className="button button-dark full-button" onClick={() => { addToBag(quickView); setQuickView(null) }}>Add to bag · {selectedSize} <span>↗</span></button><a href={getProductWaLink(quickView, selectedSize)} target="_blank" rel="noreferrer" className="button button-whatsapp full-button"><WhatsAppIcon size={18} /> Order via WhatsApp <span>↗</span></a></div></div></div>}
        {menuOpen && <div className="mobile-menu-panel"><div className="mobile-menu-head"><a href="#top" className="wordmark" onClick={() => { setMenuOpen(false); navigateToHome() }}><span>HEENA ARORA</span><strong>FASHION</strong></a><button onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button></div><p className="eyebrow">The house edit</p><button className="mobile-nav-link highlight" onClick={() => { setMenuOpen(false); navigateToCatalogue() }}>Catalogue 2026 <span>✦</span></button><button className="mobile-nav-link highlight" onClick={() => { setMenuOpen(false); navigateToEditor() }}>Couture Editor <span>✨</span></button>{['Women', 'Men', 'Bridal', 'Jewellery', 'New arrivals', 'Collections', 'Sale'].map((item) => <a href="#new-arrivals" onClick={() => { setMenuOpen(false); if (currentPage !== 'home') setCurrentPage('home') }} key={item}>{item}<span>↗</span></a>)}<div className="mobile-menu-foot"><a href="#top">Account</a><a href="#top">Wishlist</a></div></div>}
        <button className="assistant-badge" onClick={() => setAssistantOpen(true)} aria-label="Open Heena Arora Couture Assistant"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85" alt="Heena Arora Couture Assistant" /><span><strong>HEENA ARORA</strong><small>COUTURE ASSISTANT</small></span></button>
        <a
            href={websiteWaLink}
            target="_blank"
            rel="noreferrer"
            className="floating-whatsapp"
            aria-label="Chat on WhatsApp with Heena Arora Fashion"
            title="Chat with us on WhatsApp"
        >
            <span className="floating-whatsapp-pulse" aria-hidden="true" />
            <WhatsAppIcon size={22} />
            <span className="floating-whatsapp-text">Chat with us</span>
        </a>
        <VirtualTryOn isOpen={tryOnOpen} onClose={() => setTryOnOpen(false)} />
        <CoutureAssistant isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} />
    </div>
}
export default App
