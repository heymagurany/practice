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

module.exports = function LinkedList() {
  var head = null;
  // Inserts a new node at the head of the list
  this.insert = function (data) {
    head = new Node(head, data);
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
  //Find/contains
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
  // Remove all
  this.removeAll = function (data) {
    while (head && head.data === data) {
      head = head.next;
    }
    var current = head;
    while (current) {
      while (current.next && current.next.data === data) {
        current.next = current.next.next;
      }
      current = current.next;
    }
  }
  // Find midpoint
  this.mid = function () {
    if (!head) {
      return null;
    }
    var trailing = head;
    var leading = head;
    while (leading) {
      leading = leading.next;
      if (leading) {
        leading = leading.next;
        trailing = trailing.next;
      }
    }
    return trailing.data;
  };
  // Find kth from end
  this.fromEnd = function(k) {
    if (!head) {
      return null;
    }
    var leading = head;
    while (k-- && leading) {
      leading = leading.next;
    }
    var trailing = head;
    while (leading) {
      leading = leading.next;
      trailing = trailing.next;
    }
    return trailing.data;
  };
  // Reverse
  this.reverse = function () {
    var prev;
    var current = head;
    while (current) {
      var next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    head = prev;
  };
  // Is Palindrome: Use an internal linked-list as a stack
  this.isPalindrome = function () {
    var stack;
    var current = head;
    while (current) {
      stack = new Node(stack, current.data);
      current = current.next;
    }
    current = head;
    while (stack) {
      if (current.data !== stack.data) {
        return false;
      }
      stack = stack.next;
      current = current.next;
    }
    return true;
  };
  // For testing
  this.toString = function () {
    if (!head) {
      return '';
    }
    var result = head.data.toString();
    var current = head.next;
    while (current) {
      result += '->' + current.data.toString();
      current = current.next;
    }
    return result;
  };
};
