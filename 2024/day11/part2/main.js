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

function blink(num, blinkIndex, count, cache) {
  if (blinkIndex === 0) {
    cache.set(num, cache.get(num) ?? new Map());
    cache.get(num).set(blinkIndex, count);
    return count;
  }

  const cached = cache.get(num)?.get(blinkIndex);
  if (cached) {
    return cached;
  }

  if (num === 0) {
    return blink(1, blinkIndex - 1, count, cache);
  } else {
    const s = String(num);
    if (s.length % 2 == 0) {
      const n1 = Number(s.slice(0, s.length / 2));
      const n2 = Number(s.slice(s.length / 2));
      const result =
        blink(n1, blinkIndex - 1, count, cache) +
        blink(n2, blinkIndex - 1, count, cache);
      cache.set(num, cache.get(num) ?? new Map());
      cache.get(num).set(blinkIndex, result);
      return result;
    } else {
      const result = blink(num * 2024, blinkIndex - 1, count, cache);
      cache.set(num, cache.get(num) ?? new Map());
      cache.get(num).set(blinkIndex, result);
      return result;
    }
  }
}

function main(file, blinks) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const nums = input.split(" ").map(Number);

  const cache = new Map();
  for (let i = 0; i < nums.length; i++) {
    result += blink(nums[i], blinks, 1, cache);
  }

  console.log(result);
}

// debug = noop;
main("example.txt", 25);
console.log("expected -- 55312");
main("example.txt", 75);
console.log("expected -- 65601038650482");
main("exercise.txt", 75); // 228449040027793
