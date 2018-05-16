"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mustache = require("mustache");
const fs = require('fs');
const path = require('path');
const ampHtmlValidator = require('amphtml-validator');
/**
 * Some constants for your project
 */
const projectConstants = {
    projectUrl: 'http://amp-project-starter.com'
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
const partials = {
    'styles': buildPartial('styles/styles.css'),
    'articleFooter': buildPartial('components/article/article-footer.html'),
    'articleHead': buildPartial('components/article/article-head.html'),
    'footer': buildPartial('components/footer/footer.html'),
    'githubButton': buildPartial('components/github-button/github-button-inverse.html'),
    'header': buildPartial('components/header/header.html'),
    'learnMore': buildPartial('components/learn-more/learn-more.html'),
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
    'commonHead': buildPartial('components/common-head.html'),
};
/**
 * Here you can define the pages you want to compile & include in your distribution folder.
 * By specifying this explicity you gain full control and can also have drafts (unpublished html files)
 */
const pagesRootPath = './app/pages';
const pages = ['index', 'articles/index', 'starter-kit/index', 'thank-you-for-subscribing', 'alpha', 'learn-typescript/index'];
addPagesToDirectory('articles/how-to-write-a-typescript-library', ['index', 'unit-testing', 'local-consumer', 'angular', 'global-installation'], pages);
addPagesToDirectory('articles/angular', ['pitfalls', 'state-management'], pages);
addPagesToDirectory('articles/vs', ['mongo-vs-mysql-for-webapps', 'typescript-vs-javascript'], pages);
addPagesToDirectory('articles/learn-typescript', ['no-implicit-any-best-practice', 'strict-null-checks-best-practice'], pages);
addPagesToDirectory('articles/architecture', ['library-oriented-architecture'], pages);
addPagesToDirectory('articles/motivation', ['typescript-mean'], pages);
addPagesToDirectory('orders', ['typescript-front-to-back'], pages);
/**
 * execute all compilation steps
 */
function doCompile() {
    return __awaiter(this, void 0, void 0, function* () {
        compileSass();
        copyRobotsTxt();
        buildSitemap(pages);
        compileMustache();
        yield validateAmp(pages);
    });
}
doCompile();
/**
 * From here on downwards are only some implementation details...
 * ==============================================================
 */
function validateAmp(pages) {
    return __awaiter(this, void 0, void 0, function* () {
        const validator = yield ampHtmlValidator.getInstance();
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
    });
}
function compileSass() {
    const sass = require('node-sass');
    const result = sass.renderSync({
        file: './app/styles/styles.scss',
        outFile: './app/styles/styles.css'
    });
    fs.writeFileSync('./app/styles/styles.css', result.css);
}
;
function copyRobotsTxt() {
    copyFile('./app/pages/robots.txt', './dist/robots.txt', function (err) {
        if (err) {
            console.error('Error on copying robots', err);
        }
    });
}
function distLocation(page) {
    return './dist/' + (path.basename(page) === 'index' ? page + '.html' : page + '/index.html');
}
function compileMustache() {
    // ensure that all directories are created, so compilation doesn't fail
    pages.forEach(page => {
        mkdir(path.dirname(distLocation(page)));
    });
    pages.forEach(page => {
        const template = fs.readFileSync(path.join(pagesRootPath, `${page}.html`), { encoding: 'utf8' });
        const renderedPage = Mustache.render(template, {
            projectUrl: projectConstants.projectUrl
        }, partials);
        fs.writeFileSync(distLocation(page), renderedPage);
    });
}
function buildSitemap(pages) {
    let changedPages = [];
    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        changedPages.push({
            // remove 'index' and also remove '.' ...
            page: page.indexOf('index') > -1 ? (path.dirname(page) === '.' ? '' : path.dirname(page)) : (page)
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
function addPagesToDirectory(dirName, newPages, existingPages) {
    newPages.forEach(page => {
        existingPages.push(path.join(dirName, page));
    });
}
function copyFile(source, target, cb) {
    var cbCalled = false;
    var rd = fs.createReadStream(source);
    rd.on("error", function (err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function (err) {
        done(err);
    });
    wr.on("close", function (ex) {
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
function mkdir(targetDir) {
    const sep = path.sep;
    const initDir = path.isAbsolute(targetDir) ? sep : '';
    targetDir.split(sep).reduce((parentDir, childDir) => {
        const curDir = path.resolve(parentDir, childDir);
        if (!fs.existsSync(curDir)) {
            fs.mkdirSync(curDir);
        }
        return curDir;
    }, initDir);
}
;
/**
 * format date to YYYY-MM-DD
 */
function formatDate(date) {
    var mm = date.getMonth(); // getMonth() is zero-based
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
}