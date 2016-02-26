(function (window,document) {
	"use strict";
	
	var Index = function(){
		this.init();
	},
		Member = Index.prototype;
	
	
	
	Member.$canvasFrame =	$(document.getElementById("canvas-iframe"));
	Member.$sketchLink	=	$(document.getElementById("sketch").querySelectorAll("a.sketch-item__link"));
	
	
	Member.init = function(){
		this.changeCanvas();
	};
	
	/**
	 * canvasコンテンツ切り替え
	 */
	Member.changeCanvas = function(){
		var _self = this,
			_$sketchLink = this.$sketchLink;
		_$sketchLink.on("click",function(e){
			e.preventDefault();
			var _url = $(this).attr("href");
			_self.canvasFadeChange(_url);
		});	
	};
	
	/**
	 * canvasフェード処理
	 * @param {string} _url ページURL
	 */
	Member.canvasFadeChange = function(_url){
		var _$frame = this.$canvasFrame;
		_$frame.fadeTo(600,0,"linear",function(){
			_$frame.attr("src",_url).fadeTo(600,1,"linear");
		});
	};
	
	
	
	
	
	/*============================================================
	//function 暗転処理
	============================================================*/
	var blackOut = function(){
		var wrap = document.getElementById("wrapper"),
			blackOut_timer,
			flg = true,
			time = 12000;

		var bTimer = function(){
			wrap.className = "fadeOut";
			flg = true;
		};
		var blackOutReset = function(){
			clearTimeout(blackOut_timer);
			blackOut_timer = setTimeout(bTimer,time);
			if(flg === true) wrap.className = "";
		};

		wrap.addEventListener("mousemove",blackOutReset,false);
		blackOut_timer = setTimeout(bTimer,time);		
	};

	

	/*============================================================
	//function 開始処理
	============================================================*/
	var rnd_01 		= new LetterFader({id:"headName"}),
		rnd_02 		= new LetterFader({id:"headNameSub"}),
		rnd_02_02 	= new LetterFader({id:"headNameSub_02"}),
		rnd_03		= new LetterFader({id:"txtCopy_01"}),
		rnd_03_02 	= new LetterFader({id:"txtCopy_01_02"}),
		rnd_04 		= new LetterFader({id:"txtCopy_02"}),
		rnd_04_02 	= new LetterFader({id:"txtCopy_02_02"});
	
	rnd_01.duration 	= 400;
//	rnd_03.delay 		= 10;
//	rnd_03_02.delay 	= 10;
	rnd_04.delay 		= 5;
	rnd_04_02.delay 	= 5;
	rnd_03.duration 	= 600;
	rnd_03_02.duration	= 600;
	rnd_04.duration 	= 400;
	rnd_04_02.duration 	= 400;
	
	var init = function(){
		rnd_01.random();
		rnd_02.random();
		rnd_02_02.random();
		setTimeout(function(){
			rnd_03.random();
			rnd_03_02.random();
			rnd_04.random();
			rnd_04_02.random();
			setTimeout(function(){
				document.getElementById("profile").style.opacity = 1;
				document.getElementById("about").style.opacity = 1;
				document.getElementById("sketch").style.opacity = 1;
				document.getElementById("works").style.opacity = 1;
				blackOut();
			},1000);
		},600);
	};
	setTimeout(function(){
		document.getElementById("vi").className += " is-displayed";
		$(document.getElementById("mask")).fadeOut(1000,"easeInQuart");
		setTimeout(init,1400);
	},600);

	
	
	
	window.Index = Index;
	
}(window,document));

var index = new Index();