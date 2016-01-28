/*
 * grunt-bower-freeze
 * 
 *
 * Copyright (c) 2016 Comerge AG, Christoph Krautz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Lodash
  var _ = require('lodash');

  grunt.registerMultiTask('bowerfreeze', 'Freeze the bower.json to exact versions', function() {
      var done = this.async();

      var cwd = this.data.options.cwd || './';
      var src = cwd + this.data.src;
      var dest = cwd + this.data.dest;

      grunt.util.spawn({
          cmd: 'bower',
          args: ['list', '--json', '--offline'],
          opts: {
              'cwd': cwd
          }
      }, function (err, result) {
          var output = result.stdout;
          if (output) {
              var dependencies = JSON.parse(output);
              grunt.log.write('Loading source file ' + src + ' ... ');
              var bower = grunt.file.readJSON(src);
              grunt.log.writeln('DONE');
              _.forOwn(dependencies.dependencies, function (value, key) {
                  if (!value.pkgMeta) {
                      grunt.fail.fatal('Please run bower install first');
                  }
                  
                  if (bower.dependencies[key]) {
                      bower.dependencies[key] = value.pkgMeta._release;
                  }
                  if (bower.devDependencies[key]) {
                      bower.devDependencies[key] = value.pkgMeta._release;
                  }
                  if (bower.resolutions[key]) {
                      bower.resolutions[key] = value.pkgMeta._release;
                  }
              });
              var frozen = JSON.stringify(bower, null, '  ');
              console.log(frozen);
              grunt.file.write(dest, frozen);
          }
          done();
      });
  });

};
