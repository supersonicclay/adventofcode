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
  const allIncreasing = line.every((num, i) => i === 0 || num > line[i - 1]);
  const allDecreasing = line.every((num, i) => i === 0 || num < line[i - 1]);
  return allIncreasing || allDecreasing;
}

function checkDistances(line) {
  return line.every((num, i) => i === 0 || Math.abs(num - line[i - 1]) <= 3);
}

function isValid(line, forgave) {
  const validDirection = checkSameDirection(line);
  const validDistance = checkDistances(line);

  debug(
    "invalid indexes",
    line.join(","),
    "---",
    validDirection,
    validDistance
  );

  if (validDirection && validDistance) {
    // debug("valid", line, forgave, invalidDirection, invalidDistance);
    return true;
  }

  if (forgave) {
    // debug("already forgave", line, invalidDirection, invalidDistance);
    return false;
  }

  for (let i = 0; i < line.length; i++) {
    // try taking out each one
    const newLine = line.filter((_, i2) => i2 !== i);
    // debug("checking again", line, newLine, invalidDirection, invalidDistance);
    const canForgive = isValid(newLine, true);
    if (canForgive) {
      debug(`valid taking out ${i}`);
      return true;
    }
  }

  return false;
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

    debug("valid?", i, valid, line.join(","));

    if (valid) {
      result++;
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 4");
main("exercise.txt"); // 658
