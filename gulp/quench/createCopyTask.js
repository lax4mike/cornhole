const gulp    = require("gulp");
const quench  = require("./quench.js");
const debug   = require("gulp-debug");
const changed = require("gulp-changed");
const R       = require("ramda");

module.exports = function copyTask(taskName, userConfig) {

  const copyConfig = R.merge({
    /**
     * src   : glob of files to copy
     * dest  : destination folder
     * base  : *optional, https://github.com/gulpjs/gulp/blob/master/docs/API.md#optionsbase
     * watch : *optional, files to watch that will trigger a rerun when changed
     *          defaults to src
     */
  }, userConfig);

  const { src, dest, base, watch } = copyConfig;

  if (!src || !dest){
    quench.throwError(
      "Copy task requires src and dest!\n",
      `Was given ${JSON.stringify(copyConfig, null, 2)}`
    );
  }


  gulp.task(taskName, function(next) {
    return gulp.src(src, { base: base })
      .pipe(quench.drano())
      .pipe(changed(dest))
      .pipe(gulp.dest(dest))
      .pipe(debug({ title: `${taskName}:` }));
  });

  // run this task and watch if specified
  quench.maybeWatch(taskName, watch || src);

};
