import Header from '../components/Header'
import CategorySection from '../components/CategorySection'
import HeroBanner from '../components/HeroBanner' // Nouveau composant
import { categories } from '../data/games'

export default function Home() {
    return (
        <div className="main-layout">
            <aside className="ads-sidebar left">
                <div className="ad-unit">PUB GAUCHE</div>
            </aside>
            <div className="content-center">
                <Header />
                <main>
                    <HeroBanner />
                    {categories.map(cat => (
                        <CategorySection key={cat.id} category={cat} />
                    ))}
                </main>
            </div>
            <aside className="ads-sidebar right">
                <div className="ad-unit">PUB DROITE</div>
            </aside>
        </div>
    )
}