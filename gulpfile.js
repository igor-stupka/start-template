	var gulp           = require('gulp'),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		sourcemaps     = require('gulp-sourcemaps'),
		babel		   = require('gulp-babel'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		notify         = require('gulp-notify'),
		pug 		   = require('gulp-pug');

//BROWSER-SYNC
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: true
	});
});

//SASS
gulp.task('sass', function() {
	return gulp.src('source/sass/*.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		})).on("error", notify.onError({
			message: "Error: <%= error.message %>",
			title: "SASS ERROR"
		}))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream: true}))
});

//PUG
gulp.task('pug',  function() {
	return gulp.src('source/pug/pages/**/*.pug')
	.pipe(pug({
		pretty: true
	}))
	.on("error", notify.onError({
		message: "Error: <%= error.message %>",
		title: "PUG ERROR"
	}))
  .pipe(gulp.dest('dist/'));
});

//JS
gulp.task('js', () =>
	gulp.src('source/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
);

//WATCH
gulp.task('watch', ['pug', 'sass', 'js', 'browser-sync'], function() {
	gulp.watch('source/pug/**/*.pug', ['pug']).on('change', browserSync.reload);
	gulp.watch('source/sass/**/*.sass', ['sass']).on('change', browserSync.reload);
	gulp.watch('source/js/**/*.js', ['js']).on('change', browserSync.reload);
});

//DEFAULT
gulp.task('default', ['watch']);