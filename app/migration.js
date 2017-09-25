const replace = require('replace');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const partials = {
  'styles': 'styles',
  'articleFooter': 'articleFooter',
  'articleHead': 'articleHead',
  'footer': 'footer',
  'githubButton': 'githubButton',
  'header': 'header',
  'learnMore': 'learnMore',
  'logoAccent': 'logoAccent',
  'logoPrimary': 'logoPrimary',
  'logoWhite': 'logoWhite',
  'primaryNavMenu': 'primaryNavMenu',
  'sidebar': 'sidebar',
  'socialFooter': 'socialFooter',
  'subscribeLightbox': 'subscribeLightbox',
  'subscribeToNewsletter': 'subscribeToNewsletter',
  'subscribeToReleaseLightbox': 'subscribeToReleaseLightbox',
  'subscribeToReleases': 'subscribeToReleases',
  'valueBullets': 'valueBullets',
  'analytics': 'analytics',
  'commonHead': 'commonHead'
}

Object.keys(partials).forEach(key => {
  replace({
    regex: escapeRegExp(partials[key]),
    replacement: key,
    paths: ['.'],
    recursive: true,
    silent: true,
  });
})
