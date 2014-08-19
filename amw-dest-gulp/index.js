var es = require('event-stream'),
	dest = require('./lib/amw-fs'),
	fs = require('fs'),
	path = require('path');

// Plugin function
function amDest(path, loader) {
	path = path || "./";
	loader = loader || "windows";

	return  dest(path, { loader: loader});

}

// Export the plugin main function
module.exports = amDest;