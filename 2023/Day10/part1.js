
const pipes = {
    '|': new Set(['N','S']),
    '-': new Set(['E','W']),
    'L': new Set(['N','E']),
    'J': new Set(['N','W']),
    '7': new Set(['S','W']),
    'F': new Set(['E','S']),
    'S': new Set(['N','E','S','W']),
    '.': new Set(),
};

const dirs = {
    'N': [-1,0],
    'E': [0,1],
    'S': [1,0],
    'W': [0,-1],
};

function canTravel(grid, pos, dir) {
    const [r,c] = pos;
    const next = [r+dirs[dir][0], c+dirs[dir][1]];

    if (next[0]<0 || next[0]>grid.length-1) {
        return false;
    }
    if (next[1]<0 || next[1]>grid[0].length-1) {
        return false;
    }

    const pipe = pipes[grid[r][c]];
    const nextPipe = pipes[grid[next[0]][next[1]]];
    const oppositeDir = Object.keys(dirs)[(Object.keys(dirs).indexOf(dir)+2)%4];

    return pipe.has(dir) && nextPipe.has(oppositeDir);
}

let concur = 0;
let iters = 0;

function travel(grid, pos, dir, costs) {
    concur++;
    // console.log(`TRAVEL: ${pos}, ${dir}, ${iters}, ${concur}`);
    // printCosts(costs);
    if (iters++>10000000) {
        console.error(`BARF`);
        concur--;
        return;
    }
    const [r,c] = pos;
    if (!canTravel(grid, pos, dir)) {
        concur--;
        return;
    }

    const next = [r+dirs[dir][0], c+dirs[dir][1]];
    // if (costs[next[0]][next[1]] === 0) {
        // completed loop
        // return true;
    // }
    if (costs[next[0]][next[1]] <= costs[r][c]+1) {
        // don't keep looking
        concur--;
        return;
    }
    // continue traversing
    costs[next[0]][next[1]] = costs[r][c]+1;
    for (const newDir of Object.keys(dirs)) {
        travel(grid, next, newDir, costs);
    }
    concur--;
}

function findStart(grid) {
    for (let r=0; r<grid.length; r++) {
        for (let c=0; c<grid[r].length; c++) {
            if (grid[r][c] === 'S') {
                return [r,c];
            }
        }
    }
}

function printCosts(costs) {
    let minR = 108, maxR = 115, minC = 10, maxC=20;
    // let minR=0,maxR=999999,minC=0,maxC=999999;
    for (let r=0; r<costs.length; r++) {
        if (r >= minR && r <= maxR) {
            console.log(`${costs[r].slice(minC,maxC).map(c => `${c}`.padStart(4))}`.replace(/9007199254740991/g, '    ').replace(/,/g,'|') + '|');
        }
    }
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const grid = input.split('\n').map(line => line.split(''));
    const costs = new Array(grid.length);
    for (let i=0; i<grid.length; i++) {
        costs[i] = new Array(grid[0].length).fill(Number.MAX_SAFE_INTEGER);
    }
    let start = findStart(grid);
    let pos = start;
    costs[start[0]][start[1]] = 0;

    for (const dir of Object.keys(dirs)) {
        travel(grid, pos, dir, costs);
    }
    // printCosts(costs);

    result = 0;
    for (let r=0; r<costs.length; r++) {
        for (let c=0; c<costs[0].length; c++) {
            if (costs[r][c] !== Number.MAX_SAFE_INTEGER) {
                result = Math.max(result, costs[r][c])
            }
        }
    }

    console.log(result);
}

main('part1example.txt'); // 8
main('part1exercise.txt'); // 6812
