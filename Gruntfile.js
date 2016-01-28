/*
 * grunt-bower-freeze
 * 
 *
 * Copyright (c) 2016 Comerge AG
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        copy: {
            test: {
                files: [
                    {src: ['test/fixtures/default-bower.json'], dest: 'tmp/default/bower.json'},
                    {src: ['test/fixtures/missing-resolutions-bower.json'], dest: 'tmp/missing-resolutions/bower.json'}
                ]
            }
        },

        // Configuration to be run (and then tested).
        bowerfreeze: {
            default_options: {
                options: {
                    cwd: 'tmp/default/',
                    install: true
                },
                src: 'bower.json',
                dest: 'bower-frozen.json'
            },
            missing_resolutions: {
                options: {
                    cwd: 'tmp/missing-resolutions/',
                    install: true
                },
                src: 'bower.json',
                dest: 'bower-frozen.json'
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-bower-install-simple');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'copy:test', 'bowerfreeze', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

};
