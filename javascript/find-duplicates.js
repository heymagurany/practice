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
  var mid = Math.floor(list.length / 2);
  var end = list.length;

  while (mid < end) {
    count2++;
    console.log(char + ' (' + list[mid] + ') [' + list.slice(start, end).join(' ') + ']');
    if (char < list[mid]) {
      end = mid;
    }
    else if (char > list[mid]){
      start = mid + 1;
    }
    else {
      return mid;
    }
    mid = start + Math.floor((end - start) / 2);
  }
  return ~mid;
}

console.log(JSON.stringify(dupes));
console.log('Length: ' + input.length + ', Tests: ' + count2);
