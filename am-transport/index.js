'use strict';
var uglifyError = require('./lib/error.js'),
	uglify = require('uglify-js');

var AMTransport = module.exports = function AMTransport(options) {
	options = options || {};

	// back compat
	if (!(this instanceof AMTransport)) {
		return new AMTransport(options);
	}

	this.stats = {};
	this.context = {
		errors: [],
		warnings: [],
		debug: options.debug
	};
	this.errors = this.context.errors;
	this.warnings = this.context.warnings;

	//默认windows分装
	if (undefined === options.loader) {
		options.loader = "windows";
	}

	//默认AJ模块的分装
	if (undefined === options.family) {
		options.family = "AJ";
	}

	//默认不进行uglify处理
	if (undefined === options.uglify) {
		options.uglify = false;
	}

	this.options = options;

};

AMTransport.prototype.transport = function (data, callback) {
	var startedAt;
	var stats = this.stats;
//	var context = this.context;
	var options = this.options;

	if (Buffer.isBuffer(data)) {
		data = data.toString();
	}

	if (options.debug) {
		this.startedAt = process.hrtime();
		this.stats.originalSize = data.length;
	}

	switch (options.wrapper) {
		case "windows":
			data = wrapperByWindows(data, options);
			break;
	}

//	console.log(data);

	if (options.uglify) {
		data = uglify.minify(data, {fromString: true}).code;
	}

//	console.log(data);

	if (options.debug) {
		var elapsed = process.hrtime(this.startedAt);
		stats.timeSpent = ~~(elapsed[0] * 1e3 + elapsed[1] / 1e6);
		stats.efficiency = 1 - data.length / stats.originalSize;
		stats.minifiedSize = data.length;
	}

	return callback ? callback.call(this, this.context.errors.length > 0 ? this.context.errors : null, data)
		:
		data;
};

function wrapperByWindows(data, options) {
	var moduleWrapper = "(function(){\r\n$$modSrc\r\n})();";

	//remove all escaped line breaks
//	data = data.replace(/(\r\n|\n)/gm, '');

	var modNameStr = data.match(/^module.exports\s*=\s*(\w+);?$/igm);

	modNameStr = modNameStr[0].split("=")[1].replace(/(^\s*)|(\s*$)/g, "").replace(";", "");
//	console.log(modNameStr);

	data = data.replace("module.exports", "window." + options.family + "." + modNameStr);
	data = moduleWrapper.replace("$$modSrc", data);
	return data;
}