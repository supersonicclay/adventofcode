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
  const nums = input.split("").map(Number);

  const disk = [];
  for (let i = 0; i < nums.length; i += 2) {
    const [size, gap] = nums.slice(i, i + 2);

    for (let bit = 0; bit < size; bit++) {
      disk.push(i / 2);
    }
    for (let bit = 0; bit < gap; bit++) {
      disk.push(".");
    }
  }

  let left = 0;
  let right = disk.length - 1;
  while (left < right) {
    if (disk[right] === ".") {
      right--;
      continue;
    }
    if (disk[left] !== ".") {
      left++;
      continue;
    }

    disk[left] = disk[right];
    disk[right] = ".";
    debug(disk.join(""));
  }

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== ".") {
      result += i * disk[i];
    }
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 1928");
main("exercise.txt"); // 6386640365805
