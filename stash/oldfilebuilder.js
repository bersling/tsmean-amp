

console.log('=== BUILD ALL SECTIONS ===');
const githubRoot = "https://raw.githubusercontent.com";
const githubPathPartial = "/bersling/typescript-mongo-express-node-seed/master";

const sections = {
  'app-config' : {
    'app-config.test.ts.html': '/src/config/app-config.test.ts',
    'app-config.ts.html': '/src/config/app-config.ts',
    'app-properties.model.ts.html': '/src/config/app-properties.model.ts',
    'local.properties.json.html': '/properties/local.properties.json',
    'test.properties.json.html': '/properties/test.properties.json'
  },
  'authentication': {
    'login-router.test.ts.html': '/src/router/endpoints/login-router.test.ts',
    'login-router.ts.html': '/src/router/endpoints/login-router.ts',
    'passport.test.ts.html': '/src/auth/passport.test.ts',
    'passport.ts.html': '/src/auth/passport.ts',
    'password-cryptographer.test.ts.html': '/src/auth/password-cryptographer.test.ts',
    'password-cryptographer.ts.html': '/src/auth/password-cryptographer.ts',
    'user.model.ts.html': '/src/db/user.model.ts',
    'user-dao.test.ts.html': '/src/db/user-dao.test.ts',
    'user-dao.ts.html': '/src/db/user-dao.ts'
  },
  'database': {
    'before-eachs.ts.html' : '/src/test/before-eachs.ts',
    'dao.test.ts.html' : '/src/db/dao.test.ts',
    'dao.ts.html' : '/src/db/dao.ts',
    'database.test.ts.html' : '/src/db/database.test.ts',
    'database.ts.html' : '/src/db/database.ts',
    'database-response.model.ts.html' : '/src/db/database-response.model.ts',
    'utils.ts.html' : '/src/utils/utils.ts'
  },
  'router': {
    'index.ts.html' : '/src/index.ts',
    'middleware.ts.html' : '/src/router/middleware.ts',
    'router.test.ts.html' : '/src/router/router.test.ts',
    'router.ts.html' : '/src/router/router.ts',
    'endpoints/simple-crud-router.test.ts.html' : '/src/router/endpoints/simple-crud-router.test.ts',
    'endpoints/simple-crud-router.ts.html' : '/src/router/endpoints/simple-crud-router.ts',
    'endpoints/welcome-html-router.test.ts.html' : '/src/router/endpoints/welcome-html-router.test.ts',
    'endpoints/welcome-html-router.ts.html' : '/src/router/endpoints/welcome-html-router.ts',
  },
  'setup': {
    'logger.test.ts.html' : '/src/logger/logger.test.ts',
    'logger.ts.html' : '/src/logger/logger.ts',
    'tsconfig.json.html' : '/tsconfig.json',
    'package.json.html': '/package.json'
  }
};

const githubRawPage = (file) => {
  return githubRoot + githubPathPartial + file
};

const handleText = (text, file) => {
  let transformedText = text;

  //clean html
  transformedText = transformedText.replace(/</g, '&lt;');
  transformedText = transformedText.replace(/>/g, '&gt;');

  switch (file) {
    case 'package.json.html':
      transformedText = transformedText.replace('ts-mongo-express-node-seed', `<span class="highlight">project-name</span>`);
      transformedText = transformedText
          .replace(
              'Daniel Niederberger &lt;bersling@gmail.com&gt;',
              `<span class="highlight">Your Name &lt;youremail@gmail.com&gt;</span>`
          );
      const packagesToRemove = ['express', 'mongo', 'bcrypt', 'passport'];
      packagesToRemove.forEach(package => {
        const replace = ".*" + package + ".*[\r\n]";
        const re = new RegExp(replace, "mg");
        transformedText = transformedText.replace(re, "");
      });
      transformedText = transformedText.replace(/,([\s\r\n]*\})/gm, "$1");
    case 'router.ts.html':
      transformedText = transformedText.replace(
          "this.express.use('/api/v1/', loginRouter);",
          "// this.express.use('/api/v1/', loginRouter);"
      );
      transformedText = transformedText.replace(
          "this.express.use('/api/v1/', userRouter);",
          "// this.express.use('/api/v1/', userRouter);"
      );
      transformedText = transformedText.replace(
          "import {loginRouter} from './endpoints/login-router';",
          "// import {loginRouter} from './endpoints/login-router';"
      );
      transformedText = transformedText.replace(
          "import {userRouter} from './endpoints/user-router';",
          "// import {userRouter} from './endpoints/user-router';"
      );
      transformedText = transformedText.replace(
          "this.express.use('/api/v1/', simpleCrudRouter);",
          "// this.express.use('/api/v1/', simpleCrudRouter);"
      );
      transformedText = transformedText.replace(
          "import {simpleCrudRouter} from './endpoints/simple-crud-router';",
          "// import {simpleCrudRouter} from './endpoints/simple-crud-router';"
      );
    case 'middleware.ts.html':
      transformedText = transformedText.replace(
          "import * as passport from 'passport';",
          "// import * as passport from 'passport';"
      );
      transformedText = transformedText.replace(
          "express.use(passport.initialize());",
          "// express.use(passport.initialize());"
      )
  }
  return transformedText;
};

Object.keys(sections).forEach(section => {
  Object.keys(sections[section]).forEach(file => {
    const page = sections[section][file];



    https.get(githubRawPage(page), (res) => {

      let rawText = '';

      res.on('data', function (chunk) {
        rawText += chunk;
      });

      res.on('end', function () {

        const cleanedText = handleText(rawText, file);

        const wstream = fs.createWriteStream(`./src/sections/${section}/${file}`);
        wstream.write(cleanedText);

      });


    }).on('error', (e) => {
      console.error(e);
    });

  })
});

