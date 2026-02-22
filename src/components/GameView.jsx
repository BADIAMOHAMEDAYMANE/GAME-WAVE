import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { categories } from '../data/games.js';
import Header from './Header.jsx';
import "./GameView.css";

export default function GameView() {
    const { id } = useParams();
    const [isFullMode] = useState(false);

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