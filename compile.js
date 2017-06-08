var mu = require('mu2');
var fs = require('fs');

var githubRoot = "https://raw.githubusercontent.com";
var githubPathPartial = "/bersling/typescript-mongo-express-node-seed/master/src";

var sections = {
  'app-config' : {
    'app-config.test.ts': '/config/app-config.test.ts'
  }
};

const githubRawPage = (file) => {
  return githubRoot + githubPathPartial + file
};

//
const https = require('https');


Object.keys(sections).forEach(section => {
  Object.keys(sections[section]).forEach(file => {
    const page = sections[section][file];
    console.log(githubRawPage(page));

    https.get(githubRawPage(page), (res) => {

      res.on('data', (d) => {


        const wstream = fs.createWriteStream(`./src/sections/${section}/${file}.html`);
        wstream.write(d.toString());

      });

    }).on('error', (e) => {
      console.error(e);
    });

  })
});



//



mu.root = __dirname + '/src';
var data = require('./src/data.json');
var wstream = fs.createWriteStream('./dist/index.html');
mu.compileAndRender('index.html', data)
    .on('data', function (data) {
      wstream.write(data.toString());
    });
