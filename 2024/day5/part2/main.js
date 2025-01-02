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
  const entries = Array.from(orderingRules.entries());
  debug(entries.map(([page, set]) => [page, [...set]]));

  const updates = updateLines.map((line) => line.split(",").map(Number));

  for (const update of updates) {
    debug("\n=======");
    debug(update.join(","));

    const sorted = [...update].sort((a, b) =>
      orderingRules.get(a)?.has(b) ? -1 : 1
    );
    debug(sorted.join(","));

    const corrected = sorted.some((entry, index) => update[index] !== entry);

    if (corrected) {
      debug("corrected");
      result += sorted[Math.floor(sorted.length / 2)];
    }
  }

  console.log(result);
}

debug = noop;
// main("example.txt");
// console.log("expected 123");
main("exercise.txt"); // 7702 too high
