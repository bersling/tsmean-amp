var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/dist')).listen(8080, function(){
  console.log('Server running on 8080...');
});

/* Maybe someday you'll use that for SSL
app.use(function(req, res, next) {
  if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
    res.redirect('https://' + req.get('Host') + req.url);
    console.log('redirectin');
  }
  else {
    next();
    console.log('im good')
  }
});
 */
