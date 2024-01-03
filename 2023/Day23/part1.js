const blessed = require('blessed');

function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

const p2s = ([r,c]) => `${r},${c}`;
const s2p = (s) => s.split(',').map(Number);

const dirs = {
    '^': ([r, c]) => ([r-1, c]),
    '>': ([r, c]) => ([r, c+1]),
    'v': ([r, c]) => ([r+1, c]),
    '<': ([r, c]) => ([r, c-1]),
};

function canTravel(grid, pos, dir, path) {
    const newPos = dir(pos);
    const newS = p2s(newPos);
    if (newPos[0] < 0 || newPos[0] >= grid.length) {
        return {possible: false};
    }
    if (newPos[1] < 0 || newPos[1] >= grid[0].length) {
        return {possible: false};
    }
    if (path.nodeSet.has(newS)) {
        return {possible: false};
    }
    const newTile = grid[newPos[0]][newPos[1]]
    if (newTile === '#') {
        return {possible: false};
    }
    if (newTile in dirs) {
        // console.log(`${newTile} is a slope`);
        const afterSlope = dirs[newTile](newPos);
        if (afterSlope[0] === pos[0] && afterSlope[1] === pos[1]) {
            // console.log(`can't go from ${p2s(pos)} to ${p2s(newPos)}`);
            // we'd backslide
            return {possible: false};
        }
    }

    return {newPos, newS, possible: true};
}

function pathFind(grid, start, end) {
    const paths = [];

    const startS = p2s(start);
    paths.push({nodes: [startS], nodeSet: new Set([startS])});
    let stopGap=0;
    while (stopGap++<100000) {
        for (let i=0; i<paths.length; i++) {
            let path = paths[i];
            const originalNodes= [...path.nodes];
            if (path.reachedEnd) {
                continue;
            }
            const s = path.nodes[path.nodes.length-1];
            const pos = s2p(s);

            const options = Object.values(dirs).map(dir => canTravel(grid, pos, dir, path)).filter(({possible}) => possible);
            if (options.length === 0) {
                // console.log(`can't travel from ${s} from path ${path.nodes.join('|')}`)
            }
            // console.log(`${s}@${i}`, 'options', options.map(({newS}) => newS), 'path', path.nodes);

            for (let optionIndex=0; optionIndex<options.length; optionIndex++) {
                const option = options[optionIndex];
                const {newPos, newS} = option;
                // console.log(`Traveling from ${s} to ${newS}`);
                if (optionIndex>0) {
                    // console.log(`Forking path at ${s}`);
                    path = {nodes: [...originalNodes], nodeSet: new Set([...originalNodes])};
                    paths.push(path);
                }

                path.nodes.push(newS);
                path.nodeSet.add(newS);
                if (newPos[0] === end[0] && newPos[1] === end[1]) {
                    path.reachedEnd = true;
                }
            }
        }
    }

    // console.log(paths.map(({nodes}) => nodes));

    const pathsToTheEnd = paths.filter(({reachedEnd}) => reachedEnd);
    const longest = pathsToTheEnd.reduce((soFar, path) => path.nodes.length > soFar.nodes.length ? path : soFar, {nodes: []});
    console.log('longest', longest.nodes);

    // funDebug(grid, pathsToTheEnd);

    return longest.nodes.length-1;
}

function printGrid(grid, paths, path) {
    const lines = [];
    for (let r=0; r<grid.length; r++) {
        const line = grid[r].map((cell, c) => {
            const s = p2s([r,c]);
            if (paths[path].nodeSet.has(s)) {
                return '{bold}O{/bold}';
            // } else if (paths[path].open)) {
            //     return 'o';
            }
            return cell;
        }).join('');
        lines.push(line);
    }
    const gridString = lines.join('\n');

    return `${gridString}\nPath: ${path}`
}

function funDebug(grid, paths) {
    var screen = blessed.screen({
        smartCSR: true
    });

    var box = blessed.box({
        width: '100%',
        height: '100%',
        content: printGrid(grid, paths, 0),
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0'
            },
        }
    });

    let path = 0;
    // Quit on Escape, q, or Control-C.
    screen.key(['right'], function(ch, key) {
        path = (path + 1) % (paths.length);
        box.setContent(printGrid(grid, paths, path));
        screen.render();
    });

    screen.key(['left'], function(ch, key) {
        path = (path + paths.length-1) % (paths.length);
        box.setContent(printGrid(grid, paths, path));
        screen.render();
    });

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(ch, key) {
        return process.exit(0);
    });

    // Append our box to the screen.
    screen.append(box);
    screen.render();
}

function main(file, start, dest) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const grid = input.split('\n').map(line => line.split(''));

    result = pathFind(grid, start, dest);

    console.log(result);
}

main('part1example2.txt', [0,1], [6,5]);
console.log('expected 10');
main('part1example.txt', [0,1], [22,21]);
console.log('expected 94');
main('part1exercise.txt', [0,1], [140, 139]); // 2314
