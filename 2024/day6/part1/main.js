const noop = () => {};
let debug = console.log;
// debug = noop;

function sum(x) {
  return x.reduce((a, b) => a + b, 0);
}
function mul(x) {
  return x.reduce((a, b) => a * b, 1);
}

const p2s = ([r, c]) => `${r},${c}`;
const s2p = (s) => s.split(",").map(Number);

const dirs = {
  U: ([r, c]) => [r - 1, c],
  R: ([r, c]) => [r, c + 1],
  D: ([r, c]) => [r + 1, c],
  L: ([r, c]) => [r, c - 1],
};

const turnProcess = [dirs.U, dirs.R, dirs.D, dirs.L];

function inBounds(grid, [r, c]) {
  return r >= 0 && r < grid.length && c >= 0 && c < grid[0].length;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));

  let turn = 0;
  let dir = turnProcess[turn];
  let pos;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "^") {
        pos = [r, c];
        break;
      }
    }
  }

  const visited = new Set();
  while (inBounds(grid, pos)) {
    visited.add(p2s(pos));
    const cell = grid[pos[0]][pos[1]];

    const next = dir(pos);
    debug("next", next);
    if (inBounds(grid, next)) {
      const nextCell = grid[next[0]][next[1]];
      if (nextCell === "#") {
        turn++;
        debug("turning", turn);
        dir = turnProcess[turn % 4];
        continue;
      }
    }
    pos = next;
  }

  result = visited.size;

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 41");
main("exercise.txt"); // 5551
