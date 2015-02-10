var properties = require('./src/js/game/properties.js');

module.exports = function (grunt) {

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
            files: [
                'gruntfile.js',
                '<%= project.js %>'
                ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            options: {
                livereload: productionBuild ? false : properties.liveReloadPort
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
                        cwd: 'socket.io/',
                        src: ['**'],
                        dest: 'build/socket.io/'
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

        uglify: {
            options: {
                banner: '<%= project.banner %>',
                beautify: false
            },
            dist: {
                files: {
                    '<%= project.bundle %>': '<%= project.bundle %>'
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