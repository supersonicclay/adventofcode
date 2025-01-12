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

function travel(antinodes, k, [r, c], [dr, dc], rows, cols) {
  debug("travel", k, r, c, dr, dc);
  if (!inBounds([r, c], rows, cols)) {
    return;
  }
  debug("adding");

  // antinodes.add(p2s([r, c]) + String(Math.random()));
  antinodes.add(p2s([r, c]));

  travel(antinodes, k, [r + dr, c + dc], [dr, dc], rows, cols);
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

        // if (r1 !== 2 || c1 !== 5 || r2 !== 3 || c2 !== 7) {
        //   continue;
        // }

        debug("=============", k, [r1, c1], [r2, c2]);

        let dr = r1 - r2;
        let dc = c1 - c2;
        travel(antinodes, k, [r1, c1], [dr, dc], rows, cols);

        dr = r2 - r1;
        dc = c2 - c1;
        travel(antinodes, k, [r2, c2], [dr, dc], rows, cols);
      }
    }
  }

  for (let r = 0; r < rows; r++) {
    debug(
      grid[r]
        .map((x, c) => {
          if (antinodes.has(p2s([r, c]))) {
            return "#";
          }
          return x;
        })
        .join("")
    );
  }
  debug(antinodes);
  result = antinodes.size;

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 34");
main("exercise.txt"); // 1064
