var gulp           = require('gulp'),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	sourcemaps     = require('gulp-sourcemaps'),
	babel		   = require('gulp-babel'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify-es').default,
	cleanCSS       = require('gulp-clean-css'),
	wait           = require('gulp-wait'),
	rename         = require('gulp-rename'),
	autoprefixer   = require('gulp-autoprefixer'),
	bourbon        = require('node-bourbon'),
	notify         = require('gulp-notify'),
	pug 		   = require('gulp-pug'),
	htmlmin		   = require('gulp-htmlmin'),
	imagemin	   = require('gulp-imagemin'),
	critical	   = require('critical');
 

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
		.pipe(wait(500))
		.pipe(sass({
			includePaths: bourbon.includePaths
		}))
		.on("error", notify.onError({
			message: "SASS: <%= error.message %>",
			title: "Error running something"
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.reload({stream: true}))
});

//PUG
gulp.task('pug',  function() {
	return gulp.src('source/pug/pages/**/*.pug')
		.pipe(wait(500))
		.pipe(pug({
			pretty: true
		}))
		.on("error", notify.onError({
			message: "PUG: <%= error.message %>",
			title: "Error running something"
		}))
		.pipe(gulp.dest('dist/'));
});

//JS
gulp.task('js', function() {
	gulp.src('source/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.on("error", notify.onError({
			message: "JS: <%= error.message %>",
			title: "Error running something"
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
});


//WATCH
gulp.task('watch', ['pug', 'sass', 'js', 'browser-sync'], function() {
	gulp.watch('source/pug/**/*.pug', ['pug']).on('change', browserSync.reload);
	gulp.watch('source/sass/**/*.sass', ['sass']).on('change', browserSync.reload);
	gulp.watch('source/js/**/*.js', ['js']).on('change', browserSync.reload);
});

//DEFAULT
gulp.task('default', ['watch']);


//HTML-MINIFUER
gulp.task('htmlMin', ['pug'], () => {
  return gulp.src('dist/*.html')
	.pipe(wait(200))
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('dist'));
});

//IMAGE-MIN
gulp.task('imageMin', () => {
	gulp.src('dist/img/**/*')
	.pipe(imagemin([
		imagemin.gifsicle({interlaced: true}),
		imagemin.jpegtran({progressive: true}),
		imagemin.optipng({optimizationLevel: 5}),
		imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest('dist/img/'))
});

//CRITICAL-CSS
gulp.task('critical', ['pug', 'htmlMin'], function (cb) {
  critical.generate({
    base: './dist',
    src: '/index.html',
    css: ['dist/css/main.min.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024 
    },{
      width: 1280,
      height: 960
    }],
    dest: 'index.html',
    inline: true,
    minify: false,
    extract: false
  });
});

//BUILD
gulp.task('build', ['pug', 'htmlMin', 'imageMin', 'critical']);
