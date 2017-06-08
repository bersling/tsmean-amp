const mu = require('mu2');
const fs = require('fs');
const https = require('https');


const githubRoot = "https://raw.githubusercontent.com";
const githubPathPartial = "/bersling/typescript-mongo-express-node-seed/master";

const sections = {
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
  },
  'router': {
    'index.ts.html' : '/src/index.ts',
    'middleware.ts.html' : '/src/router/middleware.ts',
    'router.test.ts.html' : '/src/router/router.test.ts',
    'router.ts.html' : '/src/router/router.ts',
    'endpoints/simple-crud-router.test.ts.html' : '/src/router/endpoints/simple-crud-router.test.ts',
    'endpoints/simple-crud-router.ts.html' : '/src/router/endpoints/simple-crud-router.ts',
    'endpoints/welcome-html-router.test.ts.html' : '/src/router/endpoints/welcome-html-router.test.ts',
    'endpoints/welcome-html-router.ts.html' : '/src/router/endpoints/welcome-html-router.ts',
  },
  'setup': {
    'logger.test.ts.html' : '/src/logger/logger.test.ts',
    'logger.ts.html' : '/src/logger/logger.ts',
    'tsconfig.json.html' : '/src/tsconfig.json',
    'package.json.html': '/src/package.json'
  }
};

const githubRawPage = (file) => {
  return githubRoot + githubPathPartial + file
};

const handleText = (text, file) => {
  let transformedText = text;
  switch (file) {
    case 'package.json':
      text = text.replace('ts-mongo-express-node-seed', `<span class="highlight">project-name</span>`);
      text = text.replace('Daniel Niederberger <bersling@gmail.com>', `Your Name <youremail@gmail.com>`);
      text = text.replace(/^.*express.*$/mg, "");
  }
  return transformedText;
};

console.log('=== BUILD ALL SECTIONS ===');
Object.keys(sections).forEach(section => {
  Object.keys(sections[section]).forEach(file => {
    const page = sections[section][file];

    https.get(githubRawPage(page), (res) => {

      res.on('data', (d) => {

        handleText(d, file);

        const wstream = fs.createWriteStream(`./src/sections/${section}/${file}`);
        wstream.write(d.toString());

      });

    }).on('error', (e) => {
      console.error(e);
    });

  })
});


console.log('=== COMPILE MUSTACHE ===');
mu.root = __dirname + '/src';
var data = require('./src/data.json');
var wstream = fs.createWriteStream('./dist/index.html');
mu.compileAndRender('index.html', data)
    .on('data', function (data) {
      wstream.write(data.toString());
    });
