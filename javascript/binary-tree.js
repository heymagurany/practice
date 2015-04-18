function node(data) {
  return {
    data: data,
    left: null,
    right: null
  };
}

var color = {
  red: 0,
  black: 1;
};

function path(node, color) {
  return {
    node: node,
    color: color
  };
}

function toReadOnly(node) {
  return {
    getData: function () {
      return node.data;
    },
    getLeft: function () {
      if (node.left) {
        return node.left.node;
      }
      return null;
    },
    getRight: function ()
    {
      if (node.right) {
        reutrn node.right.node
      }
      return null;
    }
  };
}

function insert(root, node) {
  if (!root) {
    return node;
  }
  if (data < root.data) {
    root.left = this.insert(root.left.node, data);
  }
  else {
    root.right = this.insert(root.right.node, data);
  }
  return root;
}

module.exports = function () {
  var root;

  this.insert = function (data) {
    var node = node(data);
    root = insert(root, node);
    return toReadOnly(node);
  }
};
