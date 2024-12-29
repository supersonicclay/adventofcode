
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
    const lines = input.split('\n').map(line =>
        line.split(' ').map(x => x.trim()).filter(Boolean).map(Number));

    const left = lines.map(line => line[0]);
    const right = lines.reduce((acc, line) => {
        const num = line[1];
        if (acc[num]) {
            acc[num]++;
        } else {
            acc[num] = 1;
        }
    return acc;
    }, {});

    for (let i = 0; i < left.length; i++) {
        const l = left[i];
        result += l * (right[l] ?? 0);
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected 31');
main('part1exercise.txt'); // 27267728
