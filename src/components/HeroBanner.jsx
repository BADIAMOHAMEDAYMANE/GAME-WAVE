import { useState, useEffect } from 'react';
import './HeroBanner.css';
import { categories } from '../data/games';

export default function HeroBanner() {
    const [slides, setSlides] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const allGames = categories[0].games;
        const shuffled = [...allGames].sort(() => 0.5 - Math.random());
        setSlides(shuffled.slice(0, 7));
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const handlePlayGame = () => {
        window.open(`/play/${slides[currentIndex].id}`);
    };

    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-badge">À LA UNE</span>
                <h1>{slides[currentIndex].title}</h1>
                <p>{slides[currentIndex].description}</p>
                <button className="hero-btn" onClick={handlePlayGame}>JOUER MAINTENANT</button>

                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="hero-image-overlay"></div>

            <img
                className="hero-img"
                src={slides[currentIndex].image}
                alt={slides[currentIndex].title}
                key={slides[currentIndex].id}
            />
        </section>
    );
}