/* global require, module */
var EmberApp = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    // Add options here
  });

  app.import('bower_components/moment/moment.js');
  app.import('bower_components/moment/locale/pt-br.js');

  app.import({
    development: app.bowerDirectory + '/jquery.inputmask/dist/jquery.inputmask.bundle.js',
    production: app.bowerDirectory + '/jquery.inputmask/dist/min/jquery.inputmask.bundle.min.js'
  });

  return app.toTree();
};
