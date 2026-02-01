import { useState, useEffect } from 'react'
import './MobileMenu.css'

export default function MobileMenu() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('menu-open')
        } else {
            document.body.classList.remove('menu-open')
        }

        return () => {
            document.body.classList.remove('menu-open')
        }
    }, [isOpen])

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const menuItems = [
        { name: 'Accueil', icon: '🏠', href: '#home' },
        { name: 'Nouveaux Jeux', icon: '✨', href: '#nouveaux' },
        { name: 'Populaires', icon: '🔥', href: '#populaires' },
        { name: 'Sports', icon: '⚽', href: '#sports' },
        { name: 'Action', icon: '💥', href: '#action' },
        { name: 'Puzzle', icon: '🧩', href: '#puzzle' },
        { name: 'Course', icon: '🏎️', href: '#course' },
        { name: 'Favoris', icon: '⭐', href: '#favoris' },
    ]

    return (
        <>
            {/* Bouton Hamburger */}
            <button
                className={`hamburger-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Menu"
            >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
            </button>

            {/* Overlay */}
            <div
                className={`menu-overlay ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
            ></div>

            {/* Menu Latéral */}
            <nav className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <div className="mobile-menu-header">
                    <div className="menu-logo">
                        <span className="menu-logo-text">GAMEWAVE</span>
                        <span className="menu-logo-slogan">RIDE THE NEXT LEVEL</span>
                    </div>
                    <button
                        className="menu-close-btn"
                        onClick={toggleMenu}
                        aria-label="Fermer le menu"
                    >
                        ✕
                    </button>
                </div>

                <ul className="menu-items">
                    {menuItems.map((item, index) => (
                        <li
                            key={item.name}
                            className="menu-item"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <a
                                href={item.href}
                                onClick={toggleMenu}
                                className="menu-link"
                            >
                                <span className="menu-icon">{item.icon}</span>
                                <span className="menu-text">{item.name}</span>
                                <span className="menu-arrow">›</span>
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="menu-footer">
                    <div className="menu-footer-item">
                        <span>🎮</span>
                        <span>+1000 Jeux</span>
                    </div>
                    <div className="menu-footer-item">
                        <span>🆓</span>
                        <span>100% Gratuit</span>
                    </div>
                </div>
            </nav>
        </>
    )
}