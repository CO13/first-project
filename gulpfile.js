'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    prefixer    = require('gulp-autoprefixer'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    gulpPostcss = require('gulp-postcss'),
    cssdeclsort = require('css-declaration-sorter'),
    cssbeautify = require('gulp-cssbeautify'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    jade        = require('gulp-jade'),
    plumber     = require('gulp-plumber'),
    rimraf      = require('rimraf'),
    browserSync = require("browser-sync"),
    reload      = browserSync.reload;

    var config = {
        server: {
            baseDir: "./"
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "Frontend_Devil"
	};

    var path = {
        build: {
            html:  '',
            js:    'assets/js/',
            css:   'assets/css/',
            img:   'assets/images/'
        },
        src: {
            html:  'templates/*.jade',
            js:    'assets/js/source/*.js',
            style: 'assets/css/source/*.scss',
            img:   'assets/images/source*.*'
        },
        watch: {
            html1:  'templates/*.jade',
            html2:  'templates/**/*.jade',
            js:    'assets/js/source/*.js',
            style: 'assets/css/source/*.scss',
            img:   'assets/images/source*.*'
        },
        clean: './'
    };

    gulp.task('html:build', function () {
        gulp.src(path.src.html)
            .pipe(jade({
                pretty: true
            }))
            .pipe(gulp.dest(path.build.html))
            .pipe(reload({stream: true}));
    });

    gulp.task('sass:build', function () {
        gulp.src(path.src.style)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
    });

    gulp.task('style:build', function () {
	    gulp.src(path.src.style)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(prefixer())
            //.pipe(cssmin()) //Сожмем
            //.pipe(cssdeclsort({order: 'smacss'}))

            .pipe(cssbeautify())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.css))
            .pipe(reload({stream: true}));
	});

    gulp.task('js:build', function () {
        gulp.src(path.src.js)
            .pipe(rigger())
            .pipe(sourcemaps.init())
            .pipe(uglify())
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.js))
            .pipe(reload({stream: true}));
    });

    gulp.task('image:build', function () {
        gulp.src(path.src.img)
            .pipe(imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img))
            .pipe(reload({stream: true}));
    });

    gulp.task('build', [
        'html:build',
        'style:build',
        'js:build',
        'image:build'
    ]);

    gulp.task('watch', function(){
        watch([path.watch.html1], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.html2], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            gulp.start('style:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
  	});

    gulp.task('webserver', function () {
        browserSync(config);
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

	gulp.task('default', ['build', 'webserver', 'watch']);
