
const dirs = {
    U: {x: 0, y: -1},
    R: {x: 1, y: 0},
    D: {x: 0, y: 1},
    L: {x: -1, y: 0},
    3: {x: 0, y: -1},
    0: {x: 1, y: 0},
    1: {x: 0, y: 1},
    2: {x: -1, y: 0},
};

const flippingCorners = {
    'SW': 'NE',
    'NW': 'SE',
};

// 1,048,576 max for each step
const h = 1<<13;
const w = 1<<13;
// 8192*8192/32=2,097,152
// 1<<(13+13-5)=1<<21
// max array length: 1<<31: 2,147,483,648
// w:10804487--5964055=16,768,542
// h:2832837--9398487=12,231,324
// w*h/32=16,768,542*12,231,324/32=6,409,420,944,050.25
// can't fit it in a single array of ints, boo :(

// const h = 32;
// const w = 32;

function getPixel(grid, x, y) {
    // return grid[y] & (1<<(w-x));
    return false;
}

function setPixel(grid, x, y) {
    // console.log(`setting ${x},${y}: ${grid[y]} |= ${w-x}`);
    // grid[y] |= (1<<(w-x));
}

function makeCanvas(w, h) {
    // console.log('filling');
    // const sdfjkl = Array(h).fill().map(() => Array(w).fill(0));
    // const arr2 =  Array(10_000_0000).fill(0);
    // console.log('filled');
    // return Array(h*w/32).fill(0);
    return Array(h*w/32).fill(0);
}

function fill(canvas, w, h) {
    const fillCanvas = makeCanvas(w, h);
    let count = 0;
    let lastCorner = null;
    let corner = null;
    let shouldFill = false;
    for (let y=0; y<h; y++) {
        for (let x=0; x<w; x++) {
            if (getPixel(canvas, x, y)) {
                if (!getPixel(canvas, x-1, y) && getPixel(canvas, x+1, y)) {
                    // corner
                    if (getPixel(canvas, x, y-1)) {
                        corner = 'SW';
                    }
                    else if (getPixel(canvas, x, y+1)) {
                        corner = 'NW'
                    }
                }
                if (getPixel(canvas, x-1, y) && !getPixel(canvas, x+1, y)) {
                    // corner
                    if (getPixel(canvas, x, y-1)) {
                        corner = 'SE';
                    }
                    else if (getPixel(canvas, x, y+1)) {
                        corner = 'NE'
                    }
                }

                if (lastCorner && flippingCorners[lastCorner] === corner) {
                    shouldFill = !shouldFill;
                }
                lastCorner = corner;

                if (!getPixel(canvas, x-1, y) && !getPixel(canvas, x+1, y)) {
                    shouldFill = !shouldFill;
                }
                continue;
            }
            if (shouldFill) {
                setPixel(fillCanvas, x, y);
                count++;
            }
        }
        lastCorner = null;
    }
    return {count, fillCanvas};
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const steps = input.split('\n').map(line => {
        // const [dir, distString] = line.split(' ');
        // const distance = Number(distString);
        // result += distance;
        // return {dir, distance};
        const [,distance,dir] = /\#(.{5})(.)/.exec(line);
        return {dir, distance: Number('0x'+distance)};
    });

    const canvas = makeCanvas(w, h);

    let maxX = 0;
    let maxY = 0;
    let minX = Infinity;
    let minY = Infinity;

    let x = Math.round(w/2);
    let y = Math.round(h/2);
    for (let i=0; i<steps.length; i++) {
        console.log(`Processing step ${i} of ${steps.length}`);
        const {dir, distance} = steps[i];
        setPixel(canvas, x, y);
        for (let i=0; i<distance; i++) {
            x += dirs[dir].x;
            y += dirs[dir].y;
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            setPixel(canvas, x, y);
        }
        console.log(maxX, maxY, minX, minY);
    }

    console.log(maxX, maxY, minX, minY);

    const fillCanvas = makeCanvas(w, h);
    // const {count, fillCanvas} = fill(canvas, w, h);
    // result += count;

    // for (let y=0; y<h; y++) {
    //     console.log((canvas[y]>>>0).toString(2));
    // }

    // for (let y=0; y<h; y++) {
    //     const line = [...Array(w).keys()].map(x => getPixel(canvas, x, y) ? '#' : getPixel(fillCanvas, x, y) ? 'o' : '.').join('');
    //     console.log(line);
    // }

    console.log(result);
}
main('part1example.txt');
console.log('expected 62 for now');
console.log('expected 952408144115');
main('part1exercise.txt'); //
