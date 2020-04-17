// derived from https://github.com/myshenin/aws-lambda-multipart-parser/blob/master/index.js

function getValueIgnoringKeyCase(object, key) {
  const foundKey = Object
      .keys(object)
      .find(currentKey => currentKey.toLocaleLowerCase() === key.toLowerCase());
  return object[foundKey];
}

function getBoundary(event) {
  return getValueIgnoringKeyCase(event.headers, 'Content-Type').split('=')[1];
}

function decodeBase64(str) {
  return Buffer.from(str, 'base64').toString('utf8');
}

module.exports.parse = (event, spotText) => {
  const boundary = getBoundary(event);
  const result = {};

  const body = decodeBase64(event.body);

  body.split(boundary)
      .forEach(item => {
        if (/filename=".+"/g.test(item)) {
          result[item.match(/name=".+";/g)[0].slice(6, -2)] = {
            type: 'file',
            filename: item.match(/filename=".+"/g)[0].slice(10, -1),
            contentType: item.match(/Content-Type:\s.+/g)[0].slice(14),
            content: spotText? Buffer.from(item.slice(item.search(/Content-Type:\s.+/g) + item.match(/Content-Type:\s.+/g)[0].length + 4, -4), 'binary'):
                item.slice(item.search(/Content-Type:\s.+/g) + item.match(/Content-Type:\s.+/g)[0].length + 4, -4),
          };
        } else if (/name=".+"/g.test(item)){
          console.log('name: ' + item);
          result[item.match(/name=".+"/g)[0].slice(6, -1)] = item.slice(item.search(/name=".+"/g) + item.match(/name=".+"/g)[0].length + 4, -4);
        }
      });
  return result;
};
