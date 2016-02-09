var _ = require("underscore");
var async = require("async");

var sifScanner = require("sif-scanner");

function filter(item) {
  return true;
}

module.exports = function(topSifFilePath, iterator, callback) {
  sifScanner(topSifFilePath, /^PN\=/, filter, function(err, blocks) {
    var models = _.map(blocks, function(block) { return block.PN; });
    async.map(models, iterator, callback);
  });
}
