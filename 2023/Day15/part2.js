
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function hash(s) {
    let h =0;
    for (let i=0; i<s.length; i++) {
        h += s.charCodeAt(i);
        h *= 17;
        h %= 256;
    }

    return h;
}

function processStep(s, boxes) {
    const [,key, op, focalLength] = /(.*)([-=])(.?)/.exec(s);

    const i = hash(key);
    if (op === '-') {
        let slotIndex = boxes[i].findIndex(({key: k}) => k === key);
        if (slotIndex !== -1) {
            boxes[i].splice(slotIndex, 1)
        }
    }
    if (op === '=') {
        let slotIndex = boxes[i].findIndex(({key: k}) => k === key);
        if (slotIndex !== -1) {
            boxes[i][slotIndex].val = Number(focalLength);
        } else {
            boxes[i].push({key, val: Number(focalLength)});
        }
    }

    // console.log(boxes.map((b, i) => ({b, i})).filter(({b}) => b.length > 0).map(({b,i}) => `Box ${i}: ${b.map(({key, val})=> `${key}-${val}`)}`));

    // console.log();
    return hash(s);
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    let boxes = Array(256).fill(null).map(x => []);
    input.split(',').map(step => processStep(step, boxes));

    const boxSums = boxes.map((box, boxIndex) => sum(box.map(({key, val}, slotIndex) => (boxIndex+1)*(slotIndex+1)*val)));
    result = sum(boxSums)

    console.log(result);
}

main('part1example.txt'); // 145
console.log('expected 145');
main('part1exercise.txt'); // 286104
