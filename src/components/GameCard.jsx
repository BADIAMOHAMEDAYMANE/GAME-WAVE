import { useState } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import './GameCard.css'

/**
 * @param {{ game: { id: number, image: string, title: string, isNew?: boolean } }} props
 */
export default function GameCard({ game }) {
    const [isLoaded, setIsLoaded] = useState(false) // Pour le loader initial
    const [isAiReady, setIsAiReady] = useState(false) // Pour ton effet HD

    return (
        <Link to={`/play/${game.id}`} className="game-link">
            <div className="game-card">
                <div className={`image-wrapper ${isLoaded ? '' : 'loading-shimmer'}`}>
                    <img
                        src={game.image}
                        alt=""
                        className={`img-original ${isLoaded ? 'visible' : ''}`}
                        onLoad={() => setIsLoaded(true)}
                    />

                    {/* 2. Image IA (Celle qui devient HD) */}
                    {isLoaded && (
                        <img
                            src={game.image} // Ici tu mettras ton URL HD plus tard
                            alt={game.title}
                            className={`img-ai-upscaled ${isAiReady ? 'loaded' : ''}`}
                            onLoad={() => setIsAiReady(true)}
                            loading="lazy"
                        />
                    )}
                    {isLoaded && game.isNew && <span className="badge">New</span>}
                    {isAiReady && <div className="ai-tag">HD</div>}
                </div>
                {isLoaded ? (
                    <h3 className="game-title">{game.title}</h3>
                ) : (
                    <div className="skeleton-text"></div>
                )}
            </div>
        </Link>
    )
}

GameCard.propTypes = {
    game: PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        isNew: PropTypes.bool,
    }).isRequired,
}
