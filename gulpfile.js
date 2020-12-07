const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const babel = require('gulp-babel');
const nodemon = require('gulp-nodemon');

gulp.task('css', function() {
    var plugins = [
        autoprefixer(),
        cssnano()
    ];
    return gulp.src(['public/*.css', '!public/*.min.css'])
        .pipe(postcss(plugins))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('public'));
});

gulp.task('js', function() {
    return pipeline(
        gulp.src(['public/js/*.js', '!public/js/*.min.js']),
        babel({
            presets: ['@babel/env']
        }),
        uglify(),
        rename({suffix: '.min'}),
        gulp.dest('public/js/')
  );
});

gulp.task('watch', function() {
    gulp.watch(['public/*.css', '!public/*.min.css'], gulp.series('css'));
    gulp.watch(['public/js/*.js', '!public/js/*.min.js'], gulp.series('js'));
});

gulp.task('nodemon', function() {
    return nodemon({
        script: 'app.js',
    });
});

exports.dev = gulp.parallel('nodemon', 'watch');
exports.build = gulp.parallel('css', 'js');