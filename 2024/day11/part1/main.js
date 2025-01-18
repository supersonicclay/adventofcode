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

function blink(nums, numBlinks) {
  for (let b = 0; b < numBlinks; b++) {
    const newNums = [];
    let j = 0;
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      if (n === 0) {
        newNums.push(1);
      } else {
        const s = String(n);
        if (s.length % 2 == 0) {
          const n1 = Number(s.slice(0, s.length / 2));
          const n2 = Number(s.slice(s.length / 2));
          debug("even", n, n1, n2);
          newNums.push(n1);
          newNums.push(n2);
          j++;
        } else {
          newNums.push(n * 2024);
        }
      }
      j++;
    }
    debug("blink", b, "---", newNums.join(" "));
    nums = newNums;
  }
  return nums.length;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const nums = input.split(" ").map(Number);

  debug(nums);

  result = blink(nums, 25);

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 55312");
main("exercise.txt"); // 193269
