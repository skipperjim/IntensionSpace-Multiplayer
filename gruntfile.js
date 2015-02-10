var properties = require('./src/js/game/properties.js');

module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-socket.io');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-pngmin');

    var productionBuild = !!(grunt.cli.tasks.length && grunt.cli.tasks[0] === 'build');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        project: {
            src: 'src/js',
            js: '<%= project.src %>/game/{,*/}*.js',
            dest: 'build/js',
            bundle: 'build/js/app.min.js',
            port: properties.port,
            sources: ['gruntfile.js', 'src/js/**/*.js'],
            banner: '/*!\n' +
                ' * <%= pkg.title %>\n' +
                ' * <%= pkg.description %>\n' +
                ' * <%= pkg.url %>\n' +
                ' * @author <%= pkg.author %>\n' +
                ' * @version <%= pkg.version %>\n' +
                ' * Copyright <%= pkg.author %>. <%= pkg.license %> licensed.\n' +
                ' * Made using Phaser Blank <https://github.com/lukewilde/phaser-blank/>\n' +
                ' */\n'
        },
        requirejs: {
            dev: {
                options: {
                    baseUrl: '.',
                    name: 'src/js/lib/module.js',
                    mainConfigFile: "src/js/game/app.js",
                    out: 'build/main-built.js',
                    optimize: 'uglify',
                    paths: {
                        clientio: 'src/js/client.js',
                        serverio: 'src/js/lib/socket.io.js',
                    }
                }
            },
            compile: {
                options: {
                    appDir: 'src',
                    baseUrl: "src/js/lib",
                    mainConfigFile: "src/js/lib/config.js",
                    dir: 'build',
                    done: function (done, output) {
                        var duplicates = require('rjs-build-analysis').duplicates(output);

                        if (duplicates.length > 0) {
                            grunt.log.subhead('Duplicates found in requirejs build:');
                            grunt.log.warn(duplicates);
                            done(new Error('r.js built duplicate modules, please check the excludes option.'));
                        }

                        done();
                    }
                }
            }
        },
        connect: {
            dev: {
                options: {
                    port: '<%= project.port %>',
                    base: './build'
                }
            },
            server: {
                options: {
                    port: 3700,
                    base: './build',
                    socketio: true,
                    keepalive: true
                }
            }
        },
        express: {
            options: {
                // Setting to `false` will effectively just run `node path/to/server.js`
                background: false,
                // Called when the spawned server throws errors
                fallback: function() {},
                // Override node env's PORT
                port: 3700,
            },
            dev: {
                options: {
                    script: './server.js'
                }
            },
            prod: {
                options: {
                    script: 'path/to/prod/server.js',
                    node_env: 'production'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            options: {
                //livereload: productionBuild ? false : properties.liveReloadPort
                livereload: true
            },
            express: {
                files: ['**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false // for grunt-contrib-watch v0.5.0+, "nospawn: true" for lower versions. Without this option specified express won't be reloaded
                }
            },
            clientjs: {
                files: 'src/js/*.js',
                tasks: ['copy:clientjs']  
            },
            js: {
                files: '<%= project.dest %>/lib/*.js',
                tasks: ['copy:jslib']
            },
            jslib: {
                files: '<%= project.dest %>/**/*.js',
                tasks: ['jade']
            },
            jade: {
                files: 'src/templates/*.jade',
                tasks: ['jade']
            },
            stylus: {
                files: 'src/style/*.styl',
                tasks: ['stylus']
            },
            images: {
                files: 'src/images/**/*',
                tasks: ['copy:images']
            },
            audio: {
                files: 'src/audio/**/*',
                tasks: ['copy:audio']
            }
        },

        browserify: {
            app: {
                src: ['<%= project.src %>/game/app.js'],
                dest: '<%= project.bundle %>',
                options: {
                    transform: ['browserify-shim'],
                    watch: true
                        //debug: !productionBuild
                }
            }
        },

        open: {
            server: {
                path: 'http://localhost:<%= project.port %>'
            }
        },

        cacheBust: {
            options: {
                encoding: 'utf8',
                algorithm: 'md5',
                length: 16,
                rename: true,
                jsonOutput: false,
                jsonOutputFilename: 'cachebuster.json'
            },
            assets: {
                files: [
                    {
                        src: [
                        'build/index.html',
                        '<%= project.bundle %>'
                        ]
                    }
                ]
            }
        },

        jade: {
            compile: {
                options: {
                    data: {
                        properties: properties,
                        productionBuild: productionBuild
                    }
                },
                files: {
                    'build/index.html': ['src/templates/index.jade']
                }
            }
        },

        stylus: {
            compile: {
                files: {
                    'build/style/index.css': ['src/style/index.styl']
                },
                options: {
                    sourcemaps: !productionBuild
                }
            }
        },

        clean: ['./build/'],

        pngmin: {
            options: {
                ext: '.png',
                force: true
            },
            compile: {
                files: [
                    {
                        src: 'src/images/*.png',
                        dest: 'src/images/'
}
]
            }
        },

        copy: {
            images: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/images/',
                        src: ['**'],
                        dest: 'build/images/'
                    }
                ]
            },
            audio: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/audio/',
                        src: ['**'],
                        dest: 'build/audio/'
                    }
                ]
            },
            p2: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['**'],
                        dest: 'build/js/'
                    }
                ]
            },
            socketio: {
                files: [
                    {
                        expand: true,
                        cwd: 'node_modules/socket.io-client/',
                        src: ['socket.io.js'],
                        dest: 'build/socket.io/'
                    }
                ]
            },
            clientjs: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/',
                        src: ['**'],
                        dest: 'build/js/'
                    }
                ]
            },
            jslib: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js/lib/',
                        src: ['**'],
                        dest: 'build/js/lib/'
                    }
                ]
            }
        },
        concat: {
            js: {
                src: [
                    //'build/js/app.min.js', 'build/js/lib/socket.io.js', 'build/js/lib/client.js'
                    'src/js/lib/socket.io.js', 'src/js/client.js', 'build/js/app.min.js'
                ],
                dest: 'build/js/complete-app.min.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= project.banner %>',
                beautify: false
            },
            dist: {
                files: {
                    '<%= project.bundle %>': '<%= project.bundle %>'
                    //'build/js/complete-app.js': 'build/js/complete-app.min.js'
                }
            }
        },

        compress: {
            options: {
                archive: '<%= pkg.name %>.zip'
            },
            zip: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**/*'],
                    dest: '<%= pkg.name %>/'
}]
            },
            cocoon: {
                files: [{
                    expand: true,
                    cwd: 'build/',
                    src: ['**/*']
}]
            }
        }
    });

    grunt.registerTask('default', [
        'clean',
        'browserify',
        'jade',
        'stylus',
        'copy',
        'cacheBust',
        'connect:dev',
        'express:dev',
        'open',
        'watch',
    ]);

    grunt.registerTask('build', [
        'jshint',
        'clean',
        'browserify',
        'jade',
        'stylus',
        'uglify',
        'copy',
        'cacheBust',
        'connect:dev',
        'express:dev',
        'open',
        'watch'
    ]);
    
    grunt.registerTask('optimise', ['pngmin', 'copy:images']);
    grunt.registerTask('cocoon', ['compress:cocoon']);
    grunt.registerTask('zip', ['compress:zip']);
};