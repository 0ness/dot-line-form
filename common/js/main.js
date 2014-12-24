$(function(){


	/*const 定数
	--------------------------------------------------------------------*/
	var win = window,
		doc = document,
		canvas = doc.getElementById("canvas"),
		ctx = canvas.getContext("2d");
	
	var $nav = $(doc.getElementById("mainNav")),
		$page_01 = $(doc.getElementById("page_01")),
		$page_02 = $(doc.getElementById("page_02"));

	
	
	
	/*function サイト内導線の処理
	--------------------------------------------------------------------*/

	//ナビゲーション実装
	var mainNav = function(){

		var $btn = $nav.find("li"),
			$btn_01 = $(doc.getElementById("mb_01")),
			$btn_02 = $(doc.getElementById("mb_02")),
			$btn_03 = $(doc.getElementById("mb_03")),
			spd = 400,
			ease = "linear";

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

	
	
	
	/*function bodyにランダムなクラスを追加する
	--------------------------------------------------------------------*/
	var randID = function(){
		var $body = $("body");
		var aryID = ["midNight"];
		var len = aryID.length+1;

		//ランダムなID
		var id = Math.random()*len>>0;

		$body.attr("id",aryID[id]);

		return false;
	};
	
		
	return false;
});