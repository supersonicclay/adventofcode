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
  UR: ([r, c]) => [r - 1, c + 1],
  DR: ([r, c]) => [r + 1, c + 1],
  DL: ([r, c]) => [r + 1, c - 1],
  UL: ([r, c]) => [r - 1, c - 1],
};

const XMAS = ["X", "M", "A", "S"];

function look(grid, pos, dir, index) {
  if (index >= XMAS.length) {
    return true;
  }

  const [row, col] = pos;

  if (row < 0 || row >= grid.length) {
    return false;
  }
  if (col < 0 || col >= grid[row].length) {
    return false;
  }

  if (grid[row][col] !== XMAS[index]) {
    return false;
  }

  return look(grid, dir(pos), dir, index + 1);
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));

  // debug(grid);

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      for (const dir in dirs) {
        if (look(grid, [r, c], dirs[dir], 0)) {
          // debug("found", dir, r, c);
          result++;
        }
      }
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 18");
main("exercise.txt"); // 2358
