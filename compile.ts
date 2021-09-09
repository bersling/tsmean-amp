import * as Mustache from 'mustache';

const fs = require('fs');
const path = require('path');
const ampHtmlValidator = require('amphtml-validator');

//used to highlight
const rehype = require('rehype');
const highlight = require('rehype-highlight');
const vfile = require('to-vfile');

/**
 * Some constants for your project
 */
const projectConstants = {
  projectUrl: 'https://www.tsmean.com'
};

/**
 * Where the result is saved
 */
const outDirRoot = './dist';


/**
 * All partials (=components) need to be declared here
 */
const partialRootPath = './app/';
const buildPartial = (partialPath) => {
  return fs.readFileSync(path.join(partialRootPath, partialPath), 'utf8');
};
let partials = {};


/**
 * Here you can define the pages you want to compile & include in your distribution folder.
 * By specifying this explicity you gain full control and can also have drafts (unpublished html files)
 */
const pagesRootPath = './app/pages';
const pages = [
  'index',
  'articles/index',
  'thank-you-for-subscribing',
  'about/index'
];
addPagesToDirectory(
  'articles/command-line-tools',
  [
    'scp-and-idempotency'
  ],
  pages
);
addPagesToDirectory(
  'articles/how-to-write-a-typescript-library',
  ['index', 'unit-testing', 'local-consumer', 'angular', 'global-installation'],
  pages
);
addPagesToDirectory(
  'articles/angular',
  [
    'pitfalls',
    'state-management',
    'angular-control-value-accessor-example',
    'ngrxstore-vs-angular-services',
    'debugging-and-understanding-expressionhaschangedafterchecked',
    'implementing-a-live-search-aka-search-as-you-type-with-angular',
    'custom-checkbox-component-with-angular',
    'how-to-update-angular-to-the-latest-version',
    'reusing-components-from-lazy-loaded-angular-modules'

  ],
  pages
);
addPagesToDirectory(
  'articles/rxjs',
  [
    'rxjs-replaysubject-vs-behaviorsubject',
    'take1-vs-first'
  ],
  pages
);

