import * as fs from 'fs';

/*
* ARGUMENTS:
* CATEGORY in dash case.     Example: "error-handling"
* TITLE in quotes.           Example: "Always handle errors"
* */


const category = process.argv[2];
const title = process.argv[3];

if (category == null || title == null) {
  console.error(`Expected category and title to be non-null`);
  process.exit();
}

const dashCaseTitle = title.toLowerCase().replace(/ /g, `-`);

function htmlFactory() {

  return `<!doctype html>
<html ⚡ lang="en">
<head>
  
  <title>{{title}}</title>
  <meta name="description" content="XXX">
  <meta name="keywords"
        content="XXX">
  <link rel="canonical" href="https://www.tsmean.com/articles/${category}/${dashCaseTitle}" />
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
      <span class="written">XXX 2020</span>
    </div>
  
  </div>
  
  <article>
    YOUR CONTENT HERE
  </article>
  
  {{> articleFooter}}

</body>
</html>
`
}

const html = htmlFactory();

fs.mkdirSync(`./app/pages/articles/${category}`, {recursive: true});
fs.writeFileSync(`./app/pages/articles/${category}/${dashCaseTitle}.html`, html);

console.log(`
addPagesToDirectory(
  'articles/${category}',
  [
    '${dashCaseTitle}'
  ],
  pages
);
`);


console.log(`
<h3>
  XXX
</h3>
<ul>
  <li>
    <a href="${category}/${dashCaseTitle}">
      ${title}
    </a>
  </li>
</ul>
`);

