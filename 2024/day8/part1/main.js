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

function inBounds(pos, rows, cols) {
  return pos[0] >= 0 && pos[0] < rows && pos[1] >= 0 && pos[1] < cols;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const grid = input.split("\n").map((line) => line.split(""));

  const rows = grid.length;
  const cols = grid[0].length;

  const map = new Map();

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = grid[r][c];
      if (cell === ".") continue;

      map.set(cell, map.get(cell) ?? []);
      map.get(cell).push([r, c]);
    }
  }

  let antinodes = new Set();
  for (const [k, coords] of map) {
    for (let i = 0; i < coords.length; i++) {
      for (let j = i + 1; j < coords.length; j++) {
        const [r1, c1] = coords[i];
        const [r2, c2] = coords[j];

        const antinode1 = [r1 + r1 - r2, c1 + c1 - c2];
        const antinode2 = [r2 + r2 - r1, c2 + c2 - c1];

        debug(k, [r1, c1], [r2, c2], antinode1, antinode2);

        if (inBounds(antinode1, rows, cols)) {
          antinodes.add(p2s(antinode1));
        }
        if (inBounds(antinode2, rows, cols)) {
          antinodes.add(p2s(antinode2));
        }
      }
    }
  }

  debug(antinodes);
  result = antinodes.size;

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 14");
main("exercise.txt"); // 313
