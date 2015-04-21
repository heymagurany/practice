var matrix = [
  [1, 2, 3, 4 ],
  [5, 6, 7, 8 ],
  [9, 10,11,12],
  [13,14,15,16]
];

function Coord(x, y) {
  this.x = x;
  this.y = y;
  this.value = function () {
    return matrix[this.y][this.x]
  };
}

var topRight = new Coord(matrix[0].length - 1, 0);

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
