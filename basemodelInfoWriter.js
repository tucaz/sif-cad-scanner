var iterator = require("./basemodelIterator.js");
var fs = require("fs");

module.exports = function(topSifFilePath, outputFolder, getData, callback) {
  iterator(topSifFilePath,
    function(item, callback) {
      getData(item, function(err, data) {
        fs.writeFile(outputFolder + "/" + item + ".json", JSON.stringify(data, null, 4), callback);
      });
    },
    callback);
};
