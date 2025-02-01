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

function main(file, w, h, steps) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const robots = input.split("\n").map((line) => {
    const [p, v] = line
      .split(" ")
      .map((s) => s.split("=")[1].split(",").map(Number));

    return { p, v };
  });

  for (let r = 0; r < robots.length; r++) {
    const robot = robots[r];

    robot.p = [
      robot.p[0] + robot.v[0] * steps,
      robot.p[1] + robot.v[1] * steps,
    ];
    robot.p[0] = ((robot.p[0] % w) + w) % w;
    robot.p[1] = ((robot.p[1] % h) + h) % h;
  }
  // debug(robots);

  const posMap = new Map();
  const quadMap = new Map();
  for (const robot of robots) {
    const pos = p2s(robot.p);
    posMap.set(pos, (posMap.get(pos) ?? 0) + 1);

    if ((w - 1) / robot.p[0] === 2 || (h - 1) / robot.p[1] === 2) {
      debug("ignoring robot", robot);
      continue;
    }

    const quad =
      Math.floor(robot.p[0] / (w / 2)) + 2 * Math.floor(robot.p[1] / (h / 2));
    quadMap.set(quad, (quadMap.get(quad) ?? 0) + 1);
  }

  result = mul(quadMap.values());

  debug(quadMap);

  if (
    quadMap.get(3) > quadMap.get(1) * 2 &&
    quadMap.get(2) > quadMap.get(0) * 2
  ) {
    console.log("steps", steps);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let found = posMap.get(p2s([c, r])) ?? 0;

        if ((w - 1) / c === 2 || (h - 1) / r === 2) {
          process.stdout.write(" ");
        } else {
          process.stdout.write(found ? "#" : ".");
        }
      }
      process.stdout.write("\n");
    }
  }

  // console.log(result);
}

debug = noop;
for (let i = 0; i < 20000; i++) {
  main("exercise.txt", 101, 103, i); // 7847
}
