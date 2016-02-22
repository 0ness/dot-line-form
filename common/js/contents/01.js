(function (window,document) {
	"use strict";

	
	
	
	/*Static Property
	--------------------------------------------------------------------*/	
	var PLANET 	= new Planet(),
		ctx		= document.getElementById("canvas").getContext("2d");

	
	

	/*Classes
	--------------------------------------------------------------------*/	
	/**
	 * DotLineの管理
	 */
	var DotManager = function(){
		this.width	= 2000;
		this.height	= 1200;
		this.length	= 0;
		this.ary	= [];
	},
		DmMember = DotManager.prototype,
		MANAGER = new DotManager();
	
	DmMember.endAngle	= 3.141592653589793*2;
	
	//method
	DmMember.setLine 	= function(a_obj){
		this.ary[this.length] = a_obj;
		this.length += 1;
	};
	
	DmMember.draw 		= function(){
		var _self = this,
			_ary 	= _self.ary,
			_aryLen = _self.length;
		
		ctx.clearRect(0,0,_self.width,_self.height);
		for(var i = 0; i<_aryLen; i++) _ary[i].draw();
		window.requestAnimationFrame(_self.draw.bind(_self));
	};
	
	
	/**
	 * 点のラインオブジェクト
	 * @param {object} a_param 点のスタイルやパラメータ
	 */
	var DotLine = function(a_param){
		var _param = a_param;

		//座標プロパティ
		this.sx = _param.sx;
		this.sy = _param.sy;
		this.ex = _param.ex;
		this.ey = _param.ey;

		//Dotオブジェクト用オブジェクト
		this.axis 	= 1;		//1：通常のxループ 2:反転のxループ 3:通常のyループ 4:反転のyループ
		this.len 	= _param.len+1;	//格納するオブジェクトの数
		this.size 	= _param.size;		//オブジェクトのサイズ
		this.color 	= _param.color || "#fff";
		this.loop	= _param.spd*10000;
		this.spdX 	= 0;	
		this.spdY 	= 0;	//オブジェクトの速度		
		this.disX 	= 0;	//オブジェクト毎の一定の距離			
		this.disY 	= 0;	//オブジェクト毎の一定の距離				
		this.spd  	= 20;
		this.ary 	= [];		//格納用配列
		this.init();
		MANAGER.setLine(this);
	},
		DotLineMember = DotLine.prototype;

	/**
	 * 初期化
	 */
	DotLineMember.init = function(){
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
	};
	
	/**
	 * 点描画
	 */
	DotLineMember.draw = function(){
		var arr = this.ary,
			dis = 0,
			flg = false,
			len = this.len,
			c = ctx;

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
	};
	
	/**
	 * Dotオブジェクト
	 */
	var Dot = function(){
		this.id			= 0;
		this.alpha		= 1;
		this.size		= 0;
		this.originalSiz= 0;
		this.move		= 0;
		this.color		= null;
		this.x			= 0;
		this.y			= 0;
		this.spdX		= 0;
		this.spdY		= 0;
		this.angle 		= (Math.random()*360)>>0;
		this.change		= 1;	// 増やす角度（運動の増減値）
	},
		DotMember = Dot.prototype;
	
	//static property
	DotMember.pi 		= 0.0174532925;//3.141592653589793 / 180
	DotMember.endAndgle	= 3.141592653589793*2;
	
	//method
	/**
	 * 点の拡縮
	 */
	DotMember.scale = function(){
		var _radian = this.angle * this.pi,			//度をラジアンに変換
			_by 	= this.size * Math.sin(_radian)/2;	//円運動の値を計算

		this.angle += this.change;
		this.size 	= _by+this.originalSize;
	};
	/**
	 * 点の描画
	 */
	DotMember.draw = function(){
		this.scale();
		var _x 		= (this.x*10|0)/10,
			_y 		= (this.y*10|0)/10,
			_size	= (this.size*100|0)/100;
		ctx.arc(_x,_y,_size,0,this.endAndgle,false);
		this.x += this.spdX;
		this.y += this.spdY;
	};
	/**
	 * 透明度指定
	 */
	DotMember.alpha = function(){
		var _self = this;
		ctx.globalAlpha = _self.alpha;
		_self.alpha -= 50000;
	};
	
	
	
	
	/*============================================================
	//function コンテンツ部分
	============================================================*/
	var drawDriftCity = function(){

		//オブジェクト設定
		var _width = MANAGER.width;
		
		var line_01 = new DotLine({sx:_width,sy:895,ex:0,ey:395,len:20,spd:42,size:2}),
			line_02 = new DotLine({sx:_width,sy:960,ex:0,ey:440,len:20,spd:20,size:1}),
			line_03 = new DotLine({sx:_width,sy:1200,ex:0,ey:600,len:10,spd:4,size:1}),
			line_04 = new DotLine({sx:_width,sy:900,ex:0,ey:400,len:40,spd:40,size:1}),
			line_05 = new DotLine({sx:_width,sy:1080,ex:0,ey:490,len:10,spd:8,size:2}),
			line_06 = new DotLine({sx:_width,sy:1100,ex:0,ey:500,len:20,spd:6,size:0.8}),
			line_07 = new DotLine({sx:_width,sy:1380,ex:0,ey:730,len:8,spd:3,size:1.5}),
			line_08 = new DotLine({sx:_width,sy:1380,ex:0,ey:730,len:6,spd:3,size:4}),
			line_09 = new DotLine({sx:_width,sy:900,ex:0,ey:415,len:30,spd:30,size:0.5}),
			line_10 = new DotLine({sx:_width,sy:890,ex:0,ey:400,len:80,spd:25,size:0.5}),
			line_11 = new DotLine({sx:_width,sy:960,ex:0,ey:400,len:40,spd:15,size:0.5}),
			line_12 = new DotLine({sx:_width,sy:878,ex:0,ey:388,len:4,spd:50,size:2,color:"#ff0000"}),
			line_13 = new DotLine({sx:_width,sy:1380,ex:0,ey:700,len:3,spd:3,size:10}),
			line_14 = new DotLine({sx:_width,sy:950,ex:0,ey:420,len:35,spd:15,size:0.5}),
			line_15 = new DotLine({sx:_width,sy:1050,ex:0,ey:480,len:25,spd:10,size:0.5}),
			line_16 = new DotLine({sx:_width,sy:1160,ex:0,ey:580,len:30,spd:5,size:0.4}),
			line_17 = new DotLine({sx:_width,sy:1170,ex:0,ey:590,len:23,spd:4,size:0.8}),
			line_18 = new DotLine({sx:_width,sy:1050,ex:0,ey:470,len:6,spd:8,size:2}),
			line_19 = new DotLine({sx:_width,sy:890,ex:0,ey:393,len:20,spd:20,size:0.5,color:"#ff0000"}),
			line_20 = new DotLine({sx:_width,sy:895,ex:0,ey:415,len:8,spd:30,size:1}),
			line_21 = new DotLine({sx:_width,sy:1430,ex:0,ey:700,len:8,spd:2,size:2}),
			line_22 = new DotLine({sx:_width,sy:910,ex:0,ey:420,len:30,spd:14,size:0.5}),
			line_23 = new DotLine({sx:_width,sy:1600,ex:0,ey:840,len:20,spd:3,size:0.5}),
			line_24 = new DotLine({sx:_width,sy:1580,ex:0,ey:820,len:20,spd:4,size:2}),
			line_25 = new DotLine({sx:_width,sy:910,ex:0,ey:405,len:20,spd:10,size:0.5}),
			line_26 = new DotLine({sx:_width,sy:900,ex:0,ey:395,len:5,spd:40,size:3}),
			line_27 = new DotLine({sx:_width,sy:1210,ex:0,ey:605,len:3,spd:5,size:4}),
			line_28 = new DotLine({sx:_width,sy:1300,ex:0,ey:640,len:3,spd:2,size:3}),
			line_29 = new DotLine({sx:_width,sy:1350,ex:0,ey:650,len:15,spd:3,size:0.5}),
			line_30 = new DotLine({sx:_width,sy:891,ex:0,ey:394,len:20,spd:20,size:0.5,color:"#ff0000"}),
			line_37 = new DotLine({sx:_width,sy:1020,ex:0,ey:460,len:3,spd:8,size:3}),
			line_38 = new DotLine({sx:0,sy:200,ex:_width,ey:300,len:3,spd:10,size:1,color:"#ff0000"}),
			line_39 = new DotLine({sx:_width,sy:200,ex:0,ey:300,len:3,spd:10,size:1,color:"#ff0000"}),
			line_40 = new DotLine({sx:_width,sy:200,ex:0,ey:320,len:8,spd:15,size:0.5}),
			line_41 = new DotLine({sx:_width,sy:940,ex:0,ey:420,len:40,spd:10,size:1});

		//部分ループ
		var line_31 = new DotLine({sx:1000,sy:652,ex:300,ey:473,len:20,spd:25,size:1}),
			line_32 = new DotLine({sx:1000,sy:657,ex:300,ey:478,len:30,spd:25,size:0.5}),
			line_33 = new DotLine({sx:800,sy:535,ex:930,ey:0,len:8,spd:15,size:0.8,color:"#ff0000"}),
			line_34 = new DotLine({sx:820,sy:450,ex:930,ey:0,len:3,spd:5,size:0.5}),
			line_35 = new DotLine({sx:1200,sy:700,ex:200,ey:449,len:30,spd:15,size:0.5}),
			line_36 = new DotLine({sx:1200,sy:720,ex:200,ey:469,len:40,spd:10,size:0.4});

		MANAGER.draw();
	};

	
	
	/*============================================================
	//function リサイズ処理
	============================================================*/
	var resizeFunc = function(){
	};
	

	
	drawDriftCity();

}(window,document));
