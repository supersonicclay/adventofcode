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

function joinDisk(diskParts) {
  const disk = [];
  for (let i = 0; i < diskParts.length; i++) {
    const { fileId, size, gap } = diskParts[i];

    for (let bit = 0; bit < size; bit++) {
      disk.push(fileId);
    }
    for (let bit = 0; bit < gap; bit++) {
      disk.push(".");
    }
  }
  debug(disk.join(""));
  return disk;
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const nums = input.split("").map(Number);

  let diskParts = [];
  for (let i = 0; i < nums.length; i += 2) {
    const [size, gap] = nums.slice(i, i + 2);
    diskParts.push({ fileId: i / 2, size, gap: gap ?? 0 });
  }
  joinDisk(diskParts);
  debug("-----");

  for (let i = diskParts.length - 1; i > 0; i--) {
    const {
      fileId: fileIdToMove,
      size: sizeToMove,
      gap: gapToMove,
    } = diskParts[i];
    for (let j = 0; j < i; j++) {
      const { size, gap } = diskParts[j];
      if (gap >= sizeToMove) {
        // debug("move", i, diskParts[i], "to", j, diskParts[j]);

        diskParts[i].gap += sizeToMove;
        diskParts[i].size = 0;
        diskParts[j].gap = 0;

        diskParts.splice(j + 1, 0, {
          fileId: fileIdToMove,
          size: sizeToMove,
          gap: gap - sizeToMove,
        });
        break;
      }
    }
    joinDisk(diskParts);
  }

  const disk = joinDisk(diskParts);

  for (let i = 0; i < disk.length; i++) {
    if (disk[i] !== ".") {
      result += i * disk[i];
    }
  }

  console.log(result);
}

// debug = noop;
main("example.txt");
console.log("expected 2858");
// main("exercise.txt"); // 9870177277851 is too high
