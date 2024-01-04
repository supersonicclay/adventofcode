
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

const p2s = ([x,y]) => `${x},${y}`;
const s2p = (s) => s.split(',').map(Number);


function intersection(line1, line2) {
    if (p2s(line1[0]) === p2s(line2[0]) && p2s(line1[1]) === p2s(line2[1])) {
        return {x: line1[0][0], y: line1[0][1]};
    }

    const x1 = line1[0][0];
    const x2 = line1[1][0];
    const x3 = line2[0][0];
    const x4 = line2[1][0];
    const y1 = line1[0][1];
    const y2 = line1[1][1];
    const y3 = line2[0][1];
    const y4 = line2[1][1];
    const x12 = x1 - x2;
    const x34 = x3 - x4;
    const y12 = y1 - y2;
    const y34 = y3 - y4;

    const c = x12 * y34 - y12 * x34;

    if (Math.abs(c) < 0.0000000001)
    {
        // No intersection
        return false;
    }
    else
    {
        // Intersection
        const  a = x1 * y2 - y1 * x2;
        const  b = x3 * y4 - y3 * x4;

        const  x = (a * x34 - b * x12) / c;
        const  y = (a * y34 - b * y12) / c;

        return {x,y};
    }
}

function main(file, minX, maxX, minY, maxY) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const hailstones = input.split('\n').map(line => {
        const [position, velocity] = line.split(' @ ').map(triple => triple.split(', ').map(Number));
        return {position, velocity, line};
    });

    for (let i=0; i<hailstones.length; i++) {
        for (let j=i+1; j<hailstones.length; j++) {
            const hailstone1 = hailstones[i];
            const hailstone2 = hailstones[j];
            const line1 = [
                [hailstone1.position[0], hailstone1.position[1]],
                [hailstone1.position[0]+hailstone1.velocity[0], hailstone1.position[1]+hailstone1.velocity[1]]
            ];
            const line2 = [
                [hailstone2.position[0], hailstone2.position[1]],
                [hailstone2.position[0]+hailstone2.velocity[0], hailstone2.position[1]+hailstone2.velocity[1]]
            ];

            let intersect = intersection(line1, line2);
            let intersectText = intersect ? 'INTERSECTION' : 'NO_INTERSECTION';
            if (intersect) {
                const {x, y} = intersect;

                const delta1x = x - hailstone1.position[0];
                const delta2x = x - hailstone2.position[0];
                const delta1y = y - hailstone1.position[1];
                const delta2y = y - hailstone2.position[1];

                if (delta1x > 0 !== hailstone1.velocity[0] > 0) {
                    intersectText += ', happened in the past for AAAA along X';
                    intersect = false;
                }
                if (delta2x > 0 !== hailstone2.velocity[0] > 0) {
                    intersectText += ', happened in the past for BBBB along X';
                    intersect = false;
                }
                if (delta1y > 0 !== hailstone1.velocity[1] > 0) {
                    intersectText += ', happened in the past for AAAA along Y';
                    intersect = false;
                }
                if (delta2y > 0 !== hailstone2.velocity[1] > 0) {
                    intersectText += ', happened in the past for BBBB along Y';
                    intersect = false;
                }

                if (intersect && (intersect.x < minX || intersect.x > maxX || intersect.y < minY || intersect.y > maxY)) {
                    intersect = false;
                    intersectText = 'out of bounds';
                }
            }

            // console.log(`Hailstone 1:`, hailstone1.line);
            // console.log(`Hailstone 2:`, hailstone2.line);
            // console.log(intersect);
            // console.log(intersectText);
            // console.log('============================================================');

            if (intersect) {
                result++;
            }
        }
    }

    console.log(result);
}
main('part1example.txt', 7, 27, 7, 27);
console.log('expected 2');
main('part1exercise.txt', 200000000000000, 400000000000000, 200000000000000, 400000000000000); // 16818 too high, 16793 too low
