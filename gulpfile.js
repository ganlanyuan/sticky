var config = {
  sassLang: 'libsass',
  sourcemaps: '../sourcemaps',
  server: {
    base: '.',
    hostname: '0.0.0.0',
    keepalive: true,
    stdio: 'ignore',
  },
  browserSync: {
    proxy: '0.0.0.0:8000',
    open: true,
    notify: false
  },
  libsass_options: {
    outputStyle: 'compressed', 
    precision: 7
  },
  rubysass_options: {
    style: 'compressed', 
    precision: 7,
    'default-encoding': 'utf-8',
    sourcemap: true
  },
  modernizr_options: {
    "minify": true,
    "options": [
      "setClasses"
    ],
    "tests": [
      "touchevents"
    ],
  },
  
  // styles
  sass: {
    src: ['src/*.scss', 'tests/scss/*.scss'],
    dest: ['dist', 'tests/css'],
  },
  
  // scripts
  js: {
    src:[[
      "bower_components/requestAnimationFrame/requestAnimationFrame.js",
      "bower_components/Units/Length.js",
      "bower_components/go-native/src/gn/base.js",
      "bower_components/go-native/src/gn/optimizedResize.js",
      "bower_components/go-native/src/gn/extend.js",
      "bower_components/go-native/src/gn/DOM.ready.js",
      "bower_components/go-native/src/gn/isNodeList.js",
      "bower_components/go-native/src/gn/wrap.js",
      "bower_components/go-native/src/gn/unwrap.js",

      "src/sticky.native.js",
    ], [
      "src/sticky.native.js",
    ],[
      "bower_components/go-native/src/es5/array/isArray.js",
      "bower_components/go-native/src/es5/array/forEach.js",
      "bower_components/go-native/src/ie8/addEventListener.js",
      "bower_components/go-native/src/ie8/getComputedStyle.js",
      "bower_components/go-native/src/ie8/innerWidth.js",
      "bower_components/go-native/src/ie8/innerHeight.js",
    ]],
    name: [
      'sticky.js', 
      'sticky.native.js', 
      'sticky.ie8.js'
    ],
    dest: 'dist',
    options: {
      // mangle: false,
      output: {
        quote_keys: true,
      },
      compress: {
        properties: false,
      }
    }
  },

  // watch
  watch: {
    php: '**/*.php',
    html: '**/*.html'
  },
};

var gulp = require('gulp');
var php = require('gulp-connect-php');
var libsass = require('gulp-sass');
var rubysass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var modernizr = require('gulp-modernizr');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var svgstore = require('gulp-svgstore');
var path = require('path');
var svgmin = require('gulp-svgmin');
var svg2png = require('gulp-svg2png');
var colorize = require('gulp-colorize-svgs');
var inject = require('gulp-inject');
var browserSync = require('browser-sync').create();
var rename = require('gulp-rename');
var mergeStream = require('merge-stream');

function errorlog (error) {  
  console.error.bind(error);  
  this.emit('end');  
}  

// sass
gulp.task('sass', function () {  
  var tasks = [], 
      srcs = config.sass.src,
      dests = config.sass.dest;

  if (config.sassLang === 'libsass') {
    for (var i = 0; i < srcs.length; i++) {
      tasks.push(
        gulp.src(srcs[i])  
            .pipe(sourcemaps.init())
            .pipe(libsass(config.libsass_options).on('error', libsass.logError))
            .pipe(sourcemaps.write(config.sourcemaps))
            .pipe(gulp.dest(dests[i]))
      );
    }
  } else {
    for (var i = 0; i < srcs.length; i++) {
      tasks.push(
        rubysass(srcs[i], config.rubysass_options)  
            .pipe(sourcemaps.init())
            .on('error', rubysass.logError)  
            .pipe(sourcemaps.write(config.sourcemaps))
            .pipe(gulp.dest(dests[i]))
      );
    }
  }

  return mergeStream(tasks)
        .pipe(browserSync.stream());
});

// JS Task  
gulp.task('js', function () {  
  var tasks = [], 
      srcs = config.js.src,
      names = config.js.name;

  for (var i = 0; i < srcs.length; i++) {
    tasks.push(
      gulp.src(srcs[i])
          .pipe(sourcemaps.init())
          .pipe(concat(names[i]))
          .on('error', errorlog)  
          .pipe(gulp.dest(config.js.dest))
          .pipe(uglify(config.js.options))
          .pipe(sourcemaps.write('../' + config.sourcemaps))
          .pipe(gulp.dest(config.js.dest + '/min'))
    );
  }

  return mergeStream(tasks)
        .pipe(browserSync.stream());
}); 

// Server
gulp.task('server', function () {
  php.server(config.server);
});
gulp.task('sync', ['server'], function() {
  browserSync.init(config.browserSync);
});

// watch
gulp.task('watch', function () {
  gulp.watch(config.sass.src, ['sass']);
  gulp.watch(config.js.src, ['js']);
  gulp.watch(config.watch.php).on('change', browserSync.reload);
  gulp.watch(config.watch.html).on('change', browserSync.reload);
})

// Default Task
gulp.task('default', [
  // 'sass', 
  // 'js', 
  'sync', 
  'watch',
]);  