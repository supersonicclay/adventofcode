
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

const opponent = { A: 'Rock', B: 'Paper', C: 'Scissors'};
const yours = { X: 'Rock', Y: 'Paper', Z: 'Scissors' };

const beats = {
    'Rock': 'Scissors',
    'Paper': 'Rock',
    'Scissors': 'Paper',
};

const points = { Rock: 1, Paper: 2, Scissors: 3 };

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const rounds = input.split('\n').map(line => line.split(' ')).map(([a, b]) => [opponent[a], yours[b]]);

    for (const [theirs, mine] of rounds) {
        result += points[mine];
        if (mine === theirs) {
            result += 3;
        } else if (beats[mine] === theirs) {
            result += 6;
        }
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected 15');
main('part1exercise.txt'); // 12794
