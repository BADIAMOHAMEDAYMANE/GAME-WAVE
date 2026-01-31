export default function Logo() {
    return (
        <svg width="280" height="80" viewBox="0 0 350 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                {/* On booste le filtre glow pour qu'il soit visible sur mobile */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
            </defs>
            <g filter="url(#glow)">
                <path d="M40 30H70C80 30 85 35 85 45V55C85 65 80 70 70 70H40C30 70 25 65 25 55V45C25 35 30 30 40 30Z"
                      stroke="url(#neonGradient)" strokeWidth="3" fill="none" />
                <circle cx="35" cy="50" r="4" fill="#22d3ee" />
                <circle cx="75" cy="50" r="2" fill="#a855f7" />
            </g>

            {/* GAMEWAVE : On force l'application du dégradé */}
            <text x="95" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="28"
                  fill="url(#neonGradient)" style={{ letterSpacing: '1px' }}>
                GAMEWAVE
            </text>

            {/* RIDE THE NEXT LEVEL : On lui donne la classe pour le CSS et on force une couleur claire par défaut */}
            <text x="95" y="72" className="logo-slogan" font-family="Arial, sans-serif" font-weight="bold" font-size="12"
                  style={{ letterSpacing: '2px', textTransform: 'uppercase' }}>
                RIDE THE NEXT LEVEL
            </text>
        </svg>
    );
}