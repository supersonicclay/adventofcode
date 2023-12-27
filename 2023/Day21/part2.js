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

function clamp(pos, grid) {
    const [r, c] = pos;
    const clamped = [...pos];
    const h = grid.length;
    const w = grid[0].length;
    // console.log(`=== r=${r}, c=${c}, h=${h}, w=${w}`)
    if (r < 0 || r >= h) {
        clamped[0] = (r+(h*(Math.abs(Math.ceil(r/h))+1))) % h;
    }
    if (c < 0 || c >= w) {
        clamped[1] = (c+(w*(Math.abs(Math.ceil(c/w))+1))) % w;
    }
    return clamped;
}

function explore(grid, startingPos, maxSteps, visited) {

    const oddDestinations = new Set();
    const evenDestinations = new Set();

    let thisStep = new Set();
    thisStep.add(p2s(startingPos));
    visited[0] = thisStep;

    const start = new Date();

    let nextStep;
    for (let step=1; step<=maxSteps; step++) {
        if (step%100===0) console.log(`step ${step}: ${step/(new Date()-start)*1000} steps/s`)
        nextStep = new Set();
        for (const s1 of thisStep.values()) {
            for (const dir of Object.values(dirs)) {
                const p1 = s1.split(',').map(Number);
                const p2 = dir(p1);
                const s2 = p2s(p2);

                const clamped = clamp(p2, grid);
                if (grid[clamped[0]][clamped[1]] === '#') {
                    continue;
                }

                if (step % 2 === 0) {
                    if (evenDestinations.has(s2)) {
                        continue;
                    }
                    evenDestinations.add(s2);
                } else {
                    if (oddDestinations.has(s2)) {
                        continue;
                    }

                    oddDestinations.add(s2);
                }
                nextStep.add(s2);
            }
        }
        thisStep = nextStep;
        // visited[step] = new Set([...thisStep]);
        // if (step%2===0) {
        //     [...evenDestinations.values()].forEach(d => visited[step].add(d));
        // } else {
        //     [...oddDestinations.values()].forEach(d => visited[step].add(d));
        // }
    }

    return maxSteps % 2 === 0 ? evenDestinations.size : oddDestinations.size;
    // return visited[maxSteps].size;
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

function funDebug(grid, visited, maxSteps) {
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

    visited = new Map();
    result = explore(grid, startCoordinate, maxSteps, visited)

    // funDebug(grid, visited, maxSteps);

    console.log(result);
}
main('part1example.txt', 6);
console.log('expected 16');
main('part1example.txt', 10);
console.log('expected 50');
main('part1example.txt', 50);
console.log('expected 1594');
main('part1example.txt', 100);
console.log('expected 6536');
main('part1example.txt', 500);
console.log('expected 167004');
// main('part1example.txt', 1000);
// console.log('expected 668697');
// main('part1example.txt', 5000);
// console.log('expected 16733044');

// main('part1example.txt', 5000);
// console.log('expected 16733044');
// main('part1exercise.txt', 26501365); //
