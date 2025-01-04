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

function reachesTarget(target, cumulative, values) {
  if (values.length === 0) {
    return cumulative === target;
  }

  return (
    reachesTarget(target, cumulative + values[0], values.slice(1)) ||
    reachesTarget(target, cumulative * values[0], values.slice(1))
  );
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const equations = input.split("\n").map((line) => {
    const [target, ...values] = line.split(" ").map((n) => parseInt(n));

    return { target, values };
  });

  debug(equations);

  for (const { target, values } of equations) {
    if (reachesTarget(target, values[0], values.slice(1))) {
      debug("works", target, values);
      result += target;
    }
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 3749");
main("exercise.txt"); // 5030892084481
