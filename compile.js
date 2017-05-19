var mu = require('mu2');

mu.root = __dirname + '/src';
var data = require('./src/data.json');
mu.compileAndRender('index.html', data)
    .on('data', function (data) {
      console.log(data.toString());
    });