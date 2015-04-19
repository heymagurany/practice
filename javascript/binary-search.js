var value = process.argv[2];
var rotation = parseInt(process.argv[3]);
var array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','v','w','x','y','z'];

function printArray(start, end) {
  var result = array.reduce(function (previousValue, currentValue, index) {
    if (index < start || index > end) {
      return previousValue + ' ';
    }
    return previousValue + currentValue;
  }, '');
  console.log('[' + result + ']')
}

for (var i = 0; i < rotation; i++) {
  array.push(array.shift());
}

var start = 0;
var end = array.length - 1;

while (start < end) {
  printArray(start, end);
  var mid = start + Math.floor((end - start) / 2);
  if (value == array[mid]) {
    end = mid;
  }
  else if (array[start] <= array[mid]) {
    if (array[start] <= value && value < array[mid]) {
      end = mid;
    }
    else {
      start = mid + 1;
    }
  }
  else if (array[mid] <= array[end]) {
    if (array[mid] <= value && value < array[end]) {
      start = mid + 1;
    }
    else {
      end = mid;
    }
  }
}

console.log('Index: [' + start + '] = ' + array[start]);
