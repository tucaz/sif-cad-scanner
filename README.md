# sif-cad-scanner
## using the model writer
```node
var writer = require("./basemodelInfoWriter.js");
writer("./sif/**.top", "./output",
  function(item, callback) {
    callback(null, {
      model: item
    });
  },
function(err) {
  console.log("all done");
});
```
