var input = process.argv[2].toLowerCase();

// My name is matt
// The quick brown dog jumped over the fox
var list = [];
var dupes = {};
var count2 = 0;

for (var i = 0; i < input.length; i++) {
  var x = input[i];
  if (x !== ' ' && !dupes[x]) {
    var index = search(list, x);
    if (index < 0) {
      list.splice(~index, 0, x);
    }
    else {
      dupes[x] = x;
    }
  }
  count2++;
}

function search (list, char) {
  var start = 0;
  var end = list.length - 1;
  while (start <= end) {
    var mid = start + Math.floor((end - start) / 2);
    count2++;
    console.log(char + ' (' + list[mid] + ') [' + list.slice(start, end + 1).join(' ') + ']');
    if (char === list[mid]) {
      return mid;
    }
    if (char < list[mid]) {
      end = mid - 1;
    }
    else {
      start = mid + 1;
    }
  }
  return ~start;
}

console.log(JSON.stringify(dupes));
console.log('Length: ' + input.length + ', Tests: ' + count2);
