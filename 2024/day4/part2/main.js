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

const MAS = ["M", "A", "S"];

function look(grid, pos, dir, index) {
  if (index >= MAS.length) {
    return true;
  }

  const [row, col] = pos;

  if (row < 0 || row >= grid.length) {
    return false;
  }
  if (col < 0 || col >= grid[row].length) {
    return false;
  }

  if (grid[row][col] !== MAS[index]) {
    return false;
  }

  return look(grid, dir(pos), dir, index + 1);
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const backslash =
        look(grid, [r, c], dirs.DR, 0) ||
        look(grid, [r + 2, c + 2], dirs.UL, 0);
      const forwardslash =
        look(grid, [r, c + 2], dirs.DL, 0) ||
        look(grid, [r + 2, c], dirs.UR, 0);

      if (backslash && forwardslash) {
        // debug("found", r, c);
        result++;
      }
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 9");
main("exercise.txt"); // 1737
