import hangmanImg from "../assets/Hangman.png";
import SnakeImg from "../assets/Snakegame.png";
import TicTacToeImg from "../assets/TicTacToe.png";
import TetrisImg from "../assets/Tetris.png";
import PingPongImg from "../assets/PingPong.png";
import ArcheryImg from "../assets/Archery.png";
import CandycrashImg from "../assets/Candy-crash.png";
import CubeImg from "../assets/Cube.jpg";
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
                title: "Hangman",
                image: hangmanImg,
                gamePath: "/games/Hangman/index.html",
                isNew: true
            },
            {
                id: 2,
                title: "Snake Game",
                image: SnakeImg,
                gamePath: "/games/Snake/index.html",
                isNew: false
            },
            {
                id: 3,
                title: "TicTacToe Game",
                image: TicTacToeImg,
                gamePath: "/games/TicTacToe/index.html",
                isNew: false
            },
            {
                id: 4,
                title: "Tetris Game",
                image: TetrisImg,
                gamePath: "/games/Tetris/index.html",
                isNew: false
            },
            {
                id: 5,
                title: "PingPong Game",
                image: PingPongImg,
                gamePath: "/games/PingPong/index.html",
                isNew: true
            },
            {
                id: 6,
                title: " Archery Game",
                image: ArcheryImg,
                gamePath: "/games/ArcheryGame/index.html",
                isNew: false
            },
            {
                id: 7,
                title: "Candy-crash Games",
                image: CandycrashImg,
                gamePath: "/games/Candycrash/index.html",
                isNew: true
            },
            {
                id: 8,
                title: "Banania",
                image: BananiaImg,
                gamePath: "/games/Banania/game/banania.html",
                isNew: false
            },
            {
                id: 9,
                title: "Jump",
                image: CubeImg,
                gamePath: "/games/Jump/index.html",
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
                title: "Mario Game",
                image: MarioImg,
                gamePath: "/games/Mario/index.html",
                isNew: true
            },
            {
                id: 14,
                title: " Fruits Game",
                image: fruitsImg,
                gamePath: "/games/fruits/index.html",
                isNew: false
            },
            {
                id: 15,
                title: "SpeedyVerse Game",
                image: SpeedyVerseImg,
                gamePath: "/games/SpeedyVerse/index.html",
                isNew: true
            },
            {
                id: 16,
                title: "PacMan Game",
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
