// Load all gulp plugins
var gulp = require('gulp'),
	plugins = require('gulp-load-plugins')({
		pattern: '*'
	});

//Sass Compilation
var scssFiles = './scss/main.scss',
	scssDest = './css';

gulp.task('scss', function() {
	gulp.src(scssFiles)
		.pipe(plugins.plumber())
		.pipe(plugins.sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest(scssDest))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});

//Css Minification and concat
var cssFiles = './css/*.css',
	cssDest = './dist/css';

gulp.task('minify-css', function() {
	return gulp.src(cssFiles)
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(plugins.concat('styles.css'))
		.pipe(gulp.dest(cssDest))
		.pipe(plugins.cleanCss())
		.pipe(plugins.rename({
			suffix: '.min'
		}))
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(cssDest))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});

// JS Concat and uglify
var jsFiles = './js/*.js',
	jsDest = './dist/scripts';

gulp.task('scripts', function() {
	return gulp.src(jsFiles)
		.pipe(plugins.plumber())
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('scripts.js'))
		.pipe(gulp.dest(jsDest))
		.pipe(plugins.rename('scripts.min.js'))
		.pipe(plugins.uglify())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest(jsDest))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});

// Image Minification
var imgFiles = './img/**/*',
	imgDest = './dist/scripts';

gulp.task('imagemin', function() {
	gulp.src(imgFiles)
		.pipe(plugins.plumber())
		.pipe(plugins.imagemin())
		.pipe(gulp.dest(imgDest))
		.pipe(plugins.browserSync.reload({
			stream: true
		}));
});

// Browser sync
gulp.task('serve', function() {
	plugins.browserSync.init({
		server: {
			baseDir: './'
		},
		online: true
	});

	gulp.watch('./scss/**/*.scss', ['scss']);
	gulp.watch('./css/*.css', ['minify-css']);
	gulp.watch('./js/*.js', ['scripts']);
	gulp.watch('./dist/js/*.js').on('change', plugins.browserSync.reload);
	gulp.watch('./dist/css/*.css').on('change', plugins.browserSync.reload);
	gulp.watch('./**/*.html').on('change', plugins.browserSync.reload);
});

// RUN
gulp.task('default', ['scss', 'minify-css', 'scripts', 'imagemin', 'serve']);
