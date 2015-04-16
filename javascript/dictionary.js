var dictionary = function () {
  var items = new Array();
  var lookup = new Object();

  return {
    each = function (iterator) {
      for (var key in lookup) {
        iterator(key, value);
      }
    },
    insert = function (key, value) {
      items.push(value);
    },
    item = function (key) {

    },
    length = function () {
      return items.length;
    },
    remove = function (key) {
      var index = lookup[key];

      items.splice(index, 1);
      delete lookup[key];
    }
  };
};
