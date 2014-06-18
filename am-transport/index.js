'use strict';
var uglify = require('uglify-js');

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

	//standalone模式
	if (undefined === options.standalone) {
		options.standalone = false;
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

	switch (options.loader) {
		case "windows":
			data = wrapperByWindows(data, options);
			break;
	}

	if (options.uglify) {
		data = uglify.minify(data, {fromString: true}).code;
	}

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
	var moduleWrapper = "window." + options.family + " = window." + options.family + "||{};\r\n(function(){\r\n$$modSrc\r\n})();";

	if (data.indexOf("module.exports") >= 0) {
		if (!options.standalone) {
			var modNameStr = data.match(/^module.exports\s*=\s*(\w+);?$/igm);
			modNameStr = modNameStr[0].split("=")[1].replace(/(^\s*)|(\s*$)/g, "").replace(";", "");
			data = data.replace("module.exports", "window." + options.family + "." + modNameStr);
		} else {
			data = data.replace("module.exports", "window." + options.family);
		}
	}

	data = moduleWrapper.replace("$$modSrc", data);
	return data;
}