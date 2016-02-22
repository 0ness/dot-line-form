(function (window,document) {
	"use strict";
	
	
	
	
	/*============================================================
	//function 暗転処理
	============================================================*/
	var blackOut = function(){
		var wrap = document.getElementById("wrapper"),
			blackOut_timer,
			flg = true,
			time = 10000;

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

	
	var canvasChange = function(){
		var _canvasContent = document.getElementById("content_01");
//		_canvasContent.outerHTML = "";
//		_canvasContent.setAttribute("src","common/js/contents/02.js");
//		var _scr = document.createElement('script');
//		_scr.type 	= 'text/javascript';
//		_scr.src	= "common/js/contents/02.js"
//		var _firstScript = document.getElementsByTagName('script')[0];
//		_firstScript.parentNode.insertBefore(_scr,_firstScript);
		
		$(_canvasContent).attr("src", "common/js/contents/02.js").ready(function(){
//			$(iframeContainerID).fadeTo(fadeInDuration,1.0, function(){
//				isTransitioning = false;				
//			});
		});
	};


	/*============================================================
	//function 開始処理
	============================================================*/
	var rnd_01 		= new LetterFader("headName"),
		rnd_02 		= new LetterFader("headNameSub"),
		rnd_02_02 	= new LetterFader("headNameSub_02"),
		rnd_03		= new LetterFader("txtCopy_01"),
		rnd_03_02 	= new LetterFader("txtCopy_01_02"),
		rnd_04 		= new LetterFader("txtCopy_02"),
		rnd_04_02 	= new LetterFader("txtCopy_02_02");

	rnd_01.duration 	= 400;
	rnd_03.delay 		= 10;
	rnd_03_02.delay 	= 10;
	rnd_04.delay 		= 5;
	rnd_04_02.delay 	= 5;
	rnd_03.duration 	= 500;
	rnd_03_02.duration	= 500;
	rnd_04.duration 	= 500;
	rnd_04_02.duration 	= 500;
	
	
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
				document.getElementById("works").style.opacity = 1;
				blackOut();
				setTimeout(canvasChange,2000);
			},800);
		},800);
	};
	setTimeout(function(){
		document.getElementById("vi").className += " is-displayed";
		$(document.getElementById("mask")).fadeOut(1000,"easeInQuart");
		setTimeout(init,1600);
	},600);

	
	
	
}(window,document));
