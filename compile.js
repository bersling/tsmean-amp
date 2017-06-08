var mu = require('mu2');
var fs = require('fs');

var githubRoot = "https://raw.githubusercontent.com";
var githubPathPartial = "/bersling/typescript-mongo-express-node-seed/master";

var sections = {
  'app-config' : {
    'app-config.test.ts.html': '/src/config/app-config.test.ts',
    'app-config.ts.html': '/src/config/app-config.ts',
    'app-properties.model.ts.html': '/src/config/app-properties.model.ts',
    'local.properties.json.html': '/properties/local.properties.json',
    'test.properties.json.html': '/properties/test.properties.json'
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


        const wstream = fs.createWriteStream(`./src/sections/${section}/${file}`);
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
