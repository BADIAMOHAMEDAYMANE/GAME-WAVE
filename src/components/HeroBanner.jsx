import { useState, useEffect } from 'react';
import './HeroBanner.css';

// Importation de vos images
import hangmanImg from "/src/assets/Hangman.png";
import SnakeImg from "/src/assets/Snakegame.png";
import TicTacToeImg from "/src/assets/TicTacToe.png";
import TiltMazeImg from "/src/assets/Tilt-Maze.png";
import PongImg from "/src/assets/pong-game.png";
import MinesweeperImg from "/src/assets/Minesweeper.png";
import CandycrashImg from "/src/assets/Candy-crash.png";

export default function HeroBanner() {
    // Liste des jeux pour le carrousel
    const slides = [
        { id: 1, title: "Hangman", desc: "Guess the word before it's too late !", img: hangmanImg },
        { id: 2, title: "Snake Game", desc: "The timeless classic, eat to grow.", img: SnakeImg },
        { id: 3, title: "Tic Tac Toe", desc: "Challenge your friends to this strategic duel.", img: TicTacToeImg },
        { id: 4, title: "TiltMaze", desc: "Fit the blocks together and beat the record.", img: TiltMazeImg },
        { id: 5, title: "Pong Game", desc: "Speed ​​and reflexes on the table.", img: PongImg },
        { id: 6, title: "Minesweeper", desc: "Aim for the center to become the master archer.", img: MinesweeperImg },
        { id: 7, title: "Candy Crash", desc: "Blast the candies in this addictive puzzle!.", img: CandycrashImg },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Logique du carrousel automatique (3 secondes)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(timer); // Nettoyage du timer
    }, [slides.length]);

    return (
        <section className="hero-section">
            <div className="hero-content">
                <span className="hero-badge">À LA UNE</span>
                <h1>{slides[currentIndex].title}</h1>
                <p>{slides[currentIndex].desc}</p>
                <button className="hero-btn">JOUER MAINTENANT</button>

                {/* Indicateurs (petits points) */}
                <div className="carousel-indicators">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        ></div>
                    ))}
                </div>
            </div>

            <div className="hero-image-overlay"></div>

            <img
                src={slides[currentIndex].img}
                alt={slides[currentIndex].title}
                className="hero-img"
                key={slides[currentIndex].id}
            />
        </section>
    );
}