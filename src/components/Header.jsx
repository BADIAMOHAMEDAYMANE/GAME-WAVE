import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import MobileMenu from './MobileMenu.jsx';

export default function Header() {
    return (
        <header className="header">
            <div className="logo">
                <Logo />
            </div>

            <div className="header-actions">
                <div className="search-container">
                    <span className="search-icon">🔍</span>
                    <input
                        className="search"
                        placeholder="Rechercher parmi des milliers de jeux..."
                    />
                </div>
                <ThemeToggle />
                <MobileMenu />
            </div>
        </header>
    );
}