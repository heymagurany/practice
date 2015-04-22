function Node (value) {
  this.value = value;
  this.neighbors = [];
  this.toString = function () {
    var neighbors = this.neighbors.map(function (neighbor) {
      return neighbor.value.toString();
    });
    return this.value.toString() + '->(' + neighbors.join() + ')';
  };
}

/*
 * origin: Node
 * visitor: function(Node)
 *
 * return: undefined
 */
function bfs(origin, visitor) {
  var queue = [origin];
  var queued = {};
  queued[origin] = true;
  while (queue.length > 0) {
    var front = queue.shift();

    // Visit the node!
    visitor(front);

    front.neighbors.forEach(function (neighbor) {
      // Check if we visited the node
      // TODO: Use a binary tree to store the visited nodes!
      var found = queued[neighbor];
      // If we haven't visited the node, queue it and add it to
      // the list of visited nodes
      if (!found) {
        queue.push(neighbor);
        queued[neighbor] = true;
      }
    });
  }
}

/*
 * origin: Node
 * distances: {Node:Number,...}
 *
 * return: undefined
 */
function findDistances(origin, distances) {
  var distance = function (vertex) {
    var found = distances[vertex];
    if (found >= 0) {
      return found;
    }
    return Infinity;
  };
  var visit = function (vertex) {
    if (!distances[vertex]) {
      distances[vertex] = 0;
    }
    vertex.neighbors.forEach(function (neighbor) {
      var vertexDistance = distance(vertex);
      var neighborDistance = distance(neighbor);
      distances[neighbor] = Math.min(neighborDistance, 1 + vertexDistance);
    });
  };
  bfs(origin, visit);
}

exports.Node = Node;
exports.bfs = bfs;
exports.findDistances = findDistances;
