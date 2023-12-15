

function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function distanceBetween(pos1, pos2, {horizontal, vertical}) {
    const r1 = Math.min(pos1[0], pos2[0]);
    const r2 = Math.max(pos1[0], pos2[0]);
    const c1 = Math.min(pos1[1], pos2[1]);
    const c2 = Math.max(pos1[1], pos2[1]);

    // console.log(`${r1}->${r2}, ${horizontal.slice(r1, r2)}`)
    // console.log(`${c1}->${c2}, ${vertical.slice(c1, c2)}`)

    return r2 - r1 + sum(horizontal.slice(r1, r2)) + c2 - c1 + sum(vertical.slice(c1, c2));
}

function getCosts(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    const horizontal = new Array(rows).fill(0);
    const vertical = new Array(cols).fill(0);

    for (let r=0; r<rows; r++) {
        let empty = grid[r].every(c => c === '.');
        horizontal[r] = empty ? 1 : 0;
    }

    for (let c=0; c<cols; c++) {
        let empty = true;
        for (let r=0; r<rows; r++) {
            if (grid[r][c] !== '.') {
                empty = false;
                break;
            }
        }
        vertical[c] = empty ? 1 : 0;
    }

    return {horizontal, vertical};
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const grid = input.split('\n').map(line => line.split(''));

    const costs = getCosts(grid);

    for (let r1=0; r1<grid.length; r1++) {
        for (let c1=0; c1<grid[r1].length; c1++) {
            for (let r2=0; r2<grid.length; r2++) {
                for (let c2=0; c2<grid[r2].length; c2++) {
                    if (r1===r2 && c1===c2) continue;
                    if (grid[r1][c1] !== "#" || grid[r2][c2] !== "#") continue;
                    result +=distanceBetween([r1,c1], [r2,c2], costs);
                }
            }
        }
    }

    // I'm lazy
    result/=2;

    console.log(result);
}

main('part1example.txt'); // 374
main('part1exercise.txt'); // 10165598
