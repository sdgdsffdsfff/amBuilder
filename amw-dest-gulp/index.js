var es = require('event-stream'),
	dest = require('./lib/amw-fs'),
	fs = require('fs'),
	path = require('path');

// Plugin function
function amDest(path) {
	path = path || "./";

	//将文件复制到新的文件夹
	var pakageData = JSON.parse(fs.readFileSync('package.json'));

	var stream = dest(path, {version: pakageData.gallery});

	return stream;
}

// Export the plugin main function
module.exports = amDest;