
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}
function mul(x) {
    return x.reduce((a,b)=>a*b, 1);
}

const p2s = ([r,c]) => `${r},${c}`;
const s2p = (s) => s.split(',').map(Number);

const dirs = {
    'U': ([r, c]) => ([r-1, c]),
    'R': ([r, c]) => ([r, c+1]),
    'D': ([r, c]) => ([r+1, c]),
    'L': ([r, c]) => ([r, c-1]),
}


function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const lines = input.split('\n');

    for (const line of input.split('\n')) {
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected ?');
// main('part1exercise.txt'); //
