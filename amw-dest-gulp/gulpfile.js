var gulp = require('gulp'),
	amwDest = require('./index.js');

gulp.task('am-dest', function () {
	gulp.src('./test/data/**/*.js')
		.pipe(amwDest('./test/dist/'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['am-dest']);