const replace = require('replace');

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

const partials = {
  'styles': './styles/styles.css',
  'articleFooter': './components/article/article-footer.html',
  'articleHead': './components/article/article-head.html',
  'footer': './components/footer/footer.html',
  'githubButton': './components/github-button/github-button-inverse.html',
  'header': './components/header/header.html',
  'learnMore': './components/learn-more/learn-more.html',
  'logoAccent': './components/logo/accent.html',
  'logoPrimary': './components/logo/primary.html',
  'logoWhite': './components/logo/white.html',
  'primaryNavMenu': './components/primary-nav-menu/primary-nav-menu.html',
  'sidebar': './components/sidebar/sidebar.html',
  'socialFooter': './components/social-footer/social-footer.html',
  'subscribeLightbox': './components/subscribe-lightbox/subscribe-lightbox.html',
  'subscribeToNewsletter': './components/subscribe-to-newsletter/subsribe-to-newsletter.html',
  'subscribeToReleaseLightbox': './components/subscribe-to-release-lightbox/subscribe-to-release-lightbox.html',
  'subscribeToReleases': './components/subscribe-to-releases/subscrib-to-releases.html',
  'valueBullets': './components/value-bullets/value-bullets.html',
  'analytics': './components/analytics.html',
  'commonHead': './components/common-head.html'
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
