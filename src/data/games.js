import hangmanImg from "../assets/Hangman.png";
import SnakeImg from "../assets/Snakegame.png";
import TicTacToeImg from "../assets/TicTacToe.png";
import TiltMazeImg from "../assets/Tilt-Maze.png";
import PongImg from "../assets/pong-game.png";
import Minesweeper from "../assets/Minesweeper.png";
import CandycrashImg from "../assets/Candy-crash.png";
import GeometryDashImg from "../assets/geometry-dash.png";
import MarioImg from "../assets/SuperMario.png";
import BananiaImg from "../assets/Banania.jpg";
import Img2048 from "../assets/2048.jpg";
import ImgLoadRunner from "../assets/LoadRunner.jpg";
import FlappyBirdImg from "../assets/FlappyBird.jpg";
import fruitsImg from "../assets/fruits.png";
import SpeedyVerseImg from "../assets/SpeedyVerse.png";
import PacManImg from "../assets/PacMan.png";
import ChessImg from "../assets/Chess.jpg";
export const categories = [
    {
        id: 1,
        title: "GAMES",
        games: [
            {
                id: 1,
                title: "Whack-a-mole",
                image: hangmanImg,
                gamePath: "/games/Whack-a-mole/index.html",
                isNew: true
            },
            {
                id: 2,
                title: "Snake",
                image: SnakeImg,
                gamePath: "/games/Snake/index.html",
                isNew: false
            },
            {
                id: 3,
                title: "TicTacToe",
                image: TicTacToeImg,
                gamePath: "/games/TicTacToe/index.html",
                isNew: false
            },
            {
                id: 4,
                title: "Tilt Maze",
                image: TiltMazeImg,
                gamePath: "/games/Tetris/index.html",
                isNew: false
            },
            {
                id: 5,
                title: "Pong",
                image: PongImg,
                gamePath: "/games/Pong/index.html",
                isNew: true
            },
            {
                id: 6,
                title: "Minesweeper",
                image: Minesweeper,
                gamePath: "/games/Minesweeper/index.html",
                isNew: false
            },
            {
                id: 7,
                title: "Candy-Crash",
                image: CandycrashImg,
                gamePath: "/games/Candycrash/index.html",
                isNew: true
            },
            {
                id: 9,
                title: "Geometry Dash",
                image: GeometryDashImg,
                gamePath: "/games/GeometryDash/index.html",
                isNew: true
            },
            {
                id: 10,
                title: "2048",
                image: Img2048,
                gamePath: "/games/2048/index.html",
                isNew: false
            },
            {
                id: 11,
                title: "Load Runner",
                image: ImgLoadRunner,
                gamePath: "/games/LodeRunner/lodeRunner.html",
                isNew: true
            },
            {
                id: 12,
                title: "Flappy Bird",
                image: FlappyBirdImg,
                gamePath: "/games/floppybird/index.html",
                isNew: false
            },
            {
                id: 13,
                title: "Mario",
                image: MarioImg,
                gamePath: "/games/Mario/index.html",
                isNew: true
            },
            {
                id: 14,
                title: " Fruits",
                image: fruitsImg,
                gamePath: "/games/fruits/index.html",
                isNew: false
            },
            {
                id: 15,
                title: "SpeedyVerse",
                image: SpeedyVerseImg,
                gamePath: "/games/SpeedyVerse/index.html",
                isNew: true
            },
            {
                id: 16,
                title: "PacMan",
                image: PacManImg,
                gamePath: "/games/Pacman/index.html",
                isNew: true
            },
            {
                id: 17,
                title: "Chess",
                image: ChessImg,
                gamePath: "/games/Chess/chess.html",
                isNew: true
            }
        ]
    }
]
