var gulp = require('gulp'),
  path = require('path'),
  APP_ROOT = path.join(__dirname, 'app'),
  less = require('gulp-less'),
  jade = require('gulp-jade'),
  st = require('st'),
  http = require('http'),
  livereload = require('gulp-livereload');

var paths = {
  lessFiles : APP_ROOT + '/less/**.less',
  jadeFiles : APP_ROOT + '/**/**.jade'
}

/*
 *  Start the static file server
 * */
gulp.task('server', (done) => {
  http.createServer(
    st({ 
      path: APP_ROOT,
      index: '/',
      cache: false 
    })).listen(8080, done);
});

/*
 *  Watch any change in the less files or jade templates
 * */
gulp.task('watch', ['server'], function(){
  livereload.listen({
    basePath: APP_ROOT
  });

  gulp.watch([paths.lessFiles], ['less'])
    .on('error', console.log);

  gulp.watch([paths.jadeFiles], ['build'])
    .on('error', console.log);
});

/*
 *  Copy the normalize.css dependency to the css directory
 * */
gulp.task('copy', function() {
  //normalize css
  return gulp.src(__dirname + "/node_modules/normalize.css/normalize.css")
  .pipe(gulp.dest(APP_ROOT + "/css"));
});

/*
 *  compile all less files to a single css file
 * */
gulp.task('less', function() {
  return gulp.src(APP_ROOT+"/less/app.less")
    .pipe(less())
    .on('error', console.log)
    .pipe(gulp.dest(APP_ROOT + "/css"))
    .pipe(livereload());
});

/*
 *  Builds the static HTML file from jade templates
 * */
gulp.task('build', function() {
  return gulp.src(APP_ROOT + path.sep + "index.jade")
    .pipe(jade())
    .pipe(gulp.dest(APP_ROOT))
    .pipe(livereload());
});

// `gulp.task()` defines task that can be run calling `gulp xyz` from the command line
// The `default` task gets called when no task name is provided to Gulp
gulp.task('default', ['copy','less','watch']);
gulp.task('html', ['build']);
