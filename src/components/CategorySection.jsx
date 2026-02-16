import GameCard from './GameCard';
import './CategorySection.css';

export default function CategorySection({ category }) {
    return (
        <section className="category">
            <div className="category-header">
                <h2>{category.title}</h2>
                <span>{category.games.length} games</span>
            </div>

            <div className="grid">
                {category.games.map(game => (
                    <GameCard key={game.id} game={game} />
                ))}
            </div>
        </section>
    )
}
