
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}

function compareFn(a, b, operator) {
    if (operator === '<') {
        return a < b;
    }
    return a > b;
}


function parseWorkflow(workflow) {
    const [,name, flowString] = /(.+)\{(.+)\}/.exec(workflow);
    const flow = flowString.split(',');
    const elseNext = flow[flow.length-1];
    const ifs = flow.slice(0, flow.length-1).map(f => {
        let [, category, comparison, val, next] = /(.+)([\<\>])(.+)\:(.+)/.exec(f);
        // console.log({category, comparison, val, next});
        return {category, comparison, val: Number(val), next};
    })

    return {name, logic: ratings => {
        for (let i=0; i<ifs.length; i++) {
            if (compareFn(ratings[ifs[i].category], ifs[i].val, ifs[i].comparison)) {
                return ifs[i].next;
            }
        }
        return elseNext;
    }};
}

function parseRatings(ratings) {
    const [,x,m,a,s] = /\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/.exec(ratings);
    return {
        x: Number(x),
        m: Number(m),
        a: Number(a),
        s: Number(s),
    };
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');
    const [workflowStrings, ratingsString] = input.split('\n\n');

    const workflows = workflowStrings.split('\n').map(parseWorkflow);
    const ratings = ratingsString.split('\n').map(parseRatings);

    const workflowsByName = {};
    for (let i=0; i<workflows.length; i++) {
        workflowsByName[workflows[i].name] = workflows[i].logic;
    }

    for (let i=0; i<ratings.length; i++) {
        let next = 'in';
        while (next !== 'A' && next !== 'R') {
            next = workflowsByName[next](ratings[i]);
        }
        if (next === 'A') {
            result = result + ratings[i].x + ratings[i].m + ratings[i].a + ratings[i].s;
        }
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected 19114');
main('part1exercise.txt'); //
