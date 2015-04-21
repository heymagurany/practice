var array = [1,2,3,4,5,6,7,7,8,9];

function printArray(start, mid, end) {
  var result;
  if (start == 0) {
    result = array[0];
  }
  else {
    result = ' ';
  }
  for (var i = 1; i < array.length; i++) {
    var num = array[i].toString();
    result += ' ';
    if (i < start || i > end) {
      for (var j = 0; j < num.length; j++) {
        result += ' ';
      }
    }
    else {
      result += num;
    }
  }
  console.log('(' + array[mid] + ')[' + result + ']')
}

var start = 0;
var end = array.length - 1;

while (start < end) {
  var mid = start + Math.floor((end - start) / 2);
  printArray(start, mid, end);
  if (mid < array[mid]) {
    start = mid + 1;
  }
  else {
    end = mid;
  }
}

console.log('Duplicate: array[' + start + ']=' + array[start]);
