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

function getProduct(instructions) {
  let result = 0;
  const re = /mul\((\d{1,3})\,(\d{1,3})\)/g;

  const numbers = [...instructions.matchAll(re)].map((m) =>
    m.slice(1).map(Number)
  );

  for (let i = 0; i < numbers.length; i++) {
    const [a, b] = numbers[i];
    result += a * b;
  }
  return result;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");

  const parts = input.split("don't()");

  result += getProduct(parts[0]);

  for (let i = 1; i < parts.length; i++) {
    const doInstructions = parts[i].split("do()").splice(1).join("");
    result += getProduct(doInstructions);
  }

  console.log(result);
}

main("example.txt");
console.log("expected 48");
main("exercise.txt"); // 62098619
