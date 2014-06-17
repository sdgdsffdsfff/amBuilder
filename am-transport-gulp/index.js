var es = require('event-stream'),
	BufferStreams = require('bufferstreams'),
	amTrans = require('am-transport');

function transport(options, file, buffer) {
	var rawContents = String(buffer);

	var transported = new amTrans(options).transport(rawContents);

	return transported;
}

// File level transform function
function transportFileTransform(options, file) {

	// Return a callback function handling the buffered content
	return function (error, buffer, callback) {

		// Handle any error
		if (error) callback(gutil.PluginError('an-transport', error));

		// Use the buffered content
		buffer = Buffer(transport(options, file, buffer));

		// Bring it back to streams
		callback(null, buffer);
	};
}

// Plugin function
function amTransportGulp(options) {
	if (!options) options = {};

	function modifyContents(file, callback) {
		if (file.isNull()) return callback(null, file);

		if (file.isStream()) {

			file.contents = file.contents.pipe(new BufferStreams(transportFileTransform(options, file)));

			return callback(null, file);
		}

		var newFile = file.clone();

		var newContents = transport(options, file, newFile.contents);

		newFile.contents = new Buffer(newContents);
		callback(null, newFile);
	}

	return es.map(modifyContents);
}

// Export the plugin main function
module.exports = amTransportGulp;