const gulp    = require("gulp");
const quench  = require("./quench.js");
const debug   = require("gulp-debug");
const gulpJest    = require("gulp-jest").default;
const R       = require("ramda");

module.exports = function jestTask(taskName, userConfig) {

  const jestConfig = R.merge({
    /**
     * src   : glob of files to jest
     * base  : *optional, https://github.com/gulpjs/gulp/blob/master/docs/API.md#optionsbase
     * watch : *optional, files to watch that will trigger a rerun when changed
     *          defaults to src
     * jest  : *optional, jest options: https://facebook.github.io/jest/docs/en/configuration.html
     */
  }, userConfig);

  const { src, base, watch, jest = {} } = jestConfig;

  if (!src){
    quench.throwError(
      "Jest task requires src!\n",
      `Was given ${JSON.stringify(jestConfig, null, 2)}`
    );
  }

  gulp.task(taskName, function(next) {
    return gulp.src(src, { base: base })
      .pipe(quench.drano())
      .pipe(gulpJest(jest))
      .pipe(debug({ title: `${taskName}:` }));
  });

  // run this task and watch if specified
  quench.maybeWatch(taskName, watch || src);

};
