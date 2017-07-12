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

    var config = {
        server: {
            baseDir: ""
        },
        tunnel: true,
        host: 'localhost',
        port: 9000,
        logPrefix: "India Help"
    };


    gulp.task('html:build', function () {
        gulp.src(path.src.html) //Выберем файлы по нужному пути
            .pipe(plumber())
            .pipe(jade()) //Прогоним через rigger
            .pipe(gulp.dest(path.build.html)) //Выплюнем их в папку build
            .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
    });

    gulp.task('js:build', function () {
        gulp.src(path.src.js) //Найдем наш main файл
          .pipe(plumber())
          .pipe(rigger()) //Прогоним через rigger
            .pipe(concat('main.js'))
            .pipe(sourcemaps.init()) //Инициализируем sourcemap
            .pipe(gulp.dest("temp/"))
            .pipe(uglify()) //Сожмем наш js
            .pipe(sourcemaps.write()) //Пропишем карты
            .pipe(gulp.dest(path.build.js)) //Выплюнем готовый файл в build
            .pipe(reload({stream: true})); //И перезагрузим сервер
    });

    gulp.task('style:build', function () {
        gulp.src(path.src.style) //Выберем наш main.scss
          .pipe(plumber())
          .pipe(sourcemaps.init()) //То же самое что и с js
            .pipe(concat("main.scss"))
            .pipe(prefixer()) //Добавим вендорные префиксы
            .pipe(gulp.dest("temp/")) // сохраняем полученный файл в нужной директории
            .pipe(sass('temp/main.scss'))
            .pipe(cssmin()) //Сожмем
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.build.css)) //И в build
            .pipe(reload({stream: true}));
    });

    gulp.task('image:build', function () {
        gulp.src(path.src.img) //Выберем наши картинки
            .pipe(imagemin({ //Сожмем их
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                use: [pngquant()],
                interlaced: true
            }))
            .pipe(gulp.dest(path.build.img)) //И бросим в build
            .pipe(reload({stream: true}));
    });

    gulp.task('fonts:build', function() {
        gulp.src(path.src.fonts)
            .pipe(gulp.dest(path.build.fonts))
    });

    gulp.task('build', [
        'html:build',
        'js:build',
        'style:build'
    ]);

    gulp.task('pre-build', [
        'fonts:build',
        'sprite',
        'image:build'
    ]);

    gulp.task('watch', function(){
        watch([path.watch.html], function(event, cb) {
            gulp.start('html:build');
        });
        watch([path.watch.style], function(event, cb) {
            gulp.start('style:build');
        });
        watch([path.watch.js], function(event, cb) {
            gulp.start('js:build');
        });
        watch([path.watch.img], function(event, cb) {
            gulp.start('image:build');
        });
        watch([path.watch.fonts], function(event, cb) {
            gulp.start('fonts:build');
        });
    });

    gulp.task('webserver', function () {
        browserSync(config);
    });

    gulp.task('clean', function (cb) {
        rimraf(path.clean, cb);
    });

    gulp.task('sprite', function() {
      var spriteData =
        gulp.src('./src/img/sprite/*.*') // путь, откуда берем картинки для спрайта
          .pipe(sprite({
            imgName: 'sprite.png',
            cssName: '5_sprite.css',
          }));

      spriteData.img.pipe(gulp.dest('./src/img/'));  // путь, куда сохраняем картинку
      spriteData.css.pipe(gulp.dest('./src/style/1_main-styles'));  // путь, куда сохраняем стили
    });

    gulp.task('default', ['build', 'webserver', 'watch']);
