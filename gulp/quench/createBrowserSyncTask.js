const gulp        = require("gulp");
const quench      = require("./quench.js");
const R           = require("ramda");
const browserSync = require("browser-sync").create();


module.exports = function(taskName, userConfig = {}){

  const localConfig = quench.loadLocalJs();

  if (!userConfig.server && !userConfig.proxy && !localConfig.hostname){
    quench.throwError(
      "Browser-sync requires a `server` path or `proxy` in userConfig, or a `hostname` defined in local.js!\n",
      `Was given userConfig: ${JSON.stringify(userConfig, null, 2)}\n`,
      `and config from local.js: ${JSON.stringify(localConfig)}`
    );
  }


  const browserSyncSettings = R.merge({
    port: localConfig.browserSyncPort || 3000,
    open: false, // false or  "external"
    notify: false,
    ghostMode: false,

    // watch these default files and reload the browser when they change
    // can be overwritten by userConfig
    files: [
      userConfig.server + "/**",
      // prevent browser sync from reloading twice when the regular file (eg. index.js)
      // and the map file (eg. index.js.map) are generated
      "!**/*.map"
    ],

    // set the server root, or proxy if it's set in local.js
    // use proxy if you have a server running the site already (eg, IIS)
    // http://www.browsersync.io/docs/options/#option-proxy
    proxy: localConfig.hostname || userConfig.proxy || undefined

    // if not using proxy, use userConfig.server as the server root
    // http://www.browsersync.io/docs/options/#option-server

  }, userConfig);



  gulp.task(taskName, function(){

    // only run browser-sync if we're also watching
    if (quench.isWatching()){
      quench.logYellow("watching", `${taskName}:`, JSON.stringify(browserSyncSettings.files, null, 2));
      browserSync.init(browserSyncSettings);
    }

  });

};
