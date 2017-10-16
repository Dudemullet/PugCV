var gulp = require('gulp'),
  path = require('path'),
  APP_ROOT = path.join(__dirname, 'app'),
  less = require('gulp-less'),
  jade = require('gulp-jade');

var paths = {
  lessFiles : APP_ROOT + '/less/**.less',
  jadeFiles : APP_ROOT + '/**/**.jade'
}

var startExpress = function() {
  var server = require('./server.js');
  server({
    dir:APP_ROOT,
    port: 8080
  });
}

var startLiveReload = function() {
  var lr = require('tiny-lr')();
  lr.listen(35729);
  return lr;
}

var notifyLivereload = function(event, lr) {
  var fileName = require('path').relative(APP_ROOT, event.path);
  lr.changed({
    body: {
      files: [fileName]
    }
  });
}

gulp.task('watch', function(){
  startExpress();
  var lr = startLiveReload();

  gulp.watch(paths.lessFiles,['less']);
  gulp.watch([paths.jadeFiles, paths.lessFiles], ['build'])
    .on('error', console.log);
})

gulp.task('copy', function() {
  //normalize css
  return gulp.src(__dirname + "/node_modules/normalize.css/normalize.css")
  .pipe(gulp.dest(APP_ROOT + "/css"));
});

gulp.task('less', function() {
  return gulp.src(APP_ROOT+"/less/app.less")
    .pipe(less())
    .on('error', console.log)
    .pipe(gulp.dest(APP_ROOT + "/css"));
});

gulp.task('build', function() {
  return gulp.src(APP_ROOT + path.sep + "index.jade")
    .pipe(jade())
    .pipe(gulp.dest(APP_ROOT));
});

// `gulp.task()` defines task that can be run calling `gulp xyz` from the command line
// The `default` task gets called when no task name is provided to Gulp
gulp.task('default', ['copy','less','watch']);
gulp.task('html', ['build']);
