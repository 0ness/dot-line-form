$(function(){
	"use strict";


	/*============================================================
	//const 定数
	============================================================*/
	var win = window,
		doc = document;
	
	var PLANET = new Planet();


	
	
	/*============================================================
	//function コンテンツ部分
	============================================================*/
	
	/**
	 * DotLineの管理
	 */
	var DotManager = function(){},
		DMProto = DotManager.prototype,
		MANAGER = new DotManager();
	
	//property
	DMProto.canvas 		= document.getElementById("canvas"),
	DMProto.ctx 		= DMProto.canvas.getContext("2d");
	DMProto.width		= 2000;
	DMProto.height		= 1200;
	DMProto.timeSpd		= 20;
	DMProto.endAngle	= 3.141592653589793*2;
	DMProto.length		= 0;
	DMProto.ary			= [];
	
	//method
	DMProto.setLine 	= function(a_obj){
		var _self = this;
		_self.ary[_self.length] = a_obj;
		_self.length += 1;
	};
	
	DMProto.draw 		= function(){
		var _self = this,
			_ary = _self.ary,
			_aryLen = _self.length;
		
		_self.ctx.clearRect(0,0,_self.width,_self.height);
		for(var i = 0; i<_aryLen; i++) _ary[i].arcDraw();
		win.requestAnimationFrame(MANAGER.draw.bind(MANAGER));
	};
	
	
	/**
	 * Dotオブジェクト
	 */
	var Dot = function(){
		this.angle = (Math.random()*360)>>0;
	};
	Dot.prototype = {
		id				:0,
		alpha			:1,
		size			:0,
		originalSize	:0,
		move			:0,
		color			:null,
		x				:0,
		y				:0,
		spdX			:0,
		spdY			:0,
		angle			:0,		// 角度（初期値）
		change			:1,	// 増やす角度（運動の増減値）
		pi				:0.01745329251,//3.141592653589793 / 180
		endAndgle		:3.141592653589793*2,
		
		scale:function(){
			var _self 	= this,
				_radian = _self.angle * _self.pi,			//度をラジアンに変換
				_by 	= _self.size * Math.sin(_radian)/2;	//円運動の値を計算
			
			_self.angle += _self.change;
			_self.size 	= _by+_self.originalSize;
		},
		
		draw:function(){
			var _self = this;
			_self.scale();
			MANAGER.ctx.arc(_self.x,_self.y,_self.size,0,_self.endAndgle,false);
			_self.x += _self.spdX;
			_self.y += _self.spdY;
		},
		
		alpha:function(){
			var _self = this;
			MANAGER.ctx.globalAlpha = _self.alpha;
			_self.alpha -= 50000;
		}
	}
	
	
	/**
	 * DotLineオブジェクト
	 * @param {[[Type]]} sx    [[Description]]
	 * @param {[[Type]]} sy    [[Description]]
	 * @param {[[Type]]} ex    [[Description]]
	 * @param {[[Type]]} ey    [[Description]]
	 * @param {[[Type]]} len   [[Description]]
	 * @param {[[Type]]} spd   [[Description]]
	 * @param {[[Type]]} size  [[Description]]
	 * @param {[[Type]]} color [[Description]]
	 */
	function DotLine(sx,sy,ex,ey,len,spd,size,color){
		var _self = this;
		_self.sx = sx;
		_self.sy = sy;
		_self.ex = ex;
		_self.ey = ey;

		_self.axis 	= 1;		//1：通常のxループ 2:反転のxループ 3:通常のyループ 4:反転のyループ
		_self.len 	= len+1;	//格納するオブジェクトの数
		_self.size 	= size;		//オブジェクトのサイズ
		_self.color = color || "#fff";
		_self.loop	= spd*10000;
		_self.ary 	= [];		//格納用配列
		_self.init();
		MANAGER.setLine(_self);
	};		
	DotLine.prototype = {
		
		//座標系オブジェクト
		sx			:0,
		sy			:0,
		ex			:0,
		ey			:0,
		distance	:0,
		
		//Dotオブジェクト用オブジェクト
		axis		:1,		//1：通常のxループ 2:反転のxループ 3:通常のyループ 4:反転のyループ
		len			:0,		//格納するオブジェクトの数
		size		:0,		//オブジェクトのサイズ
		color		:null,
		spdX		:0,
		spdY		:0,	//オブジェクトの速度
		disX		:0,	//オブジェクト毎の一定の距離
		disY		:0,	//オブジェクト毎の一定の距離
		loop		:0,
		spd 		:20,
		ary			:null,			//格納用配列
		
		init:function(){
			
			var dis_x = this.ex - this.sx,
				dis_y = this.ey - this.sy;

			//1つずつの距離
			this.disX = (dis_x / (this.len-1));
			this.disY = (dis_y / (this.len-1));

			//始点と終点の距離
			this.distance = PLANET.abs(dis_x);

			//移動スピード
			this.spdX = this.distance / this.loop * this.spd;
			this.spdY = PLANET.abs(dis_y) / this.loop * this.spd;
			this.spdX = (this.sx > this.ex) ? -this.spdX : this.spdX;
			this.spdY = (this.sy > this.ey) ? -this.spdY : this.spdY;

			//オブジェクト生成・設定・格納
			for(var i = 0; i<this.len; i++){
				var d = new Dot();
				d.id = i;
				d.size = this.size;
				d.originalSize = this.size;
				d.spdY = this.spdY;
				d.spdX = this.spdX;
				d.x = (this.sx+i*this.disX)-this.disX;
				d.y = (this.sy+i*this.disY)-this.disY;
				d.move = this.ex - d.x;
				this.ary[i] = d;
			}
		},
		arcDraw:function(){

			var arr = this.ary,
				dis = 0,
				flg = false,
				len = this.len,
				c = MANAGER.ctx;
			
			c.fillStyle = this.color;

			for(var i=0; i<len; i++){

				var d = arr[i];
				
				dis = PLANET.abs(d.x - this.sx) - this.distance;
				flg = (dis > 0) ? true : false;

				if(flg === true){
					var prev = d.id+1;
					if(prev === this.len) prev = 0;
					d.x = arr[prev].x-this.disX;
					d.y = arr[prev].y-this.disY;
				}

				//描画
				c.beginPath();
				d.draw();
				c.fill();

				d.x += d.spdX;
				d.y += d.spdY;
			}
		}
	};

	
	/*============================================================
	//function コンテンツ部分
	============================================================*/
	MANAGER.content_01 = function(){

		//オブジェクト設定
		var _self = this,
			_width = _self.width;
		
		var line_01 = new DotLine(_width,895,0,395,20,42,2),
			line_02 = new DotLine(_width,960,0,440,20,20,1),
			line_03 = new DotLine(_width,1200,0,600,10,4,1),
			line_04 = new DotLine(_width,900,0,400,40,40,1),
			line_05 = new DotLine(_width,1080,0,490,10,8,2),
			line_06 = new DotLine(_width,1100,0,500,20,6,0.8),
			line_07 = new DotLine(_width,1380,0,730,8,3,1.5),
			line_08 = new DotLine(_width,1380,0,730,6,3,4),
			line_09 = new DotLine(_width,900,0,415,30,30,0.5),
			line_10 = new DotLine(_width,890,0,400,80,25,0.5),
			line_11 = new DotLine(_width,960,0,400,40,15,0.5),
			line_12 = new DotLine(_width,878,0,388,4,50,2,"#ff0000"),
			line_13 = new DotLine(_width,1380,0,700,3,3,10),
			line_14 = new DotLine(_width,950,0,420,35,15,0.5),
			line_15 = new DotLine(_width,1050,0,480,25,10,0.5),
			line_16 = new DotLine(_width,1160,0,580,30,5,0.4),
			line_17 = new DotLine(_width,1170,0,590,23,4,0.8),
			line_18 = new DotLine(_width,1050,0,470,6,8,2),
			line_19 = new DotLine(_width,890,0,393,20,20,0.5,"#ff0000"),
			line_20 = new DotLine(_width,895,0,415,8,30,1),
			line_21 = new DotLine(_width,1430,0,700,8,2,2),
			line_22 = new DotLine(_width,910,0,420,30,14,0.5),
			line_23 = new DotLine(_width,1600,0,840,20,3,0.5),
			line_24 = new DotLine(_width,1580,0,820,20,4,2),
			line_25 = new DotLine(_width,910,0,405,20,10,0.5),
			line_26 = new DotLine(_width,900,0,395,5,40,3),
			line_27 = new DotLine(_width,1210,0,605,3,5,4),
			line_28 = new DotLine(_width,1300,0,640,3,2,3),
			line_29 = new DotLine(_width,1350,0,650,15,3,0.5),
			line_30 = new DotLine(_width,891,0,394,20,20,0.5,"#ff0000"),
			line_37 = new DotLine(_width,1020,0,460,3,8,3),
			line_38 = new DotLine(0,200,_width,300,3,10,1,"#ff0000"),
			line_39 = new DotLine(_width,200,0,300,3,10,1,"#ff0000"),
			line_40 = new DotLine(_width,200,0,320,8,15,0.5),
			line_41 = new DotLine(_width,940,0,420,40,10,1);

		//部分ループ
		var line_31 = new DotLine(1000,652,300,473,20,25,1),
			line_32 = new DotLine(1000,657,300,478,30,25,0.5),
			line_33 = new DotLine(800,535,930,0,8,15,0.8,"#ff0000"),
			line_34 = new DotLine(820,450,930,0,3,5,0.5),
			line_35 = new DotLine(1200,700,200,449,30,15,0.5),
			line_36 = new DotLine(1200,720,200,469,40,10,0.4);

		_self.draw();
	};

	
	

	/*============================================================
	//function 暗転処理
	============================================================*/
	var blackOut = function(){

		var wrap = doc.getElementById("wrapper"),
			blackOut_timer,
			flg = true,
			time = 10000;

		var bTimer = function(){
			wrap.className = "fadeOut";
			flg = true;
		};
		var classChange = function(){
			clearTimeout(blackOut_timer);
			blackOut_timer = setTimeout(bTimer,time);
			if(flg === true) wrap.className = "";
		};

		wrap.addEventListener("mousemove",classChange,false);
		blackOut_timer = setTimeout(bTimer,time);		
	};

	
	
	
	/*============================================================
	//function リサイズ処理
	============================================================*/
	var resizeFunc = function(){
		canvas.width = win.innerWidth || doc.body.clientWidth;
	};
	win.addEventListener("resize",resizeFunc);
	
	
	
	
	/*============================================================
	//function 開始処理
	============================================================*/
	var rnd_01 = new LetterFader("headName"),
		rnd_02 = new LetterFader("headNameSub"),
		rnd_03 = new LetterFader("txtCopy_01"),
		rnd_03_02 = new LetterFader("txtCopy_01_02"),
		rnd_04 = new LetterFader("txtCopy_02"),
		rnd_04_02 = new LetterFader("txtCopy_02_02"),
		rnd_05 = new LetterFader("txtCopy_03"),
		rnd_05_02 = new LetterFader("txtCopy_03_02");
	
	rnd_01.duration = 1000;
	rnd_03.delay = 24;
	rnd_03_02.delay = 24;
	rnd_04.delay = 24;
	rnd_04_02.delay = 24;
	rnd_05.delay = 24;
	rnd_05_02.delay = 24;
	rnd_03.duration = 700;
	rnd_03_02.duration = 700;
	rnd_04.duration = 700;
	rnd_04_02.duration = 700;
	rnd_05.duration = 700;
	rnd_05_02.duration = 700;

	var init = function(){
		rnd_01.random();
		rnd_02.random();
		
		setTimeout(function(){
			rnd_03.random();
			rnd_03_02.random();
			rnd_04.random();
			rnd_04_02.random();
			rnd_05.random();
			rnd_05_02.random();
			setTimeout(function(){
				doc.getElementById("message").className = "blcColumnParent";
				doc.getElementById("profile").style.opacity = 1;
				doc.getElementById("about").style.opacity = 1;
				blackOut();
			},2000);
		},1700);
	}
	
	resizeFunc();
	MANAGER.content_01();
	$(doc.getElementById("mask")).delay(300).fadeOut(1500,init);

	return false;

});
