var gulp           = require('gulp'),
	sass           = require('gulp-sass'),
	browserSync    = require('browser-sync'),
	sourcemaps     = require('gulp-sourcemaps'),
	babel		   = require('gulp-babel'),
	concat         = require('gulp-concat'),
	uglify         = require('gulp-uglify-es').default,
	cleanCSS       = require('gulp-clean-css'),
	autoprefixer   = require('gulp-autoprefixer'),
	pug 		   = require('gulp-pug'),
	htmlmin		   = require('gulp-htmlmin'),
	imagemin	   = require('gulp-imagemin'),
	critical	   = require('critical'),
	dom			   = require('gulp-dom');
 

//BROWSER-SYNC
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: './dist'
		},
		notify: false
	});
});

//SASS
gulp.task('sass', function() {
	return gulp.src('source/sass/*.sass')
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(concat('main.min.css'))
		.pipe(autoprefixer({
			grid: true,
			overrideBrowserlist: ['last 10 versions']
		}))
		.pipe(gulp.dest('dist/css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

//PUG
gulp.task('pug',  function() {
	return gulp.src('source/pug/pages/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({ stream: true }))
});

//JS
gulp.task('js', function() {
	gulp.src('source/js/**/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/js'))
		.pipe(uglify())
		.pipe(concat('main.min.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
		.pipe(browserSync.reload({ stream: true }));
});


//WATCH
gulp.task('watch', function() {
	gulp.watch('source/pug/**/*.pug',  gulp.parallel('pug'));
	gulp.watch('source/sass/**/*.sass',  gulp.parallel('sass'));
	gulp.watch('source/js/**/*.js',  gulp.parallel('js'));
});

//DEFAULT
gulp.task('default', gulp.parallel('pug', 'sass', 'js', 'browser-sync', 'watch'));


//HTML-MINIFUER
gulp.task('htmlMin', () => {
  return gulp.src('dist/*.html')
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest('dist'));
});

//IMAGE-MIN
gulp.task('imageMin', async () => {
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

//DOM
gulp.task('dom', function() {
    return gulp.src('./dist/*.html')
        .pipe(dom(function() {
			fillEmptyAttrs(this);
            return this;
        }))
        .pipe(gulp.dest('./dist/'));
});

//CRITICAL-CSS
gulp.task('critical', async () => {
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
gulp.task('build', gulp.series(gulp.parallel('sass', 'pug'), 'dom', 'htmlMin', 'critical', 'imageMin'));


function fillEmptyAttrs(scope) {
	const sorryText = 'Sorry, I forgot to set this value ¯\\_(ツ)_/¯';
	
	// fill empty alt attribute in "img"
	scope.querySelectorAll('[alt]').forEach(img => { 
		if (img.getAttribute('alt') === '') img.setAttribute('alt', sorryText);
	});
	// fill empty href attribute in "a"
	[...scope.querySelectorAll('a[href]')].forEach(link => { 
		if (link.getAttribute('href') === '') link.setAttribute('href', '#');
		if (link.innerHTML.trim().length === 0) link.setAttribute('aria-label', sorryText)
	});
	// fill empty content attribute in "meta[name='description']"
	const descrEl = scope.querySelector('meta[name="description"]');
	if (descrEl.getAttribute('content') === '') descrEl.setAttribute('content', sorryText);
	
	
}
