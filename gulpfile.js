'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    rigger      = require('gulp-rigger'),
    sorter      = require('css-declaration-sorter'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    browserSync = require("browser-sync"),
    jade        = require('gulp-jade'),
    plumber     = require('gulp-plumber'),
    reload      = browserSync.reload;

    var config = {
	      server: {
	          baseDir: ""
	      },
	      tunnel: true,
	      host: 'localhost',
	      port: 9000,
	      logPrefix: "Frontend_Devil"
	  };

    var path = {
        build: { //Тут мы укажем куда складывать готовые после сборки файлы
            html:  '',
            js:    'assets/js/',
            css:   'assets/css/',
            img:   'assets/images/'
        },
        src: { //Пути откуда брать исходники
            html:  'templates/*.jade',
            js: [
                'assets/js/source/*.js'
            ],
            style: [
              'assets/css/source/*.scss'
            ],
            img:   'assets/images/source*.*'
        },
        watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
            html:  'templates/*.jade',
            js:    'assets/js/source/*.js',
            style: 'assets/style/**/**/*.*',
            img:   'assets/images/source*.*'
        },
        clean: ''
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
	    gulp.src(path.src.style) //Выберем наш main.scss
	          .pipe(sourcemaps.init()) //То же самое что и с js
	          .pipe(sass()) //Скомпилируем
	          //.pipe(prefixer()) //Добавим вендорные префиксы
	          //.pipe(cssmin()) //Сожмем
	          .pipe(sourcemaps.write())
	          .pipe(gulp.dest(path.build.css)) //И в build
	          .pipe(reload({stream: true}));
	});

    gulp.task('build', [
        'html:build',
        'style:build',
    ]);

    gulp.task('watch', function(){
      watch([path.watch.html], function(event, cb) {
          gulp.start('html:build');
      });
      watch([path.watch.style], function(event, cb) {
          gulp.start('style:build');
      });
  	});

  	gulp.task('webserver', function () {
	    browserSync(config);
	});

	gulp.task('default', ['build', 'webserver', 'watch']);
    //gulp.task('default', ['build', 'webserver', 'watch']);
