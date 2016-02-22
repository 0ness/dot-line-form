(function (window,document) {
	"use strict";


	
	
	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var $main = $(doc.getElementById("main"));

	var s_r = (Math.random()*255)>>0;
	var s_g = (Math.random()*255)>>0;
	var s_b = (Math.random()*255)>>0;
	var s_dotColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)";
	//		var s_dotColor = "rgba(255,255,255, 0.9)";
	var s_ctxComposition = "xor";

	var n_Loop = 28;
	var n_ObjLen = 60;
	//		var n_PI = 3.141592653589793;
	var n_PI = Math.PI*2;
	var n_Angle = n_PI<<1;
	var n_DisLimit = 50;


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

	var aryObj = [];

	//座標
	var mousePoint = {x:0,y:0};





	/*object Dotsオブジェクト
	--------------------------------------------------------------------*/
	function Dots(){

		this.dotLength =80;
		this.dotDisLimit = 230;
		this.composition = "source-over";
		this.dotSpd = 2;
		this.dotStartSpd = 5;
		this.dotSize =1;
		//this.dotFieldSize = 1;
		this.dotLineWidth = 0;
		this.clearAlpha = 1;
		this.fillAlpha = 0.04;

		var s_r = (Math.random()*255)>>0;
		var s_g = (Math.random()*255)>>0;
		var s_b = (Math.random()*255)>>0;
		this.fillColor = "rgb("+s_r+", "+s_g+", "+s_b+")";
		this.strokeColor = "rgba("+s_r+", "+s_g+", "+s_b+",0.9)";


		var r = Math.floor(Math.random()*55)+200;
		var g = Math.floor(Math.random()*55)+200;
		var b = Math.floor(Math.random()*55)+200;
		this.bgColor = "rgb("+r+", "+g+", "+b+")";
		//			this.bgColor = "#ffffff"

		this.flgLine = false;
		this.flgFade = false;
		this.flgAutoSpd = false;

		return false;
	};

	var dots = new Dots();


	/*object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
//	var gui = new dat.GUI();
//
//	var DatParam = function() {};
//	var param = new DatParam();
//	gui.remember(dots);
//	gui.add(dots, 'dotLength',10,300);
//	gui.add(dots, 'dotDisLimit',10,600);
//	gui.add(dots, 'dotSpd',0,8).listen();
//	gui.add(dots, 'dotSize',0,20);
//	gui.add(dots, 'fillAlpha',0,1);
//	gui.add(dots, 'clearAlpha',0,1);
//	//		gui.add(dots, 'dotFieldSize',1,10);
//	gui.add(dots, "flgFade");
//	gui.add(dots, "flgLine");
//	gui.add(dots, "flgAutoSpd");
//	gui.add(dots, 'dotLineWidth',0,20);
//	gui.add(dots,'composition',["xor","lighter","multiply","difference","source-over"]);
//	gui.addColor(dots, 'fillColor');
//	gui.addColor(dots, 'strokeColor');
//	//		gui.add(dots, 'fieldAlpha',0,0.4).listen();
//
//	var bgChange = gui.addColor(dots, 'bgColor');
//	bgChange.onChange(function(value) {
//		canvas.style.backgroundColor = value;
//	});

	var plus = 0.05;
	var flg = true;
	var detune = 0.02;
	var parmUpdate = function() {
		if(dots.flgAutoSpd === false ) return false;

		if(flg === true) dots.dotSpd += (8 - dots.dotSpd ) * detune;
		else dots.dotSpd += (0 - dots.dotSpd ) * detune;

		if(dots.dotSpd > 7.8) flg = false;
		else if(dots.dotSpd <= 0.2) flg =true;

	};



	/*contents 処理
	--------------------------------------------------------------------*/

	//module 二点間の距離計算
	var pointDisCheck  = function(_p1,_p2){

		var p1 = _p1;
		var p2 = _p2;

		var a = 0;
		var b = 0;
		var d = 0;

		a = p1.x - p2.x;
		b = p1.y - p2.y;
		d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

		return d;
	};

	//object Pointオブジェクト
	var Point = function(){};
	Point.prototype = {
		x:0,
		y:0,
		nX:0,
		nY:0
	}

	//process オブジェクト作成 → 配列に格納
	var objSet = function(){

		aryObj = [];
		n_ObjLen = dots.dotLength>>0;

		for(var i=0; i<n_ObjLen; i++){

			var p = new Point();
			var spd = dots.dotStartSpd;
			var spdHarf = spd/2;

			p.x = (Math.random()*n_iw)>>0;
			p.y = (Math.random()*n_ih)>>0;
			p.nX = (Math.random()*spd)-spdHarf;
			p.nY = (Math.random()*spd)-spdHarf;
			aryObj[i] = p;
		}

		return false;
	};

	//process 描画
	var objDraw = function(){


		var len = dots.dotLength>>0;
		if(n_ObjLen !== len) objSet();


		//基本の描画
		ctx.fillStyle = dots.fillColor;
		ctx.globalCompositeOperation = dots.composition;
		ctx.strokeStyle = dots.strokeColor;
		ctx.lineWidth = dots.dotLineWidth;

		var limit = dots.dotDisLimit;
		var size = 0;

		for(var i=0; i<n_ObjLen; i++){

			var o = aryObj[i];
			var x = o.x;
			var y = o.y;
			var dis = limit;
			var dis_02 = limit;

			ctx.globalAlpha = dots.fillAlpha;
			ctx.beginPath();
			ctx.moveTo(o.x,o.y);

			//他のポイントとの距離確認
			for(var j=0; j<n_ObjLen; j++){
				if(j === i) continue;
				var o2 = aryObj[j];
				dis = pointDisCheck(o,o2);
				if(dis < limit) {
					ctx.lineTo(o2.x,o2.y);
				}
			}
			ctx.closePath;
			if(dots.flgLine === true) ctx.stroke();
			ctx.fill();

			ctx.globalAlpha = 1;

			ctx.beginPath();
			ctx.arc(x,y,dots.dotSize,0,n_Angle,false);
			ctx.closePath;
			ctx.fill();


			x += o.nX*dots.dotSpd;
			y += o.nY*dots.dotSpd;

			if(x < 0) x = n_iw;
			else if(x > n_iw) x = 0;

			if(y < 0) y = n_ih;
			else if(y > n_ih) y = 0;

			o.x = x;
			o.y = y;
		}


		return false;
	};


	//process ループ関数
	var loop = function(){

		if(dots.flgFade === true){
			ctx.globalAlpha = dots.clearAlpha;
			ctx.fillStyle = dots.bgColor;

			ctx.beginPath();
			ctx.rect(0,0,n_iw,n_ih);
			ctx.closePath();
			ctx.fill();
		}else{
			ctx.clearRect(0,0,n_iw,n_ih);
		}

		//ctx.globalAlpha = 1;
		parmUpdate();

		objDraw();
		window.requestAnimationFrame(loop);
	};



	canvas.style.backgroundColor = dots.bgColor;
	objSet();
	loop();





}(window,document));