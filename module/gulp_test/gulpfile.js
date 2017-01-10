(function(){
    'use strict';
    var gulp = require('gulp'),
        connect = require('gulp-connect'),
        open = require('gulp-open'),
        less = require('gulp-less'),
        jade = require('gulp-jade'),
        rename = require('gulp-rename'),
        header = require('gulp-header'),
        md5 = require('gulp-rev'), 
        path = require('path'),
        uglify = require('gulp-uglify'),
        sourcemaps = require('gulp-sourcemaps'),
        minifyCSS = require('gulp-minify-css'),
        tap = require('gulp-tap'),
        concat = require('gulp-concat'),
        jshint = require('gulp-jshint'),
        stylish = require('jshint-stylish'),
        fs = require('fs'),
        paths = {
            root: './',
            build: {
                root: 'build/',
                styles: 'build/css/',
                scripts: 'build/js/'
            },
            custom: {
                root: 'custom/',
                styles: 'custom/css/',
                scripts: 'custom/js/',
            },
            dist: {
                root: 'dist/',
                styles: 'dist/css/',
                scripts: 'dist/js/'
            },
            ks: {
                ios : {
                    root: 'kitchen-sink-ios/',
                    css: 'kitchen-sink-ios/css/',
                    jade: 'kitchen-sink-ios/jade/*.jade',
                    less: 'kitchen-sink-ios/less/*.less',
                },
                material : {
                    root: 'kitchen-sink-material/',
                    css: 'kitchen-sink-material/css/',
                    jade: 'kitchen-sink-material/jade/*.jade',
                    less: 'kitchen-sink-material/less/*.less',
                }
            },
            source: {
                root: 'src/',
                styles: {
                    ios: 'src/less/ios/',
                    material: 'src/less/material/'
                },
                scripts: 'src/js/*.js'
            },
            examples: {
                root: 'examples/',
                list: ['inline-pages', 'split-view', 'split-view-panel', 'tab-bar', 'template7-pages']
            }
        };
        
    /* ==================================================================
    Build Framework7
    ================================================================== */
    //合并js
    gulp.task('concatJs', function (cb) {
        gulp.src('./src/js/*.js')
            .pipe(concat('lib.js')) //单纯合并
            .pipe(gulp.dest('./build/js/'))
            .pipe(uglify())   //压缩代码 
            .pipe(rename(function(path) { //重新命名
                    path.basename = path.basename + '.min';
             }))      
            .pipe(gulp.dest('./build/js/min/'))   
            .on('end',function(){          //执行结束输出
               cb();
            })
    });   

    //合并css
    gulp.task('concatCss', function (cb) {
        gulp.src('./src/css/*.css')
            .pipe(concat('a.css'))
            .pipe(gulp.dest('./build/css/'))
            .pipe(minifyCSS())     //压缩输出
            .pipe(md5())           //md5输出
            .pipe(gulp.dest('./build/css/min/'))
            .on('end',function(){          //执行结束输出
               cb();
            }) 
    }); 

    
    gulp.task('baoer-uglify', function (cb) {
        gulp.src(f7.jsFiles)
            .pipe(concat('baoer.min.js'))  //简单合并文件，并生成文件名
            .pipe(uglify())                //压缩文件
            .pipe(gulp.dest('tuy'))        //输出到tuy文件夹下
            .on('end',function(){          //执行结束输出
               cb();
            })
    });   
    gulp.task('demo-jade', function (cb) {
        gulp.src('jade/*.jade')
            .pipe(jade({
                pretty: true,
                locals: {
                    stylesheetFilename: 'framework7.ios',
                    stylesheetColorsFilename: 'framework7.ios.colors',
                    scriptFilename: 'framework7',
                }
            }))
            .pipe(gulp.dest('html/'));
        cb();
    });
})();