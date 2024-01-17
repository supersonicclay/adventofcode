
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const calories = input.split('\n\n').map(calorieLines => calorieLines.split('\n').map(Number));

    result = calories.reduce((acc, calorie) => Math.max(acc, sum(calorie)), 0);

    console.log(result);
}
main('part1example.txt');
console.log('expected 24000');
main('part1exercise.txt'); // 69626
