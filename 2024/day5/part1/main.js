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

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const [orderingRulesLines, updateLines] = input
    .split("\n\n")
    .map((chunk) => chunk.split("\n"));

  const orderingRules = orderingRulesLines.reduce((map, line) => {
    const [earlierPage, laterPage] = line.split("|").map(Number);
    map.set(earlierPage, (map.get(earlierPage) ?? new Set()).add(laterPage));
    return map;
  }, new Map());

  const updates = updateLines.map((line) => line.split(",").map(Number));
  // debug(orderingRules);
  // debug(updates);

  for (const update of updates) {
    // debug(update);

    let valid = true;
    let previous = update[0];
    for (let i = 1; i < update.length; i++) {
      const current = update[i];

      // debug(previous, current, orderingRules.get(previous));
      if (!orderingRules.get(previous)?.has(current)) {
        valid = false;
        break;
      }
      previous = current;
    }

    if (valid) {
      // debug("valid", Math.floor(update.length / 2));
      result += update[Math.floor(update.length / 2)];
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 143");
main("exercise.txt"); // 5948
