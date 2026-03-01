import whackamoleImg from "../assets/whack-a-mole.png";
import SnakeImg from "../assets/Snakegame.png";
import TicTacToeImg from "../assets/TicTacToe.png";
import TiltMazeImg from "../assets/Tilt-Maze.png";
import PongImg from "../assets/pong-game.png";
import Minesweeper from "../assets/Minesweeper.png";
import CandycrashImg from "../assets/Candy-crash.png";
import GeometryDashImg from "../assets/geometry-dash.png";
import Img2048 from "../assets/2048.png";
import ImgLoadRunner from "../assets/LoadRunner.png";
import FlappyBirdImg from "../assets/FlappyBird.png";
import fruitsImg from "../assets/fruits.png";
import OutRunImg from "../assets/outrun.png";
import PacManImg from "../assets/Pacman.png";
import ChessImg from "../assets/Chess.jpg";
import TetrisImg from "../assets/tetris-game.png";

export const categories = [
    {
        id: 1,
        title: "GAMES",
        games: [
            {
                id: 1,
                title: "Whack-a-mole",
                description: "Test your reflexes and whack the moles as they appear!",
                image: whackamoleImg,
                gamePath: "/games/Whack-a-mole/index.html",
                isNew: true
            },
            {
                id: 2,
                title: "Snake",
                description: "The timeless classic, eat to grow and avoid the walls.",
                image: SnakeImg,
                gamePath: "/games/Snake/index.html",
                isNew: false
            },
            {
                id: 3,
                title: "TicTacToe",
                description: "Challenge your friends to this strategic duel.",
                image: TicTacToeImg,
                gamePath: "/games/TicTacToe/index.html",
                isNew: false
            },
            {
                id: 4,
                title: "Tilt Maze",
                description: "Navigate the maze and reach the goal.",
                image: TiltMazeImg,
                gamePath: "/games/Tetris/index.html",
                isNew: false
            },
            {
                id: 5,
                title: "Pong",
                description: "Speed and reflexes on the table.",
                image: PongImg,
                gamePath: "/games/Pong/index.html",
                isNew: true
            },
            {
                id: 6,
                title: "Minesweeper",
                description: "Clear the board without detonating any hidden mines.",
                image: Minesweeper,
                gamePath: "/games/Minesweeper/index.html",
                isNew: false
            },
            {
                id: 7,
                title: "Candy-Crash",
                description: "Blast the candies in this addictive puzzle!",
                image: CandycrashImg,
                gamePath: "/games/Candycrash/index.html",
                isNew: true
            },
            {
                id: 9,
                title: "Geometry Dash",
                description: "Jump and fly your way through danger in this rhythm-based platformer!",
                image: GeometryDashImg,
                gamePath: "/games/GeometryDash/index.html",
                isNew: true
            },
            {
                id: 10,
                title: "2048",
                description: "Slide tiles and merge them together to reach the 2048 tile.",
                image: Img2048,
                gamePath: "/games/2048/index.html",
                isNew: false
            },
            {
                id: 11,
                title: "Load Runner",
                description: "Collect gold and avoid enemies in this classic puzzle platformer.",
                image: ImgLoadRunner,
                gamePath: "/games/LodeRunner/lodeRunner.html",
                isNew: true
            },
            {
                id: 12,
                title: "Flappy Bird",
                description: "Navigate the bird through the pipes without hitting them.",
                image: FlappyBirdImg,
                gamePath: "/games/floppybird/index.html",
                isNew: false
            },
            {
                id: 14,
                title: " Fruits",
                description: "Slice and dice juicy fruits like a true ninja!",
                image: fruitsImg,
                gamePath: "/games/fruits/index.html",
                isNew: false
            },
            {
                id: 15,
                title: "OutRun",
                description: "Race through the galaxy at top speeds!",
                image: OutRunImg,
                gamePath: "/games/OutRun/index.html",
                isNew: true
            },
            {
                id: 16,
                title: "PacMan",
                description: "Chomp dots and avoid ghosts in this arcade classic.",
                image: PacManImg,
                gamePath: "/games/Pacman/index.html",
                isNew: true
            },
            {
                id: 17,
                title: "Chess",
                description: "Outsmart your opponent in the ultimate game of strategy.",
                image: ChessImg,
                gamePath: "/games/Chess/chess.html",
                isNew: true
            },
            {
                id: 18,
                title: "Tetris",
                description: "Clear lines with falling blocks in this classic puzzle game.",
                image: TetrisImg,
                gamePath: "/games/tetris-game/index.html",
                isNew: true
            }
        ]
    }
]
