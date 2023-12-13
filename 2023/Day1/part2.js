
const spelled = [
    'zero','one','two','three','four','five','six','seven','eight','nine'
];
const numeric = [
    '0','1','2','3','4','5','6','7','8','9'
]
const digits = [
    ...numeric,...spelled,
];

const r = digits.join('|');

function n(s) {
    if (spelled.indexOf(s) !== -1) {
        return spelled.indexOf(s);
    }
    return Number(s);
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    result = input.split('\n').map(line => {
        let found = [];
        for (let d of digits) {
            const minI = line.indexOf(d);
            const maxI = line.lastIndexOf(d);
            if (minI !== -1) {
                found.push({minI, maxI, d});
            }
        }

        const min = found.reduce((p, c) => p.minI < c.minI ? p : c, {i: Number.MAX_SAFE_INTEGER});
        const max = found.reduce((p, c) => p.maxI > c.maxI ? p : c, {i: -1});
        const a = n(min.d);
        const b = n(max.d);
        // console.log(`${line}: ${a} ${b}`);

        return a*10 + b;
    }).reduce((sum, x) => sum+x, 0);

    console.log(result);
}

main('part2example.txt');
main('part2exercise.txt'); // 53389
