'use strict';
/*jshint asi: true */

var test = require('tap').test
  , prepareShims = require('../lib/prepare-shims');

var paths = {
        'jquery': 'vendor/jquery-1.8.2'
      , 'backbone': 'vendor/backbone'
        // no export since it is commonJS compliant
      , 'underscore': 'vendor/underscore'
        // no export since it attaches itself to jquery or zepto
      , 'backbone.stickit': 'vendor/backbone.stickit-mod'
    }

  , shims = {
      'jquery': { exports: '$' }
    , 'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      }
    , 'backbone.stickit': ['backbone']
      // missing in paths
    , 'handlebars': {
        exports: 'Handlebars'
      }
    }

function inspect(obj, depth) {
 return require('util').inspect(obj, false, depth || 5, true);
}

~function () {
  var expected = { 
    shims: [ { exports: '$',
        alias: 'jquery',
        path: 'vendor/jquery-1.8.2' },
      { deps: [ 'underscore', 'jquery' ],
        exports: 'Backbone',
        alias: 'backbone',
        path: 'vendor/backbone' },
      { deps: [ 'backbone' ],
        alias: 'backbone.stickit',
        path: 'vendor/backbone.stickit-mod' },
      { exports: 'Handlebars',
        alias: 'handlebars', 
        pathMissing: true,
        path: prepareShims.pathMissingFor('handlebars') 
      } ],
    missingPaths: [ 'handlebars' ] }
  
  test('requireJS dir and bundleJS dir is the same and given paths:\n' + inspect(paths) + '\nand shims:\n' + inspect(shims) + '\nit returns:\n' + inspect(expected), function (t) {
    t.deepEquals(prepareShims(shims, paths, '.', '.'), expected)
    t.end()
  })
}();

~function () {
  var expected = { 
    shims: [ { exports: '$',
        alias: 'jquery',
        path: '../vendor/jquery-1.8.2' },
      { deps: [ 'underscore', 'jquery' ],
        exports: 'Backbone',
        alias: 'backbone',
        path: '../vendor/backbone' },
      { deps: [ 'backbone' ],
        alias: 'backbone.stickit',
        path: '../vendor/backbone.stickit-mod' },
      { exports: 'Handlebars',
        alias: 'handlebars', 
        pathMissing: true,
        path: prepareShims.pathMissingFor('handlebars') 
      } ],
    missingPaths: [ 'handlebars' ] }
  
  test('requireJS is "." and buildJS dir is "./build" the same and given paths:\n' + inspect(paths) + '\nand shims:\n' + inspect(shims) + '\nit returns:\n' + inspect(expected), function (t) {
    t.deepEquals(prepareShims(shims, paths, '.', './build'), expected)
    t.end()
  })
}();
