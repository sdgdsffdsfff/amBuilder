var gulp = require('gulp'),
	amDest = require('./index.js');

gulp.task('am-dest', function () {
	gulp.src('./test/data/**/*.js')
		.pipe(amDest('./test/dist/'))
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['am-dest']);