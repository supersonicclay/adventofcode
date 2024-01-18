
const rank = ['A', 'B', 'C'];
const indexShift = { X: 2,Y: 0,Z: 1 };
const pointsForOutcome = {X: 0, Y: 3, Z: 6};

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const rounds = input.split('\n')
        .map(line => line.split(' '));

    for (const [theirs, instruction] of rounds) {
        const theirRank = rank.indexOf(theirs);
        const yourRank = (theirRank + indexShift[instruction]) % 3;

        result += pointsForOutcome[instruction];
        result += yourRank + 1;
    };

    console.log(result);
}

main('part1example.txt');
console.log('expected 12');
main('part1exercise.txt'); // 14979
console.log('expected 14979');
