var mu = require('mu2');
var fs = require('fs');

mu.root = __dirname + '/src';
var data = require('./src/data.json');
var wstream = fs.createWriteStream('./dist/index.html');
mu.compileAndRender('index.html', data)
    .on('data', function (data) {
      wstream.write(data.toString());
    });