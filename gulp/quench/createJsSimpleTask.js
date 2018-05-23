const gulp        = require("gulp");
const quench      = require("./quench.js");
const uglify      = require("gulp-uglify");
const rename      = require("gulp-rename");
const debug       = require("gulp-debug");
const sourcemaps  = require("gulp-sourcemaps");
const browserify  = require("browserify");
const babelify    = require("babelify");
const through2    = require("through2");
const R           = require("ramda");


module.exports = function jsTask(taskName, userConfig){

  const env = quench.getEnv();

  const jsConfig = R.merge({

    uglify: {},

    browserify: {
      debug: !env.production() // enable sourcemaps for development/local
    }

    /**
     * src    : path to this file
     * dest     : directory to write the file
     * watch    : rerun this files's task when these files change (can be an array of globs)
     **/

  }, userConfig);

  const { src, dest, watch } = jsConfig;

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
      .pipe(bundleJs(jsConfig.browserify))
      .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
      .pipe(env.production( uglify(jsConfig.uglify) ))
      .pipe(rename({
        suffix: "-generated"
      }))
      .pipe(sourcemaps.write("./"))
      // write to this file's info dest, or fallback to config.dest
      .pipe(gulp.dest(dest || jsConfig.dest))
      .pipe(debug({ title: `${taskName}: ` }));

  });

};


/**
  * Create a bundle of the files in the stream using browserify
  * http://stackoverflow.com/questions/30294003/how-to-avoid-code-duplication-using-browserify/30294762#30294762
  * @param  {Object} browserifyOptions Options to pass to browserify
  * @return {Stream} a gulp stream transform
  */
function bundleJs(browserifyOptions){

  return through2.obj(function (file, enc, callback){

    // https://github.com/substack/node-browserify/issues/1044#issuecomment-72384131
    const b = browserify(browserifyOptions || {}) // pass options
      .add(file.path) // this file
      .transform(babelify, { // run it through babel, for es6 transpiling
        presets: [ "env", "react" ],
        plugins: [ "transform-object-rest-spread", "transform-class-properties" ]
      });

    b.bundle(function(err, res){
      if (err){
        callback(err, null); // emit error so drano can do it's thang
      }
      else {
        file.contents = res; // assumes file.contents is a Buffer
        callback(null, file); // pass file along
      }
    });

  });
}
