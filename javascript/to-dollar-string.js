var number = Number(process.argv[2]);
var numbers = ['0','1','2','3','4','5','6','7','8','9'];
var count = 0;
var separator = '.'
var index = 2;
var result = '';
var isNegative = number < 0;

number = number * 100 + 0.5;

if (isNegative) {
  number = number * -1;
}

do {
  var digit = Math.floor(number % 10);
  if (count == index) {
    result = separator + result;
    count = 0;
    separator = ',';
    index = 3;
  }
  result = numbers[digit] + result;
  number = number / 10;
  count++;
} while (number >= 1);

result = '$' + result;

if (isNegative) {
  result = '(' + result + ')';
}

console.log(result);
