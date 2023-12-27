
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

const p2s = ([r,c]) => `${r},${c}`;

const dirs = {
    'U': ([r, c]) => ([r-1, c]),
    'R': ([r, c]) => ([r, c+1]),
    'D': ([r, c]) => ([r+1, c]),
    'L': ([r, c]) => ([r, c-1]),
}

function visit(grid, pos, visited, steps, maxSteps) {
    if (pos[0] < 0 || pos[0] >= grid.length) {
        pos[0] = (pos[0]+grid.length) % grid.length;
    }
    if (pos[1] < 0 || pos[1] >= grid[0].length) {
        pos[1] = (pos[1]+grid[0].length) % grid[0].length;
    }

    if (grid[pos[0]][pos[1]] === '#') {
        return;
    }

    visited[steps] = visited[steps] ?? new Set();
    if (visited[steps].has(p2s(pos))) {
        // no need to process twice
        return;
    }
    visited[steps].add(p2s(pos));

    if (steps >= maxSteps) {
        return;
    }

    for (const dir of Object.values(dirs)) {
        visit(grid, dir(pos), visited, steps+1, maxSteps);
    }
    if (steps+1 < maxSteps) {
        visited.delete(steps)
    }
}

function main(file, maxSteps) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const grid = input.split('\n').map(line => line.split(''));

    let startCoordinate;
    for (let r=0; r<grid.length && !startCoordinate; r++) {
        for (let c=0; c<grid[0].length && !startCoordinate; c++) {
            if (grid[r][c] === 'S') {
                startCoordinate = [r, c];
            }
        }
    }

    const visited = new Map();
    visit(grid, startCoordinate, visited, 0, maxSteps)
    result = visited[maxSteps].size;

    // for (let r=0; r<grid.length; r++) {
    //     const line = grid[r].map((cell, c) => visited[maxSteps].has(p2s([r,c])) ? 'O' : cell).join('');
    //     console.log(line);
    // }

    console.log(result);
}
main('part1example.txt', 6);
console.log('expected 16');
main('part1example.txt', 10);
console.log('expected 50');
// main('part1example.txt', 5000);
// console.log('expected 16733044');
// main('part1exercise.txt', 26501365); //
