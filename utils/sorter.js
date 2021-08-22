function sort(elements) {
  var sortable = [];
  for (var element in elements) {
    sortable.push([element, elements[element]]);
  }
  sortable.sort(function(a, b) {
    return b[1] - a[1];
  });
  return sortable;
}

function sortObject(inputObj) {
  return Object.keys(inputObj)
    .sort().reduce(function(Obj, key) {
      Obj[key] = inputObj[key];
      return Obj;
    }, {});
}

module.exports = { sort, sortObject }