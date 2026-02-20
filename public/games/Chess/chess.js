/**
 * Chess Logic with chess.js integration and Minimax AI
 */
/* global Chess */

// --- Settings & Consts ---
const SIZE = 56;
const OFFSET = { x: 28, y: 28 };
const canvas = document.getElementById('chess-canvas');
const ctx = canvas.getContext('2d');
const figuresImg = new Image();
const boardImg = new Image();
figuresImg.src = 'images/figures.png';
boardImg.src = 'images/board.png';

// --- Game State ---
let game = new Chess();
let pieces = [];
let draggingIndex = -1;
let dragOffset = { x: 0, y: 0 };
let originalSquare = null;
let gameMode = 'pvp';
let isAiThinking = false;

// --- Theme & Fullscreen ---
function initTheme() {
  const savedTheme = localStorage.getItem('chess-theme') || 'dark';
  document.body.dataset.theme = savedTheme;
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.body.dataset.theme;
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.dataset.theme = newTheme;
  localStorage.setItem('chess-theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.querySelector('#btn-theme-toggle i');
  if (icon) {
    icon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function toggleFullscreen() {
  const elem = document.getElementById('game-container');
  const icon = document.querySelector('#btn-fullscreen i');
  if (document.fullscreenElement) {
    document.exitFullscreen().then(() => {
      if (icon) icon.className = 'fa-solid fa-expand';
    });
  } else {
    elem.requestFullscreen().then(() => {
      if (icon) icon.className = 'fa-solid fa-compress';
    }).catch(err => {
      console.error(`Error attempting to enable full-screen mode: ${err.message}`);
    });
  }
}

document.addEventListener('fullscreenchange', () => {
  const icon = document.querySelector('#btn-fullscreen i');
  if (!document.fullscreenElement && icon) {
    icon.className = 'fa-solid fa-expand';
  }
});

// --- Evaluation Tables for AI ---
const Weights = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const PST = {
  p: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5, 5, 10, 25, 25, 10, 5, 5],
    [0, 0, 0, 20, 20, 0, 0, 0],
    [5, -5, -10, 0, 0, -10, -5, 5],
    [5, 10, 10, -20, -20, 10, 10, 5],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ],
  n: [
    [-50, -40, -30, -30, -30, -30, -40, -50],
    [-40, -20, 0, 0, 0, 0, -20, -40],
    [-30, 0, 10, 15, 15, 10, 0, -30],
    [-30, 5, 15, 20, 20, 15, 5, -30],
    [-30, 0, 15, 20, 20, 15, 0, -30],
    [-30, 5, 10, 15, 15, 10, 5, -30],
    [-40, -20, 0, 5, 5, 0, -20, -40],
    [-50, -40, -30, -30, -30, -30, -40, -50]
  ],
  b: [
    [-20, -10, -10, -10, -10, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 10, 10, 5, 0, -10],
    [-10, 5, 5, 10, 10, 5, 5, -10],
    [-10, 0, 10, 10, 10, 10, 0, -10],
    [-10, 10, 10, 10, 10, 10, 10, -10],
    [-10, 5, 0, 0, 0, 0, 5, -10],
    [-20, -10, -10, -10, -10, -10, -10, -20]
  ],
  r: [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [5, 10, 10, 10, 10, 10, 10, 5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [-5, 0, 0, 0, 0, 0, 0, -5],
    [0, 0, 0, 5, 5, 0, 0, 0]
  ],
  q: [
    [-20, -10, -10, -5, -5, -10, -10, -20],
    [-10, 0, 0, 0, 0, 0, 0, -10],
    [-10, 0, 5, 5, 5, 5, 0, -10],
    [-5, 0, 5, 5, 5, 5, 0, -5],
    [0, 0, 5, 5, 5, 5, 0, -5],
    [-10, 5, 5, 5, 5, 5, 0, -10],
    [-10, 0, 5, 0, 0, 0, 0, -10],
    [-20, -10, -10, -5, -5, -10, -10, -20]
  ],
  k: [
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-30, -40, -40, -50, -50, -40, -40, -30],
    [-20, -30, -30, -40, -40, -30, -30, -20],
    [-10, -20, -20, -20, -20, -20, -20, -10],
    [20, 20, 0, 0, 0, 0, 20, 20],
    [20, 30, 10, 0, 0, 10, 30, 20]
  ]
};

// --- Piece Utilities ---
function syncPieces() {
  pieces = [];
  const board = game.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const square = board[i][j];
      if (!square) continue;
      const typeMap = { 'p': 6, 'r': 1, 'n': 2, 'b': 3, 'q': 4, 'k': 5 };
      const type = typeMap[square.type];
      pieces.push({
        type,
        color: square.color,
        sx: (type - 1) * SIZE,
        sy: square.color === 'w' ? SIZE : 0,
        x: j * SIZE,
        y: i * SIZE,
        alive: true
      });
    }
  }
  updateUI();
}

