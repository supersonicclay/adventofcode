
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function horizontalReflection(grid, c) {
    // console.log(`======Checking ${c}`);
    for (let r=0; r<grid.length; r++) {
        for (let c1=c-1,c2=c; c1>=0 && c2<grid[0].length; c1--,c2++) {
            // console.log(`Comparing ${grid[r][c1]} to ${grid[r][c2]}`);
            if (grid[r][c1] !== grid[r][c2]) {
                return false;
            }
        }
    }

    // console.log(`REFLECTS! ${c}`);
    // return c === 5;
    return true;
}

function verticalReflection(grid, r) {
    // console.log(`======Checking ${r}`);
    for (let c=0; c<grid[0].length; c++) {
        for (let r1=r-1,r2=r; r1>=0 && r2<grid.length; r1--,r2++) {
            // console.log(`Comparing ${grid[r1][c]} to ${grid[r2][c]}`);
            if (grid[r1][c] !== grid[r2][c]) {
                return false;
            }
        }
    }

    // console.log(`REFLECTS! ${r}`);
    return true;
}

function processGrid(grid) {
    // vertical reflection
    const rows = [...Array(grid.length-1).keys()].map(r => r+1).filter(r => verticalReflection(grid, r));
    // console.log(`ROWS: ${rows}`);

    // horizontal reflection
    const cols = [...Array(grid[0].length-1).keys()].map(c => c+1).filter(c => horizontalReflection(grid, c));
    // console.log(`COLS: ${cols}`);

    return sum(rows)*100 + sum(cols);
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const grids = input.split('\n\n').map(grid => grid.split('\n').map(line => line.split('')));

    result = sum(grids.map(processGrid));

    console.log(result);
}

main('part1example.txt'); // 405
main('part1exercise.txt'); // 29213
