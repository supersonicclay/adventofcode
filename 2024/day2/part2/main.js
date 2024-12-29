const noop = () => {};
let debug = console.log;
debug = noop;

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

function checkSameDirection(line) {
  let firstIncreasing = line[1] - line[0] > 0;
  let secondIncreasing = line[2] - line[1] > 0;
  let thirdIncreasing = line[3] - line[2] > 0;
  if (
    firstIncreasing !== secondIncreasing ||
    secondIncreasing !== thirdIncreasing
  ) {
    if (firstIncreasing === thirdIncreasing) {
      return 1;
    }
    return 0;
  }

  for (let i = 4; i < line.length; i++) {
    let increasing = line[i] - line[i - 1] > 0;
    if (increasing !== firstIncreasing) {
      return i;
    }
  }
  return -1;
}

function checkDistances(line) {
  const invalidIndexes = [];
  for (let i = 1; i < line.length; i++) {
    const diff = Math.abs(line[i] - line[i - 1]);
    if (diff < 1 || diff > 3) {
      return i;
    }
  }
  return -1;
}

function isValid(line, forgave) {
  debug("checking", line, forgave);
  const invalidDirection = checkSameDirection(line);
  const invalidDistance = checkDistances(line);

  if (
    invalidDirection !== -1 &&
    invalidDistance !== -1 &&
    invalidDirection !== invalidDistance
  ) {
    debug("different indexes", line, invalidDirection, invalidDistance);
    return false;
  }

  if (invalidDirection === -1 && invalidDistance === -1) {
    debug("no forgiveness necessary", line, invalidDirection, invalidDistance);
    return true;
  }

  if (forgave) {
    debug("already forgave", line, invalidDirection, invalidDistance);
    return false;
  }

  const indexToRemove =
    invalidDirection !== -1 ? invalidDirection : invalidDistance;

  // remove the invalid index and save in new variable
  const newLine = line.filter((_, i) => i !== indexToRemove);
  debug("checking again", line, newLine, invalidDirection, invalidDistance);

  return isValid(newLine, true);
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const lines = input.split("\n").map((line) =>
    line
      .split(" ")
      .map((x) => x.trim())
      .filter(Boolean)
      .map(Number)
  );

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    debug("-========-");
    const valid = isValid(line, false);

    debug(line, valid);

    if (valid) {
      result++;
    }

    if (i === 10) {
      debug = () => {};
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 4");
main("exercise.txt"); // ?
