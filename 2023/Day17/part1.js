
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function populateOptimal(costs, r, c, optimal) {
    if (r === 0 || c === 0) {
        optimal[r][c] = true;
        return;
    }

    // is up cheaper?
    const minAbove = costs[r-1][c].reduce((a,b) => Math.min(a,b.cost), Number.MAX_SAFE_INTEGER);
    const minLeft = costs[r][c-1].reduce((a,b) => Math.min(a,b.cost), Number.MAX_SAFE_INTEGER);

    optimal[r][c] = true;
    if (r > 0 && minAbove < minLeft) {
        populateOptimal(costs, r-1, c, optimal);
    } else {
        populateOptimal(costs, r, c-1, optimal);
    }
}

function calculateCost(grid) {
    const costs = Array(grid.length).fill(null).map(r => Array(grid[0].length).fill(null).map(c => []));
    const optimal = Array(grid.length).fill(null).map(r => Array(grid[0].length).fill(false));
    // console.log(costs[0][0]);
    // console.log(costs);

    for (let r=0; r<grid.length; r++) {
        for (let c=0; c<grid[0].length; c++) {
            // console.log(`visiting: ${r},${c}`, costs[r][c]);
            if (r === 0 && c === 0) {
                costs[r][c] = [{run: 0, dir: 'E', cost: 0}];
            }
            else if (r === 0) {
                costs[r][c] = costs[r][c-1].filter(({run}) => run < 3).map(({run, cost}) => ({run: run+1, dir: 'E', cost: grid[r][c] + cost}));
            }
            else if (c === 0) {
                costs[r][c] = costs[r-1][c].filter(({run}) => run < 3).map(({run, cost}) => ({run: run+1, dir: 'S', cost: grid[r][c] + cost}));
            }
            else {
                // from left
                const fromLeft = costs[r][c-1]
                    .filter(({dir, run}) => dir === 'S' || run < 3)
                    .map(({dir, run, cost}) => ({dir: 'E', run: dir === 'S' ? 1 : run+1, cost: cost+grid[r][c]}));
                costs[r][c].push(...fromLeft)

                // from above
                const fromAbove = costs[r-1][c]
                    .filter(({dir, run}) => dir === 'E' || run < 3)
                    .map(({dir, run, cost}) => ({dir: 'S', run: dir === 'E' ? 1 : run+1, cost: cost+grid[r][c]}));
                costs[r][c].push(...fromAbove)

                // reduce duplicates
                costs[r][c] = costs[r][c].filter(({dir, run, cost}) => !costs[r][c].some(({dir: dir2, run: run2, cost: cost2}) => dir === dir2 && run == run2 && cost2 < cost));
            }
        }
    }

    // console.log(costs.map(r => r.map(c => c.map(({cost, run, dir}) => `${cost} (${dir}@${run})`)).join(' | ')).join('\n'));

    // populateOptimal(costs, grid.length-1, grid[0].length-1, optimal);
    // console.log(optimal.map(r => r.map(c => c ? '*' : ' ').join(' | ')).join('\n'));

    const minCost = costs[grid.length-1][grid[0].length-1].reduce((a,b) => Math.min(a,b.cost), Number.MAX_SAFE_INTEGER);

    return minCost;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const grid = input.split('\n').map(line => line.split('').map(Number));

    result = calculateCost(grid);

    // console.log(grid);

//     const a = `2413432311323
// 3215453535623
// 3255245654254
// 3446585845452
// 4546657867536
// 1438598798454
// 4457876987766
// 3637877979653
// 4654967986887
// 4564679986453
// 1224686865563
// 2546548887735
// 4322674655533`;

//     const b = `
// 2>>34^>>>1323
// 32v>>>35v5623
// 32552456v>>54
// 3446585845v52
// 4546657867v>6
// 14385987984v4
// 44578769877v6
// 36378779796v>
// 465496798688v
// 456467998645v
// 12246868655<v
// 25465488877v5
// 43226746555v>`.trim();

//     const line1 = a.split('\n').map(line => line.split(''));
//     const line2 = b.split('\n').map(line => line.split(''));

//     const parts = [];
//     for (let i=0; i<line1.length; i++) {
//         for (let j=0; j<line1.length; j++) {
//             if (line1[i][j] !== line2[i][j]) {
//                 parts.push(line1[i][j]);
//             }
//         }
//     }

    console.log(result);
}

// stops: 2 (starting point) +1+1+5+3+1+5+2+5+3+5+3+3+6+3+3
// along the way: 4+1+3+2+3+1+1+5+4+5+3+5+4+2+4+5+3+5+6+5+3+7+3+6+3+3+3+3

main('part1example.txt');
console.log('expected 102');
// main('part1exercise.txt'); //
