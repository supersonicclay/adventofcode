
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function scootchColumn(grid, c) {
    for (let r=0; r<grid.length-1; r++) {
        if (grid[r][c] !== '#') {
            const {stackable, space} = countStackableRocks(grid, r, c);
            for (let r2=r; r2<r+space; r2++) {
                grid[r2][c] = r2 < r+stackable ? 'O' : '.';
            }
        }
    }
}

function countStackableRocks(grid, r, c) {
    let stackable = 0;
    let space = 0;
    for (let r2=r; r2<grid.length; r2++, space++) {
        if (grid[r2][c] === '#') {
            break;
        } else if (grid[r2][c] === 'O') {
            stackable++;
        }
    }
    return {stackable, space};
}

function countRocks(grid, r) {
    let count = 0;
    for (let c=0; c<grid[0].length; c++) {
        count += grid[r][c] === 'O' ? 1 : 0
    }
    // console.log(`Count for ${r+1} = ${count}`)
    return count;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const grid = input.split('\n').map(line => line.split(''));
    for (let i=0; i<10000000; i++) {
        for (let c=0; c<grid[0].length; c++) {
            scootchColumn(grid, c);
        }
    }
    // scootchColumn(grid, 0);

    // grid.forEach(r => console.log(r.join(' ')));

    for (let r=0; r<grid.length; r++) {
        result += (grid.length-r) * countRocks(grid, r);
    }

    console.log(result);
}

main('part1example.txt');
console.log('expected 64');
// main('part1exercise.txt'); //
