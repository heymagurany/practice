function Node(arg0, arg1) {
  if (arg1) {
    this.next = arg0;
    this.data = arg1;
  }
  else {
    this.next = null;
    this.data = arg0;
  };
}

module.exports = function () {
  var head = null;
  // Inserts a new node at the head of the list
  this.insert = function (data) {
    var insertion = new Node(data);
    if (!head) {
      insertion.next = insertion;
      head = insertion;
    }
    else {
      insertion.data = head.data;
      head.data = data;
      insertion.next = head.next;
      head.next = insertion;
    }
  };
  // Inserts sorted.
  this.insert_sorted = function (data) {
    if (!head || head.data > data) {
      head = new Node(head, data);
    }
    else {
      var current = head;
      while (current.next && current.next.data < data) {
        current = current.next;
      }
      current.next = new Node(current.next, data);
    }
  };
  this.find = function (data) {
    var current = head;
    while (current && current.data !== data) {
      current = current.next;
    }
    return current != null;
  };
  // Remove
  this.remove = function (data) {
    if (head) {
      if (head.data === data) {
        head = head.next;
        return true;
      }
      var current = head;
      while (current.next) {
        if (current.next.data === data) {
          current.next = current.next.next;
          return true;
        }
        current = current.next;
      }
    }
    return false;
  };
  // For testing
  this.toString = function () {
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
