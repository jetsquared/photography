'use strict';

var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
const shell = require('gulp-shell')

const watermarkFile = './PhotoWatermark_jetsquared.png';
// paths
const _imgs = './images';
const _ass = './assets';
const _sass = `${_ass}/sass`;
const _js = `${_ass}/js`;

gulp.task('watermark', () => {
    return gulp
        .src(`${_imgs}/*.*`, { read: false })
        .pipe(shell([`magick composite -gravity center ${watermarkFile} <%= file.path %> <%= file.path %>`]))
})

gulp.task('resize', () => {
    return gulp.src(`${_imgs}/*.*`)
        .pipe(imageResize({
            width: 1024,
            imageMagick: true
        }))
        .pipe(gulp.dest(`${_imgs}/fulls`))
        .pipe(imageResize({
            width: 512,
            imageMagick: true
        }))
        .pipe(gulp.dest(`${_imgs}/thumbs`));
});

gulp.task('del', gulp.series('resize', () => {
    return del([`${_imgs}/*.*`]);
}));

// compile scss to css
gulp.task('sass', () => {
    return gulp.src(`${_sass}/main.scss`)
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest(`${_ass}/css`));
});

// watch changes in scss files and run sass task
gulp.task('sass:watch', () => {
    gulp.watch(`${_sass}/**/*.scss`, gulp.parallel('sass'));
});

// minify js
gulp.task('minify-js', () => {
    return gulp.src(`${_js}/main.js`)
        .pipe(uglify())
        .pipe(rename({basename: 'main.min'}))
        .pipe(gulp.dest(`${_js}`));
});

// default task
gulp.task('default', gulp.series('watermark', 'del')); // 'del'

// scss compile task
gulp.task('compile-sass', gulp.parallel('sass', 'minify-js'));