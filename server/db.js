const { Async } = require("crocks");
const path = require("path");
const fs = require("fs");

const file = path.resolve(`${__dirname}/../cornhole.json`);


const fsWriteFile = Async.fromNode(fs.writeFile);
const fsReadFile = Async.fromNode(fs.readFile);


const setState = data => fsWriteFile(file, data)
  .map(() => `${file} written!`)
  .fork(console.error, console.log);


const getState = () => fsReadFile(file, {
  encoding: "utf-8"
});



const api = { setState, getState };


module.exports = api;
