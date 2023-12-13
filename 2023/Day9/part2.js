
function getNextValForLine(line) {
    let nums = line.split(' ').map(Number);
    let diffs = nums;
    let firsts = [];
    while(true) {
        let allZeros = true;
        let next = [];
        for (let i=0; i<diffs.length-1; i++) {
            next.push(diffs[i+1]-diffs[i]);
            if (next[next.length-1] !== 0) {
                allZeros = false;
            }
        }
        firsts.push(diffs[0]);
        diffs = next;
        if (allZeros) {
            break;
        }
    }


    let result = 0;
    let newFirsts = [];
    for (let i=firsts.length-1; i>=0; i--) {
        newFirsts[i] = i === firsts.length-1 ? firsts[i] : firsts[i] - newFirsts[i+1];
    }
    return newFirsts[0];
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    result = input.split('\n').map(getNextValForLine).reduce((a,b) => a+b, 0);

    console.log(result);
}

main('part2example.txt'); // 2
main('part2exercise.txt'); //
