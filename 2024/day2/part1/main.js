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
  const lines = input.split("\n").map((line) =>
    line
      .split(" ")
      .map((x) => x.trim())
      .filter(Boolean)
      .map(Number)
  );

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const expectIncreasing = line[1] - line[0] > 0;

    let valid = true;
    for (let j = 1; j < line.length; j++) {
      const increasing = line[j] - line[j - 1] > 0;
      if (increasing !== expectIncreasing) {
        valid = false;
        continue;
      }

      const diff = Math.abs(line[j] - line[j - 1]);
      if (diff < 1 || diff > 3) {
        valid = false;
        continue;
      }
    }

    if (valid) {
      result++;
    }
  }

  console.log(result);
}

main("example.txt");
console.log("expected 2");
main("exercise.txt"); // 624
