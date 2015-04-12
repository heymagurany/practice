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
    if (!head) {
      head = new Node(head, data);
      head.next = head;
    }
    else if (head.data > data) {
      head.next = new Node(head.next, head.data);
      head.data = data;
    }
    else {
      var current = head;
      while (current.next != head && current.next.data < data) {
        current = current.next;
      }
      current.next = new Node(current.next, data);
    }
  };
  // Find/contains
  this.find = function (data) {
    var current = head;
    while (current && current.data !== data) {
      current = current.next;
      if (current == head) {
        return false;
      }
    }
    return true;
  };
  // Remove
  this.remove = function (data) {
    if (head) {
      var remove;
      if (head.data === data) {
        remove = head;
      }
      else {
        var current = head.next;
        while (!remove && current != head) {
          if (current.data === data) {
            remove = current;
          }
          else {
            current = current.next;
          }
        }
      }
      if (remove) {
        if (remove.next == remove) {
          head = null;
        }
        else {
          var next = remove.next;
          remove.data = next.data;
          remove.next = next.next;
          head = remove;
        }
        return true;
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
