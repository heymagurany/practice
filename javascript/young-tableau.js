var matrix = [
  [1, 2, 3, 4, 5, 6, 7, 8 ],
  [9, 10,11,12,13,14,15,16],
  [17,18,19,20,21,22,23,24],
  [25,26,27,28,29,30,31,32],
  [33,34,35,36,37,38,39,40],//37
  [41,42,43,44,45,46,47,48],
  [49,50,51,52,53,54,55,56],
  [57,58,59,60,61,62,63,64]
];
var matrix = [
  [1, 2, 3, 4, 5, 6, 7, 8 ],
  [2, 3, 4, 5, 6, 7, 8, 9 ],
  [3, 4, 5, 6, 7, 8, 9, 10],
  [4, 5, 6, 7, 8, 9, 10,11],
  [5, 6, 7, 8, 9, 10,11,12],
  [6, 7, 8, 9, 10,11,12,13],
  [7, 8, 9, 10,11,12,13,14],
  [8, 9, 10,11,12,13,14,15],
];
matrix.lengthX = matrix[0].length;
matrix.lengthY = matrix.length;

function Coord(x, y) {
  this.x = x;
  this.y = y;
  this.value = function () {
    return matrix[this.y][this.x]
  };
}

var topLeft = new Coord(0, 0);

function findRecursive(value) {
  var _recurse = function(lower, upper) {
    if (lower.x > upper.x ||
        lower.y > upper.y ||
        matrix.lengthX < Math.max(lower.x, upper.x) ||
        matrix.lengthY < Math.max(lower.y, lower.y)) {
      return null;
    }
    var midY = lower.y + Math.floor((upper.y - lower.y) / 2);
    var midX = lower.x;// + Math.floor((upper.x - lower.x) / 2);
    var mid = new Coord(midX, midY);
    while (value < mid.value()) {
      mid.x++;
    }
    if (value < mid.value()) {

    }
  };
  var lower = new Coord(0, 0);
  var upper = new Coord(matrix.lengthX - 1, matrix.lengthY - 1);
  return _recurse(lower, upper);
}

function findLinear(value) {
  var coord = new Coord(0, matrix.length - 1);
  while (coord.value() != value && coord.x <= topRight.x && coord.y >= topRight.y) {
    console.log('M[' + coord.x + ',' + coord.y + ']=' + coord.value());
    if (value < coord.value()) {
      coord.y--;
    }
    else {
      coord.x++;
    }
  }
  return coord;
}

var result = findLinear(parseInt(process.argv[2]));

console.log('Find Linear: M[' + result.x + ',' + result.y + ']=' + result.value());
