var DataStructures = require('./data-structures.js');

var tree1 = new DataStructures.BinaryTree();
var root1 = tree1.insert(null, 5);
root1 = tree1.insert(root1, 7);
root1 = tree1.insert(root1, 3);
root1 = tree1.insert(root1, 9);
root1 = tree1.insert(root1, 1);
root1 = tree1.insert(root1, 6);
console.log(tree1.toString(root1));
