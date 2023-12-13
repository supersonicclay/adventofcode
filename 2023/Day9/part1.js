
function getNextValForLine(line) {
    let nums = line.split(' ').map(Number);
    let diffs = nums;
    let lasts = [];
    while(true) {
        let allZeros = true;
        let next = [];
        for (let i=0; i<diffs.length-1; i++) {
            next.push(diffs[i+1]-diffs[i]);
            if (next[next.length-1] !== 0) {
                allZeros = false;
            }
        }
        lasts.push(diffs[diffs.length-1]);
        diffs = next;
        if (allZeros) {
            break;
        }
    }

    const sum = lasts.reduce((a,b) => a+b, 0)
    return sum;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    result = input.split('\n').map(getNextValForLine).reduce((a,b) => a+b, 0);

    console.log(result);
}

main('part1example.txt');
main('part1exercise.txt'); // 2075724761
