## Tutorial Page for the TSMEAN Project (an example of an AMP page)

This is the code the tsmean tutorial page at http://www.tsmean.com is built with.

This repository isn't interesting if you're interested in building a MEAN
application. If you're interested in how to build a a MEAN application visit the actual page at
http://www.tsmean.com. If, however, you think the
tsmean.com page has an awesome layout, loads really fast, or is somehow else
interesting and you'd like to build a page just like it, you've come to the right place.

The tsmean.com page is built with AMP. AMP stands for Accelerated Mobile Pages
and is a framework for super-fast loading pages.

## Installation

```
git clone https://github.com/bersling/tsmean-amp.git my-project #replace my-project with your project's name
cd my-project
npm install #installs the required packages
npm run build #compiles the code
npm start #starts a server
```

Now you should have a server running at port 8082.

## Development

The project is compiled from multiple html-snippets into multiple html pages (that are amp compatible). The templating language used is mustache. In order
to continuously watch your changes run
```
npm run watch
```
otherwise you'll have to do "npm run build" after any change yourself. It's really up to you.

Since it's an AMP project, you'll have to be careful to follow the rules
of AMP. For instance, in an AMP project you're not allowed to use
the `<img>` tag. You'll have to use the `<amp-img>` tag. If you don't follow those rules
your page doesn't break, it just doesn't get the "AMP-SEO Bonus" anymore. During the build process, it logs to the console whether each page passes amp validation or not.


### Structure

The structure of the project is as follows:

```
tsmean-amp/
├── app/
│   ├── components/ # here are reusable UI elements for your app
│   │   ├── some-component/
│   │   │   ├── some-component.html
│   │   │   └── some-component.scss
│   │   └── ... # more components
│   ├── pages/ #here go pages of your app (e.g. /about)
│   │   ├── index.html # the root page
│   │   ├── ... # more pages
│   │   ├── category1/ # pages that will be available on /category1
│   │   │   ├── page1.html # will be on /category/page1
│   │   │   ├── page2.html
│   │   │   └── ... # more pages
│   │   └── ... # more categories
│   └── styles/
│       ├── styles.scss # the root of your scss
│       ├── button.scss # styling your buttons...
│       └── ... # even more styles
├── dist/ # auto-generated folder that holds the compiled sources
├── node_modules/ # auto-generated folder that holds the node_modules
├── README.md # what you're currently reading
├── deploy.sh # deploy script, adjust to your needs...
├── package.json # definition of all "npm" commands & packages that are required
├── server.ts # small server to test app locally
├── yarn.lock # auto-generated, ensures the same packages are installed for all yarn users.
├── .gitignore # files being ignored from git
└── compile.ts # part of the build process
```
