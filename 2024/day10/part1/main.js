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

function walk(grid, pos, visited, peaks) {
  const [r, c] = pos;
  if (visited.has(p2s(pos))) {
    return;
  }
  visited.add(p2s(pos));
  if (grid[r][c] === 9) {
    peaks.add(p2s(pos));
    return;
  }

  for (const dir of Object.values(dirs)) {
    const [newR, newC] = dir(pos);
    if (newR < 0 || newR >= grid.length || newC < 0 || newC >= grid[0].length) {
      continue;
    }
    const newHeight = grid[newR][newC];
    if (newHeight === grid[r][c] + 1) {
      walk(grid, [newR, newC], visited, peaks);
    }
  }
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split("").map(Number));

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === 0) {
        const peaks = new Set();
        const visited = new Set();
        walk(grid, [r, c], visited, peaks);
        debug([r, c], peaks);
        result += peaks.size;
      }
    }
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 36");
main("exercise.txt"); // 535
