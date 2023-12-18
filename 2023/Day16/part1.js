
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

const dirs = {
    'N': [-1, 0],
    'E': [0, 1],
    'S': [1, 0],
    'W': [0, -1],
}

const ccw = dir => Object.keys(dirs)[(Object.keys(dirs).indexOf(dir)+3)%4];
const cw = dir => Object.keys(dirs)[(Object.keys(dirs).indexOf(dir)+1)%4];

const paths = {
    '.':  dir => [dir],
    '|':  dir => dir === 'N' || dir === 'S' ? [dir] : ['N','S'],
    '-':  dir => dir === 'E' || dir === 'W' ? [dir] : ['E','W'],
    '\\': dir => dir === 'N' || dir === 'S' ? [ccw(dir)] : [cw(dir)],
    '/':  dir => dir === 'N' || dir === 'S' ? [cw(dir)] : [ccw(dir)],
};

const p2s = (r, c) => `${r},${c}`;

function go(grid, r, c, dir, energized) {
    // console.log(`At ${p2s(r,c)}, traveling ${dir}: ${[...energized].join(' | ')}`);
    if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) {
        return;
    }

    const s = p2s(r,c);
    energized.set(s, energized.get(s) ?? new Set());
    const dirsTravelled = energized.get(s);
    if (dirsTravelled.has(dir)) {
        // don't travel again
        return;
    }
    dirsTravelled.add(dir);
    const thing = grid[r][c];
    const newDirs = paths[grid[r][c]](dir);
    // console.log(`THING: ${thing}`);
    // console.log(`New dirs: ${newDirs}`);
    for (const newDir of newDirs) {
        go(grid, r+dirs[newDir][0], c+dirs[newDir][1], newDir, energized);
    }
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const grid = input.split('\n').map(line => line.split(''));

    // console.log(paths['\\']('N')); // W
    // console.log(paths['/']('E')); // N

    const energized = new Map();
    go(grid, 0, 0, 'E', energized);
    // console.log(energized);

    result = energized.size;

    console.log(result);
}

main('part1example.txt');
console.log('expected 46');
main('part1exercise.txt'); //
