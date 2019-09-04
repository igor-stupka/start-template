const   gulp                = require('gulp'),
		sass                = require('gulp-sass'),
		browserSync         = require('browser-sync'),
		sourcemaps          = require('gulp-sourcemaps'),
		babel		        = require('gulp-babel'),
		concat              = require('gulp-concat'),
		uglify              = require('gulp-uglify-es').default,
		cleanCSS            = require('gulp-clean-css'),
		autoprefixer        = require('gulp-autoprefixer'),
		pug 		        = require('gulp-pug'),
		htmlmin		        = require('gulp-htmlmin'),
		imagemin	        = require('gulp-imagemin'),
		imageminPngquant    = require('imagemin-pngquant'),
		imageminMozjpeg     = require('imagemin-mozjpeg'),
		imageminZopfli      = require('imagemin-zopfli'),
		del                 = require('del'),
		critical	        = require('critical'),
		dom			        = require('gulp-dom'),
		gs		            = require('gulp-selectors');

//BROWSER-SYNC
	gulp.task('browser-sync', function() {
		browserSync({
		server: {
			baseDir: './dist'
		},
		notify: false,
		// tunnel: 'igorstupka'  // Demonstration page: http://igorstupka.localtunnel.me
	});
});

//FORCE REBOOT
function bsReload(done) { browserSync.reload(); done(); };

//SASS
gulp.task('sass', function() {
	return gulp.src('source/sass/*.sass')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(concat('main.min.css'))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
		.pipe(browserSync.stream());
});

//PUG
gulp.task('pug', function() {
	return gulp.src('source/pug/pages/**/*.pug')
		.pipe(pug({
			pretty: true
		}))
		.pipe(gulp.dest('dist/'))
		.pipe(browserSync.reload({ stream: true }))
});

//JS
gulp.task('js', async function() {
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
	gulp.watch('source/img/**/*', gulp.parallel('img'));
});

//DEFAULT
gulp.task('default', gulp.parallel('pug', 'sass', 'js', 'browser-sync', 'watch'));


//IMAGE-MIN
gulp.task('imageMin', function() {
	return gulp.src(['source/img/**/*'])
		.pipe(imagemin([
			// PNG
			imageminPngquant({
				speed: 1,
				quality: [0.95, 1] //lossy settings
			}),
			imageminZopfli({
				more: true
				// iterations: 50 // very slow but more effective
			}),
			// GIF
			imagemin.gifsicle({
			    interlaced: true,
			    optimizationLevel: 3
			}),
			// SVG
			imagemin.svgo({
				plugins: [{
					removeViewBox: false
				}]
			}),
			//jpg lossless
			imagemin.jpegtran({
				progressive: true
			}),
			//jpg very light lossy, use vs jpegtran
			imageminMozjpeg({
				quality: 90
			})
		]))
		.pipe(gulp.dest('dist/img'));
});

// CLEAR IMAGES
gulp.task('clearImages', async () => {
	return del(['dist/img/**/*']), { force: true }
});

// IMG
gulp.task('img', gulp.series('clearImages', 'imageMin', bsReload));

//DOM
gulp.task('dom',  function() {
	return gulp.src('./dist/*.html')
		.pipe(dom(function() {
			fillEmptyAttrs(this);
			leaveSignature(this, 'body');
			return this;
		}))
		.pipe(gulp.dest('./dist/'));
});

// SELECTORS
gulp.task('selectors', function() {
	return gulp.src(['dist/**/*.min.css', 'dist/**/*.html'])
		.pipe(gs.run({
			'css':  ['css'],                // run the css processor on  .css files
			'html': ['html']                // run the html processor on .html files
		}, {
			classes: ['hidden', 'active', 'opened'],   // ignore these class selectors,
			ids: '*'                         // ignore all IDs
		}))
		.pipe(gulp.dest('dist/'));
});

//CRITICAL-CSS
gulp.task('critical', async () => {
	critical.generate({
		base: 'dist/',
		src: 'index.html',
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
		minify: true,
		extract: true
	});
});



//HTML-MINIFUER
gulp.task('htmlMin', () => {
	return gulp.src('dist/*.html')
		.pipe(htmlmin({ collapseWhitespace: true }))
		.pipe(gulp.dest('dist/'));
});

//BUILD
gulp.task('build', gulp.series(gulp.parallel('sass', 'pug', 'js'), 'dom', 'htmlMin', 'selectors', 'critical', 'img'));

// FILL EMPTY FIELDS BY PLACEHOLDER
function fillEmptyAttrs(scope) {
	const placeholder = '👋 Hi, don\'t forget to fill me up!';
	const descrEl = scope.querySelector('meta[name="description"]');

	// fill empty alt attribute in "img"
	scope.querySelectorAll('[alt]').forEach(img => {
		if (img.getAttribute('alt') === '') img.setAttribute('alt', placeholder);
	});
	// fill empty href attribute in "a"
	[...scope.querySelectorAll('a[href]')].forEach(link => {
		if (link.getAttribute('href') === '') link.setAttribute('href', '#');
		if (link.innerHTML.trim().length === 0) link.setAttribute('aria-label', placeholder)
	});
	// fill empty content attribute in "meta[name='description']"
	if (descrEl.getAttribute('content') === '') descrEl.setAttribute('content', placeholder);
}

// LEAVE PERSONAL SIGNATURE
function leaveSignature(scope, element) {
	const signature = `
			       ,
			     0/
			    /7,
			  .'(
			'^ / >
			  / < 
			  \` 
		FRONTEND BY STUPKA IGOR

`;
	scope.querySelector(element).appendChild(scope.createComment(signature))
}