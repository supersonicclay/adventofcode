
const dirs = {
    U: {x: 0, y: -1},
    R: {x: 1, y: 0},
    D: {x: 0, y: 1},
    L: {x: -1, y: 0},
};

const flippingCorners = {
    'SW': 'NE',
    'NW': 'SE',
};

function fill(grid) {
    let count = 0;
    let lastCorner = null;
    let shouldFill = false;
    for (let y=0; y<grid.length; y++) {
        for (let x=0; x<grid[0].length; x++) {
            if (grid[y][x] === '#') {
                if (grid[y][x-1] !== '#' && grid[y][x+1] === '#') {
                    // corner
                    if (grid[y-1][x] === '#') {
                        corner = 'SW';
                    }
                    if (grid[y+1][x] === '#') {
                        corner = 'NW'
                    }
                }
                if (grid[y][x-1] === '#' && grid[y][x+1] !== '#') {
                    // corner
                    if (grid[y-1][x] === '#') {
                        corner = 'SE';
                    }
                    if (grid[y+1][x] === '#') {
                        corner = 'NE'
                    }
                }

                if (lastCorner && flippingCorners[lastCorner] === corner) {
                    shouldFill = !shouldFill;
                }
                lastCorner = corner;

                if (grid[y][x-1] !== '#' && grid[y][x+1] !== '#') {
                    shouldFill = !shouldFill;
                }
                continue;
            }
            if (shouldFill) {
                grid[y][x] = 'o';
                count++;
            }
        }
        lastCorner = null;
    }
    return count;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const steps = input.split('\n').map(line => {
        const [dir, distString] = line.split(' ');
        const distance = Number(distString);
        result += distance;
        return {dir, distance};
    });

    const grid = Array(1000).fill().map(() => Array(1000).fill('.'));

    let x = 500;
    let y = 500;
    for (const {dir, distance} of steps) {
        grid[y][x] = '#';
        for (let i=0; i<distance; i++) {
            x += dirs[dir].x;
            y += dirs[dir].y;
            grid[y][x] = '#';
        }
    }

    result += fill(grid);

    console.log(grid.map(line => line.join('')).join('\n'));

    console.log(result);
}
// main('part1example.txt');
console.log('expected 62');
main('part1exercise.txt'); //
