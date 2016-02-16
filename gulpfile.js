var gulp = require('gulp');

var uglify = require('gulp-uglify');

var cssnano = require('gulp-cssnano');

gulp.task('css', function() {
    return gulp.src('./main/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('./out'));
});
 
gulp.task('compress', function() {
  return gulp.src('./snippets/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});