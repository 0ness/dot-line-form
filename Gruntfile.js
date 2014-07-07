
//マルチタスクの登録
//module.exports = function(grunt){
//
//    /*grunt.initConfig({
//        タスク１：{
//            ターゲット1：データ1,
//            ターゲット2：データ2,
//            ターゲット3：データ3,
//            ....,
//        },
//        タスク２:{
//        },
//        ....,
//    })
//    マルチタスクはinitConfigのデータを元に処理を行う
//    registerMultiTask関数と紐付いているため関数と同じ名前を持つ
//    各タスクに2つ以上値がある場合、それぞれに処理が走る*/
//    grunt.initConfig({
//        mygreattask:{
//            target1:"so great",
//            target2:"very great"
//        },
//        mycooltask:{
//            target1:"so cool",
//            target2:"very cool"
//        }
//    });
//
//    /*grunt.registerMultiTask
//    registerTaskと基本的な記述は同じ、this.targetとthis.dataが利用できる*/
//    grunt.registerMultiTask("mygreattask","マルチタスクのテスト_01",function(){
//        grunt.log.writeln("target: "+this.target);
//        grunt.log.writeln("data: "+this.data);
//    });
//
//    grunt.registerMultiTask("mycooltask","マルチタスクのテスト_02",function(){
//
//        /*async()
//        実行した際、そのタスクは非同期であることをgrunt側が判断する
//        完了時に関数を返し、その関数の実行によってタスク完了をgurnt側が判断する
//        引数にfalseを入れるとタスクの失敗を連絡できる*/
//        var done = this.async();
//        var self = this;
//        setTimeout(function(){
//            grunt.log.writeln("target: "+self.target);
//            grunt.log.writeln("data: "+self.data);
//            done();
//        },1000);
//    });
//
//    grunt.registerTask("default",["mygreattask","mycooltask"]);
//
//}


//タスクの外部ファイル化
//module.exports = function(grunt){
//
//    /*grunt.task.loadTasks（ディレクトリ）
//    ディレクトリ内のファイルを読み込む*/
//    grunt.task.loadTasks("mytasks");
//
//    grunt.initConfig({
//        mygreattask:{
//            target1:"so great",
//            target2:"very great"
//        },
//        mycooltask:{
//            target1:"so cool",
//            target2:"very cool"
//        }
//    });
//
//    grunt.registerTask("default",["mygreattask","mycooltask"]);
//
//};


//Gruntプラグインの導入（uglifyの場合）
//module.exports = function(grunt){
//
//    /*grunt.loadNpmTask(インストールするプラグイン名)
//    gruntにプラグインをインストールする*/
//    grunt.loadNpmTasks("grunt-contrib-uglify");
//
//    //uglifyの設定を追加
//    grunt.initConfig({
//        uglify:{
//            /*options
//            プラグインそれぞれのオプション機能*/
//            options:{
//                banner:"/* uglifyプラグインのオプションテスト */"
//            },
//            foo:{
//                src:"common/js/main.js",
//                dest:"common/js/minify/main.min.js"
//            },
//            bar:{
//                src:"common/js/pageInfo.js",
//                dest:"common/js/minify/pageInfo.min.js"
//            }
//        }
//    });
//
//    //処理を実行
//    grunt.registerTask("default",["uglify"]);
//}


//Gruntプラグインの導入（concatの場合）
//module.exports = function(grunt){
//
//    grunt.loadNpmTasks("grunt-contrib-concat");
//
//    grunt.initConfig({
//        //concatの設定を追加
//        concat:{
//            js:{
//                src:[
//                    "common/js/pageInfo.js",
//                    "common/js/jquery/jquery.js",
//                    "common/js/jquery/easing.js"
//                ],
//                dest:"common/js/test.js"
//            }
//        }
//    });
//
//    grunt.registerTask("default",["concat"]);
//}


//Gruntプラグインの導入（watchの場合）
//module.exports = function(grunt){
//
//    grunt.loadNpmTasks("grunt-contrib-uglify");
//    grunt.loadNpmTasks("grunt-contrib-watch");
//
//    grunt.initConfig({
//        uglify:{
//            test:{
//                src:"common/js/main.js",
//                dest:"common/js/minify/main.min.js"
//            }
//        },
//        watch:{
//            js:{
//                files:"<%= uglify.test.src %>",
//                tasks:["uglify"]
//            }
//        }
//    });
//
//    grunt.registerTask("default",["uglify"]);
//
//}


//Gruntプラグインの導入（watchの場合）
module.exports = function(grunt){

	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-sass");
	grunt.loadNpmTasks("grunt-autoprefixer");
	grunt.loadNpmTasks("grunt-play");
	grunt.loadNpmTasks("grunt-shell");
//	grunt.loadNpmTasks("grunt-utf8tosjis" );
	grunt.loadNpmTasks("grunt-remove-logging");
	grunt.loadNpmTasks("grunt-newer");


	//基本的なタスクセット
    grunt.initConfig({
        concat:{
            baseJS:{
                src:[
                    "common/js/pageInfo.js",
                    "common/js/jquery/jquery.js",
                    "common/js/jquery/easing.js",
                    "common/js/ie/selectivizr-min.js",
                    "common/js/library.js"
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
        play:{
            fanfare:{
                file:"node_modules/grunt-play/sounds/sound.mp3"
            }
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

    //grunt.registerTask("default",["concat","uglify","clean","play"]);


};


