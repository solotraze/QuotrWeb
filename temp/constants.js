/*** Constants ***/
var constantsList = {
	"dataPath": process.env.OPENSHIFT_DATA_DIR || './data/',
	"failedUrlsLogFileName": "failedUrls.json",
	"traceLogFileName": "trace.json",
  "exceptionsLogFileName": "exceptions.json"
};

function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

function defineAllConstants(constantsList) {
	for(var key in constantsList){
	    define(key,constantsList[key]);
	}
};

// Define all the constants
defineAllConstants(constantsList);

