
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

const p2s = ([x,y]) => `${x},${y}`;
const s2p = (s) => s.split(',').map(Number);

function canSettle(matrix, w, d, h, x, y, z, floor) {
    for (let z2=floor; z2<z; z2++) {
        // console.log(`checking ${x},${y},${z}`)
        if (matrix[x][y][z2] !== '.') {
            return false;
        }
    }
    return true;
}

function farthestSettle(matrix, w, d, h, x, y, z) {
    if (x < 0 || x >= w || y < 0 || y >= d || z < 1 || z >= h) {
        return Infinity;
    }

    for (let floor=1; floor<h; floor++) {
        if (canSettle(matrix, w, d, h, x, y, z, floor)) {
            // console.log(`can settle: ${matrix[x][y][z]} @ ${x},${y},${z} to ${floor}`);
            return floor;
        }
    }
    return z;
}

function settleAll(matrix, w, d, h) {
    const settled = JSON.parse(JSON.stringify(matrix));

    let somethingSettled = false;
    for (let z=1; z<h; z++) {
        const floors = new Map();
        const bricks = new Map();
        for (let x=0; x<w; x++) {
            for (let y=0; y<d; y++) {
                const id = settled[x][y][z];
                if (id !== '.') {
                    bricks.set(id, bricks.get(id) ?? new Set());
                    bricks.get(id).add(p2s([x, y]));
                    const floor = farthestSettle(settled, w, d, h, x, y, z);
                    floors.set(id, Math.max(floors.get(id) ?? 0, floor));
                }
            }
        }

        for (let [id, floor] of floors.entries()) {
            if (floor === z) {
                continue;
            }

            somethingSettled = true;
            // console.log(`DROPPING ${id} from ${z} to ${floor}`);
            for (let pos of bricks.get(id)) {
                const [x, y] = s2p(pos);
                settled[x][y][floor] = id;
                settled[x][y][z] = '.';
            }
        }
    }

    return {settled, somethingSettled};
}

function populateMatrixFromBricks(bricks, w, d, h) {
    const matrix = Array(w).fill().map(_ => Array(d).fill().map(_ => Array(h).fill('-')));
    for (let x=0; x<w; x++) {
        for (let y=0; y<d; y++) {
            for (let z=1; z<h; z++) {
                const b = bricks.find(b => b.coords[0].x<=x && b.coords[1].x>=x && b.coords[0].y<=y && b.coords[1].y>=y && b.coords[0].z<=z && b.coords[1].z>=z );
                // if (b.length > 1) console.log(`Found multiple @ ${x},${y},${z}: ${b.map(b => b.id)}`);
                matrix[x][y][z] = b?.id ?? '.';
            }
        }
    }
    return matrix;
}

function viewFromFront(matrix, w, d, h) {
    const view = Array(h).fill().map(_ => Array(w).fill('-'));
    for (let z=1; z<h; z++) {
        for (let x=0; x<w; x++) {
            const b = [...new Set([...Array(d).keys()].map(y => matrix[x][y][z]).filter(b => b !== '.'))];
            if (b.length > 1) view[z][x] = '?';
            else view[z][x] = b[0] ?? '.';
        }
    }

    [...view].reverse().map(line => console.log(line.join(' ')));
    console.log('--------------------');

    return view;
}

function viewFromRight(matrix, w, d, h) {
    const view = Array(h).fill().map(_ => Array(d).fill('-'));
    for (let z=1; z<h; z++) {
        for (let y=0; y<d; y++) {
            const b = [...new Set([...Array(w).keys()].map(x => matrix[x][y][z]).filter(b => b !== '.'))];
            if (b.length > 1) view[z][y] = '?';
            else view[z][y] = b[0] ?? '.';
        }
    }

    [...view].reverse().map(line => console.log(line.join(' ')));
    console.log('--------------------');

    return view;
}

function removeAll(id, matrix, w, d, h) {
    const copy = JSON.parse(JSON.stringify(matrix));
    for (let x=0; x<w; x++) {
        for (let y=0; y<d; y++) {
            for (let z=0; z<h; z++) {
                if (copy[x][y][z] === id) {
                    copy[x][y][z] = '.';
                }
            }
        }
    }
    return copy;
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    let w=0, d=0, h=0;
    let ids = new Set();

    const bricks = input.split('\n').map((line, id) => {
        const coords = line.split('~').map(s => {
            const [x,y,z] = s.split(',').map(Number);
            return {x,y,z};
        });
        w = Math.max(w, coords[0].x+1, coords[1].x+1);
        d = Math.max(d, coords[0].y+1, coords[1].y+1);
        h = Math.max(h, coords[0].z+1, coords[1].z+1);
        const name = String.fromCharCode("A".charCodeAt(0)+id);
        ids.add(id);
        return {id, coords};
    });

    const matrix = populateMatrixFromBricks(bricks, w, d, h);

    // viewFromFront(matrix, w, d, h);
    // viewFromRight(matrix, w, d, h);
    const {settled} = settleAll(matrix, w, d, h);
    // viewFromFront(settled, w, d, h);
    // viewFromRight(settled, w, d, h);

    for (let id of ids.values()) {
        const {somethingSettled} = settleAll(removeAll(id, settled, w, d, h), w, d, h);
        if (!somethingSettled) {
            result++;
        }
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected 5');
main('part1exercise.txt'); // 515
