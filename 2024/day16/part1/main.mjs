import { readFileSync } from "fs";
import { funDebug } from "./gridDebug.mjs";

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

function findShortestPath(maze, start, end) {
  const queue = [[[start], 0, "R"]]; // [path, cost, previous direction]
  const visited = new Set();
  visited.add(p2s(start));

  const steps = [];
  while (queue.length > 0) {
    steps.push(new Set([...visited]));

    const [path, cost, prevDir] = queue.shift();
    const [r, c] = path[path.length - 1];

    // if (steps.length === 102) {
    //   debug("r, end", p2s([r, c]), p2s(end));
    //   debug("cost", cost);
    // }
    if (r === end[0] && c === end[1]) {
      funDebug(maze, [new Set([...path.map(p2s)])], 0);

      debug("done", path);
      return cost;
    }

    for (const dir of Object.keys(dirs)) {
      const [nr, nc] = dirs[dir]([r, c]);

      if (
        maze[nr] &&
        (maze[nr][nc] === "." || maze[nr][nc] === "E") &&
        !visited.has(p2s([nr, nc]))
      ) {
        const turnCost = prevDir !== dir ? 1000 : 0;
        const newCost = cost + 1 + turnCost;
        debug("trying", nr, nc, turnCost, newCost);
        queue.push([[...path, [nr, nc]], newCost, dir]);
        visited.add(p2s([nr, nc]));
      }
    }
  }

  // funDebug(maze, steps, steps.length - 1);

  return -1; // no path found
}

function main(file) {
  let result = 0;
  const input = readFileSync(file, "utf-8");
  const maze = input.split("\n").map((line) => line.split(""));

  let start, end;
  for (let r = 0; r < maze.length; r++) {
    for (let c = 0; c < maze[r].length; c++) {
      const cell = maze[r][c];
      if (cell === "S") {
        start = [r, c];
      } else if (cell === "E") {
        end = [r, c];
      }
    }
  }

  result = findShortestPath(maze, start, end);

  console.log(result);
}

main("example1.txt");
console.log("expected 7036");
// main("example2.txt");
// console.log("expected 11048");
// main("exercise.txt"); // ???
