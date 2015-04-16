var list = function () {
  var items = new Array();

  return {
    binarySearch = function (item, comparer) {

    },
    each = function (iterator) {
      for (var i = 0; i < items.length; i++) {
        iterator(i, items[i]);
      }
    },
    insert = function (index, item) {
      items.splice(index, 0, item);
    },
    item = function (index) {
      return items[index];
    },
    length = function () {
      return items.length;
    },
    remove = function (index) {
      items.splice(index, 0);
    }
  };
};
