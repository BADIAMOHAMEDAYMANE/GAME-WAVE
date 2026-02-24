import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/games.js';
import Header from './Header.jsx';
import "./GameView.css";

export default function GameView() {
    const { id } = useParams();
    const [isFullMode, setIsFullMode] = useState(false);

    const game = categories[0].games.find(g => g.id === Number.parseInt(id));

    useEffect(() => {
        if (game) {
            document.title = game.title;
        }
        return () => {
            document.title = "Game Wave";
        };
    }, [game]);

    if (!game) return <div className="error">Jeu non trouvé</div>;



    return (
        <div className={`game-page-layout ${isFullMode ? 'full-mode-active' : ''}`}>
            {!isFullMode && <Header />}

            <main className="game-main-content">


                <div className="game-iframe-container">
                    <button
                        className="fullscreen-btn"
                        onClick={() => setIsFullMode(!isFullMode)}
                        title={isFullMode ? "Exit Fullscreen" : "Enter Fullscreen"}
                    >
                        {isFullMode ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" /></svg>
                                <span>Exit</span>
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3m10 0h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m10 0h3a2 2 0 0 0 2-2v-3" /></svg>
                                <span>Fullscreen</span>
                            </>
                        )}
                    </button>
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