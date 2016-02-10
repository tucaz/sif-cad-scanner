var sifScanner = require("sif-scanner"),
    async = require("async");

function _getCadFile(baseModel, callback) {
    var sifScanner = require("sif-scanner");
    sifScanner("./sif/**.in", /^PN\=/, function filter(item) {
        return item.PN === baseModel;
    }, function done(err, results) {
        if (err) {
            return callback(err);
        }

        callback(null, results[0]["3D"]);
    });
}

function _getStaticLayers(baseModel, callback) {
    sifScanner("./sif/**.PLI", /^PN\=/, function filter(item) {
        return item.PN === baseModel;
    }, function(err, results) {
        if (err) {
            return callback(err);
        }

        var o = {};

        results.forEach(function(item) {
            o[item["3DLA"]] = item.IM;
        });

        callback(null, o);
    });
}

function _getOptionKeys(baseModel, callback) {
    sifScanner("./sif/**.key", /^PN\=/, function filter(item) {
        return item.PN === baseModel;
    }, function(err, results) {
        if (err) {
            return callback(err);
        }

        var item = results[0];
        var keyIndex = 0;
        var optionKeys = [];

        if (!item) {
            return callback(null, null);
        }

        while (item["G" + keyIndex]) {
            optionKeys.push(item["G" + keyIndex]);
            keyIndex++;
        }

        callback(null, optionKeys);
    });
}

function _getLayerForOptionKey(key, callback) {
    sifScanner("./sif/**.MON", /^PO\=/, function filter(item) {
        return item.PO === key;
    }, function done(err, results) {
        if (err) {
            return callback(err);
        }

        if (results && results.length > 0)
            return callback(null, results[0]["3DLA"]);

        callback(null, null);
    });
}

function _getDynamicLayers(baseModel, callback) {
    _getOptionKeys(baseModel, function(err, keys) {
        if (err) {
            return callback(err);
        }

        async.map(keys, _getLayerForOptionKey, function(err, results) {
            if (err) {
                return callback(err);
            }

            var r = {};

            for (var i = 0; i < results.length; i++) {
                if (results[i]) {
                    r[results[i]] = i;
                }
            }

            callback(null, r);
        });
    });
}

module.exports = function(baseModel, allDone) {
    async.series({
        cadFile: function(callback) {
            _getCadFile(baseModel, callback);
        },
        dynamicLayers: function(callback) {
            _getDynamicLayers(baseModel, callback);
        },
        staticLayers: function(callback) {
            _getStaticLayers(baseModel, callback);
        }
    }, allDone);
};