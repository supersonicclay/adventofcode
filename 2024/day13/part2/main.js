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

function gcdExtended(a, b) {
  if (b === 0) return [a, 1, 0];

  let [g, x1, y1] = gcdExtended(b, a % b);

  return [g, y1, x1 - Math.floor(a / b) * y1];
}

function hasSolution(a, b, c) {
  let [g, x0, y0] = gcdExtended(a, b);
  return c % g === 0;
}

function solvePositiveOrZeroSolutions(a, b, c) {
  // Find GCD and coefficients
  let [g, x0, y0] = gcdExtended(a, b);
  debug([g, x0, y0]);

  // Check if a solution exists
  if (c % g !== 0) {
    return new Set();
  }

  // Scale the solution
  let factor = c / g;
  x0 *= factor;
  y0 *= factor;

  // Calculate step size (how much to increment/decrement k)
  let stepX = b / g;
  let stepY = a / g;

  let solutions = new Set();

  // Check for solutions when x = 0
  let kXZero = -x0 / stepX;
  if (Number.isInteger(kXZero)) {
    let y = y0 - stepY * kXZero;
    if (y > 0) {
      solutions.add(`0,${y}`);
    }
  }

  // Check for solutions when y = 0
  let kYZero = y0 / stepY;
  if (Number.isInteger(kYZero)) {
    let x = x0 + stepX * kYZero;
    if (x > 0) {
      solutions.add(`${x},0`);
    }
  }

  // Check for solutions when both x and y are positive
  let kMin = Math.ceil(-x0 / stepX);
  let kMax = Math.floor(y0 / stepY);

  let zzz = 0;
  for (let k = kMin; k <= kMax; k++) {
    let x = x0 + stepX * k;
    let y = y0 - stepY * k;

    if (x > 0 && y > 0) {
      solutions.add(`${x},${y}`);

      if (zzz++ < 10) {
        debug("x,y", x, y, x * a + b * y, c);
        debug(solutions);
      }
    }
  }

  return solutions;
}

function parseButton(str) {
  const [x, y] = str
    .split(": ")[1]
    .split(", ")
    .map((s) => Number(s.split("+")[1]));

  return [x, y];
}

function tokensForGroup({ buttons, prize }) {
  const [a, b] = buttons;

  if (
    !hasSolution(a[0], b[0], prize[0]) ||
    !hasSolution(a[1], b[1], prize[1])
  ) {
    debug("no solution");
    return Infinity;
  }

  solvePositiveOrZeroSolutions(a[0], b[0], prize[0]);
  // solvePositiveOrZeroSolutions(a[1], b[1], prize[1]);

  // const maxAPresses = Math.floor(Math.min(prize[0] / a[0], prize[1] / a[1]));
  // // debug(maxAPresses);

  // let minTokens = Infinity;
  // for (let aPresses = maxAPresses; aPresses >= 0; aPresses--) {
  //   // debug("trying", aPresses);
  //   const xLeft = prize[0] - a[0] * aPresses;
  //   const yLeft = prize[1] - a[1] * aPresses;
  //   const valid =
  //     xLeft % b[0] === 0 && yLeft % b[1] === 0 && xLeft / b[0] === yLeft / b[1];
  //   if (valid) {
  //     const bPresses = xLeft / b[0];
  //     minTokens = Math.min(minTokens, aPresses * 3 + bPresses);
  //   }

  //   // for (let bPresses = 0; bPresses <= maxBPresses; bPresses++) {
  //   //   const pos = [
  //   //     a[0] * aPresses + b[0] * bPresses,
  //   //     a[1] * aPresses + b[1] * bPresses,
  //   //   ];
  //   //   if (pos[0] === prize[0] && pos[1] === prize[1]) {
  //   //     debug("can do this combo", aPresses, bPresses);
  //   //     // return "doober";
  //   //   }
  //   // }
  // }
  // return minTokens;

  // // const [dx1, dx2] = a[0] > b[0] ? [a[0], b[0]] : [b[0], a[0]];
  // // const [dy1, dy2] = a[1] > b[1] ? [a[1], b[1]] : [b[1], a[1]];

  // // debug({ buttons, prize });
  // // debug("cheapest x", dx1, dx2);
  // // //01,10,11,11

  // // // start optimistically over x axis
  // // for (
  // //   let x1Presses = Math.floor(prize[0] / dx1);
  // //   x1Presses >= 0;
  // //   x1Presses--
  // // ) {
  // //   const xLeft = prize[0] - dx1 * x1Presses;

  // //   if (x1Presses === 80) {
  // //     debug("xLeft", xLeft);
  // //   }
  // //   // return;
  // //   // const x2Presses = dx2 / prize[0]
  // //   //   const pos = [a[0] * x1Presses + b[0] * x2Presses, 0];
  // //   //   if (pos[0] === prize[0]) {
  // //   //     debug("can do this combo", x1Presses, x2Presses);
  // //   //     // return "doober";
  // //   //   }
  // //   // }
  // // }

  // // for (let aPresses = 0; aPresses <= maxAPresses; aPresses++) {
  // //   for (let bPresses = 0; bPresses <= maxBPresses; bPresses++) {
  // //     const pos = [
  // //       a[0] * aPresses + b[0] * bPresses,
  // //       a[1] * aPresses + b[1] * bPresses,
  // //     ];
  // //     if (pos[0] === prize[0] && pos[1] === prize[1]) {
  // //       debug("can do this combo", aPresses, bPresses);
  // //       // return "doober";
  // //     }
  // //   }
  // // }
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const groups = input.split("\n\n").map((group) => {
    const [aString, bString, prizeString] = group.split("\n");

    const prize = prizeString
      .split(": ")[1]
      .split(", ")
      .map((s) => Number(s.split("=")[1]) + 10000000000000);

    return {
      buttons: [parseButton(aString), parseButton(bString)],
      prize,
    };
  });

  for (let group of groups) {
    debug("=================================");
    debug(group);
    const tokens = tokensForGroup(group);
    if (tokens !== Infinity) {
      result += tokens;
    }
    debug(group, tokens);
  }

  console.log(result);
}

// debug = noop;
main("example.txt");
console.log("expected ?");
// main("exercise.txt"); // ??
