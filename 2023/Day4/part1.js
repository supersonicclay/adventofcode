
function main(file) {
    let results = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    for (let line of input.split('\n')) {
        let [winners, revealed] = line.split(': ')[1].split(' | ').map(nums => nums.split(' ').filter(Boolean));
        winners = new Set(winners);
        const payout = revealed.filter(i => winners.has(i)).length;
        results += Math.max(1<<(payout-1), 0);
    }

    console.log(results);
}

main('part1example.txt');
main('part1exercise.txt');
