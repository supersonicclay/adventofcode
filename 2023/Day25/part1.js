
function sum(x) {
    return x.reduce((a,b)=>a+b, 0);
}
function mul(x) {
    return x.reduce((a,b)=>a*b, 1);
}

const p2s = ([x,y]) => `${x},${y}`;
const s2p = (s) => s.split(',').map(Number);

function dfs(graph, node, graphNum, nodeToGraph) {
    if (nodeToGraph.has(node)) {
        return;
    }

    nodeToGraph.set(node, graphNum);
    for (const n of graph.get(node)) {
        dfs(graph, n, graphNum, nodeToGraph);
    }
}

function copyGraph(graph) {
    return new Map(new Map(JSON.parse(JSON.stringify(Array.from(graph)))));
}

function countGraphs(graph) {
    const copy = copyGraph(graph);

    const nodeToGraph = new Map();
    let count = 0;
    for (const node of copy.keys()) {
        dfs(copy, node, ++count, nodeToGraph);
    }

    const graphToNode = new Map();
    for (const [node, graphNum] of nodeToGraph.entries()) {
        graphToNode.set(graphNum, graphToNode.get(graphNum) ?? new Set());
        graphToNode.get(graphNum).add(node);
    }
    return {nodeToGraph, graphToNode};
}

function removeEdge(graph, n1, n2) {
    graph.get(n1).splice(graph.get(n1).indexOf(n2), 1);
    graph.get(n2).splice(graph.get(n2).indexOf(n1), 1);
}

function printGraph(graph) {
    [...graph.entries()].forEach(([key, nodes]) => console.log(key, nodes));
}

function main(file) {
    let result = 0;
    const input = require('fs').readFileSync(file, 'utf-8');

    const edges = [];
    const graph = new Map();
    for (const line of input.split('\n')) {
        const [[key], nodes] = line.split(': ').map(x => x.split(' '));
        for (const node of nodes) {
            edges.push({n1: key, n2: node});
            graph.set(key, graph.get(key) ?? []);
            graph.get(key).push(node);
            graph.set(node, graph.get(node) ?? []);
            graph.get(node).push(key);
        }
    }

    // sort edges based on number of connections
    edges.sort((e1, e2) => graph.get(e1.n1).length + graph.get(e1.n2).length - graph.get(e2.n1).length - graph.get(e2.n2).length);

    for (let e1=0; e1<edges.length && !result; e1++) {
        for (let e2=e1+1; e2<edges.length && !result; e2++) {
            for (let e3=e2+1; e3<edges.length && !result; e3++) {
                const copy = copyGraph(graph);
                const {n1: e1n1, n2: e1n2} = edges[e1];
                const {n1: e2n1, n2: e2n2} = edges[e2];
                const {n1: e3n1, n2: e3n2} = edges[e3];
                removeEdge(copy, e1n1, e1n2);
                removeEdge(copy, e2n1, e2n2);
                removeEdge(copy, e3n1, e3n2);

                const nodes = [e1n1, e1n2, e2n1, e2n2, e3n1, e3n2].sort((a, b) => a.localeCompare(b));
                const {nodeToGraph, graphToNode} = countGraphs(copy);
                if (new Set([...nodeToGraph.values()]).size > 1) {
                    console.log(`works by removing ${e1n1}-${e1n2}, ${e2n1}-${e2n2}, and ${e3n1}-${e3n2}`);
                    result = mul([...graphToNode.values()].map(s => s.size));
                }
            }
        }
    }

    console.log(result);
}
main('part1example.txt');
console.log('expected 54');
// main('part1exercise.txt'); //
