const fplService = require('./fpl-service');

const fpl = new fplService();

async function findDuplicates() {
  await fpl.init(1000);
  elements = fpl.getElements();
  let map = [];
  let duplicates = [];
  for (var i in elements) {
    var webName = elements[i].web_name;
    if (map[webName] == 1) {
      map[webName]++;
      duplicates.push(webName);
    } else {
      map[webName] = 1;
    }
  }
  duplicates.sort();
  var oldNames = fpl.getSameLastName();
  console.dir(duplicates.filter(x => !oldNames.includes(x)));
  console.dir(oldNames.filter(x => !duplicates.includes(x)));
  console.dir(duplicates);
  return duplicates;
}

module.exports = { findDuplicates }