exports.handler = async (event) => {

  if (req.query && req.query.listid) {
    const optionsCopy = CoreUtils.deepCopy(options);

    // set correct headers for amp
    res.setHeader('AMP-Access-Control-Allow-Source-Origin', req.query.__amp_source_origin);
    res.setHeader('Access-Control-Expose-Headers', 'AMP-Access-Control-Allow-Source-Origin');

    optionsCopy.url = `${config.url}/lists/${req.query.listid}/members/`;

    if (req.body && req.body.EMAIL) {

      optionsCopy.body = jsonForMailchimp(req.body);

      request(optionsCopy, function (err, mailchimpResponse) {

        if (err) {
          console.error('error posting json: ', err);
          throw err
        }

        const headers = mailchimpResponse.headers;
        const statusCode = mailchimpResponse.statusCode;

        res.status(statusCode).send(mailchimpResponse);
      });
    } else {
      res.status(400).send('You need a payload with an "EMAIL" property');
    }

  } else {
    res.status(400).send('You need to have the listid query parameter');
  }



  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;



};
