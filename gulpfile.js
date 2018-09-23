	var gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		svgmin 		   = require('gulp-svgmin'),
		pngquant       = require('imagemin-pngquant'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		fileinclude    = require('gulp-file-include'),
		gulpRemoveHtml = require('gulp-remove-html'),
		bourbon        = require('node-bourbon'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		pug 		   = require('gulp-pug');


gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('sass', ['headersass'], function() {
	return gulp.src('app/scss/**/*.scss')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(gulp.dest('app/css'))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('pug', function() {
  return gulp.src('app/pug/index.pug')
  .pipe(pug({
	pretty: true
  }))
  .pipe(gulp.dest('app/'));
});

gulp.task('headersass', function() {
	return gulp.src('app/header.scss')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(gulp.dest('app'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('libs', function() {
	return gulp.src([
		'app/libs/jquery/jquery-1.11.1.min.js',
		'app/libs/swiper/js/swiper.min.js',
		'app/libs/MagnificPopup/jquery.magnific-popup.min.js',
			])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('watch', ['pug', 'sass', 'libs', 'browser-sync'], function() {
	gulp.watch('app/**/*.pug', ['pug']);
	gulp.watch('app/header.scss', ['headersass']);
	gulp.watch('app/scss/**/*.scss', ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('buildhtml', function() {
  gulp.src(['app/*.html'])
	.pipe(fileinclude({
	  prefix: '@@'
	}))
	.pipe(gulpRemoveHtml())
	.pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('dist/img')); 
});

gulp.task('svgmin', function () {
	return gulp.src('app/img/**/*.svg')
		.pipe(svgmin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('removedist', function() { return del.sync('dist'); });

gulp.task('build', ['removedist', 'buildhtml', 'svgmin', 'imagemin', 'sass', 'libs'], function() {

	var buildCss = gulp.src([
		'app/css/main.min.css',
		'app/css/libs.min.css'
		]).pipe(gulp.dest('dist/css'));

	var buildFiles = gulp.src([
		'app/.htaccess'
	]).pipe(gulp.dest('dist'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildDocs = gulp.src('app/docs/**/*')
	.pipe(gulp.dest('dist/docs'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'));

	 var buildXml = gulp.src('app/*.xml')
		.pipe(gulp.dest('dist'));

	var buildPhp = gulp.src('app/*.php')
		.pipe(gulp.dest('dist/'));
});

gulp.task('deploy', function() {

	var conn = ftp.create({
		host:      'igorstupka.zzz.com.ua',
		user:      'igor-stop',
		password:  'dtqcxcgirn1A',
		parallel:  10,
		log: gutil.log
	});

	var globs = [
	'dist/**',
	'dist/.htaccess',
	];
	return gulp.src(globs, {buffer: false})
	.pipe(conn.dest('/igorstupka.zzz.com.ua'));

});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['watch']);