const gulp   = require("gulp");
const quench = require("./quench.js");
const exec   = require("child_process").exec;
const R      = require("ramda");

module.exports = function patternLabTask(taskName, userConfig) {

  const patternLabConfig = R.merge({
    labRoot: "./lab",
    watch: []
  }, userConfig);

  const {labRoot, watch} = patternLabConfig;

  if (!labRoot){
    quench.throwError(
      "Pattern lab requires a lab root directory.",
      `Was given ${JSON.stringify(patternLabConfig, null, 2)}`
    );
  }

  gulp.task(taskName, function () {
    exec("php " + labRoot + "/core/console --generate", (err, stdout, stderr) => {
      console.log(stdout);
      console.log(stderr);
    });
  });

  // run this task and watch if specified
  quench.maybeWatch(taskName, watch || []);

};
