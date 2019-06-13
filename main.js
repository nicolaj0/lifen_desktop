'use strict'

const path = require('path')
const {app, ipcMain} = require('electron')

const Window = require('./Window')
const DataStore = require('./DataStore')
const chokidar = require('chokidar');

require('electron-reload')(__dirname)
var fs = require('fs');

function main() {

    const {net} = require('electron')
    // todo list window
    let mainWindow = new Window({
        file: path.join('renderer', 'index.html')
    })


    var fileLocation = path.join(__dirname, 'FHIR')
    const watcher = chokidar.watch('.', {
        persistent: true,
        cwd: './FHIR',
      });
       
      // Something to use when events are received.
      const log = console.log.bind(console);
      // Add event listeners.
      watcher
        .on('add', p => {
            log(`File ${p} has been added`)
            
            log( path.join(fileLocation,p))

            
            var data = fs.readFileSync(path.join(fileLocation,p));

            const request = net.request({
                method: 'POST',
                url: 'https://fhirtest.uhn.ca/baseDstu3/Binary',
                body: data.toString('base64'),
                headers: { "Content-Type": "text/plain" }
            });
    
            request.on('response', (response) => {
                console.log(`STATUS: ${response.statusCode}`)
                  response.on('end', () => {
                    console.log('No more data in response.')
                  })
            })
            request.end()
        })
        


   /*  fs.watch('./FHIR', (eventType, filename) => {
        if (filename) {
          console.log(filename);
          data = fs.readFileSync(filename);

          const request = net.request({
              method: 'POST',
              url: 'https://fhirtest.uhn.ca/baseDstu3/Binary',
              body: data.toString('base64'),
              headers: { "Content-Type": "text/plain" }
          });
  
          request.on('response', (response) => {
              console.log(`STATUS: ${response.statusCode}`)
              console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
                response.on('end', () => {
                  console.log('No more data in response.')
                })
          })
          request.end()
        }
      }); */


    ipcMain.on('on-file-dropped', (e, f) => {
        console.log(f)


        var fs = require('fs'),
            data = fs.readFileSync(f);

        const request = net.request({
            method: 'POST',
            url: 'https://fhirtest.uhn.ca/baseDstu3/Binary',
            body: data.toString('base64'),
            headers: { "Content-Type": "text/plain" }
        });

        request.on('response', (response) => {
            console.log(`STATUS: ${response.statusCode}`)
            console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
              response.on('end', () => {
                console.log('No more data in response.')
              })
        })
        request.end()

    })


    // create add todo window


    // add-todo from add todo window

}

app.on('ready', main)

app.on('window-all-closed', function () {
    app.quit()
})
