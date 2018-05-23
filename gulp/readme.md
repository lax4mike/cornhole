# Gulp

## Setup

### Once per computer

1. Install LTS version of node from [https://nodejs.org/](https://nodejs.org/)
2. Install gulp globally:  
   `npm install -g gulp-cli`

### Once per project

1. Navigate to the folder containing `package.json`, normally in the the project root.
2. Install node dependancies via
`npm install`

This will add gulp and all the other packages that it
needs to compile css, etc. All these dependancies get installed to the
`node_modules` folder.  If things get messed up, you can delete this
folder and reinstall.

## Usage

### Running tasks

1. Navigate to the folder containing `gulpfile.js`, normally in the project root or the `gulp` folder.

2. Run `gulp` to run the default task or `gulp [taskname]` to run a specific task.  Often, `gulp` will print a list of available tasks.

The actual gulp tasks will vary by project. Look in `gulpfile.js` for specific [`gulp.task()`](https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps--fn) declarations or `create*` calls from quench tasks.

The watcher will normally start a [browserSync](https://browsersync.io/) server.  The console will tell you the exact port, but it usually runs on [http://localhost:3000/](http://localhost:3000/).  

#### Watching
All tasks will watch by default. What they watch is configured on a task by task basis.

To disable watching, use `--no-watch` when you run the `gulp` command.

If browser-sync is included via [`createBrowserSyncTask`](./tasks/createBrowserSyncTask.js), it will be started if `watch` is true.

#### Environments
You can set the environments by using `--env [anotherEnv]` when you run the `gulp` command.  Valid environments are `local`, `development`, `production`.  `local` is used by default.

#### Continuous Integration
For Jenkins, or other continuous integrations, it's common to run the tasks without watching and for the production environment. For example:

```
gulp build --no-watch --env production
```

#### CSS

Compiled css files can be configured by passing in options to [`createCssTask`](./tasks/createCssTask.js). All generated files will have `-generated` appended to the end of the filename.

[BEM](https://css-tricks.com/bem-101/) methodology is loosely used for class naming. In general, every new Block element should get a new `.scss` file.

For more information, refer to [http://wiki.velir.com/index.php?title=Semantics_Using_BEM/SMACSS](http://wiki.velir.com/index.php?title=Semantics_Using_BEM/SMACSS)

`.scss` files that start with an underscore should only contain variables and/or mixins.  This ensures that they can be imported into other `.scss` files without duplication. eg. `_colors.scss`

#### Bundled Javascript with npm packages

Compiled javascript files can be configured by passing in options to [`createJsTask`](./tasks/createJsTask.js).

Each entry in the `files` array will produce a bundled javascript file. All generated files will have `-generated` appended to the end of the filename.

eg. `/client/js/index.js` > `/build/js/index-generated.js`

ES6 modules are used to import other files into these entry point files. eg:

`import React from "react";`  
`import $ from "jquery";`  
`import DataProfile from "../components/DataProfile/DataProfile.jsx";`

To add a new javascript dependency, run eg. `npm install --save react` from the project root.  This will add an entry in `package.json`.  Then, in your application script file, use eg. `import React from "react";` to include the dependency by the package name.

These shared npm packages are compiled into `/build/js/libraries-generated.js` via the `js-libraries` task defined in `/tasks/js.js`.
