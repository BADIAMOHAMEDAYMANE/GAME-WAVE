import Header from '../components/Header';
import CategorySection from '../components/CategorySection';
import HeroBanner from '../components/HeroBanner';
import { categories } from '../data/games';

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <HeroBanner />
                {categories.map(cat => (
                    <CategorySection key={cat.id} category={cat} />
                ))}
            </main>
        </>
    )
}