addPagesToDirectory(
  'articles/aws',
  [
    'the-ultimate-aws-lambda-tutorial-for-nodejs'
  ],
  pages
);
addPagesToDirectory(
  'articles/vs',
  [
    'mongo-vs-mysql-for-webapps',
    'typescript-vs-javascript',
    'best-browser-based-wysiwyg-for-html-in-2020',
    'common-concepts-among-component-centric-frameworks'
  ],
  pages
);
addPagesToDirectory(
  'articles/learn-typescript',
  [
    'no-implicit-any-best-practice',
    'strict-null-checks-best-practice',
    'typescript-module-compiler-option'
  ],
  pages
);
addPagesToDirectory(
  'articles/mysql',
  [
    'fixing-a-typo-in-a-json-in-mysql',
    'how-to-merge-rows-in-mysql-while-redirecting-all-foreign-keys'
  ],
  pages
);
addPagesToDirectory(
  'articles/error-handling',
  [
    'always-handle-errors',
    // 'the-ultimate-error-handling-tutorial'
  ],
  pages
);
addPagesToDirectory(
  'articles/tooling',
  [
    'convert-latex-to-html-online',
    'if-you-are-a-programmer-do-not-use-wordpress',
    'intellij-not-using-correct-tsconfigjson-file'
  ],
  pages
);
addPagesToDirectory(
  'articles/architecture',
  ['library-oriented-architecture'],
  pages
);
addPagesToDirectory(
  'articles/seo',
  [
    'how-to-setup-www-vs-non-www-for-seo'
  ],
  pages
);
addPagesToDirectory(
  'articles/infrastructure',
  [
    'how-to-send-mail-from-the-command-line',
    'backup-mongodb-to-s3',
    'install-ssl-certificate-through-letsencrypt-on-nginx',
    'host-static-files-with-apache-on-digitalocean',
    'password-protect-parts-of-your-website'
  ],
  pages
);
// addPagesToDirectory(
//   'articles/infrastructure/gcloud',
//   [
//     'the-ultimate-google-cloud-functions-tutorial-for-nodejs'
//   ],
//   pages
// );
addPagesToDirectory(
  'articles/mustache',
  [
    'the-ultimate-mustache-tutorial'
  ],
  pages
);
addPagesToDirectory(
  'articles/motivation',
  ['typescript-mean'],
  pages
);
addPagesToDirectory(
  'articles/nodejs',
  [
    'how-to-handle-cpu-intensive-tasks-with-node',
    'deploy-nodejs-at-scale'
  ],
  pages
);
addPagesToDirectory(
  'articles/authentication',
  [
    'express-session-angular',
    'jwt-express-angular',
  ],
  pages
);
addPagesToDirectory(
  'articles/js',
  [
    'async-await'
  ],
  pages
);
addPagesToDirectory(
  'articles/regex',
  [
    'match-anything-with-javascript-regex',
    'javascript-regex-match-vs-exec-vs-matchall'
  ],
  pages
);
addPagesToDirectory(
  'articles/css',
  [
    'reverse-engineering-bootstrap-grid-with-modern-css',
    'simple-css-grid-system'
  ],
  pages
);
addPagesToDirectory(
  'articles/analytics',
  ['gtm'],
  pages
);
addPagesToDirectory(
  'articles/security',
  [
    'oauth2-tutorial',
    'authentication-vs-authorization',
    'on-the-same-origin-policy-sop-cors-cookies-and-xsrf-attacks'
  ],
  pages
);
addPagesToDirectory(
  'articles/docker',
  [
    'how-to-debug-linux-on-a-mac'
  ],
  pages
);
addPagesToDirectory(
  'articles/math',
  [
    'mathjax-parser-for-html-strings'
  ],
  pages
);
addPagesToDirectory(
    'articles/soap',
    [
        'how-to-call-a-soap-webservice-with-curl-and-ntlm-authentication'
    ],
    pages
);
addPagesToDirectory(
    'articles/encoding',
    [
        'unicode-and-utf-8-tutorial-for-dummies'
    ],
    pages
);




/**
 * execute all compilation steps
 */
async function doCompile() {
  compileMarkdown();
  compileSass();
  buildPartials();
  copyRobotsTxt();
  buildSitemap(pages);
  compileMustache();

  await validateAmp(pages);
}

doCompile();

/**
 * From here on downwards are only some implementation details...
 * ==============================================================
 */
