const gulp         = require("gulp");
const quench       = require("./quench.js");
const less         = require("gulp-less");
const autoprefixer = require("gulp-autoprefixer");
const rename       = require("gulp-rename");
const debug        = require("gulp-debug");
const header       = require("gulp-header");
const pixrem       = require("gulp-pixrem");
const concat       = require("gulp-concat");
const cleanCSS     = require("gulp-clean-css");
const gulpif       = require("gulp-if-else");
const sourcemaps   = require("gulp-sourcemaps");
const R            = require("ramda");


module.exports = function cssTask(taskName, userConfig) {

  const env = quench.getEnv();

  // css settings
  const cssConfig = R.mergeDeepRight({

    less: {
      // config options: http://lesscss.org/#using-less-configuration
      // plugin options: http://lesscss.org/usage/#plugins-list-of-less-plugins
      // plugins: []
    },

    autoprefixer: {
      browsers: ["> 1%", "last 2 versions", "Firefox ESR", "Opera 12.1", "ie >= 9"],
      grid: true
    },

    cleanCSS: {

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
      .pipe(less(cssConfig.less))
      .pipe(autoprefixer(cssConfig.autoprefixer))
      .pipe(pixrem("16px", {
        atrules: true,
        html: true
      }))
      .pipe(gulpif( // concat the css if the filename is provided
        filename,
        () => concat(filename)
      ))
      .pipe(rename({
        suffix: "-generated"
      }))
      .pipe(gulpif( // minify when building for production
        env.production(),
        () => cleanCSS(cssConfig.cleanCSS)
      ))
      .pipe(gulpif( // only add the header text if this css isn't compressed
        !env.production(),
        () => header("/* This file is generated.  DO NOT EDIT. */ \n")
      ))
      .pipe(sourcemaps.write("./"))
      .pipe(gulp.dest(dest || cssConfig.dest))
      .pipe(debug({ title: `${taskName}: ` }));
  });


  // register the watcher for this task
  quench.maybeWatch(taskName, watch || src);

};