function updateUI() {
  const log = document.getElementById('moves-log');
  if (log) log.textContent = game.history().join(' ');
  const status = document.getElementById('game-status');
  if (game.game_over()) {
    if (game.in_checkmate()) {
      const winner = game.turn() === 'w' ? "Black" : "White";
      status.textContent = `Checkmate! ${winner} wins!`;
    } else if (game.in_draw()) {
      status.textContent = "Draw!";
    } else {
      status.textContent = "Game Over";
    }
  } else {
    const turn = game.turn() === 'w' ? "White" : "Black";
    status.textContent = `${turn}'s turn`;
    if (game.in_check()) status.textContent += " (Check!)";
  }
  draw();
}

// --- AI Logic (Minimax) ---
function evaluateBoard(gameInstance) {
  let totalEvaluation = 0;
  const board = gameInstance.board();
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      totalEvaluation += getPieceValue(board[i][j], i, j);
    }
  }
  return totalEvaluation;
}

function getPieceValue(piece, x, y) {
  if (!piece) return 0;
  const absoluteValue = Weights[piece.type] + (piece.color === 'w' ? PST[piece.type][x][y] : PST[piece.type][7 - x][y]);
  return piece.color === 'w' ? absoluteValue : -absoluteValue;
}

function minimax(gameInstance, depth, alpha, beta, isMaximisingPlayer) {
  if (depth === 0) return evaluateBoard(gameInstance);

  const possibleMoves = gameInstance.moves();

  if (isMaximisingPlayer) {
    let bestEval = -9999;
    for (const move of possibleMoves) {
      gameInstance.move(move);
      const evalValue = minimax(gameInstance, depth - 1, alpha, beta, false);
      bestEval = Math.max(bestEval, evalValue);
      gameInstance.undo();
      alpha = Math.max(alpha, bestEval);
      if (beta <= alpha) break;
    }
    return bestEval;
  } else {
    let bestEval = 9999;
    for (const move of possibleMoves) {
      gameInstance.move(move);
      const evalValue = minimax(gameInstance, depth - 1, alpha, beta, true);
      bestEval = Math.min(bestEval, evalValue);
      gameInstance.undo();
      beta = Math.min(beta, bestEval);
      if (beta <= alpha) break;
    }
    return bestEval;
  }
}

