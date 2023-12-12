
const numeric = {
    'J': 11,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'T': 10,
    'Q': 12,
    'K': 13,
    'A': 14,
};

function rank(hand) {
    let cardToCount = {};
    for (let card of hand) {
        cardToCount[numeric[card]] = (cardToCount[numeric[card]] ?? 0)+1;
    }

    let combos = Object.values(cardToCount).sort((a,b) => b-a);

    let rank = 0;
    rank = hand.split('').reduce((acc, c, i) => {
        return acc + (numeric[c]<<((hand.length-i-1)*4));
    }, 0);

    rank += combos[0]*(1<<(28));
    rank += (combos[1] ?? 0)*(1<<(21));
    return rank;
}

function parse(file) {
    const input = require('fs').readFileSync(file, 'utf-8');

    return input.split('\n').map(line => ({hand: line.split(' ')[0], bid: Number(line.split(' ')[1])}))
}

function main(file) {
    let result = 0;
    const hands = parse(file);

    const ranks = hands.map(({hand, bid}) => ({bid, hand, rank: rank(hand), rankHex: rank(hand).toString(16)})).sort(({rank: r1}, {rank: r2}) => r1-r2);
    // console.log(ranks);
    result = ranks.reduce((acc, {bid}, index) => {
        // console.log(`${index+1}*${bid}`);
        return acc + (index+1)*bid;
    }, 0);

    console.log(result);
}

main('part1example.txt');
main('part1exercise.txt');
