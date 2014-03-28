'use strict';

/* Variables */
var project = {
  css: {
    src: {
      base: './assets/stylesheets/',
      files: ['./assets/stylesheets/**/*.less']
    },
    dest: './public/stylesheets/'
  },
  js: {
    src: {
      base: './assets/javascripts/',
      files: ['./assets/javascripts/**/*.js']
    },
    dest: './public/javascripts/'
  }
};

/* Dependencies */
var gulp = require('gulp'),

  /* Stylesheets */
  less = require('gulp-less'),
  autoprefixer = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),

  /* Javascript */
  uglify = require('gulp-uglify');

/* Tasks */
gulp.task('watch', ['build'], function() {
  gulp.watch(project.css.src.files, ['css']);
  gulp.watch(project.js.src.files, ['js']);
});

gulp.task('css', function() {
  gulp.src(project.css.src.files, { base: project.css.src.base })
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(gulp.dest(project.css.dest));
});

gulp.task('js', function() {
  gulp.src(project.js.src.files, { base: project.js.src.base })
    .pipe(uglify())
    .pipe(gulp.dest(project.js.dest));
});

gulp.task('build', ['css', 'js']);
gulp.task('default', ['watch']);