async function validateAmp(pages: string[]) {
  const validator = await ampHtmlValidator.getInstance();
  pages.forEach(page => {
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
}

function buildPartials() {
  partials = {
    ...partials,
    'styles': buildPartial('styles/styles.css'),
    'highlightStyles': buildPartial('../node_modules/highlight.js/styles/tomorrow-night-bright.css'),
    'articleFooter': buildPartial('components/article/article-footer.html'),
    'articleHead': buildPartial('components/article/article-head.html'),
    'footer': buildPartial('components/footer/footer.html'),
    'githubButton': buildPartial('components/github-button/github-button-inverse.html'),
    'header': buildPartial('components/header/header.html'),
    'learnMore': buildPartial('components/learn-more/learn-more.html'),
    'featured': buildPartial('components/featured/featured.html'),
    'bluehost': buildPartial('components/bluehost/bluehost.html'),
    'logoAccent': buildPartial('components/logo/accent.html'),
    'logoPrimary': buildPartial('components/logo/primary.html'),
    'logoWhite': buildPartial('components/logo/white.html'),
    'primaryNavMenu': buildPartial('components/primary-nav-menu/primary-nav-menu.html'),
    'sidebar': buildPartial('components/sidebar/sidebar.html'),
    'socialFooter': buildPartial('components/social-footer/social-footer.html'),
    'subscribeLightbox': buildPartial('components/subscribe-lightbox/subscribe-lightbox.html'),
    'subscribeToNewsletter': buildPartial('components/subscribe-to-newsletter/subscribe-to-newsletter.html'),
    'subscribeToReleaseLightbox': buildPartial('components/subscribe-to-release-lightbox/subscribe-to-release-lightbox.html'),
    'subscribeToReleases': buildPartial('components/subscribe-to-releases/subscribe-to-releases.html'),
    'valueBullets': buildPartial('components/value-bullets/value-bullets.html'),
    'analytics': buildPartial('components/analytics.html'),
    'commonHead': buildPartial('components/common-head.html')
  };
}

function compileMarkdown() {
  console.log('compiling markdown');
  const { spawnSync } = require( 'child_process' );
  pages.forEach(page => {
    const markdownPath = path.join(pagesRootPath, `${page}.md`);
    const outHtmlPath = `${markdownPath}.html`
    const hasMarkdown = fs.existsSync(markdownPath);
    if (hasMarkdown) {
      spawnSync( 'pandoc', [ markdownPath, '-o',  outHtmlPath] );
      const htmlString = fs.readFileSync(path.join(outHtmlPath), 'utf8')
        .replace(/<pre><code>/g, '###PRE_CODE_TEMP###')
        .replace(/<code>/g, '<code class="app-code">')
        .replace(/###PRE_CODE_TEMP###/g, '<pre><code>')
        .replace(/sourceCode (.*?)/g, 'sourceCode language-$1');

      const pageTitle = page.split('/').pop();
      partials = {
        ...partials,
        [pageTitle]: htmlString
      }
      fs.unlinkSync(outHtmlPath);
    }
  });
}

function compileSass() {
  console.log('compiling scss');
  const sass = require('node-sass');
  const result = sass.renderSync({
    file: './app/styles/styles.scss',
    outFile: './app/styles/styles.css'
  });
  fs.writeFileSync('./app/styles/styles.css', result.css);
  console.log('compiled scss');
}

function copyRobotsTxt() {
  copyFile('./app/pages/robots.txt', './dist/robots.txt', function (err) {
    if (err) {
      console.error('Error on copying robots', err);
    }
  });
}

function distLocation(page: string) {
  return './dist/' + (path.basename(page) === 'index' ? page + '.html' : page + '/index.html');
}

function compileMustache() {

  // ensure that all directories are created, so compilation doesn't fail
  pages.forEach(page => {
    mkdir(path.dirname(distLocation(page)));
  });

  pages.forEach(page => {
    const template = fs.readFileSync(path.join(pagesRootPath, `${page}.html`), {encoding: 'utf8'});
    const pageUrl = projectConstants.projectUrl + '/' + page.split('index')[0];
    const renderedPage = Mustache.render(template, {
      projectUrl: projectConstants.projectUrl,
      pageUrl,
      encodedPageUrl: encodeURIComponent(pageUrl)
    }, partials);

    fs.writeFileSync(distLocation(page), renderedPage);

    // apply highlight
    rehype()
      .use(highlight) // comment this line to disable highlight
      .process(vfile.readSync(distLocation(page)), function (err, file) {
        if (err) {
          console.error(err);
        } else {
          fs.writeFileSync(distLocation(page), String(file));
        }
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
  const extendedData = {
    pages: changedPages,
    date: formatDate(new Date())
  };
  Object.assign(extendedData, projectConstants);
  const sitemapTemplate = fs.readFileSync('./app/pages/sitemap.xml.mustache', 'utf8');
  const renderedSitemap = Mustache.render(sitemapTemplate, extendedData);
  fs.writeFileSync('./dist/sitemap.xml', renderedSitemap);
}


/**
 * And even less interesting, here are some helper functions...
 * ============================================================
 */
function addPagesToDirectory(dirName: string, newPages: string[], existingPages: string[]) {
  newPages.forEach(page => {
    existingPages.push(path.join(dirName, page));
  });
}

function copyFile(source, target, cb) {
  var cbCalled = false;

  var rd = fs.createReadStream(source);
  rd.on('error', function (err) {
    done(err);
  });
  var wr = fs.createWriteStream(target);
  wr.on('error', function (err) {
    done(err);
  });
  wr.on('close', function (ex) {
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
function mkdir(targetDir: string) {
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
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
  ].join('-');
}
