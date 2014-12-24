//Gruntプラグインの導入（watchの場合）
module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-shell");
//	grunt.loadNpmTasks("grunt-utf8tosjis" );
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks("grunt-newer");


	//基本的なタスクセット
    grunt.initConfig({
        concat:{
            baseJS:{
                src:[
                    "common/js/lib/PageInfo.js",
                    "common/js/jquery/jquery.js",
                    "common/js/jquery/easing.js",
                    "common/js/ie/selectivizr-min.js",
					"common/js/lib/library.js"
                ],
                dest:"common/js/base.js"
            }
        },
		removelogging:{
			baseJS:{
				src: "common/js/base.js",
				dest:"common/js/minify/base.js"
			},
            mainJS:{
                src: "common/js/main.js",
                dest:"common/js/minify/main.js"
            }
		},
        uglify:{
			baseJS:{
                src:"common/js/minify/base.js",
                dest:"common/js/minify/base.js"
            },
            mainJS:{
                src:"common/js/minify/main.js",
                dest:"common/js/minify/main.js"
            }
        },
//		utf8tosjis:{
//			dist:{
//				expand:true,
//				flatten: true,
////				cwd:'./common/js/minify',
//				src:'common/js/main.js',
//				dest:'common/js/minify'
//		  }
//		},
		clean:{
            js:"<%= concat.baseJS.dest %>"
        },
		sass:{
			options:{
				style: 'compact'
			},
			dist:{
				files:{
					'common/style/layout.css': 'common/scss/layout.scss',
					'common/style/contents.css': 'common/scss/contents.scss'
				}
			}
		},
		autoprefixer:{
			options:{
				browsers: ['last 2 version','ie 7','ie 8','ie 9','ios 5']
			},
			file:{
				expand: true,
				flatten: true,
				src:'common/style/*.css',
				dest:'common/style/'
			}
		},
		shell:{
			styledocco:{
				command: function () {
					return ' styledocco --preprocessor "sass" common/scss/module.scss';
				}
			}
		},
        watch:{
            js:{
				options: {
					spawn: false
				},
                files:[
                    "<%= concat.baseJS.src %>",
                    "<%= removelogging.mainJS.src %>"
                ],
                tasks:["newer:concat","newer:removelogging","newer:uglify"/*,"clean",*//*"utf8tosjis"*/]
            },
			sass:{
				files:"common/scss/*.scss",
				tasks:["sass"]
			},
			css:{
				options: {
					spawn: false
				},
				files:"<%= autoprefixer.file.src %>",
                tasks:["autoprefixer"]
			},
			styleguide:{
				files:"common/scss/module.scss",
                tasks:["shell:styledocco"]
			}
        }
	});



};


