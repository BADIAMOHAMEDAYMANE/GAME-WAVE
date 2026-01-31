export default function GameCard({ game }) {
    return (
        <div className="game-card">
            <div className="image-wrapper">
                <img src={game.image} alt={game.title} />
                {game.isNew && <span className="badge">New</span>}
            </div>
            <h3 className="game-title">{game.title}</h3>
        </div>
    )
}