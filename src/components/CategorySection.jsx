/* eslint-disable react/prop-types */
import { useState } from 'react';
import GameCard from './GameCard';
import './CategorySection.css';

const GAMES_PER_PAGE = 16;

export default function CategorySection({ category }) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(category.games.length / GAMES_PER_PAGE);
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const displayedGames = category.games.slice(startIndex, startIndex + GAMES_PER_PAGE);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <section className="category">
            <div className="grid">
                {displayedGames.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Précédent
                    </button>
                    <span className="page-info">Page {currentPage} sur {totalPages}</span>
                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Suivant
                    </button>
                </div>
            )}
        </section>
    )
}
