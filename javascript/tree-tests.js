var DataStructures = require('./data-structures.js');

var tree1 = new DataStructures.BinaryTree();

console.log('Insert:');
var root1 = tree1.insert(null, 4);
root1 = tree1.insert(root1, 2);
root1 = tree1.insert(root1, 6);
root1 = tree1.insert(root1, 1);
root1 = tree1.insert(root1, 3);
root1 = tree1.insert(root1, 5);
root1 = tree1.insert(root1, 7);
root1 = tree1.insert(root1, 8);
console.log(tree1.toString(root1));
console.log();

console.log('Size: ' + tree1.size(root1));
console.log();

console.log('Size (non-recursive): ' + tree1.size2(root1));
console.log();

console.log('Find:');
var node4 = tree1.find(root1, 4);
var node1 = tree1.find(root1, 1);
var node6 = tree1.find(root1, 6);
var node7 = tree1.find(root1, 7);
console.log('Root: ' + node4.data);
console.log('No Children: ' + node1.data);
console.log('One Child: ' + node7.data);
console.log('Two Children: ' + node6.data);
console.log();

console.log('Find Parent:');
var parent4 = tree1.findParent(root1, node4);
var parent1 = tree1.findParent(root1, node1);
var parent6 = tree1.findParent(root1, node6);
var parent7 = tree1.findParent(root1, node7);
console.log('Parent 4: ' + (parent4 ? parent4.data : '(null)'));
console.log('Parent 1: ' + parent1.data);
console.log('Parent 6: ' + parent6.data);
console.log('Parent 7: ' + parent7.data);
console.log();

console.log('Find Successor:');
var parent4 = tree1.findSuccessor(root1, node4);
var parent1 = tree1.findSuccessor(root1, node1);
var parent6 = tree1.findSuccessor(root1, node6);
var parent7 = tree1.findSuccessor(root1, node7);
console.log('Successor 4: ' + (parent4 ? parent4.data : '(null)'));
console.log('Successor 1: ' + parent1.data);
console.log('Successor 6: ' + parent6.data);
console.log('Successor 7: ' + parent7.data);
console.log();

console.log('Remove');
var root1 = tree1.remove(root1, node1);
console.log('No Children 1:');
console.log(tree1.toString(root1));
var root1 = tree1.remove(root1, node7);
console.log('One Child: 7');
console.log(tree1.toString(root1));
var root1 = tree1.remove(root1, node6);
console.log('Two Children 6:');
console.log(tree1.toString(root1));
var root1 = tree1.remove(root1, root1);
console.log('Root: 4');
console.log(tree1.toString(root1));
console.log();
