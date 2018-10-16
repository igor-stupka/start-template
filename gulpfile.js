	var gulp           = require('gulp'),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		autoprefixer   = require('gulp-autoprefixer'),
		bourbon        = require('node-bourbon'),
		notify         = require("gulp-notify"),
		pug 		   = require('gulp-pug');

//BROWSER-SYNC
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'dist'
		},
		notify: false
	});
});

//SASS
gulp.task('sass', function() {
	return gulp.src('source/sass/*.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
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
  .pipe(gulp.dest('dist/'));
});

//JS
gulp.task('js', function() {
	return gulp.src('source/js/**/*.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

//LIBS
gulp.task('libs', function() {
	return gulp.src([
		'source/libs/jquery/jquery-1.11.1.min.js',
		'source/libs/swiper/js/swiper.min.js',
		'source/libs/MagnificPopup/jquery.magnific-popup.min.js',
			])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});

//WATCH
gulp.task('watch', ['pug', 'sass', 'js', 'libs', 'browser-sync'], function() {
	gulp.watch('source/pug/**/*.pug', ['pug']).on('change', browserSync.reload);
	gulp.watch('source/sass/**/*.sass', ['sass']).on('change', browserSync.reload);
	gulp.watch('source/js/**/*.js', ['js']).on('change', browserSync.reload);
});

//DEFAULT
gulp.task('default', ['watch']);