
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function hash(s) {
    let h =0;
    for (let i=0; i<s.length; i++) {
        h += s.charCodeAt(i);
        h *= 17;
        h %= 256;
    }

    return h;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    result = sum(input.split(',').map(hash));

    console.log(result);
}

main('part1example.txt'); // 1320
console.log('expected 1320');
main('part1exercise.txt'); // 517015
