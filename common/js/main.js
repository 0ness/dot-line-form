function init(){
	

	/*const 定数
	--------------------------------------------------------------------*/
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
    win.requestAnimFrame = (function(){
		return	win.requestAnimFrame ||
				win.webkitRequestAnimFrame ||
				win.mozRequestAnimFrame ||
				win.msRequestAnimFrame ||
				function(callback,element){
					win.setTimeout(callback,1000/60);
				};
	})();

			
	/*function サイト内導線の処理
	--------------------------------------------------------------------*/
	var system = function(){

		$(function(){

			//レイアウト要素
			var $nav = $(doc.getElementById("mainNav"));
			var $page_01 = $(doc.getElementById("page_01"));
			var $page_02 = $(doc.getElementById("page_02"));


			//ナビゲーション実装///////////////////////////////////////
			var mainNav = function(){

				var $btn = $nav.find("li");
				var $btn_01 = $(doc.getElementById("mb_01"));
				var $btn_02 = $(doc.getElementById("mb_02"));
				var $btn_03 = $(doc.getElementById("mb_03"));
				var spd = 400;
				var ease = "linear";

				$btn_01.on("click",function(){
					$page_01.fadeIn(spd,ease);
					$page_02.hide();
					$btn.removeClass();
					$(this).addClass("current");
				})

				$btn_02.on("click",function(){
					$page_01.hide();
					$page_02.fadeIn(spd,ease);
					$btn.removeClass();
					$(this).addClass("current");
				})
			}();
		
		});

	}();

	
	/*function bodyにランダムなクラスを追加する
	--------------------------------------------------------------------*/
	var randID = function(){
		$(function(){
			var $body = $("body");
			var aryID = ["midNight"];
			var len = aryID.length+1;
			
			//ランダムなID
			var id = Math.random()*len>>0;
			
			$body.attr("id",aryID[id]);
			
		});		
		return false;
	};
	
		
	return false;
};

//contents スクリプト動作開始
if(window.addEventListener) window.addEventListener("load",init, false);
else window.attachEvent("onload",init);