import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/games.js';
import Header from './Header.jsx';
import "./GameView.css";

export default function GameView() {
    const { id } = useParams();
    const [isFullMode, setIsFullMode] = useState(false);

    const game = categories[0].games.find(g => g.id === parseInt(id));

    if (!game) return <div className="error">Jeu non trouvé</div>;

    const toggleDisplayMode = () => {
        setIsFullMode(!isFullMode);
    };

    return (
        <div className={`game-page-layout ${isFullMode ? 'full-mode-active' : ''}`}>
            {!isFullMode && <Header />}

            <main className="game-main-content">
                <button
                    className="display-mode-toggle"
                    onClick={toggleDisplayMode}
                    title={isFullMode ? "Mode Standard" : "Plein Écran (Page)"}
                >
                    {isFullMode ? '🗗' : '⛶'}
                </button>

                <div className="game-iframe-container">
                    <iframe
                        src={game.gamePath}
                        title={game.title}
                        allowFullScreen
                        scrolling="no"
                    />
                </div>
            </main>
        </div>
    );
}