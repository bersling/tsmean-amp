import * as highlight from 'highlight.js';

const mu = require('mu2');
const fs = require('fs');


console.log('=== COMPILE SASS ===');
const sass = require('node-sass');
const result = sass.renderSync({
  file: './styles/styles.scss',
  outFile: './styles/styles.css'
});
fs.writeFileSync('./styles/styles.css', result.css);

console.log('=== BUILD SITEMAP && robots ===');
function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on("error", function(err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on("error", function(err) {
    done(err);
  });
  wr.on("close", function(ex) {
    done(ex);
  });
  rd.pipe(wr);

  function done(err) {
    if (!cbCalled) {
      cb(err);
      cbCalled = true;
    }
  }
}

copyFile('./sitemap.xml', './dist/sitemap.xml', function(err) {
  if (err) {
    console.error('Error on copying sitemap.xml:', err);
  }
});
copyFile('./robots.txt', './dist/robots.txt', function(err) {
  if (err) {
    console.error('Error on copying robots', err);
  }
});

console.log('=== COMPILE MUSTACHE ===');
mu.root = __dirname;
const data = {};

const pages = ['index'];
const htwatlPages = ['index', 'unit-testing', 'local-consumer', 'angular', 'global-installation'];
htwatlPages.forEach(page => {
  pages.push('how-to-write-a-typescript-library/' + page)
});
const vsPages = ['mongo-vs-mysql-for-webapps'];
vsPages.forEach(page => {
  pages.push('vs/' + page);
});
const angularPages = ['pitfalls', 'state-management'];
angularPages.forEach(page => {
  pages.push('angular/' + page);
});

pages.forEach(page => {
  const writeStream = fs.createWriteStream(`./dist/${page}.html`);
  mu.compileAndRender(`pages/${page}.html`, data)
    .on('data', function (data) {
      const dataStr = data.toString();
      writeStream.write(dataStr);
    });
});

// not yet functional
const doHighlight = (dataStr) => {
  const pattern = /<pre(.*?)>([\s\S]*?)<\/pre>/g;
  dataStr.replace(pattern, function(a, b) {
    return highlight.highlightAuto(b).value;
  });
};


console.log('=== AMP VALIDATION ===');
const amphtmlValidator = require('amphtml-validator');

pages.forEach(page => {
  amphtmlValidator.getInstance().then(function (validator) {
    const input = fs.readFileSync(`dist/${page}.html`, 'utf8');
    const result = validator.validateString(input);
    ((result.status === 'PASS') ? console.log : console.error)(`${result.status} (${page})`);
    for (let ii = 0; ii < result.errors.length; ii++) {
      const error = result.errors[ii];
      let msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
      if (error.specUrl !== null) {
        msg += ' (see ' + error.specUrl + ')';
      }
      ((error.severity === 'ERROR') ? console.error : console.warn)(msg);
    }
  });
});
