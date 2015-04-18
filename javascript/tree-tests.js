var DataStructures = require('./data-structures.js');

var tree = new DataStructures.BinaryTree();

console.log('Insert:');
var root1 = tree.insert(null, 4);
root1 = tree.insert(root1, 2);
root1 = tree.insert(root1, 6);
root1 = tree.insert(root1, 1);
root1 = tree.insert(root1, 3);
root1 = tree.insert(root1, 5);
root1 = tree.insert(root1, 7);
root1 = tree.insert(root1, 8);
console.log(tree.toString(root1));
console.log();

console.log('Size: ' + tree.size(root1));
console.log();

console.log('Size (non-recursive): ' + tree.size2(root1));
console.log();

console.log('Find:');
var node4 = tree.find(root1, 4);
var node1 = tree.find(root1, 1);
var node6 = tree.find(root1, 6);
var node7 = tree.find(root1, 7);
console.log('Root: ' + node4.data);
console.log('No Children: ' + node1.data);
console.log('One Child: ' + node7.data);
console.log('Two Children: ' + node6.data);
console.log();

console.log('Find Parent:');
var parent4 = tree.findParent(root1, node4);
var parent1 = tree.findParent(root1, node1);
var parent6 = tree.findParent(root1, node6);
var parent7 = tree.findParent(root1, node7);
console.log('Parent 4: ' + (parent4 ? parent4.data : '(null)'));
console.log('Parent 1: ' + parent1.data);
console.log('Parent 6: ' + parent6.data);
console.log('Parent 7: ' + parent7.data);
console.log();

console.log('Find Successor:');
var parent4 = tree.findSuccessor(root1, node4);
var parent1 = tree.findSuccessor(root1, node1);
var parent6 = tree.findSuccessor(root1, node6);
var parent7 = tree.findSuccessor(root1, node7);
console.log('Successor 4: ' + (parent4 ? parent4.data : '(null)'));
console.log('Successor 1: ' + parent1.data);
console.log('Successor 6: ' + parent6.data);
console.log('Successor 7: ' + parent7.data);
console.log();

console.log('Remove:');
var root1 = tree.remove(root1, node1);
console.log('No Children 1:');
console.log(tree.toString(root1));
var root1 = tree.remove(root1, node7);
console.log('One Child: 7');
console.log(tree.toString(root1));
var root1 = tree.remove(root1, node6);
console.log('Two Children 6:');
console.log(tree.toString(root1));
var root1 = tree.remove(root1, root1);
console.log('Root: 4');
console.log(tree.toString(root1));
console.log();

console.log('Depth: ' + tree.depth(root1));
console.log();

tree.insert(root1, 6);
tree.insert(root1, 9);
tree.insert(root1, 10);
console.log(tree.toString(root1));
console.log('Depth (non-recursive): ' + tree.depth2(root1));
console.log();

console.log('Is Balanced: ' + tree.isBalanced(root1));
console.log();

var node10 = tree.find(root1, 10);
var path = [];
console.log('Ancestry 10: ' + tree.ancestry(root1, node10, path));
var pathString = path.map(function(node) {
  return node.data;
});
console.log(pathString.join('->'));
console.log();

var node3 = tree.find(root1, 3);
var node6 = tree.find(root1, 6);
var node9 = tree.find(root1, 9);
console.log('Least Common Ancestor: ' + tree.lca(root1, node6, node9).data);
console.log();

console.log('Least Common Ancestor (non-recursive): ' + tree.lca2(root1, node6, node9).data);
console.log('Least Common Ancestor (non-recursive): ' + tree.lca2(root1, node10, node9).data);
console.log();

console.log('Reconstruction:');
console.log(tree.toString(root1));
console.log('Build In-Order List:')
var inOrder = [];
function visitInOrder(node) {
  console.log(node.data);
  inOrder.push(node.data);
}
tree.inOrder(root1, visitInOrder);
console.log('Build Pre-Order List:');
var preOrder = [];
function visitPreOrder(node) {
  console.log(node.data);
  preOrder.push(node.data);
}
tree.preOrder(root1, visitPreOrder);
console.log('Reconstructed:');
var root2 = tree.reconstruct(inOrder, preOrder);
console.log(tree.toString(root2));
