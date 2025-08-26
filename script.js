const gridSize = 4;
let grid = [];
const gridContainer = document.getElementById("grid");
const statusText = document.getElementById("status");

function initGame() {
  grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
  addNewTile();
  addNewTile();
  drawGrid();
}

function addNewTile() {
  const empty = [];
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) empty.push([i, j]);
    }
  }
  if (empty.length) {
    const [x, y] = empty[Math.floor(Math.random() * empty.length)];
    grid[x][y] = Math.random() < 0.9 ? 2 : 4;
  }
}

function drawGrid() {
  gridContainer.innerHTML = "";
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const tile = document.createElement("div");
      const value = grid[i][j];
      tile.className = "tile";
      if (value) {
        tile.textContent = value;
        tile.classList.add("tile-" + value);
      }
      gridContainer.appendChild(tile);
    }
  }
}

function move(direction) {
  let moved = false;

  function slide(arr) {
    arr = arr.filter(v => v !== 0);
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(v => v !== 0);
    while (arr.length < gridSize) arr.push(0);
    return arr;
  }

  if (direction === "left") {
    for (let i = 0; i < gridSize; i++) {
      const original = grid[i].slice();
      grid[i] = slide(grid[i]);
      if (grid[i].toString() !== original.toString()) moved = true;
    }
  } else if (direction === "right") {
    for (let i = 0; i < gridSize; i++) {
      const original = grid[i].slice();
      grid[i] = slide([...grid[i]].reverse()).reverse();
      if (grid[i].toString() !== original.toString()) moved = true;
    }
  } else if (direction === "up") {
    for (let j = 0; j < gridSize; j++) {
      const col = grid.map(r => r[j]);
      const original = col.slice();
      const slid = slide(col);
      for (let i = 0; i < gridSize; i++) grid[i][j] = slid[i];
      if (slid.toString() !== original.toString()) moved = true;
    }
  } else if (direction === "down") {
    for (let j = 0; j < gridSize; j++) {
      const col = grid.map(r => r[j]);
      const original = col.slice();
      const slid = slide(col.reverse()).reverse();
      for (let i = 0; i < gridSize; i++) grid[i][j] = slid[i];
      if (slid.toString() !== original.toString()) moved = true;
    }
  }

  if (moved) {
    addNewTile();
    drawGrid();
    checkGameOver();
  }
}

function checkGameOver() {
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      if (grid[i][j] === 0) return;
      if (j < gridSize - 1 && grid[i][j] === grid[i][j + 1]) return;
      if (i < gridSize - 1 && grid[i][j] === grid[i + 1][j]) return;
    }
  }
  statusText.textContent = "Game Over!";
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") move("left");
  else if (e.key === "ArrowRight") move("right");
  else if (e.key === "ArrowUp") move("up");
  else if (e.key === "ArrowDown") move("down");
});

initGame();
