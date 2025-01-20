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

function calculatePlot(plants, pos, visited, borders) {
  const [r, c] = pos;
  const key = p2s(pos);
  if (visited.has(key)) {
    return borders;
  }
  visited.add(key);

  const plantType = plants[r][c];
  for (const [dir, move] of Object.entries(dirs)) {
    const nextPos = move(pos);
    const [nr, nc] = nextPos;
    if (nr < 0 || nr >= plants.length || nc < 0 || nc >= plants[r].length) {
      borders++;
    } else {
      const nextPlantType = plants[nr][nc];
      if (nextPlantType === plantType) {
        borders = calculatePlot(plants, nextPos, visited, borders);
      } else {
        borders++;
      }
    }
  }

  return borders;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const plants = input.split("\n").map((line) => line.split(""));
  const rows = plants.length;
  const cols = plants[0].length;
  debug(plants);

  const visited = new Set();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let sizeBefore = visited.size;
      const borders = calculatePlot(plants, [r, c], visited, 0);
      const area = visited.size - sizeBefore;
      result += borders * area;
    }
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 140");
main("example2.txt");
console.log("expected 772");
main("example3.txt");
console.log("expected 1930");
main("exercise.txt"); // 1375574
