
function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    result = input.split('\n').map(line => {
        let matches = /.*?(\d).*(\d).*/g.exec(line);
        if (matches == null) {
            matches = /.*?(\d).*/g.exec(line);
        }
        // console.log(line);
        // console.log(matches);
        const [, a, b] = matches;
        // console.log(Number(a)*10+Number(b ?? a));
        return Number(a)*10+Number(b ?? a);
    }).reduce((sum, x) => sum+x, 0);


    console.log(result);
}

main('part1example.txt');
main('part1exercise.txt');
