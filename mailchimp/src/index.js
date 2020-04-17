const request = require('request');

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


exports.handler = async (event) => {

  const response = {
    headers: {
      'AMP-Access-Control-Allow-Source-Origin': event.queryStringParameters.__amp_source_origin,
      'Access-Control-Expose-Headers': 'AMP-Access-Control-Allow-Source-Origin'
    }
  };

  if (event.queryStringParameters && event.queryStringParameters.listid) {

    const options = optionsFactory();

    options.url = `${config.url}/lists/${event.queryStringParameters.listid}/members/`;

    if (event.requestContext && event.requestContext.EMAIL) {

      optionsCopy.body = jsonForMailchimp(event.requestContext);

      request(optionsCopy, function (err, mailchimpResponse) {

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
