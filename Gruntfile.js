"use strict";
Error.stackTraceLimit = 100;

module.exports = function( grunt ) {
    function writeFile( dest, content ) {
        grunt.file.write( dest, content );
        grunt.log.writeln('File "' + dest + '" created.');
    }

    var gruntConfig = {};

    gruntConfig.pkg = grunt.file.readJSON("package.json");

    gruntConfig.jshint = {
        all: {
            options: {
                globals: {
                    "console": false,
                    "require": false,
                    "module": false,
                    "define": false,
                    "escape": false
                },

                "bitwise": false,
                "camelcase": true,
                "curly": true,
                "eqeqeq": true,
                "es3": true,
                "forin": true,
                "immed": true,
                "latedef": false,
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonew": true,
                "plusplus": false,
                "quotmark": "double",
                "undef": true,
                "unused": true,
                "strict": false,
                "trailing": true,
                "maxparams": 7,
                "maxlen": 80,

                "asi": false,
                "boss": true,
                "eqnull": true,
                "evil": true,
                "expr": false,
                "funcscope": false,
                "globalstrict": false,
                "lastsemic": false,
                "laxcomma": false,
                "laxbreak": false,
                "loopfunc": true,
                "multistr": true,
                "proto": false,
                "scripturl": true,
                "smarttabs": false,
                "shadow": true,
                "sub": true,
                "supernew": false,
                "validthis": true,

                "browser": true,
                "jquery": true,
                "devel": true,


                '-W014': true,
                '-W116': true,
                '-W106': true,
                '-W064': true,
                '-W097': true
            },

            files: {
                src: [
                    "./src/urlparser.js"
                ]
            }
        }
    };

    gruntConfig.jshint.all.options.reporter = require("jshint-stylish");
    grunt.initConfig(gruntConfig);
    grunt.loadNpmTasks('grunt-contrib-jshint');


    grunt.registerTask( "testrun", function() {
        var fs = require("fs");
        var done = this.async();
        var Mocha = require("mocha");

        var mochaOpts = {
            reporter: "spec",
            timeout: 500,
            slow: Infinity
        };

        var mocha = new Mocha(mochaOpts);

        fs.readdirSync("./test").forEach(function(fileName) {
            mocha.addFile("./test/" + fileName);
        });

        mocha.run(function(err){
            if( err ) {
                process.stderr.write(test.title + "\n" + err.stack + "\n");
                done(err);
            }
            else {
                done();
            }
        }).on( "fail", function( test, err ) {
            process.stderr.write(test.title + "\n" + err.stack + "\n");
            done(err);
        });
    });

    grunt.registerTask( "test", ["jshint", "testrun"] );
    grunt.registerTask( "default", ["jshint"] );

};
