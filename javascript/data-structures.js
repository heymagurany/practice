function Node (data) {
  this.data = data;
  this.left = null;
  this.right = null;
}
module.exports = {
  BinaryTree: function () {
    this.insert = function (root, data) {
      if (!root) {
        return new Node(data);
      }
      if (data < root.data) {
        root.left = this.insert(root.left, data);
      }
      else {
        root.right = this.insert(root.right, data);
      }
      return root;
    };
    this.find = function (root, data) {
      if (!root || root.data === data) {
        return root;
      }
      if (data < root.data) {
        return this.find(root.left, data);
      }
      return this.find(root.right, data);
    };
    this.findParent = function (root, target) {
      if (root == target) {
        return null;
      }
      while (root && root.left != target && root.right != target) {
        if (target.data < root.data) {
          root = root.left;
        }
        else {
          root = root.right;
        }
      }
      return root;
    };
    this.findSuccessor = function (root, target) {
      var successor = target.right;
      // There is a right child, so the right child's deepest left node will
      // be the successor.
      if (successor) {
        while (successor.left) {
          successor = successor.left;
        }
        return successor;
      }
      // There isn't a right child, so find the target's ancestor where the
      // target is in the left sub-tree.
      do {
        if (successor) {
          target = successor;
        }
        successor = this.findParent(root, target);
      } while (successor && successor.right == target);
      return successor;
    };
    this.remove = function (root, target) {
      if (target.left != null && target.right != null) {
        var successor = this.findSuccessor(root, target);
        this.remove(root, successor);
        target.data = successor.data;
        return root;
      }
      if (target.left != null) {
        var left = target.left;
        target.data = left.data;
        target.left = left.left;
        target.right = left.right;
        return root;
      }
      if (target.right != null) {
        var right = target.right;
        target.data = right.data;
        target.left = right.left;
        target.right = right.right;
        return root;
      }
      if (root == target) {
        return null;
      }
      var parent = this.findParent(root, target);
      if (parent.left == target) {
        parent.left = null;
      }
      else {
        parent.right = null;
      }
      return root;
    };
    this.toString = function (root) {
      var subTree = function (node, pad, prefix, line) {
        return '\n' + pad + prefix + '->' + tree(node, pad + line + '  ');
      };
      var tree = function (root, pad) {
        if (!root) {
          return 'X';
        }
        return root.data.toString() +
               subTree(root.left, pad, 'L', '|') +
               subTree(root.right, pad, 'R', ' ');
      };
      return tree(root, '');
    };
  }
};
