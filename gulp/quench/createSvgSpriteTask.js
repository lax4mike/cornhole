const gulp     = require("gulp");
const quench   = require("./quench.js");
const debug    = require("gulp-debug");
const R        = require("ramda");
const svgmin   = require("gulp-svgmin");
const svgstore = require("gulp-svgstore");
const rename   = require("gulp-rename");
const gulpif   = require("gulp-if-else");

module.exports = function svgSpriteTask(taskName, userConfig) {

  const env = quench.getEnv();

  const svgConfig = R.merge({
    /**
     * src   : glob of files to copy
     * dest  : destination folder
     * base  : *optional https://github.com/gulpjs/gulp/blob/master/docs/API.md#optionsbase
     * watch : *optional, files to watch that will trigger a rerun when changed
     *          defaults to src
     */
    filename: "svg-sprite.svg",
    svgmin: env.production()
  }, userConfig);

  const { src, dest, base, watch, filename } = svgConfig;

  if (!src || !dest){
    quench.throwError(
      "SvgSprite task requires src and dest!\n",
      `Was given ${JSON.stringify(svgConfig, null, 2)}`
    );
  }

  gulp.task(taskName, function(next) {

    return gulp.src(src, { base: base })
      .pipe(quench.drano())
      .pipe(gulpif(
        svgConfig.svgmin,
        () => svgmin()
      ))
      .pipe(svgstore({
        inlineSvg: false
      }))
      .pipe(rename(filename))
      .pipe(gulp.dest(dest))
      .pipe(debug({ title: `${taskName}:` }));
  });

  // run this task and watch if specified
  quench.maybeWatch(taskName, watch || src);

};
