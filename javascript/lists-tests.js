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

// Palidrome
var p1 = new LinkedList();
console.log('Is Palindrome (empty): ' + p1.isPalindrome());
p1.insert(1);
p1.insert(2);
p1.insert(3);
p1.insert(4);
console.log('Is Palindrome 1,2,3,4: ' + p1.isPalindrome());
var p2 = new LinkedList();
p2.insert(1);
p2.insert(2);
p2.insert(2);
p2.insert(1);
console.log('Is Palindrome 1,2,2,1: ' + p2.isPalindrome());
var p3 = new LinkedList();
p3.insert(1);
p3.insert(2);
p3.insert(3);
p3.insert(2);
p3.insert(1);
console.log('Is Palindrome 1,2,3,2,1: ' + p3.isPalindrome());

// Detect Loop
var l = new LinkedList();
var node1 = l.insert(1);
l.insert(4);
var node2 = l.insert(2);
node1.next = node2;
l.insertNode(node1);
l.insert(3);
console.log('Detect Loop 3,1,2,4,1: ' + l.detectLoop());


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

// Reverse
doubly.reverse();
console.log('Reverse: ' + doubly.toString());

// Palidrome
var p1 = new DoublyLinkedList();
console.log('Is Palindrome (empty): ' + p1.isPalindrome());
p1.insert(1);
p1.insert(2);
p1.insert(3);
p1.insert(4);
console.log('Is Palindrome 1,2,3,4: ' + p1.isPalindrome());
var p2 = new DoublyLinkedList();
p2.insert(1);
p2.insert(2);
p2.insert(2);
p2.insert(1);
console.log('Is Palindrome 1,2,2,1: ' + p2.isPalindrome());
var p3 = new DoublyLinkedList();
p3.insert(1);
p3.insert(2);
p3.insert(3);
p3.insert(2);
p3.insert(1);
console.log('Is Palindrome 1,2,3,2,1: ' + p3.isPalindrome());
