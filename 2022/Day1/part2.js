
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const calories = input.split('\n\n').map(calorieLines => calorieLines.split('\n').map(Number));

    const sums = calories.map(c => sum(c)).sort((a, b) => b - a);
    result = sums[0]+sums[1]+sums[2];

    console.log(result);
}
main('part1example.txt');
console.log('expected 45000');
main('part1exercise.txt'); // 206780
