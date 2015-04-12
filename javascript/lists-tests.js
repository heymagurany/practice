var LinkedList = require('./linked-list.js');
var CircularLinkedList = require('./circular-linked-list.js');

console.log('Linked List')
console.log('===========');
var list = new LinkedList();

// Insert
list.insert(1);
list.insert(3);
list.insert(2);
console.log(list.toString());

// Insert sorted
var listSorted = new LinkedList();
listSorted.insert_sorted(2);
listSorted.insert_sorted(1);
listSorted.insert_sorted(4);
listSorted.insert_sorted(3);
console.log(listSorted.toString());

// Find
console.log(list.find(3));
console.log(list.find(4));

// Remove
console.log(list.remove(3));
console.log(list.remove(3));
console.log(list.remove(1));
console.log(list.toString());

console.log('Circular Linked List')
console.log('===========');
var circular = new CircularLinkedList();

// Insert
circular.insert(1);
circular.insert(3);
circular.insert(2);
console.log(circular.toString());

// Insert sorted
var circularSorted = new CircularLinkedList();
circularSorted.insert_sorted(2);
circularSorted.insert_sorted(1);
circularSorted.insert_sorted(4);
circularSorted.insert_sorted(3);
console.log(circularSorted.toString());

// Find
console.log(circular.find(3));
console.log(circular.find(4));

// Remove
console.log(circular.remove(3));
console.log(circular.remove(3));
console.log(circular.remove(1));
console.log(circular.toString());
