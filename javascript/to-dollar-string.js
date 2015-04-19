var number = Number(process.argv[2]);
var numbers = ['0','1','2','3','4','5','6','7','8','9'];
var count = 0;
var result = '';
var isNegative = number < 0;
var digit;

number = number * 100 + 0.5;

if (isNegative) {
  number = number * -1;
}

do {
  if (count > 0) {
    if (count == 2) {
      result = '.' + result;
    }
    else if (count % 3 === 0) {
      result = ',' + result;
    }
  }
  digit = Math.floor(number % 10);
  result = numbers[digit] + result;
  number = number / 10;
  count++;
} while (number >= 1 || count < 3);

result = '$' + result;

if (isNegative) {
  result = '(' + result + ')';
}

console.log(result);
