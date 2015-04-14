function Node(data, prev, next) {
  this.data = data;
  if (prev) {
    this.prev = prev;
  }
  else {
    this.prev = this;
  }
  if (next) {
    this.next = next;
  }
  else {
    this.next = this;
  }
}

module.exports = function DoublyLinkedList() {
  var head = null;
  this.insert = function (data) {
    if (!head) {
      head = new Node(data);
    }
    else {
      var insertion = new Node(data, head.prev, head);
      insertion.prev.next = insertion;
      insertion.next.prev = insertion;
    }
  };
  this.reverse = function () {
    if (head && head.next != head.prev) {
      head = head.prev;
      var tail = head;
      do {
        var next = tail.next;
        tail.next = tail.prev;
        tail.prev = next;
        tail = next;
      } while (tail != head);
    }
  };
  this.isPalindrome = function () {
    if (head && head != head.next) {
      var first = head;
      var last = head.prev;
      while (first != last && first != head) {
        if (first.data !== last.data) {
          return false;
        }
        first = first.next;
        last = last.prev;
      }
    }
    return true;
  };
  this.toString = function() {
    if (!head) {
      return '';
    }
    var result = head.data.toString();
    var current = head.next;
    while (current != head) {
      result += '->' + current.data.toString();
      current = current.next;
    }
    return result;
  };
};
