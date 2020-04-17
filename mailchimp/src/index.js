const request = require('request');
const parser = require('parse-multipart');

function jsonForMailchimp(mergeFields) {
  return {
    "email_address": mergeFields.EMAIL,
    "status": "pending",
    "merge_fields": mergeFields
  }
}

const config = {
  user: process.env.user,
  key: process.env.key,
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

function sendRequestToMailchimp(options) {
  return new Promise((resolve, reject) => {
    request(options, function (err, mailchimpResponse) {
      if (err) {
        reject(err);
      } else {
        resolve(mailchimpResponse);
      }
    });
  });
}


exports.handler = async (event) => {

  const inputData = parser.parse(event);

  const response = {
    statusCode: 501,
    headers: {
      'AMP-Access-Control-Allow-Source-Origin': event.queryStringParameters.__amp_source_origin,
      'Access-Control-Expose-Headers': 'AMP-Access-Control-Allow-Source-Origin'
    }
  };

  if (event.queryStringParameters && event.queryStringParameters.listid) {

    if (inputData && inputData.EMAIL) {

      try {
        const options = optionsFactory();
        options.url = `${config.url}/lists/${event.queryStringParameters.listid}/members/`;
        options.body = jsonForMailchimp(inputData);

        const mailchimpResponse = await sendRequestToMailchimp(options);

        response.statusCode = mailchimpResponse.statusCode;
        response.body = JSON.stringify(mailchimpResponse.body);
      } catch (e) {
        console.error(e);
      }

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
