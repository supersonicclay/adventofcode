
function traverse(seed, maps) {
    let code = seed;

    for (let map of maps) {
        const mapping = map.find(({src, count}) => src <= code && code <= src+count);
        if (mapping) {
            code = code - mapping.src + mapping.dest;
        }
    }
    return code;
}

function parse(file) {
    const input = require('fs').readFileSync(file, 'utf-8');

    let [seeds, ...maps] = input.split('\n\n');

    seeds = seeds.split(': ')[1].split(' ').map(Number);
    maps = maps.map(m => m.split('\n').slice(1)
        .map(x => x.split(' ').map(Number)).map(([dest, src, count]) => ({dest, src, count})));

    return {seeds, maps}
}

function main(file) {
    let result = 0;
    const {seeds, maps} = parse(file);

    result = seeds.reduce((acc, seed) => Math.min(acc, traverse(seed, maps)), Number.MAX_SAFE_INTEGER)
    console.log(result);
}

main('part1example.txt');
main('part1exercise.txt');
