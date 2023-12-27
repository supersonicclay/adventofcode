const blessed = require('blessed');

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

function printGrid(grid, visited, step) {
    const lines = [];
    for (let r=0; r<grid.length; r++) {
        const line = grid[r].map((cell, c) => {
            const s = p2s([r,c]);
            if (visited[step].has(s)) {
                return '{bold}O{/bold}';
            } else if (step > 0 && visited[step-1].has(s)) {
                return 'o';
            }
            return cell;
        }).join('');
        lines.push(line);
    }
    const gridString = lines.join('\n');

    return `${gridString}\n${visited[step].size}@${step} steps`
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


    var screen = blessed.screen({
        smartCSR: true
    });

    var box = blessed.box({
        // top: 'center',
        // left: 'center',
        width: '100%',
        height: '100%',
        content: '',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            // bg: 'magenta',
            border: {
                fg: '#f0f0f0'
            },
        }
    });

    let step = 0;
    // Quit on Escape, q, or Control-C.
    screen.key(['right'], function(ch, key) {
        step = (step + 1) % (maxSteps+1);
        box.setContent(printGrid(grid, visited, step));
        screen.render();
    });

    screen.key(['left'], function(ch, key) {
        step = (step + maxSteps) % (maxSteps+1);
        box.setContent(printGrid(grid, visited, step));
        screen.render();
    });

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });

    // Append our box to the screen.
    screen.append(box);
    screen.render();

    console.log(result);
}
// main('part1example.txt', 6);
// console.log('expected 16');
main('part1example.txt', 10);
console.log('expected 50');
// main('part1example.txt', 5000);
// console.log('expected 16733044');
// main('part1exercise.txt', 26501365); //
