var es = require('event-stream'),
	dest = require('./lib/amw-fs'),
	fs = require('fs'),
	path = require('path');

// Plugin function
function amDest(path, loader) {
	path = path || "./";
	loader = loader || "windows";

	//将文件复制到新的文件夹
	var packageData = JSON.parse(fs.readFileSync('package.json'));

	return  dest(path, {version: packageData.gallery, loader: loader});

}

// Export the plugin main function
module.exports = amDest;