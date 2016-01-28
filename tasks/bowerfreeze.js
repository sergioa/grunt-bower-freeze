/*
 * grunt-bower-freeze
 * 
 *
 * Copyright (c) 2016 Comerge AG, Christoph Krautz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Lodash
    var _ = require('lodash');

    function freeze(cwd, src, dest, done) {
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

                    if (bower.dependencies && bower.dependencies[key]) {
                        bower.dependencies[key] = value.pkgMeta._release;
                    }
                    if (bower.devDependencies && bower.devDependencies[key]) {
                        bower.devDependencies[key] = value.pkgMeta._release;
                    }
                    if (bower.resolutions && bower.resolutions[key]) {
                        bower.resolutions[key] = value.pkgMeta._release;
                    }
                });
                var frozen = JSON.stringify(bower, null, '  ');
                grunt.file.write(dest, frozen);
            }
            done();
        });
    }

    grunt.registerMultiTask('bowerfreeze', 'Freeze the bower.json to exact versions', function () {
        var done = this.async();

        var updateBower = false;
        var installBower = false;
        var cwd = './';
        if (this.data.options) {
            updateBower = this.data.options.update || updateBower;
            installBower = this.data.options.install || installBower;
            cwd = this.data.options.cwd || cwd;
        }
        var src = cwd + this.data.src;
        var dest = cwd + this.data.dest;

        if (updateBower) {
            grunt.log.write('Updating bower dependencies ... ');
            grunt.util.spawn({
                cmd: 'bower',
                args: ['update'],
                opts: {
                    'cwd': cwd
                }
            }, function () {
                grunt.log.writeln('DONE');
                freeze(cwd, src, dest, done);
            })
        } else if (installBower) {
                grunt.log.write('Installing bower dependencies ... ');
                grunt.util.spawn({
                    cmd: 'bower',
                    args: ['install'],
                    opts: {
                        'cwd': cwd
                    }
                }, function() {
                    grunt.log.writeln('DONE');
                    freeze(cwd, src, dest, done);
                })
        } else {
            freeze(cwd, src, dest, done);
        }
    });

};