function getBestMove(gameInstance) {
  const possibleMoves = gameInstance.moves();
  let bestMove = null;
  let bestValue = 9999; // Black wants to minimize the score (White - Black)

  for (const move of possibleMoves) {
    gameInstance.move(move);
    const boardValue = minimax(gameInstance, 2, -10000, 10000, true); // Next turn is White (maximize)
    gameInstance.undo();
    if (boardValue < bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }
  return bestMove;
}

function triggerAiMove() {
  if (game.game_over() || gameMode !== 'ai' || game.turn() === 'w') return;

  isAiThinking = true;
  document.getElementById('ai-thinking').style.display = 'inline';

  setTimeout(() => {
    const bestMove = getBestMove(game);
    if (bestMove) game.move(bestMove);
    isAiThinking = false;
    document.getElementById('ai-thinking').style.display = 'none';
    syncPieces();
  }, 500);
}

// --- Interaction ---
function canvasToBoardCoords(clientX, clientY) {
  const r = canvas.getBoundingClientRect();
  const scaleX = canvas.width / r.width;
  const scaleY = canvas.height / r.height;
  const mx = (clientX - r.left) * scaleX;
  const my = (clientY - r.top) * scaleY;
  return { mx, my };
}

function handleStart(clientX, clientY) {
  if (isAiThinking || game.game_over()) return;
  const { mx, my } = canvasToBoardCoords(clientX, clientY);
  const sx = Math.floor((mx - OFFSET.x) / SIZE);
  const sy = Math.floor((my - OFFSET.y) / SIZE);
  if (sx < 0 || sx > 7 || sy < 0 || sy > 7) return;

  const idx = pieces.findIndex(p => p.alive && Math.round(p.x / SIZE) === sx && Math.round(p.y / SIZE) === sy);
  if (idx === -1 || pieces[idx].color !== game.turn()) return;

  draggingIndex = idx;
  const p = pieces[idx];
  dragOffset.x = mx - (p.x + OFFSET.x);
  dragOffset.y = my - (p.y + OFFSET.y);
  originalSquare = { x: p.x, y: p.y, sx, sy };
}

function handleMove(clientX, clientY) {
  if (draggingIndex === -1) return;
  const { mx, my } = canvasToBoardCoords(clientX, clientY);
  pieces[draggingIndex].x = mx - OFFSET.x - dragOffset.x;
  pieces[draggingIndex].y = my - OFFSET.y - dragOffset.y;
  draw();
}

function handleEnd() {
  if (draggingIndex === -1) return;
  const p = pieces[draggingIndex];
  const newSX = Math.max(0, Math.min(7, Math.floor((p.x + SIZE / 2) / SIZE)));
  const newSY = Math.max(0, Math.min(7, Math.floor((p.y + SIZE / 2) / SIZE)));

  const from = String.fromCodePoint(97 + originalSquare.sx) + (8 - originalSquare.sy);
  const to = String.fromCodePoint(97 + newSX) + (8 - newSY);

  const move = game.move({ from, to, promotion: 'q' });

  if (move) {
    syncPieces();
    if (gameMode === 'ai') triggerAiMove();
  } else {
    p.x = originalSquare.x;
    p.y = originalSquare.y;
    draw();
  }
  draggingIndex = -1;
}

canvas.addEventListener('mousedown', (ev) => handleStart(ev.clientX, ev.clientY));
canvas.addEventListener('mousemove', (ev) => handleMove(ev.clientX, ev.clientY));
canvas.addEventListener('mouseup', handleEnd);

canvas.addEventListener('touchstart', (ev) => {
  ev.preventDefault();
  if (ev.touches.length > 0) handleStart(ev.touches[0].clientX, ev.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchmove', (ev) => {
  ev.preventDefault();
  if (ev.touches.length > 0) handleMove(ev.touches[0].clientX, ev.touches[0].clientY);
}, { passive: false });

canvas.addEventListener('touchend', (ev) => {
  ev.preventDefault();
  handleEnd();
}, { passive: false });

canvas.addEventListener('mouseleave', () => {
  if (draggingIndex !== -1) {
    pieces[draggingIndex].x = originalSquare.x;
    pieces[draggingIndex].y = originalSquare.y;
    draggingIndex = -1;
    draw();
  }
});

// --- UI Actions ---
function initMode(mode) {
  gameMode = mode;
  document.getElementById('mode-selection').style.display = 'none';
  game = new Chess();
  syncPieces();
}

document.getElementById('btn-pvp').addEventListener('click', () => initMode('pvp'));
document.getElementById('btn-ai').addEventListener('click', () => initMode('ai'));
const btnReset = document.getElementById('btn-reset');
if (btnReset) {
  btnReset.addEventListener('click', () => {
    document.getElementById('mode-selection').style.display = 'flex';
  });
}

const btnUndo = document.getElementById('btn-undo');
if (btnUndo) {
  btnUndo.addEventListener('click', () => {
    game.undo();
    if (gameMode === 'ai') game.undo();
    syncPieces();
  });
}

const btnTheme = document.getElementById('btn-theme-toggle');
if (btnTheme) btnTheme.addEventListener('click', toggleTheme);

const btnFS = document.getElementById('btn-fullscreen');
if (btnFS) btnFS.addEventListener('click', toggleFullscreen);

initTheme();

globalThis.addEventListener('keydown', (e) => {
  if (e.key === 'Backspace') {
    game.undo();
    if (gameMode === 'ai') game.undo();
    syncPieces();
  }
});

// --- Drawing ---
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (boardImg.complete) ctx.drawImage(boardImg, 0, 0);
  if (figuresImg.complete) {
    pieces.forEach(p => {
      if (p.alive) {
        ctx.drawImage(figuresImg, p.sx, p.sy, SIZE, SIZE, p.x + OFFSET.x, p.y + OFFSET.y, SIZE, SIZE);
      }
    });
  }
}

boardImg.onload = draw;
figuresImg.onload = draw;
syncPieces();
