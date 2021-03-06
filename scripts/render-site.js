// Runs on babel-node only, because it uses React components
'use strict';

const buildRoutes = require('../site/routes').buildRoutes;
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const pify = require('pify');
const timelog = require('./timelog');

const siteDistDir = path.join(__dirname, '../dist');
const pageTemplatePath = path.join(__dirname, '../site/template.html');

function writePage(pageData, pageTemplate) {
  const pagePath = path.join(siteDistDir, pageData.route);
  const pageContent = ReactDOMServer.renderToStaticMarkup(pageData.component);

  const fullPage = pageTemplate.split('{content}').join(pageContent);

  return pify(mkdirp)(pagePath).then(() => {
    return pify(fs.writeFile)(path.join(pagePath, 'index.html'), fullPage);
  }).then(() => {
    timelog(`Completed ${pageData.name}`);
  });
}

function renderSite() {
  timelog('Rendering site');

  let pageTemplate;
  const readTemplate = pify(fs.readFile)(pageTemplatePath, 'utf8')
    .then((content) => pageTemplate = content);

  return Promise.all([
    readTemplate,
    mkdirp(siteDistDir)
  ])
    .then(() => {
      const buildPages = buildRoutes().map((pageData) => {
        return writePage(pageData, pageTemplate);
      });
      return Promise.all(buildPages);
    })
    .then(() => timelog('Done rendering site'));
}

module.exports = renderSite;

if (require.main === module) {
  renderSite().catch((err) => console.error(err.stack));
}
