import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import {ServeStaticOptions} from 'serve-static';

const options: ServeStaticOptions = {
  extensions: ['html']
};
const port = 8082;
connect().use(serveStatic(__dirname + '/dist', options)).listen(port, function(){
  console.log(`Server running on ${port}...`);
});
