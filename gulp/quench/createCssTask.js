const gulp         = require("gulp");
const quench       = require("./quench.js");
const sass         = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const rename       = require("gulp-rename");
const debug        = require("gulp-debug");
const header       = require("gulp-header");
const concat       = require("gulp-concat");
const gulpif       = require("gulp-if-else");
const sourcemaps   = require("gulp-sourcemaps");
const R            = require("ramda");


module.exports = function cssTask(taskName, userConfig) {

  const env = quench.getEnv();

  // css settings
  const cssConfig = R.mergeDeepRight({

    sass: {
      outputStyle: env.production() ? "compressed" : "expanded"
    },

    autoprefixer: {
      browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1", "ie >= 9"],
      grid: true
    }

    /**
     * src      : glob of css files to compile
     * dest     : destination folder
     * filename : *optional, name of output file (-generated will be appended)
     *            will concat all input files into this filename
     * watch    : *optional, files to watch that will trigger a rerun when changed
     *            defaults to src
     */

  }, userConfig);


  const { src, dest, filename, watch, base } = cssConfig;

  if (!src || !dest){
    quench.throwError(
      "Css task requires src and dest!\n",
      `Was given ${JSON.stringify(cssConfig, null, 2)}`
    );
  }

  /* css task */
  gulp.task(taskName, function() {

    return gulp.src(src, { base })
      .pipe(quench.drano())
      .pipe(sourcemaps.init())
      .pipe(sass(cssConfig.sass))
      .pipe(autoprefixer(cssConfig.autoprefixer))
      .pipe(gulpif(
        // concat the css if the filename is provided
        filename,
        () => concat(filename)
      ))
      .pipe(rename({
        suffix: "-generated"
      }))
      .pipe(gulpif(
        // only add the header text if this css isn't compressed
        (cssConfig.sass && cssConfig.sass.outputStyle !== "compressed"),
        () => header("/* This file is generated.  DO NOT EDIT. */ \n")
      ))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(dest || cssConfig.dest))
      .pipe(debug({ title: `${taskName}: ` }));
  });


  // register the watcher for this task
  quench.maybeWatch(taskName, watch || src);

};
