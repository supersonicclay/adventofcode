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
  "^": ([r, c]) => [r - 1, c],
  ">": ([r, c]) => [r, c + 1],
  v: ([r, c]) => [r + 1, c],
  "<": ([r, c]) => [r, c - 1],
};

function debugGrid(grid) {
  for (let row of grid) {
    debug(row.join(""));
  }
}

function makeMove(grid, robotPos, curPos, distance, move) {
  const cur = grid[curPos[0]][curPos[1]];

  if (distance === 1) {
    if (cur === ".") {
      // no push necessary
      grid[robotPos[0]][robotPos[1]] = ".";
      grid[curPos[0]][curPos[1]] = "@";
      return curPos;
    }

    if (cur === "#") {
      // can't move
      return robotPos;
    }
  }

  if (distance > 0) {
    if (cur === "O") {
      return makeMove(grid, robotPos, move(curPos), distance + 1, move);
    }

    if (cur === ".") {
      const pos1 = move(robotPos);
      grid[robotPos[0]][robotPos[1]] = ".";
      grid[pos1[0]][pos1[1]] = "@";
      grid[curPos[0]][curPos[1]] = "O";
      return pos1;
    }
    if (cur === "#") {
      // can't move
      return robotPos;
    }
  }
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const [gridString, movesString] = input.split("\n\n");

  const grid = gridString.split("\n").map((line) => line.split(""));
  const moves = movesString.split("").filter((m) => dirs[m]);
  let r = grid.findIndex((row) => row.includes("@"));
  let c = grid[r].indexOf("@");
  debug(r, c);
  let robotPos = [r, c];
  debugGrid(grid);
  debug(moves);

  for (let m = 0; m < moves.length; m++) {
    const moveName = moves[m];
    const move = dirs[moveName];
    if (!move) {
      console.error("unknown move", moveName);
      return;
    }
    robotPos = makeMove(grid, robotPos, move(robotPos), 1, move);
    debugGrid(grid);
  }

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === "O") {
        result += r * 100 + c;
      }
    }
  }

  console.log(result);
}

debug = noop;
main("example1.txt");
console.log("expected 2028");
main("example2.txt");
console.log("expected 10092");
main("exercise.txt"); // 1438161
