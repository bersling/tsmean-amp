const request = require('request');
const Busboy = require('busboy');
const inspect = require('util').inspect;

function jsonForMailchimp(mergeFields) {
  return {
    "email_address": mergeFields.EMAIL,
    "status": "pending",
    "merge_fields": mergeFields
  }
}

const config = {
  user: process.env.user,
  key: process.env.user,
  url: process.env.url,
};

function optionsFactory() {
  return {
    url: undefined, //added dynamically
    body: undefined, //added dynamically
    json: true,
    auth: {
      user: config.user,
      pass: config.key
    },
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    }
  };
}

function parseMultipartForm(event) {
  return new Promise((resolve, reject) => {
    const contentType = event.headers['Content-Type'] || event.headers['content-type'];
    const busboy = new Busboy({headers: {
        'content-type': contentType
      }});

    busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
      resolve('Field [' + fieldname + ']: value: ' + inspect(val));
    });
  });
}


exports.handler = async (event) => {

  console.log('staring the handler');

  const inputData = await parseMultipartForm(event);
  console.log(inputData);

  const response = {
    headers: {
      'AMP-Access-Control-Allow-Source-Origin': event.queryStringParameters.__amp_source_origin,
      'Access-Control-Expose-Headers': 'AMP-Access-Control-Allow-Source-Origin'
    }
  };

  if (event.queryStringParameters && event.queryStringParameters.listid) {

    const options = optionsFactory();

    options.url = `${config.url}/lists/${event.queryStringParameters.listid}/members/`;

    if (inputData && inputData.EMAIL) {

      options.body = jsonForMailchimp(inputData);

      request(options, function (err, mailchimpResponse) {

        if (err) {
          console.error('error posting json: ', err);
          throw err
        }

        response.statusCode = mailchimpResponse.statusCode;
        response.body = mailchimpResponse;
      });

    } else {
      response.statusCode = 400;
      response.body = JSON.stringify('You need a payload with an "EMAIL" property');
    }

  } else {
    response.statusCode = 400;
    response.body = JSON.stringify('You need to have the listid query parameter');
  }

  return response;

};
