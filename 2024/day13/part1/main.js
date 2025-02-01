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

function parseButton(str) {
  const [x, y] = str
    .split(": ")[1]
    .split(", ")
    .map((s) => Number(s.split("+")[1]));

  return [x, y];
}

function tokensForGroup({ buttons, prize }) {
  const [a, b] = buttons;

  const maxAPresses = Math.floor(Math.min(prize[0] / a[0], prize[1] / a[1]));
  debug(maxAPresses);

  let minTokens = Infinity;
  for (let aPresses = maxAPresses; aPresses >= 0; aPresses--) {
    const xLeft = prize[0] - a[0] * aPresses;
    const yLeft = prize[1] - a[1] * aPresses;
    const valid =
      xLeft % b[0] === 0 && yLeft % b[1] === 0 && xLeft / b[0] === yLeft / b[1];
    if (valid) {
      const bPresses = xLeft / b[0];
      minTokens = Math.min(minTokens, aPresses * 3 + bPresses);
    }

    // for (let bPresses = 0; bPresses <= maxBPresses; bPresses++) {
    //   const pos = [
    //     a[0] * aPresses + b[0] * bPresses,
    //     a[1] * aPresses + b[1] * bPresses,
    //   ];
    //   if (pos[0] === prize[0] && pos[1] === prize[1]) {
    //     debug("can do this combo", aPresses, bPresses);
    //     // return "doober";
    //   }
    // }
  }
  return minTokens;

  // const [dx1, dx2] = a[0] > b[0] ? [a[0], b[0]] : [b[0], a[0]];
  // const [dy1, dy2] = a[1] > b[1] ? [a[1], b[1]] : [b[1], a[1]];

  // debug({ buttons, prize });
  // debug("cheapest x", dx1, dx2);
  // //01,10,11,11

  // // start optimistically over x axis
  // for (
  //   let x1Presses = Math.floor(prize[0] / dx1);
  //   x1Presses >= 0;
  //   x1Presses--
  // ) {
  //   const xLeft = prize[0] - dx1 * x1Presses;

  //   if (x1Presses === 80) {
  //     debug("xLeft", xLeft);
  //   }
  //   // return;
  //   // const x2Presses = dx2 / prize[0]
  //   //   const pos = [a[0] * x1Presses + b[0] * x2Presses, 0];
  //   //   if (pos[0] === prize[0]) {
  //   //     debug("can do this combo", x1Presses, x2Presses);
  //   //     // return "doober";
  //   //   }
  //   // }
  // }

  // for (let aPresses = 0; aPresses <= maxAPresses; aPresses++) {
  //   for (let bPresses = 0; bPresses <= maxBPresses; bPresses++) {
  //     const pos = [
  //       a[0] * aPresses + b[0] * bPresses,
  //       a[1] * aPresses + b[1] * bPresses,
  //     ];
  //     if (pos[0] === prize[0] && pos[1] === prize[1]) {
  //       debug("can do this combo", aPresses, bPresses);
  //       // return "doober";
  //     }
  //   }
  // }
}

function main(file) {
  let result = 0;
  const input = require("fs").readFileSync(file, "utf-8");
  const groups = input.split("\n\n").map((group) => {
    const [aString, bString, prizeString] = group.split("\n");

    const prize = prizeString
      .split(": ")[1]
      .split(", ")
      .map((s) => Number(s.split("=")[1]));

    return {
      buttons: [parseButton(aString), parseButton(bString)],
      prize,
    };
  });

  for (let group of groups) {
    debug("=================================");
    const tokens = tokensForGroup(group);
    if (tokens !== Infinity) {
      result += tokens;
    }
    debug(group, tokens);
  }

  console.log(result);
}

debug = noop;
main("example.txt");
console.log("expected 480");
main("exercise.txt"); // 28138
