'use strict';

var gulp        = require('gulp'),
    watch       = require('gulp-watch'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    sorter      = require('css-declaration-sorter'),
    concat      = require('gulp-concat'),
    imagemin    = require('gulp-imagemin'),
    browserSync = require("browser-sync"),
    jade        = require('gulp-jade'),
    reload      = browserSync.reload;

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
              'assets/css/source/*.scss',
              'assets/css/source/**/*.scss'
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


    //gulp.task('default', ['build', 'webserver', 'watch']);
