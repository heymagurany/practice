function Node (data) {
  this.data = data;
  this.left = null;
  this.right = null;
}
module.exports = {
  Node: Node,
  BinaryTree: function () {
    this.insert = function(root, data) {
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
