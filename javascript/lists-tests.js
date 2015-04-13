var LinkedList = require('./linked-list.js');

console.log('Linked List')
console.log('===========');
var list = new LinkedList();

// Insert
list.insert(1);
list.insert(3);
list.insert(2);
console.log('Insert: ' + list.toString());

// Reverse
list.reverse();
console.log('Reverse: ' + list.toString());

// Insert sorted
var listSorted = new LinkedList();
listSorted.insert_sorted(2);
listSorted.insert_sorted(1);
listSorted.insert_sorted(4);
listSorted.insert_sorted(3);
console.log('Insert Sorted: ' + listSorted.toString());

// Reverse sorted
listSorted.reverse();
console.log('Reverse Sorted: ' + listSorted.toString());

// Find
console.log('Find 3: ' + list.find(3));
console.log('Find 4: ' + list.find(4));

// Midpoint
console.log(list.mid());
console.log(listSorted.mid());

// From end
console.log(list.fromEnd(2));
console.log(listSorted.fromEnd(2));

// Remove
console.log(list.remove(3));
console.log(list.remove(3));
console.log(list.remove(1));
console.log(list.toString());

// Remove All
list.insert(2);
list.insert(3);
list.insert(5);
list.insert(4);
list.insert(5);
list.removeAll(2);
console.log('Remove All: ' + list.toString());
list.removeAll(5);
console.log('Remove All: ' + list.toString());

console.log('Circular Linked List')
console.log('====================');
var CircularLinkedList = require('./circular-linked-list.js');
var circular = new CircularLinkedList();
var circularSorted = new CircularLinkedList();

// Insert
circular.insert(1);
circular.insert(3);
circular.insert(2);
console.log(circular.toString());

// Insert sorted
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

console.log('Doubly Linked List');
console.log('==================');
var DoublyLinkedList = require('./doubly-linked-list.js');
var doubly = new DoublyLinkedList();
var doublySorted = new DoublyLinkedList();

// Insert
doubly.insert(3);
doubly.insert(1);
doubly.insert(2);
doubly.insert(4);
console.log('Insert: ' + doubly.toString());

doubly.reverse();
console.log('Reverse: ' + doubly.toString());
