(function () {
	"use strict";



	/*const 共通定数　このJS内部でグローバルに使う定数
	--------------------------------------------------------------------*/
	//DOMオブジェクト
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var n_ObjLen = 60;
	var n_PI = Math.PI*2;
	var n_Angle = n_PI<<1;


	/*var 共通変数　このJS内部でグローバルに使う変数
	--------------------------------------------------------------------*/
	var n_iw = win.innerWidth || doc.body.clientWidth;  //ウィンドウ幅
	var n_ih = win.innerHeight || doc.body.clientHeight;//ウィンドウ高さ

	var aryObj = [];




	/*object Dotsオブジェクト
	--------------------------------------------------------------------*/
	function Dots(){

		this.dotLength 	=45;
		this.dotDisLimit = 180;
		this.composition = "source-over";
		this.dotSpd = 1;
		this.dotStartSpd = 5;
		this.dotSize =6;
		//this.dotFieldSize = 1;
		this.dotLineWidth = 4;
		this.clearAlpha = 0.5;
		this.fillAlpha = 1;

		var r = Math.floor(Math.random()*140);
		var g = Math.floor(Math.random()*140);
		var b = Math.floor(Math.random()*140);
		this.fillColor = "rgb("+r+", "+g+", "+b+")";

		r = Math.floor(Math.random()*255);
		g = Math.floor(Math.random()*255);
		b = Math.floor(Math.random()*255);
		this.fillHitColor = "rgb("+r+", "+g+", "+b+")";

		r = Math.floor(Math.random()*255);
		g = Math.floor(Math.random()*255);
		b = Math.floor(Math.random()*255);
		this.strokeColor = "rgb("+r+", "+g+", "+b+")";

		r = Math.floor(Math.random()*150);
		g = Math.floor(Math.random()*150)+20;
		b = Math.floor(Math.random()*150)+20;
		this.bgColor = "rgb("+r+", "+g+", "+b+")";

		this.fillShadowColor = "rgba(0,0,0,0.1)";
		this.flgFade = false;
		this.flgAutoSpd = false;
		this.difference = 0.1;






		//パラメータから算出した値
		this.dotLength = 200;
		this.dotDisLimit = 150;
		this.dotSpd = 1.2;									
		this.dotSize = 2.2;
		this.dotLineWidth = 0.2;
		this.fillAlpha 	= 1;
		this.clearAlpha = 0.1;
		this.flgFade = true;
		this.flgAutoSpd = false;	
		this.composition = "source-over";		
		this.fillColor = "#000";			
		this.fillHitColor = "rgb(0, 255, 59)";
		this.fillShadowColor = "rgba(0,0,0,1)";
		this.strokeColor = "#00de33";
		this.bgColor = "#000";
	};

	var dots = new Dots();


	/*object object Dotsオブジェクト
	--------------------------------------------------------------------*/
	var Point = function(){
		this.x = 0;
		this.y = 0;
		this.nX = 0;
		this.nY = 0;
		this.nextObj = null;
		this.flgHitted = false;
//		this.fillHitColor = "rgba(0,"+ (Math.random()*255|0) +", 0, 1)";
		this.fillHitColor = "rgb(0, 255, 59)";
		this.size = 1;
//		this.size = Math.random()*50 | 0;
//		if(this.size < 1) this.size = 1;
	}


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


	/*module オブジェクト作成 → 配列に格納
	--------------------------------------------------------------------*/
	var objSet = function(){

		aryObj = [];
		n_ObjLen = dots.dotLength>>0;

		for(var i=0; i<n_ObjLen; i++){

			var p = new Point(),
				spd = dots.dotStartSpd,
				spdHarf = spd/2;

			var rand = (Math.random()*2>>0),
				flg = (rand === 0)? true : false;
			p.x = (Math.random()*n_iw)>>0;
			p.y = (Math.random()*n_ih)>>0;

			if(rand === 0){
				p.nX = (((Math.random()*spd)-spdHarf)*1000|0)/1000;
			}else if(rand === 1){
				p.nY = (((Math.random()*spd)-spdHarf)*1000|0)/1000;
			}
			
			aryObj[i] = p;
		}

		for(var n=0; n<n_ObjLen; n++){
			if(n = n_ObjLen-1) return false;
			var p = aryObj[n];
			p.nextObj = aryObj[n+1];
		}

	};


	/*module 二点間の距離計算
	--------------------------------------------------------------------*/
	var pointDisCheck  = function(_p1,_p2){
		var p1 = _p1,
			p2 = _p2;

		var a = p1.x - p2.x,
			b = p1.y - p2.y,
			d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));

		return d;
	};


	/*module 差の絶対値の計算
	--------------------------------------------------------------------*/
	var absoluteValue = function(_num){
		var _n = _num;
		var n = _n < 0 ? -_n : _n;
		return n;
	}


	/*process 描画
	--------------------------------------------------------------------*/
	var objDraw = function(){

		var len = dots.dotLength>>0,
			_c	=ctx;
		if(n_ObjLen !== len) objSet();

		//基本の描画
		_c.globalCompositeOperation = dots.composition;
		_c.strokeStyle = dots.strokeColor;
		_c.lineWidth = dots.dotLineWidth;

		var limit = dots.dotDisLimit;
		var size = 0;

		for(var i=0; i<n_ObjLen; i++){

			var o = aryObj[i];

			var x = o.x,
				y = o.y,
				dis = limit,
				dis_02 = limit,
				flg = false;

			_c.globalAlpha = dots.fillAlpha;

			//他のポイントとの距離確認
			var o2,
				n_div,
				n_difX,
				n_difY,
				dis02 = limit,
				forLen = n_ObjLen - i,
				size = 2;


			for(var j=0; j<n_ObjLen; j++){

				var num;

				if(j === i) continue;
				o2 = aryObj[j];
				dis = pointDisCheck(o,o2);

				if(flg === true) break;
				if(dis >= limit ) continue;

				n_difX = x - o2.x;
				n_difY = y - o2.y;
				n_difX = absoluteValue(n_difX);
				n_difY = absoluteValue(n_difY);

				if(n_difX >= dots.difference　&& n_difY >= dots.difference) continue;

				_c.beginPath();
				_c.moveTo(x,y);
				_c.lineTo(o2.x,o2.y);
				_c.stroke();
				o.flgHitted = true;
				o2.flgHitted = true;
			}
			if(o.flgHitted === true){
				var _rand = Math.random()*2|0;
				if(o.nX === 0){
					o.nX = (_rand === 0)? o.nY : - o.nY;
					o.nY = 0;
				}else if(o.nY === 0){
					o.nY = (_rand === 0)? o.nX : - o.nX;
					o.nX = 0;
				}
			}

//			_c.globalAlpha = 1;
//			_c.fillStyle = dots.fillShadowColor;
//			_c.beginPath();
//			_c.arc(x,y+1,dots.dotSize+2,0,n_Angle,false);
//			_c.fill();
//			
//			_c.fillStyle = (o.flgHitted === true)? dots.fillHitColor :dots.fillColor;
//			_c.beginPath();
//			_c.arc(x,y,o.size,0,n_Angle,false);
//			_c.fill();

			_c.beginPath();
			if(o.flgHitted === true) {
				_c.fillStyle = o.fillHitColor;
//				_c.arc(x,y,o.size,0,n_Angle,false)
			}else{
				_c.fillStyle = dots.fillColor;
//				_c.arc(x,y,1,0,n_Angle,false);
			}
			_c.fill();

			x += o.nX*dots.dotSpd;
			y += o.nY*dots.dotSpd;

			if(x < 0) x = n_iw;
			else if(x > n_iw) x = 0,y = (Math.random()*n_ih)>>0;
			if(y < 0) y = n_ih,x = (Math.random()*n_iw)>>0;
			else if(y > n_ih) y = 0;

			o.x = x;
			o.y = y;

			o.flgHitted = false;
		}
	};


	/*process ループ関数
	--------------------------------------------------------------------*/
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
		win.requestAnimationFrame(loop);
	};


	/*function マウス座標取得
	--------------------------------------------------------------------*/
	canvas.style.backgroundColor = dots.bgColor;
	objSet();
	loop();


	/*function リサイズ実行
	--------------------------------------------------------------------*/
	var resizeFunc = function(){
		n_iw = win.innerWidth || doc.body.clientWidth;
		n_ih = win.innerHeight || doc.body.clientHeight;
		canvas.width = n_iw;
		canvas.height = n_ih;
	};


	/*contents 処理分岐
	--------------------------------------------------------------------*/
	resizeFunc();
	window.addEventListener("resize",resizeFunc);




}());
