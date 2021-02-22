import * as fs from 'fs';

/*
* ARGUMENTS:
* CATEGORY in dash case.     Example: "error-handling"
* TITLE in quotes.           Example: "Always handle errors"
* */


const category = process.argv[2];
const title = process.argv[3];

if (category == null || title == null) {
  console.error(`Expected category (arg 1) and title (arg 2) to be non-null and of format:
  
/*
* ARGUMENTS:
* CATEGORY in dash case.     Example: "error-handling"
* TITLE in quotes.           Example: "Always handle errors"
* */
  
  
  `);
  process.exit();
}

const dashCaseUrlTitle = title.toLowerCase()
  .replace(/ /g, `-`)
  .replace(/\./g, ``)
  .replace(/\(/g, ``)
  .replace(/\)/g, ``)
  .replace(/,/g, '')
  .replace(/"/g, '')
  .replace(/%/g, '')
  .replace(/'/g, '');

function htmlFactory() {

  return `<!doctype html>
<html ⚡ lang="en">
<head>
  
  <title>{{title}}</title>
  <meta name="description" content="XXX">
  <meta name="keywords"
        content="XXX">
  <link rel="canonical" href="https://www.tsmean.com/articles/${category}/${dashCaseUrlTitle}" />
  {{> commonHead}}
  {{> articleHead}}
  {{> analytics}}

</head>
<body>
  
  {{> header}}
  
  <div class="jumbo-vertical">
    <amp-img class="jumbo-image"
             width="150"
             height="150"
             src="/assets/img/001-light-bulb.svg">
    </amp-img>
    <h1 class="jumbo-title">
      ${title}
    </h1>
    
    <div class="meta-header">
      <span class="written">XXX 2021</span>
    </div>
  
  </div>
  
  <article>
{{> ${dashCaseUrlTitle} }}
  </article>
  
  {{> articleFooter}}

</body>
</html>
`
}

const html = htmlFactory();

fs.mkdirSync(`./app/pages/articles/${category}`, {recursive: true});
fs.writeFileSync(`./app/pages/articles/${category}/${dashCaseUrlTitle}.html`, html);
fs.writeFileSync(`./app/pages/articles/${category}/${dashCaseUrlTitle}.md`, 'YOUR CONTENT HERE');

console.log(`
// compile.ts
addPagesToDirectory(
  'articles/${category}',
  [
    '${dashCaseUrlTitle}'
  ],
  pages
);
`);


console.log(`
// app/pages/articles/index.html
<h3>
  XXX
</h3>
<ul>
  <li>
    <a href="${category}/${dashCaseUrlTitle}">
      ${title}
    </a>
  </li>
</ul>
`);

