

const num = ['.','#'];

function parse(file) {
    const input = require('fs').readFileSync(file, 'utf-8');

    return input.split('\n').map(line => {
        const [conditionsString, countsString] = line.split(' ');
        const counts = countsString.split(',');
        const conditions = conditionsString.split('');
        const unknownIndexes = conditions.map((c, i) => c === '?' ? i : -1).filter(x => x>=0);

        return {
            conditions,
            counts: counts.map(Number),
            unknownIndexes,
            knownBad: conditions.filter(s => s === '#').length,
            totalCount: counts.map(Number).reduce((sum, x) => sum+x, 0),
        };
    });
}

function checkArrangementValid(conditions, counts) {
    // console.log(`CHECKING ${conditions.join('')}, ${counts}`);
    let runningCount = 0;
    let countIndex = 0;
    for (let i=0; i<conditions.length; i++) {
        const spring = conditions[i];
        // console.log(`CHEckiNG: ${spring}, ${i}, IDX=${countIndex}, RUNNING=${runningCount}`)
        if (spring === '?') {
            console.error(`CHECKING: theres an unknown`);
            return false;
        }
        else if (spring === '#') {
            runningCount++;
            if (runningCount > counts[countIndex]) {
                // console.log(`CHECKING: overflow ${conditions.join('')}, ${counts}`);
                return false;
            }
        }
        else if (i > 0 && conditions[i-1] === '#' && spring === '.') {
            if (runningCount !== counts[countIndex]) {
                return false;
            }
            countIndex++;
            runningCount=0;
        }

        // console.log(`CHECKING::: ${conditions.join('')}, ${counts} :: IDX=${countIndex}, RUNNING=${runningCount}`)
    }
    if (runningCount < counts[countIndex]) {
        // console.log(`CHECKING: too few at the end ${conditions.join('')}, ${counts}`);
        return false;
    }

    // console.log(`ARRANGEMENT WORKS: ${conditions.join('')}, ${counts}`)
    return true;
}

function countSetBits(n) {
    let count = 0;
    while (n)
    {
        count += n & 1;
        n >>= 1;
    }
    return count;
}

function swapCombo({conditions, unknownIndexes, knownBad, totalCount}, comboNum) {
    // console.log(`SWAPPING ${conditions.join('')} using ${comboNum.toString(2)}`)

    if (countSetBits(comboNum) + knownBad !== totalCount) {
        return undefined;
    }
    const copy = [...conditions];
    for (let i=0; i<unknownIndexes.length; i++) {
        const bit = (comboNum & (1<<i)) !== 0;
        // console.log(`LOOP: ${i}, ${bit}, ${(1<<i)}, ${comboNum} ==== ${comboNum & (1<<i)}`)
        copy[unknownIndexes[i]] = bit ? '#' : '.';
    }
    // console.log(`SWAPPED ${conditions.join('')} using ${comboNum.toString(2)} to ${copy.join('')}`)
    // console.log(`SWAPPED ${conditions.join('')} using ${comboNum.toString(2)} to `, copy);
    return copy;
}

function possibleArrangements(row) {
    const {conditions, counts} = row;
    let arrangements = 0;
    const unknowns = conditions.filter(x => x === '?').length;

    for (let comboNum=0; comboNum<(1<<unknowns); comboNum++) {
        const arrangementToCheck = swapCombo(row, comboNum);
        if (!arrangementToCheck) {
            continue;
        }
        if (checkArrangementValid(arrangementToCheck, counts)) {
            arrangements++;
        }
    }

    // console.log(`POSSIBLE ARRANGEMENTS: ${conditions.join('')} = ${arrangements}`)

    return arrangements;
}

function main(file) {
    let result = 0;
    const rows = parse(file);

    result = rows.map(possibleArrangements).reduce((sum, arrangements) => sum += arrangements, 0);

    console.log(result);
}

main('part1example.txt');
main('part1exercise.txt');
