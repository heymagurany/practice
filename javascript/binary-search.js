var value = process.argv[2];
var rotate = parseInt(process.argv[3]);
var array = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','v','w','x','y','z'];

function printArray(start, mid, end) {
  var result = array.reduce(function (previousValue, currentValue, index) {
    if (index < start || index > end) {
      return previousValue + ' ';
    }
    return previousValue + currentValue;
  }, '');
  console.log('(' + array[mid] + ')[' + result + ']')
}

for (var i = 0; i < rotate; i++) {
  array.push(array.shift());
}

var start = 0;
var end = array.length - 1;

while (start < end) {
  var mid = start + Math.floor((end - start) / 2);
  printArray(start, mid, end);
  if (array[start] <= array[mid]) {
    if(array[mid] < array[end]) {
      break;
    }
    start = mid + 1;
  }
  else {
    end = mid;
  }
}

var pivot = start;

console.log('Pivot: [' + pivot + '] = ' + array[pivot]);

var start = 0;
var end = array.length - 1;

while (start < end) {
  var mid = start + Math.floor((end - start) / 2);
  printArray(start, mid, end);
  var midValue = array[Math.floor((mid + pivot) % array.length)];
  if (value <= midValue) {
    end = mid;
  }
  else {
    start = mid + 1;
  }
}

var result = Math.floor((start + pivot) % array.length);

console.log('Index: [' + result + '] = ' + array[result]);
