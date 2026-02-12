import hangmanImg from "/src/assets/Hangman.png";
import SnakeImg from "/src/assets/Snakegame.png";
import TicTacToeImg from "/src/assets/TicTacToe.png";
import TetrisImg from "/src/assets/Tetris.png";
import PingPongImg from "/src/assets/PingPong.png";
import ArcheryImg from "/src/assets/Archery.png";
import CandycrashImg from "/src/assets/Candy-crash.png";
import CubeImg from "/src/assets/Cube.jpg";
import MarioImg from "/src/assets/SuperMario.png";
import BananiaImg from "/src/assets/Banania.jpg";
import Img2048 from "/src/assets/2048.jpg";
import ImgLoadRunner from "/src/assets/LoadRunner.jpg";
import FlappyBirdImg from "/src/assets/FlappyBird.jpg";
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
                title: " Chess Game",
                image: "https://play-lh.googleusercontent.com/askVKuYkgbtAOdVez7g1J3HDG2LuVZcNWWDZaB-OZwLhteR6pCW-ndfYb4e72pLZ7dQ=w526-h296-rw",
                isNew: false
            },
            {
                id: 15,
                title: "Card Games",
                image: "https://imgs.crazygames.com/games/spider-frvr/cover_16x9-1746159133741.png?metadata=none&quality=60&width=412",
                isNew: true
            }




        ]
    }
]
