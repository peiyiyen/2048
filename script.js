const size = 4;
let board = [];
let score = 0;

function createBoard() {
  const container = document.getElementById('game-container');
  container.innerHTML = '';
  for (let i = 0; i < size * size; i++) {
    const tile = document.createElement('div');
    tile.classList.add('tile');
    container.appendChild(tile);
  }
}

function drawBoard() {
  const tiles = document.querySelectorAll('.tile');
  for (let i = 0; i < size * size; i++) {
    const tile = tiles[i];
    tile.innerHTML = '';
    const value = board[Math.floor(i / size)][i % size];
    if (value !== 0) {
      const img = document.createElement('img');
      img.src = `images/${value}.png`;
      img.alt = value;
      tile.appendChild(img);
    }
  }
  document.getElementById('score').textContent = score;
}

function initBoard() {
  board = Array(size).fill().map(() => Array(size).fill(0));
  score = 0;
  addRandomTile();
  addRandomTile();
  drawBoard();
}

function addRandomTile() {
  const emptyTiles = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c] === 0) emptyTiles.push({ r, c });
    }
  }
  if (emptyTiles.length === 0) return;
  const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function rotateMatrix(matrix) {
  const result = [];
  for (let i = 0; i < size; i++) {
    result[i] = [];
    for (let j = 0; j < size; j++) {
      result[i][j] = matrix[size - j - 1][i];
    }
  }
  return result;
}

function moveLeft() {
  let moved = false;
  for (let row = 0; row < size; row++) {
    let newRow = board[row].filter(val => val !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow[i + 1] = 0;
        moved = true;
      }
    }
    newRow = newRow.filter(val => val !== 0);
    while (newRow.length < size) {
      newRow.push(0);
    }
    if (board[row].toString() !== newRow.toString()) {
      moved = true;
    }
    board[row] = newRow;
  }
  return moved;
}

function move(direction) {
  let moved = false;
  if (direction === 'up') {
    board = rotateMatrix(board);
    moved = moveLeft();
    board = rotateMatrix(board);
    board = rotateMatrix(board);
    board = rotateMatrix(board);
  } else if (direction === 'down') {
    board = rotateMatrix(board);
    board = rotateMatrix(board);
    board = rotateMatrix(board);
    moved = moveLeft();
    board = rotateMatrix(board);
  } else if (direction === 'left') {
    moved = moveLeft();
  } else if (direction === 'right') {
    board = board.map(row => row.reverse());
    moved = moveLeft();
    board = board.map(row => row.reverse());
  }

  if (moved) {
    addRandomTile();
    drawBoard();
  }
}

// ✅ 手機觸控滑動偵測（支援上下左右）
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }
}, { passive: true });

document.addEventListener('touchend', (e) => {
  if (e.changedTouches.length > 0) {
    touchEndX = e.changedTouches[0].clientX;
    touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const threshold = 30;

    if (absDx > absDy && absDx > threshold) {
      if (dx > 0) move('right');
      else move('left');
    } else if (absDy > threshold) {
      if (dy > 0) move('down');
      else move('up');
    }
  }
});
  
createBoard();
initBoard();
