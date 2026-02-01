import './HeroBanner.css'

export default function HeroBanner() {
    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-badge">À LA UNE</span>
                <h1>Cyber Racer 2026</h1>
                <p>Dominez les rues de Neo-Tokyo dans le jeu de course le plus attendu de l'année.</p>
                <button className="hero-btn">JOUER MAINTENANT</button>
            </div>
            <div className="hero-image-overlay"></div>
            <img src="https://www.goodwood.com/globalassets/.road--racing/race/historic/2021/2-february/list-best-racing-games-of-the-2000s/best-racing-games-of-the-2000s-list-goodwood-040220212.jpg?rxy=0.5,0.5&width=800&height=450" alt="Featured Game" className="hero-img" />
        </section>
    );
}