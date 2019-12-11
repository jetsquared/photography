'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('resize', () => {
    return gulp.src('./images/*.*')
        .pipe(imageResize({
            width: 1024,
            imageMagick: true
        }))
        .pipe(gulp.dest('./images/fulls'))
        .pipe(imageResize({
            width: 512,
            imageMagick: true
        }))
        .pipe(gulp.dest('./images/thumbs'));
});

gulp.task('del', gulp.series('resize', () => {
    return del(['./images/*.*']);
}));

// compile scss to css
gulp.task('sass', () => {
    return gulp.src('./assets/sass/main.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/css'));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', () => {
    gulp.watch('./assets/sass/**/*.scss', gulp.parallel('sass'));
});

// minify js
gulp.task('minify-js', () => {
    return gulp.src('./assets/js/main.js')
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest('./assets/js'));
});

// default task
gulp.task('default', gulp.series('del'));

// scss compile task
gulp.task('compile-sass', gulp.parallel('sass', 'minify-js'));