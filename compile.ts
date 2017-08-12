const mu = require('mu2');
const fs = require('fs');
const path = require('path');
const ampHtmlValidator = require('amphtml-validator');

/**
 * Here you can define the pages you want to compile & include in your distribution folder.
 * By specifying this explicity you gain full control and can also have drafts (unpublished html files)
 */
const pages = ['index', 'articles/index', 'starter-kit/index', 'thank-you-for-subscribing', 'alpha'];
addPagesToDirectory (
  'articles/how-to-write-a-typescript-library',
  ['index', 'unit-testing', 'local-consumer', 'angular', 'global-installation'],
  pages
);
addPagesToDirectory(
  'articles/angular',
  ['pitfalls', 'state-management'],
  pages
);
addPagesToDirectory(
  'articles/vs',
  ['mongo-vs-mysql-for-webapps', 'typescript-vs-javascript'],
  pages
);
addPagesToDirectory(
  'articles/motivation',
  ['typescript-mean'],
  pages
);

/**
 * execute all compilation steps
 */
async function doCompile() {
  compileSass();
  copyRobotsTxt();
  buildSitemap(pages);
  await compileMustache(); // this step needs to be ready for the next one, that's why await is used here.
  validateAmp(pages);
}
doCompile();

/**
 * From here on downwards are only some implementation details...
 * ==============================================================
 */
function validateAmp(pages: string[]) {
  pages.forEach(page => {
    ampHtmlValidator.getInstance().then(function (validator) {
      const input = fs.readFileSync(distLocation(page), 'utf8');
      const result = validator.validateString(input);
      ((result.status === 'PASS') ? console.log : console.error)(`AMP ${result.status} (${page})`);
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
}

function compileSass () {
  const sass = require('node-sass');
  const result = sass.renderSync({
    file: './app/styles/styles.scss',
    outFile: './app/styles/styles.css'
  });
  fs.writeFileSync('./app/styles/styles.css', result.css);
};

function copyRobotsTxt() {
  copyFile('./app/pages/robots.txt', './dist/robots.txt', function(err) {
    if (err) {
      console.error('Error on copying robots', err);
    }
  });
}

function distLocation(page: string) {
  return './dist/' + (path.basename(page) === 'index' ? page + '.html' : page + '/index.html');
}

function compileMustache() {

  return new Promise ((resolve, reject) => {
    mu.root = __dirname + '/app';
    const data = {};

    // ensure that all directories are created, so compilation doesn't fail
    pages.forEach(page => {
      mkdir('./dist/' + page);
    });

    pages.forEach(page => {

      const writeStreams = [
        //fs.createWriteStream(`./dist/${page}.html`),
        fs.createWriteStream(distLocation(page))  // AWS likes it more like this
      ];

      mu.compileAndRender(`pages/${page}.html`, data)
        .on('data', function (data) {
          const dataStr = data.toString();
          writeStreams.forEach(writeStream => {
            writeStream.write(dataStr, (err) => {
              if (err) {
                reject(err)
              } else {
                resolve();
              }
            })
          });
        });
    });
  });

}

function buildSitemap(pages) {
  let changedPages = [];
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    changedPages.push({
      // remove 'index' and also remove '.' ...
      page: page.indexOf('index') > -1 ? (
        path.dirname(page) === '.' ? '' : path.dirname(page)
      ) : (
        page
      )
    });
  }
  const writeStream = fs.createWriteStream(`./dist/sitemap.xml`);
  mu.compileAndRender(`app/pages/sitemap.xml.mustache`, {
    pages: changedPages,
    date: formatDate(new Date())
  }).on('data', function (data) {
    const dataStr = data.toString();
    writeStream.write(dataStr);
  });
}


/**
 * And even less interesting, here are some helper functions...
 * ============================================================
 */
function addPagesToDirectory (dirName: string, newPages: string[], existingPages: string[]) {
  newPages.forEach(page => {
    existingPages.push(path.join(dirName, page));
  });
}

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

/**
 * synchronously creates directory (chain)
 * @param targetDir
 */
function mkdir (targetDir: string) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(parentDir, childDir);
    if (!fs.existsSync(curDir)) {
      fs.mkdirSync(curDir);
    }

    return curDir;
  }, initDir);
};

/**
 * format date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
  var mm = date.getMonth(); // getMonth() is zero-based
  var dd = date.getDate();

  return [date.getFullYear(),
    (mm>9 ? '' : '0') + mm,
    (dd>9 ? '' : '0') + dd
  ].join('-');
}
