module.exports = function(grunt) {

    var browsers = [{
      browserName: 'firefox',
      version: '19',
      platform: 'XP'
    }, {
      browserName: 'googlechrome',
      platform: 'XP'
    }, {
      browserName: 'googlechrome',
      platform: 'linux'
    }, {
      browserName: 'internet explorer',
      platform: 'WIN8',
      version: '10'
    }, {
      browserName: 'internet explorer',
      platform: 'VISTA',
      version: '9'
    }];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                eqeqeq: true,
                trailing: true,
                curly: true,
                indent: 4,
                latedef: false,
                undef: true,
                unused: true,
                maxparams: 4,
                maxdepth: 4,
                maxstatements: 25,
                maxcomplexity: 8,
                maxlen: 120,
                jquery: true,
                browser: true,
                predef: ["teoria", "Raphael", "ABCHeader", "ABCPrinter", "AbcTuneBook", "AbcParse", "console", "AbcParseHeader", "key_signatures", "alert"]

            },
            target: {
                src: ['source/scripts/red-jackets*.js']
            },
        },
        qunit: {
            all: ['test/tests.html']

        },
        connect: {
          server: {
            options: {
              base: '',
              port: 9999
            }
          }
        },

        'saucelabs-qunit': {
          all: {
            options: {
              urls: [
                'http://127.0.0.1:9999/index.html'
              ],
              browsers: browsers,
              build: process.env.TRAVIS_JOB_ID,
              testname: 'qunit tests',
              throttled: 3,
              sauceConfig: {
                'video-upload-on-pass': false
              }
            }
          }
        },
        watch: {},

        copy: {
            build: {
                cwd: 'source',
                src: ['**'],
                dest: 'build',
                expand: true
            },
            fonts: {
                cwd: 'build/css/fonts',
                src: ['**'],
                dest: 'build/css',
                expand: true,
            }
        },
        clean: {
            build: {
                src: ['build']
            },
            stylesheets: {
                src: ['build/css/*.css', 'build/css/fonts/*.css', '!build/css/red-jackets-fakebook.css']
            },
            scripts: {
                src: ['build/scripts/*.js', '!build/red-jackets-fakebook.js']
            },
            zip: {
                src: ['red-jackets-fakebook.zip']
            },
            svgs: {
                src: ['build/images/svg/*.svg', 'build/images/svg/']
            },
            html: {
                src: ['build/index.html'] // Remove the htmls that are minified
            }
        },
        uglify: {
            build: {
                options: {
                    mangle: true,
                    beautify: false,
                    preserveComments: false,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    'build/red-jackets-fakebook.min.js': ['build/scripts/*.js']
                }
            }
        },
        cssmin: {
            build: {
                files: {
                    'build/css/red-jackets-fakebook.css': ['build/css/*.css', 'build/css/fonts/*.css']
                }
            }
        },
        compress: {
            main: {
                options: {
                    archive: 'red-jackets-fakebook.zip'
                },
                files: [{
                        expand: true,
                        cwd: 'build/',
                        src: ['**'],
                        dest: '.'
                    }, // includes files in path and its subdirs

                ]
            }
        },
        svgmin: { // Task
            options: { // Configuration that will be passed directly to SVGO
                plugins: [{
                    removeViewBox: false
                }, {
                    removeEmptyContainers: true
                }, {
                    removeEmptyText: true
                }, {
                    removeHiddenElems: true
                }, {
                    removeMetadata: true
                }, {
                    removeComments: true
                }, {
                    removeUselessStrokeAndFill: true
                }, {
                    mergePaths: true
                }, {
                    convertPathData: false
                }, {
                    convertShapeToPath: true
                }, {
                    convertColors: true
                }, {
                    removeEmptyAttrs: true

                }]
            },
            dist: { // Target
                files: [{ // Dictionary of files
                    expand: true, // Enable dynamic expansion.
                    cwd: 'build/images/svg', // Src matches are relative to this path.
                    src: ['*.svg'], // Actual pattern(s) to match.
                    dest: 'build/images', // Destination path prefix.
                    ext: '.min.svg' // Dest filepaths will have this extension.
                    // ie: optimise img/src/branding/logo.svg and store it in img/branding/logo.min.svg
                }]
            }
        },
        htmlmin: { // Task
            dist: { // Target
                options: { // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: { // Dictionary of files
                    'build/index.html': 'source/index.html', // 'destination': 'source'
                }
            },
        },
        strip_code: {
            options: {
                start_comment: "test-code",
                end_comment: "end-test-code",
            },
            remove_test_code: {
                // a list of files you want to strip code from
                src: "build/*.js"
            }
        },
        responsive_images: {
            splash: {
                options: {
                    engine: 'im',
                    sizes: [{
                        height: 240,
                        width: 400,
                    }, {
                        height: 480,
                        width: 800,
                    }, {
                        height: 960,
                        width: 1600,
                    }]
                },
                files: [{
                    expand: true,
                    src: ['images/splash.png'],
                    cwd: 'build/',
                    dest: 'build/',
                }]
            }
        },
    });

    // Load the plugin that provides the "jshint" task.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-saucelabs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-strip-code');
    grunt.loadNpmTasks('grunt-responsive-images');

    // Custom tasks
    grunt.registerTask('unusedimages', function() {
        var assets = [],
            links = [];

        // Get list of images
        grunt.file.expand({
            filter: 'isFile',
            cwd: 'build/images/' // Change this to your images dir
        }, ['**/*']).forEach(function(file) {
            assets.push(file);
        });

        // Find images in content
        grunt.file.expand({
            filter: 'isFile',
        }, ['build/*.html', 'build/css/**/*.css']).forEach(function(file) { // Change this to narrow down the search
            var content = grunt.file.read(file);
            assets.forEach(function(asset) {
                if (content.search(asset) !== -1) {
                    links.push(asset);
                }
            });
        });

        // Output unused images
        var unused = grunt.util._.difference(assets, links);
        console.log('Found ' + unused.length + ' unused images:');
        unused.forEach(function(el) {
            console.log(el);
        });
    });

    // Default task(s).
    grunt.registerTask('images', ['responsive_images']);
    grunt.registerTask('test', ['unusedimages', 'jshint', 'qunit']);
    grunt.registerTask('saucetest', ['connect', 'saucelabs-qunit']);
    grunt.registerTask('export', ['clean:build', 'copy:build']);
    grunt.registerTask('scripts', ['strip_code', 'uglify', 'clean:scripts']);
    grunt.registerTask('stylesheets', ['cssmin', 'clean:stylesheets', 'copy:fonts']);
    grunt.registerTask('svgs', ['svgmin', 'clean:svgs']);
    grunt.registerTask('html', ['clean:html', 'htmlmin']);
    grunt.registerTask('zip', ['clean:zip', 'compress'])

    grunt.registerTask('default', ['test', 'export', 'scripts', 'stylesheets', 'svgs', 'images', 'html', 'zip']);
    grunt.registerTask('travis', ['saucetest','test']);

};
