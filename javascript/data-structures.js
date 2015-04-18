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
    this.size = function (root) {
      if (!root) {
        return 0;
      }
      return 1 + this.size(root.left) + this.size(root.right);
    };
    this.size2 = function (root) {
      if (!root) {
        return 0;
      }
      var count = 0;
      var stack = [];
      stack.push(root);
      while (stack.length > 0) {
        var front = stack.shift();
        count++;
        if (front.left) {
          stack.push(front.left);
        }
        if (front.right) {
          stack.push(front.right);
        }
      }
      return count;
    };
    this.depth = function (root) {
      if (!root) {
        return 0;
      }
      return 1 + Math.max(this.depth(root.left), this.depth(root.right));
    };
    this.depth2 = function (root) {
      if (!root) {
        return 0;
      }
      var depth = 0;
      var visited = [];
      var isVisted = function (node) {
        for (var i = 0; i < visited.length; i++) {
          if (visited[i] == node) {
            return true;
          }
        }
        return false;
      }
      var stack = [];
      stack.push(root);
      while (stack.length !== 0) {
        var top = stack[stack.length - 1];
        // Have we visited the left node?
        if (top.left && !isVisted(top.left)) {
          stack.push(top.left);
        }
        // Have we visited the right node?
        else if (top.right && !isVisted(top.right)) {
          stack.push(top.right);
        }
        // We're at the bottom, count the stack (depth). The next iteration
        // will go down top's sibling.
        else {
          visited.push(top); // Inserts the leaf node.
          depth = Math.max(depth, stack.length);
          stack.pop();
        }
      }
      return depth;
    };
    this.isBalanced = function (root) {
      var balancedDepth = function (info) {
        if (!info.root) {
          info.depth = 0;
          return true;
        }
        var left = { root: info.root.left };
        var right = { root: info.root.right };
        if (!balancedDepth(left)) {
          return false;
        }
        if (!balancedDepth(right)) {
          return false;
        }
        info.depth = 1 + Math.max(left.depth, right.depth);
        if (Math.abs(info.left - info.right) > 1) {
          return false;
        }
        return true;
      };

      return balancedDepth({ root: root });
    };
    this.ancestry = function(root, target, path) {
      while (root && target && (path.length == 0 || path[path.length - 1] != target)) {
        path.push(root);
        if(target.data < root.data) {
          root = root.left;
        }
        else {
          root = root.right;
        }
      }
      return !target || path[path.length - 1] == target;
    };
    this.lca = function (root, x, y) {
      if (root == x && root == y) {
        return root;
      }
      if ((x.data < root.data && y.data >= root.data) || (x.data >= root.date && y.data < root.data)) {
        return root;
      }
      if (x.data < root.data) {
        return this.lca(root.left, x, y);
      }
      return this.lca(root.right, x, y);
    };
    this.lca2 = function (root, x, y) {
      if (x && y && (x.data > y.data)) {
        var swap = x;
        x = y;
        y = swap;
      }
      while (root && (y.data < root.data || x.data >= root.data)) {
        console.log('DEBUG: ' + root.data + '-' + x.data + ',' + y.data);
        if (x.data < root.data) {
          root = root.left;
        }
        else {
          root = root.right;
        }
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
