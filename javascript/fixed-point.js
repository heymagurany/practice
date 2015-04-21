//var array = [-10, -5, 0, 3, 7, 8, 9, 10];
//var array = [0, 2, 5, 8, 17];
//var array = [-10, -5, 3, 4, 7, 9];
var array = [0,1,2,3,4,5,6,7,8,9];

function printArray(start, mid, end) {
  var result = array.reduce(function (previousValue, currentValue, index) {
    if (index < start || index > end) {
      return previousValue + '  ';
    }
    return previousValue + ' ' + currentValue;
  }, '');
  console.log('(' + array[mid] + ')[' + result + ']')
}

var start = 0;
var end = array.length - 1;

while (start < end) {
  var mid = start + Math.floor((end - start) / 2);
  printArray(start, mid, end);
  if (mid <= array[mid]) {
    end = mid;
  }
  else {
    start = mid + 1;
  }
}

console.log('Fixed Point: array[' + start + ']=' + array[start]);
