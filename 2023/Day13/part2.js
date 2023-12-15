
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function p2s(r,c) { return `${r},${c}`; }

function horizontalReflection(grid, c) {
    // console.log(`======Checking ${c}`);
    let mismatches = new Set();
    for (let r=0; r<grid.length; r++) {
        for (let c1=c-1,c2=c; c1>=0 && c2<grid[0].length; c1--,c2++) {
            // console.log(`Comparing ${grid[r][c1]} to ${grid[r][c2]}`);
            if (grid[r][c1] !== grid[r][c2]) {
                mismatches.add(p2s(r,c1));
            }
        }
    }

    // console.log(`MISMATCHES ${c}   ${mismatches.size === 0}  ${[...mismatches].join('|')}`);
    return mismatches;
}

function verticalReflection(grid, r) {
    // console.log(`======Checking ${r}`);
    let mismatches = new Set();
    for (let c=0; c<grid[0].length; c++) {
        for (let r1=r-1,r2=r; r1>=0 && r2<grid.length; r1--,r2++) {
            // console.log(`Comparing ${grid[r1][c]} to ${grid[r2][c]}`);
            if (grid[r1][c] !== grid[r2][c]) {
                mismatches.add(p2s(r1,c));
            }
        }
    }

    // console.log(`MISMATCHES ${r}   ${mismatches.size === 0}  ${[...mismatches].join('|')}`);
    return mismatches;
}

function processGrid(grid) {
    // vertical reflection
    const row = [...Array(grid.length-1).keys()]
        .map(r => r+1)
        .find(r => verticalReflection(grid, r).size === 1) ?? 0;

    // console.log(`ROW: ${row}`);
    // console.log(`ONE OFFs: ${oneOffRow}`);

    // horizontal reflection
    const col = [...Array(grid[0].length-1).keys()]
        .map(c => c+1)
        .find(c => horizontalReflection(grid, c).size === 1) ?? 0;

    // console.log(`COL: ${col}`);
    // console.log(`ONE OFFs: ${oneOffCol}`);
    // console.log();
    // console.log(`${(row === 0) !== (col === 0)} ${(oneOffRow.length === 0) !== (oneOffCol.length === 0)}`)

    return row*100 + col;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const grids = input.split('\n\n').map(grid => grid.split('\n').map(line => line.split('')));

    result = sum(grids.map(processGrid));

    console.log(result);
}

main('part1example.txt'); // 400
main('part1exercise.txt'); // 37453
