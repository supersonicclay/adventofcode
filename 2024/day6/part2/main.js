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

function doIGetStuck(grid, pos, turn) {
  let dir = turnProcess[turn];

  const visited = new Set();
  while (inBounds(grid, pos)) {
    debug("pos", pos, turn);
    const visit = p2s(pos) + "|" + turn;
    if (visited.has(visit)) {
      return true;
    }

    visited.add(visit);
    const next = dir(pos);
    if (inBounds(grid, next)) {
      const nextCell = grid[next[0]][next[1]];
      if (nextCell === "#") {
        turn = (turn + 1) % 4;
        // debug("turning", turn);
        dir = turnProcess[turn];
        continue;
      }
    }
    pos = next;
  }
  return false;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));

  let turn = 0;
  let pos;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "^") {
        pos = [r, c];
        break;
      }
    }
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== ".") {
        continue;
      }

      grid[r][c] = "#";
      if (doIGetStuck(grid, pos, turn)) {
        result++;
      }
      grid[r][c] = ".";
    }
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 6");
main("exercise.txt"); // ???
