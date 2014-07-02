function init(){


	/*============================================================
	//const 定数
	============================================================*/
	var win = window;
	var doc = document;
	var canvas = doc.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	var numWidth = 2000;
	var numHeight = 1200;
	var numTimeSpd = 20;
	var numEndAngle = 3.141592653589793*2;


	/*============================================================
	//function 共通関数
	============================================================*/
	var abs = function(num){
		var a = num;
		return a>0?a:-a;
	};


	/*============================================================
	//function コンテンツ部分
	============================================================*/
	var content_01 = function(){


		/*object DotLineオブジェクト
		--------------------------------------------------------------------*/
		function DotLine(x01,y01,x02,y02,len,spd,size,color){

			//座標系オブジェクト
			this.zone = {
				sx:x01,
				sy:y01,
				ex:x02,
				ey:y02,
				distance:0
			};

			//Dotオブジェクト用オブジェクト
			this.dot = {
				axis:1,			//1：通常のxループ 2:反転のxループ 3:通常のyループ 4:反転のyループ
				arr:[],			//格納用配列
				len:len+1,		//格納するオブジェクトの数
				size:size,		//オブジェクトのサイズ
				color:color,
				spd:{x:0,y:0},	//オブジェクトの速度
				dis:{x:0,y:0},	//オブジェクト毎の一定の距離
				loop:spd*10000,
			};

			return false;
		};
		DotLine.prototype = {
			init:function(){
				var that = this;
				var dis_x = that.zone.ex - that.zone.sx;
				var dis_y = that.zone.ey - that.zone.sy;

				//1つずつの距離
				that.dot.dis.x = (dis_x / (that.dot.len-1));
				that.dot.dis.y = (dis_y / (that.dot.len-1));

				//始点と終点の距離
				that.zone.distance = abs(dis_x);

				//移動スピード
				that.dot.spd.x = that.zone.distance / that.dot.loop * numTimeSpd;
				that.dot.spd.y = abs(dis_y) / that.dot.loop * numTimeSpd;
				that.dot.spd.x = (that.zone.sx > that.zone.ex) ? -that.dot.spd.x : that.dot.spd.x;
				that.dot.spd.y = (that.zone.sy > that.zone.ey) ? -that.dot.spd.y : that.dot.spd.y;

				//オブジェクト生成・設定・格納
				for(var i = 0; i<that.dot.len; i++){
					var d = new Dot();
					d.prop.id = i;
					d.prop.size = that.dot.size;
					d.prop.originalSize = that.dot.size;
					d.prop.spd.y = that.dot.spd.y;
					d.prop.spd.x = that.dot.spd.x;
					d.prop.point.x = (that.zone.sx+i*that.dot.dis.x)-that.dot.dis.x;
					d.prop.point.y = (that.zone.sy+i*that.dot.dis.y)-that.dot.dis.y;
					d.prop.move = that.zone.ex - d.prop.point.x;
					that.dot.arr[i] = d;
				}
				return false;
			},
			arcDraw:function(){

				var that = this;
				var arr = that.dot.arr;
				var axis = that.dot.axis;
				var dis = 0;
				var flg = false;
				var len = that.dot.len;

				for(var i=0; i<len; i++){

					var d = arr[i];
					dis = abs(d.prop.point.x - that.zone.sx) - that.zone.distance;
					flg = (dis > 0) ? true : false;

					if(flg === true){
						var prev = d.prop.id+1;
						if(prev === that.dot.len) prev = 0;
						d.prop.point.y = arr[prev].prop.point.y-that.dot.dis.y;
						d.prop.point.x = arr[prev].prop.point.x-that.dot.dis.x;
					}

					ctx.fillStyle = that.dot.color;

					//描画
					d.draw();

					d.prop.point.x += d.prop.spd.x;
					d.prop.point.y += d.prop.spd.y;

				}
				return false;
			},
			arcLine:function(){

				ctx.strokeStyle= "#fff";
				ctx.beginPath();

				var that = this;
				var arr = that.dot.arr;
				var axis = that.dot.axis;
				var dis = 0;
				var flg = false;

				for(var i=0; i<that.dot.len; i++){

					var d = arr[i];
					dis = abs(d.prop.point.x - that.zone.sx) - that.zone.distance;
					flg = (dis > 0) ? true : false;

					if(flg === true){
						var prev = d.prop.id+1;
						if(prev === that.dot.len) prev = 0;
						d.prop.point.y = arr[prev].prop.point.y-that.dot.dis.y;
						d.prop.point.x = arr[prev].prop.point.x-that.dot.dis.x;
					}

					ctx.fillStyle = that.dot.color;

					//描画
					d.line();
					d.prop.point.x += d.prop.spd.x;
					d.prop.point.y += d.prop.spd.y;

				}
			}
		};


		/*object Dotオブジェクト
		--------------------------------------------------------------------*/
		function Dot(){
			this.prop = {
				id:0,
				alpha:1,
				size:0,
				originalSize:0,
				move:0,
				color:"#ffffff",
				point:{x:0,y:0},
				spd:{x:0,y:0}
			};
			this.scaleSize = {
				angle:(Math.random()*360)>>0,		// 角度（初期値）
				change:0.5,	// 増やす角度（運動の増減値）
				radius:2,	// 半径（折り返す値）
				radian:0,
				by:0,
				pi:0.01745329251//3.141592653589793 / 180
			}
		};
		Dot.prototype = {
			scale:function(){
				var that = this;
				that.scaleSize.radian = that.scaleSize.angle * that.scaleSize.pi;       //度をラジアンに変換
				that.scaleSize.by = that.prop.size * Math.sin(that.scaleSize.radian)/2;	//円運動の値を計算
				that.scaleSize.angle += that.scaleSize.change;		            		//角度を増減
				that.prop.size = that.scaleSize.by+that.prop.originalSize;
			},
			draw:function(){
				var that = this;

				that.scale();
				ctx.beginPath();
				ctx.arc(that.prop.point.x,that.prop.point.y,that.prop.size,0,numEndAngle,false);
				ctx.fill();

				that.prop.point.x += that.prop.spd.x;
				that.prop.point.y += that.prop.spd.y;

				return false;
			},
			line:function(){
				var that = this;

				ctx.beginPath();
				ctx.moveTo(that.prop.spd.x,that.prop.spd.y);
				ctx.lineTo(that.prop.spd.x+12,that.prop.spd.y+10);
				ctx.stroke();
				ctx.fill();

				that.prop.point.x += that.prop.spd.x;
				that.prop.point.y += that.prop.spd.y;

				return false;
			},
			alpha:function(){
				ctx.globalAlpha = this.prop.alpha;
				this.prop.alpha -= 50000;
				return false;
			}
		}


		//オブジェクト生成
		var line_01 = new DotLine(numWidth,895,0,395,20,42,2,"#fff");
		var line_02 = new DotLine(numWidth,960,0,440,20,20,1,"#fff");
		var line_03 = new DotLine(numWidth,1200,0,600,10,4,1,"#fff");
		var line_04 = new DotLine(numWidth,900,0,400,40,40,1,"#fff");
		var line_05 = new DotLine(numWidth,1080,0,490,10,8,2,"#fff");
		var line_06 = new DotLine(numWidth,1100,0,500,20,6,0.8,"#fff");
		var line_07 = new DotLine(numWidth,1380,0,730,8,3,1.5,"#fff");
		var line_08 = new DotLine(numWidth,1380,0,730,6,3,4,"#fff");
		var line_09 = new DotLine(numWidth,900,0,415,30,30,0.5,"#fff");
		var line_10 = new DotLine(numWidth,890,0,400,80,25,0.5,"#fff");
		var line_11 = new DotLine(numWidth,960,0,400,40,15,0.5,"#fff");
		var line_12 = new DotLine(numWidth,878,0,388,4,50,2,"#ff0000");
		var line_13 = new DotLine(numWidth,1380,0,700,3,3,10,"#fff");
		var line_14 = new DotLine(numWidth,950,0,420,35,15,0.5,"#fff");
		var line_15 = new DotLine(numWidth,1050,0,480,25,10,0.5,"#fff");
		var line_16 = new DotLine(numWidth,1160,0,580,30,5,0.4,"#fff")
		var line_17 = new DotLine(numWidth,1170,0,590,23,4,0.8,"#fff");
		var line_18 = new DotLine(numWidth,1050,0,470,6,8,2,"#fff");
		var line_19 = new DotLine(numWidth,890,0,393,20,20,0.5,"#ff0000");
		var line_20 = new DotLine(numWidth,895,0,415,8,30,1,"#fff");
		var line_21 = new DotLine(numWidth,1430,0,700,8,2,2,"#fff");
		var line_22 = new DotLine(numWidth,910,0,420,30,14,0.5,"#fff");
		var line_23 = new DotLine(numWidth,1600,0,840,20,3,0.5,"#fff");
		var line_24 = new DotLine(numWidth,1580,0,820,20,4,2,"#fff");
		var line_25 = new DotLine(numWidth,910,0,405,20,10,0.5,"#fff");
		var line_26 = new DotLine(numWidth,900,0,395,5,40,3,"#fff");
		var line_27 = new DotLine(numWidth,1210,0,605,3,5,4,"#fff");
		var line_28 = new DotLine(numWidth,1300,0,640,3,2,3,"#fff");
		var line_29 = new DotLine(numWidth,1350,0,650,15,3,0.5,"#fff");
		var line_30 = new DotLine(numWidth,891,0,394,20,20,0.5,"#ff0000");
		var line_37 = new DotLine(numWidth,1020,0,460,3,8,3,"#fff");
		var line_38 = new DotLine(0,200,numWidth,300,3,10,1,"#ff0000");
		var line_39 = new DotLine(numWidth,200,0,300,3,10,1,"#ff0000");
		var line_40 = new DotLine(numWidth,200,0,320,8,15,0.5,"#fff");
		var line_41 = new DotLine(numWidth,940,0,420,40,10,1,"#fff");
		//部分ループ
		var line_31 = new DotLine(1000,652,300,473,20,25,1,"#fff");
		var line_32 = new DotLine(1000,657,300,478,30,25,0.5,"#fff");
		var line_33 = new DotLine(800,535,930,0,8,15,0.8,"#ff0000");
		var line_34 = new DotLine(820,450,930,0,3,5,0.5,"#fff");
		var line_35 = new DotLine(1200,700,200,449,30,15,0.5,"#fff");
		var line_36 = new DotLine(1200,720,200,469,40,10,0.4,"#fff");

		line_01.init();
		line_02.init();
		line_03.init();
		line_04.init();
		line_05.init();
		line_06.init();
		line_07.init();
		line_08.init();
		line_09.init();
		line_10.init();
		line_11.init();
		line_12.init();
		line_13.init();
		line_14.init();
		line_15.init();
		line_16.init();
		line_17.init();
		line_18.init();
		line_19.init();
		line_20.init();
		line_21.init();
		line_22.init();
		line_23.init();
		line_24.init();
		line_25.init();
		line_26.init();
		line_27.init();
		line_28.init();
		line_29.init();
		line_30.init();
		line_31.init();
		line_32.init();
		line_33.init();
		line_34.init();
		line_35.init();
		line_36.init();
		line_37.init();
		line_38.init();
		line_39.init();
		line_40.init();
		line_41.init();


		//function ループ用関数
		var loopAnim = function(){
//                ctx.beginPath();
//                ctx.fillStyle = "rgba(0,0,0,0.5)";
//                ctx.fillRect(0,0,numWidth,numHiehgt);
			ctx.clearRect(0,0,numWidth,numHeight);
			line_01.arcDraw();
			line_02.arcDraw();
			line_03.arcDraw();
			line_04.arcDraw();
			line_05.arcDraw();
			line_06.arcDraw();
			line_07.arcDraw();
			line_08.arcDraw();
			line_09.arcDraw();
			line_10.arcDraw();
			line_11.arcDraw();
			line_12.arcDraw();
			line_13.arcDraw();
			line_14.arcDraw();
			line_15.arcDraw();
			line_16.arcDraw();
			line_17.arcDraw();
			line_18.arcDraw();
			line_19.arcDraw();
			line_20.arcDraw();
			line_21.arcDraw();
			line_22.arcDraw();
			line_23.arcDraw();
			line_24.arcDraw();
			line_25.arcDraw();
			line_26.arcDraw();
			line_27.arcDraw();
			line_28.arcDraw();
			line_29.arcDraw();
			line_30.arcDraw();
			line_31.arcDraw();
			line_32.arcDraw();
			line_33.arcDraw();
			line_34.arcDraw();
			line_35.arcDraw();
			line_36.arcDraw();
			line_37.arcDraw();
			line_38.arcDraw();
			line_39.arcDraw();
			line_40.arcDraw();
			line_41.arcDraw();

			requestAnimFrame(loopAnim);
			return false;
		};

		setTimeout(loopAnim,20)

		return false;
	}();


	/*============================================================
	//function 暗転処理
	============================================================*/
	var blackOut = function(){

		$(function(){
			var wrap = doc.getElementById("wrapper");
			var blackOut_timer;
			var flg = true;
			var time = 10000;

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


			//マスク処理///////////////////////////////////////
			var mask = function(){
				var mask = $(doc.getElementById("mask"));
				mask.delay(300).fadeOut(1500);
			}();
		});

		return false;
	}();

	return false;
};

//contents スクリプト動作開始
if(window.addEventListener) window.addEventListener("load",init, false);
else window.attachEvent("onload",init);