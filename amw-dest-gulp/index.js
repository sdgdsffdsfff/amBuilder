var es = require('event-stream'),
	vfs = require('vinyl-fs'),
	fs = require('fs'),
	path = require('path');

// Plugin function
function amDest(options) {
	if (!options) options = {};

	function buildDest(file, callback) {
		//将文件复制到新的文件夹
		var pakageData = JSON.parse(fs.readFileSync('package.json'));
		console.log(pakageData);

		if (file.isNull()) return callback(null, file);

		if (file.isStream()) {
			return callback(null, file);
		}

		var newFile = file.clone();
		newFile.contents = new Buffer(newFile.contents);
		callback(null, newFile);
	}

	return es.map(buildDest);
}

// Export the plugin main function
module.exports = amDest;