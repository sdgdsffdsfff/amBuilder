'use strict';

var _ = require('lodash');
var defaults = _.defaults;

var path = require('path');
var through2 = require('through2');
var mkdirp = require('mkdirp');
var fs = require('graceful-fs');

var writeContents = require('./writeContents');

// 511 = 0777
var processMode = 511 & (~process.umask());

function dest(outFolder, opt) {
	if (typeof outFolder !== 'string' && typeof outFolder !== 'function') {
		throw new Error('Invalid output folder');
	}

	var options = defaults({}, opt, {
		cwd: process.cwd()
	});

	if (typeof options.mode === 'string') {
		options.mode = parseInt(options.mode, 8);
	}

	var cwd = path.resolve(options.cwd);
	var defaultMode = (options.mode || processMode);

	function saveFile(file, enc, cb) {
		function getRelativePath(path) {
			function getVersion() {
				var fullPath = file.path.split("/");
				fullPath[fullPath.length - 1] = "package.json";
				var packageInfo = JSON.parse(fs.readFileSync(fullPath.join("/")));
				return packageInfo.version || "1.0.0";
			}

			if (path.indexOf("/") > 0) {
				var widgetName = path.substr(path.indexOf("/") + 1, path.length);
				path = path.substr(0, path.indexOf("/")).split("/");

				var version = getVersion();

				switch (options.loader) {
					case "cmd":
						path.unshift("spm");
						break;
					default:
						//在文件名前加上版本号
						path.push(version);
				}

				path.push(widgetName);
				path = path.join("/");
			}

			return path;
		}

		var basePath;
		if (typeof outFolder === 'string') {
			basePath = path.resolve(cwd, outFolder);
		}
		if (typeof outFolder === 'function') {
			basePath = path.resolve(cwd, outFolder(file));
		}

		var relative = getRelativePath(file.relative);

//		console.log(file.relative);

		var writePath = path.resolve(basePath, relative);

		var writeFolder = path.dirname(writePath);

		// wire up new properties
		file.stat = file.stat ? file.stat : new fs.Stats();
		file.stat.mode = (options.mode || file.stat.mode || processMode);
		file.cwd = cwd;
		file.base = basePath;
		file.path = writePath;

		// mkdirp the folder the file is going in
		mkdirp(writeFolder, defaultMode, function (err) {
			if (err) {
				cb(err);
			} else {
				writeContents(writePath, file, cb);
			}
		});
	}

	var stream = through2.obj(saveFile);
	stream.resume();
	return stream;
}

module.exports = dest;