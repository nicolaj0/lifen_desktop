"use strict";

const path = require("path");
const { app, ipcMain, BrowserWindow } = require("electron");

const Window = require("./Window");
const chokidar = require("chokidar");
var rp = require("request-promise");
require("electron-reload")(__dirname);
var fs = require("fs");

function main() {
  const { net } = require("electron");
  // todo list window
  let win = new Window({
    file: path.join("renderer", "index.html")
  });


  var fileLocation = path.join(__dirname, "FHIR");
  const watcher = chokidar.watch("./**/*.pdf", {
    persistent: true,
    cwd: "./FHIR"
  });

  // Something to use when events are received.
  const log = console.log.bind(console);
  // Add event listeners.
  watcher.on("add", (p, stats) => {
    log(`File ${p} has been added`);

    log(path.join(fileLocation, p));
    if (stats) {
      console.log(`File ${path} changed size to ${stats.size}`);
      if (stats.size/1000000 >= 2){
        console.error('file too big')
        return
      }
    }

    win.webContents.send("ping", p);

    var data = fs.readFileSync(path.join(fileLocation, p));
    const histo = {
      method: "GET",
      url: "https://fhirtest.uhn.ca/baseDstu3/Binary/_history",
      json: true,
      resolveWithFullResponse: true
    };

    const post = {
      method: "POST",
      url: "https://fhirtest.uhn.ca/baseDstu3/Binary",
      body: {
        some: data.toString("base64")
      },
      resolveWithFullResponse: true,
      json: true,
      headers: { "Content-Type": "text/plain" }
    };

    rp(post)
      .then(response => {
        return rp(histo);
      })
      .then(response => {
        console.log(`histo res: ${response.body.total}`);
        win.webContents.send("total", response.body.total);
      })
      .catch(err => console.log); 
  });

  ipcMain.on("on-file-dropped", (e, f) => {

    var fs = require("fs"),
      data = fs.readFileSync(f);

    const request = net.request({
      method: "POST",
      url: "https://fhirtest.uhn.ca/baseDstu3/Binary",
      body: data.toString("base64"),
      headers: { "Content-Type": "text/plain" }
    });

    request.on("response", response => {
      console.log(`STATUS: ${response.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
      response.on("end", () => {
        console.log("No more data in response.");
      });
    });
    request.end();
  });
}

app.on("ready", main);

app.on("window-all-closed", function() {
  app.quit();
});
