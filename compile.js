"use strict";
exports.__esModule = true;
var mu = require('mu2');
var fs = require('fs');
var path = require('path');
/**
 * synchronously creates directory (chain)
 * @param targetDir
 */
var mkdir = function (targetDir) {
    var sep = path.sep;
    var initDir = path.isAbsolute(targetDir) ? sep : '';
    targetDir.split(sep).reduce(function (parentDir, childDir) {
        var curDir = path.resolve(parentDir, childDir);
        if (!fs.existsSync(curDir)) {
            fs.mkdirSync(curDir);
        }
        return curDir;
    }, initDir);
};
console.log('=== COMPILE SASS ===');
var sass = require('node-sass');
var result = sass.renderSync({
    file: './styles/styles.scss',
    outFile: './styles/styles.css'
});
fs.writeFileSync('./styles/styles.css', result.css);
console.log('=== BUILD SITEMAP && robots ===');
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
copyFile('./sitemap.xml', './dist/sitemap.xml', function (err) {
    if (err) {
        console.error('Error on copying sitemap.xml:', err);
    }
});
copyFile('./robots.txt', './dist/robots.txt', function (err) {
    if (err) {
        console.error('Error on copying robots', err);
    }
});
console.log('=== COMPILE MUSTACHE ===');
mu.root = __dirname;
var data = {};
var pages = ['index', 'articles/index', 'starter-kit/index'];
var htwatlPages = ['index', 'unit-testing', 'local-consumer', 'angular', 'global-installation'];
htwatlPages.forEach(function (page) {
    var dir = 'articles/how-to-write-a-typescript-library/';
    mkdir('./dist/' + dir);
    pages.push(dir + page);
});
var vsPages = ['mongo-vs-mysql-for-webapps'];
vsPages.forEach(function (page) {
    var dir = 'articles/vs/';
    pages.push(dir + page);
});
var angularPages = ['pitfalls', 'state-management'];
angularPages.forEach(function (page) {
    var dir = 'articles/angular/';
    pages.push(dir + page);
});
pages.forEach(function (page) {
    mkdir('./dist/' + path.dirname(page));
});
pages.forEach(function (page) {
    var writeStream = fs.createWriteStream("./dist/" + page + ".html");
    mu.compileAndRender("pages/" + page + ".html", data)
        .on('data', function (data) {
        var dataStr = data.toString();
        writeStream.write(dataStr);
    });
});
// sitemap
var changedPages = [];
pages.forEach(function (page) { return function () {
    changedPages.push({
        page: page
    });
}; });
console.log(changedPages);
var writeStream = fs.createWriteStream("./dist/sitemap.xml");
mu.compileAndRender("sitemap.xml", {
    pages: changedPages,
    date: formatDate(new Date())
}).on('data', function (data) {
    var dataStr = data.toString();
    writeStream.write(dataStr);
});
function formatDate(date) {
    var mm = date.getMonth(); // getMonth() is zero-based
    var dd = date.getDate();
    return [date.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
    ].join('-');
}
console.log('=== AMP VALIDATION ===');
var amphtmlValidator = require('amphtml-validator');
pages.forEach(function (page) {
    amphtmlValidator.getInstance().then(function (validator) {
        var input = fs.readFileSync("dist/" + page + ".html", 'utf8');
        var result = validator.validateString(input);
        ((result.status === 'PASS') ? console.log : console.error)(result.status + " (" + page + ")");
        for (var ii = 0; ii < result.errors.length; ii++) {
            var error = result.errors[ii];
            var msg = 'line ' + error.line + ', col ' + error.col + ': ' + error.message;
            if (error.specUrl !== null) {
                msg += ' (see ' + error.specUrl + ')';
            }
            ((error.severity === 'ERROR') ? console.error : console.warn)(msg);
        }
    });
});
