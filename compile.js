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
  },
  'authentication': {
    'login-router.test.ts.html': '/src/router/endpoints/login-router.test.ts',
    'login-router.ts.html': '/src/router/endpoints/login-router.ts',
    'passport.test.ts.html': '/src/auth/passport.test.ts',
    'passport.ts.html': '/src/auth/passport.ts',
    'password-cryptographer.test.ts.html': '/src/auth/password-cryptographer.test.ts',
    'password-cryptographer.ts.html': '/src/auth/password-cryptographer.ts',
    'user.model.ts.html': '/src/db/user.model.ts',
    'user-dao.test.ts.html': '/src/db/user-dao.test.ts',
    'user-dao.ts.html': '/src/db/user-dao.ts'
  },
  'database': {
    'before-eachs.ts.html' : '/src/test/before-eachs.ts',
    'dao.test.ts.html' : '/src/db/dao.test.ts',
    'dao.ts.html' : '/src/db/dao.ts',
    'database.test.ts.html' : '/src/db/database.test.ts',
    'database.ts.html' : '/src/db/database.ts',
    'database-response.model.ts.html' : '/src/db/database-response.model.ts',
    'utils.ts.html' : '/src/utils/utils.ts'
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
