const gulp        = require("gulp");
const quench      = require("./quench.js");
const uglify      = require("gulp-uglify");
const rename      = require("gulp-rename");
const debug       = require("gulp-debug");
const concat      = require("gulp-concat");
const gulpif      = require("gulp-if-else");
const sourcemaps  = require("gulp-sourcemaps");
const R           = require("ramda");


module.exports = function jsTask(taskName, userConfig){

  const env = quench.getEnv();

  const jsConfig = R.merge({

    uglify: {}

    /**
     * src    : path to this file
     * dest     : directory to write the file
     * watch    : rerun this files's task when these files change (can be an array of globs)
     * filename : *optional, name of output file (-generated will be appended)
     *            will concat all input files into this filename
    **/

  }, userConfig);

  const { src, dest, watch, filename } = jsConfig;

  if (!src || !dest ){
    quench.throwError(
      "Simple Js task requires an src and a dest!\n",
      `Given jsConfig: ${JSON.stringify(jsConfig, null, 2)}`
    );
  }


  // register the watcher for this task
  if (watch){
    quench.maybeWatch(taskName, watch);
  }

  // create a gulp task to compile this file
  gulp.task(taskName, function(){

    return gulp.src(src)
      .pipe(quench.drano())
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      .pipe(env.production( uglify(jsConfig.uglify) ))
      .pipe(gulpif(
        // concat the files if the filename is provided
        filename,
        () => concat(filename)
      ))
      .pipe(rename({
        suffix: "-generated"
      }))
      .pipe(sourcemaps.write("./"))
      // write to this file's info dest, or fallback to config.dest
      .pipe(gulp.dest(dest || jsConfig.dest))
      .pipe(debug({ title: `${taskName}: ` }));

  });

};
