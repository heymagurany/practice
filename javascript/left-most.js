var value = process.argv[2];
var array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','m','m','m','n','o','p','q','r','s','t','v','w','x','y','z'];
var start = 0;
var end = array.length - 1;

function printArray(start, end) {
  var result = array.reduce(function (previousValue, currentValue, index) {
    if (index < start || index > end) {
      return previousValue + ' ';
    }
    return previousValue + currentValue;
  }, '');
  console.log('(' + array[mid] + ') [' + result + ']')
}

while (start < end && value !== array[start]) {
  var mid = start + Math.floor((end - start) / 2);
  printArray(start, end);
  if (value <= array[mid]) {
    end = mid;
  }
  else {
    start = mid + 1;
  }
}

console.log('Index: ' + start);
