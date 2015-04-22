var graph = require('./graph.js');

var node1 = new graph.Node(1);
var node2 = new graph.Node(2);
var node3 = new graph.Node(3);
var node4 = new graph.Node(4);
var node5 = new graph.Node(5);

node1.neighbors.push(node2);
node2.neighbors.push(node1, node4);
node3.neighbors.push(node2, node4);
node4.neighbors.push(node1, node2, node3);
node5.neighbors.push(node3);

var distances = {};

console.log('Find Distances:');
var result = graph.findDistances(node1, distances);
console.log(JSON.stringify(distances));
console.log();
