const R = require("ramda");
const gulp = require("gulp");
const nodemon = require("nodemon");
const quench = require("./quench.js");

module.exports = function(taskName, userConfig){

  const nodemonConfig = R.merge({

    // use babel to start the server files
    // https://www.youtube.com/watch?v=Xb_0awoShR8 --inspect for node debugging
    execMap: {
      js: "babel-node --inspect",
      jsx: "babel-node --inspect"
    }
    /**
     * script: path.resolve(serverDir, "server.js"),
     * ignore: [],
     * watch: [],  // https://github.com/remy/nodemon/issues/965
     * args: ["--flag", value],
     * verbose: true
     */
  }, userConfig);


  gulp.task(taskName, function (cb) {

    return nodemon(nodemonConfig)
      .once("start", cb)
      .on("restart", function () {
        quench.logYellow(taskName, "restarted!");
      })
      .on("crash", function() {
        quench.logYellow(taskName, "server.js crashed!");
        // stream.emit("restart", 10)  // restart the server in 10 seconds
      });
  });
};
