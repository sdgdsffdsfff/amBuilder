## am-transport-plugin
gulp plugin for am project transport

## usage

```
var gulp = require('gulp'),
        amTransportGulp = require('gulp-am-transport');

gulp.task('am-transport', function() {
  gulp.src('./test/data/*.js')
    .pipe(amTransportGulp())
    .pipe(gulp.dest('./dist/'))
});
```