module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        concat : {
            optinss : {
                separator: ';'
            },
            dist: {
                src: ['node_modules/jquery/dist/jquery.min.js',
                    'node_modules/bootstrap/dist/js/bootstrap.min.js',
                    'node_modules/angular/angular.min.js',
                    'node_modules/angular-route/angular-route.min.js',
                    'node_modules/angular-bootstrap-switch/dist/angular-bootstrap-switch.min.js',
                    'node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js',
                    'app/app.js',
                    'app/seed/*.js',
                    'app/division/*.js',
                    'app/datatype/*.js'
                ],
                dest: 'build/manager.js'
            }
        },

        uglify: {
            build: {
                src: 'build/manager.js',
                dest: 'build/manager.min.js'
            }
        },

        cssmin: {
            css: {
                src: [ 'node_modules/bootstrap/dist/css/bootstrap.min.css',
                    'node_modules/bootstrap-switch/dist/css/bootstrap3/bootstrap-switch.min.css',
                    'app/app.css'],
                dest: 'build/manager.min.css'
            }
        },

        htmlmin: {
            options : {
                removeComments : true,
                removeCommentsFromCDATA: true,
                collapseWhitespace:true,
                collapseBooleanAttributes:true,
                removeAttributeQuotes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },

            html: {
                files: [
                    {
                        expand:true,
                        cwd: 'app/',
                        src:['index.html',
                             'seed/*.html',
                             'datatype/*.html',
                             'division/*.html'],
                        dest: 'build/'
                    }
                ]
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-uglify");
    //grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-usemin');

    grunt.registerTask('default', ['concat', 'uglify', 'cssmin','htmlmin']);
}
