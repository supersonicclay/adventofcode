
function main(file) {
    let results = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const lines = input.split('\n');

    const wonCards = new Array(lines.length).fill(0);
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let [winners, revealed] = line.split(': ')[1].split(' | ').map(nums => nums.split(' ').filter(Boolean));
        winners = new Set(winners);
        const matches = revealed.filter(i => winners.has(i));

        wonCards[i]++;
        // console.log(`MATCHES card=${i+1}, matches=${matches.length}, ${i+1+1}-${Math.min(matches.length+i+1, wonCards.length)}`);
        for (let j = i+1; j < Math.min(matches.length+i+1, wonCards.length); j++) {
            // console.log(`BUMPING ${j+1} by ${wonCards[i]}`)
            wonCards[j] += wonCards[i];
        }

        // console.log('WINS', wonCards);
        results += wonCards[i];
    }

    console.log(results);
}

main('part2example.txt');
main('part2exercise.txt');
