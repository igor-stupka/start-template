const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const pug = require('gulp-pug');
const dom = require('gulp-dom');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const gs = require('gulp-selectors');
const critical = require('critical');
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;
const autoprefixer = require('gulp-autoprefixer');
const manifest = JSON.parse(fs.readFileSync('./dist/manifest.json'));

// BROWSER-SYNC
gulp.task('browser-sync', () => {
  browserSync({
    server: {
      baseDir: './dist'
    },
    notify: false
    // tunnel: 'igorstupka'  // Demonstration page: http://igorstupka.localtunnel.me
  });
});

// FORCE REBOOT
function bsReload(done) { browserSync.reload(); done(); }

// SASS
gulp.task('sass', () => gulp.src('source/sass/*.sass')
  .pipe(sass())
  .pipe(gulp.dest('dist/css'))
  .pipe(sass({ outputStyle: 'compressed' }))
  .pipe(concat('main.min.css'))
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
  .pipe(cleanCSS())
  .pipe(gulp.dest('dist/css'))
  .pipe(browserSync.stream())
);

// PUG
gulp.task('pug', () => gulp.src('source/pug/pages/**/*.pug')
  .pipe(pug({
    pretty: true
  }))
  .pipe(replace('__projectName__', manifest.name))
  .pipe(replace('__projectDescr__', manifest.decsription))
  .pipe(replace('__themeColor__', manifest.theme_color))
  .pipe(replace('__projectLang__', manifest.lang))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.reload({ stream: true }))
);

// JS
gulp.task('js', async () => {
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

// WATCH
gulp.task('watch', () => {
  gulp.watch('source/pug/**/*.pug', gulp.parallel('pug'));
  gulp.watch('source/sass/**/*.sass', gulp.parallel('sass'));
  gulp.watch('source/js/**/*.js', gulp.parallel('js'));
});

// DEFAULT
gulp.task('default', gulp.parallel('pug', 'sass', 'js', 'browser-sync', 'watch'));

// CLEAR IMAGES
gulp.task('clearImages', async () => del(['dist/img/**/*'], { force: true }));


// DOM
gulp.task('dom', () => gulp.src('./dist/*.html')
  .pipe(dom(function() {
    fillEmptyAttrs(this);
    return this;
  }))
  .pipe(gulp.dest('./dist/')));

// SELECTORS
gulp.task('selectors', () => gulp.src(['dist/**/*.min.css', 'dist/**/*.html'])
  .pipe(gs.run({
    css: ['css'], // run the css processor on  .css files
    html: ['html'] // run the html processor on .html files
  }, {
    classes: ['hidden', 'active', 'opened', 'lazyload', 'js-*'], // ignore these class selectors,
    ids: '*' // ignore all IDs
  }))
  .pipe(gulp.dest('dist/')));

// CRITICAL-CSS
gulp.task('critical', async () => {
  critical.generate({
    base: 'dist/',
    src: 'index.html',
    css: ['dist/css/main.min.css'],
    dimensions: [{
      width: 320,
      height: 480
    }, {
      width: 768,
      height: 1024
    }, {
      width: 1280,
      height: 960
    }],
    dest: 'index.html',
    inline: true,
    minify: true,
    extract: true
  });
});

// HTML-MINIFUER
gulp.task('htmlMin', () => gulp.src('dist/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('dist/')));

// BUILD
gulp.task('build', gulp.series(gulp.parallel('sass', 'pug', 'js'), 'dom', 'htmlMin', 'selectors', 'critical'));

// FILL EMPTY FIELDS BY PLACEHOLDER
function fillEmptyAttrs(scope) {
  const placeholder = '👋 Hi, don\'t forget to fill me up!';
  const descrEl = scope.querySelector('meta[name="description"]');

  // fill empty alt attribute in "img"
  scope.querySelectorAll('[alt]').forEach((img) => {
    if (img.getAttribute('alt') === '') img.setAttribute('alt', placeholder);
  });
  // fill empty href attribute in "a"
  [...scope.querySelectorAll('a[href]')].forEach((link) => {
    if (link.getAttribute('href') === '') link.setAttribute('href', '#');
    if (link.innerHTML.trim().length === 0) link.setAttribute('aria-label', placeholder);
  });
  // fill empty content attribute in "meta[name='description']"
  if (descrEl.getAttribute('content') === '') descrEl.setAttribute('content', placeholder);
}
