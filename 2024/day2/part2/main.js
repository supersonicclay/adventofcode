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
  const increasingIndexes = new Set();
  const decreasingIndexes = new Set();
  for (let i = 1; i < line.length; i++) {
    const diff = line[i] - line[i - 1];
    if (diff > 0) {
      increasingIndexes.add(i);
    } else {
      decreasingIndexes.add(i);
    }
  }

  // debug(
  //   "directionFrequency",
  //   line.join(","),
  //   increasingIndexes,
  //   decreasingIndexes
  // );

  if (increasingIndexes.size === 0 || decreasingIndexes.size === 0) {
    // nothing invalid
    return new Set();
  }

  if (increasingIndexes.size > decreasingIndexes.size) {
    return decreasingIndexes;
  } else {
    return increasingIndexes;
  }
}

function checkDistances(line) {
  const invalidIndexes = new Set();
  for (let i = 1; i < line.length; i++) {
    const diff = Math.abs(line[i] - line[i - 1]);
    if (diff < 1 || diff > 3) {
      invalidIndexes.add(i);
    }
  }
  return invalidIndexes;
}

function isValid(line, forgave) {
  const invalidDirection = checkSameDirection(line);
  const invalidDistance = checkDistances(line);

  debug(
    "invalid indexes",
    line.join(","),
    "---",
    [...invalidDirection],
    [...invalidDistance]
  );

  if (invalidDirection.size === 0 && invalidDistance.size === 0) {
    return true;
  }

  let invalidIndexes = new Set();
  for (let i = 0; i < line.length; i++) {
    invalidIndexes.add(i);
  }

  if (invalidIndexes.size === 0) {
    // debug("no forgiveness necessary", line, invalidDirection, invalidDistance);
    return true;
  }

  if (forgave) {
    // debug("already forgave", line, invalidDirection, invalidDistance);
    return false;
  }

  for (const invalidIndex of invalidIndexes) {
    const newLine = line.filter((_, i) => i !== invalidIndex);
    // debug("checking again", line, newLine, invalidDirection, invalidDistance);
    const isValid2 = isValid(newLine, true);
    if (isValid2) {
      debug(`valid taking out ${invalidIndex}`);
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
  // .slice(0, 10);
  // .slice(4, 5);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    debug("-========-");
    const valid = isValid(line, false);

    const stuffs = line.map((num, i) => {
      const prev = i === 0 ? line[i] : line[i - 1];
      const diff = num - prev;
      return {
        num,
        diffInvalid: i !== 0 && (diff < -3 || diff === 0 || diff > 3),
        dir: diff === 0 ? "." : diff > 0 ? "+" : "-",
      };
    });

    debug(line.map((_, i) => i).join(""));
    debug(stuffs.map(({ diffInvalid }) => (diffInvalid ? "#" : ".")).join(""));
    debug(
      stuffs
        .map(({ dir }, i) =>
          i === 0 || i === 1 ? "." : dir === stuffs[i - 1].dir ? "." : "#"
        )
        .join("")
    );
    debug(stuffs.map(({ dir }) => dir).join(""));

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
