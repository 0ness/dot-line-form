function init(){


	/*============================================================
	//const 定数
	============================================================*/
	var win = window;
	var doc = document;
//	var canvas = doc.getElementById("canvas");
//	var ctx = canvas.getContext("2d");

	var n_winWidth = 2000;
	var n_winHeight = 1200;
	var n_fps = 20;
	var n_endAngle = 3.141592653589793*2;
	
	var d_planeArea = doc.getElementById("planeArea");
	var $planeArea = $(d_planeArea);


	/*============================================================
	//module 共通関数
	============================================================*/
	var abs = function(num){
		var a = num;
		return a>0?a:-a;
	};


	/*============================================================
	//object Planeオブジェクト
	============================================================*/
	var Plane = function(){
		return false;
	};
	Plane.prototype = {
		x:0,
		y:0,
		ex:0,
		ey:0,
		size:0,
		radius:0,
		duration:12,
		moveCls:null,
		dom:null,
		init:function(_dom,_x,_y,_size,_radius){
			var that = this;
			this.dom = _dom;
			that.x = _x;
			that.y = _y;
			that.ex = 0;
			that.ey = that.y + ((Math.random()*400) - 200)>>0;
			that.size = _size;
			that.duration = ((Math.random()*that.duration)>>0) + 5;
			that.radius = _radius;

			var num = (Math.random()*2);
			if(num > 1) that.ex = n_winWidth + 20;
			else that.ex = -20;
			
			//css調整
			var style = that.dom.style;
			style.width = that.size + "px";
			style.height = that.size + "px";
			
			//トランジション調整
			var delay = (Math.random()*3)>>0;
			style.transitionDuration = that.duration + "s";
			style.animationDelay = delay + "s";
			
			//座標調整
			var s_transform = "translate("+ that.x +"px,"+ that.y +"px)";
			style.transform = s_transform;
			
			//イベントハンドラ
			this.dom.addEventListener("transitionend",that.restart,true);
			
			//表示
			style.display = "block";
			
			setTimeout(function(){
				s_transform = "translate("+ that.ex +"px,"+ that.ey +"px)";
				style.transform = s_transform;
			},10)

			return false;
		},
		restart:function(){
			
			//このスコープではthis.domがthisになる
			var that = this;
			var style = that.style;
			
			style.display = "none";
			
			//トランジション調整
			var delay = (Math.random()*3)>>0;
			that.duration = ((Math.random()*that.duration)>>0) + 5;
			style.transitionDuration = that.duration + "s";
			style.animationDelay = delay + "s";
			
			//座標調整
			if((Math.random()*n_winWidth) < (n_winWidth >>1)){ 
				that.x = n_winWidth+10;
				that.ex = -10;
			}else{
				that.x = -10;
				that.ex = n_winWidth+10;
			}
			
			that.y = (Math.random()*n_winHeight) >> 0;
			that.ey = that.y + ((Math.random()*400) - 200)>>0;
			
			var s_transform = "translate("+ that.x +"px,"+ that.y +"px)";
			style.transform = s_transform;
			
			//表示
			style.display = "block";
			
			console.log(that.x);
			
			
			setTimeout(function(){
				s_transform = "translate("+ that.ex +"px,"+ that.ey +"px)";
				style.transform = s_transform;
			},100)
		}
	};
	
	
	/*============================================================
	//object PlaneContainerオブジェクト
	============================================================*/
	var PlaneContainer = function(){
		return false;
	}
	PlaneContainer.prototype = {
		len:0,
		ary:[],
		init:function(_len){
			
			this.len = _len;
			var s_id = "";
			var s_spd = "";
			var s_dom = "";
			var d_id = null;
			
			//DOM作成
			//Planeオブジェクト作成
			for(var i = 0; i < this.len; i++){
				s_id = "plane_0"+i;
				s_spd = "plane-spd_01";
				s_dom = "<div id='" + s_id + "' class='plane "+ s_spd +"'> </div>";
				$planeArea.append(s_dom);
				d_id = doc.getElementById(s_id);
				this.ary[i] = d_id;
				
				var p = new Plane();
				var sx = (Math.random()*n_winWidth) >> 0;
				var sy = (Math.random()*n_winHeight) >> 0;
				
				p.init(d_id,sx,sy,2,30);
			}
			
			return false;
		}
	};
	var o_planeCont = new PlaneContainer();


	/*============================================================
	//function コンテンツ部分
	============================================================*/
	var content_01 = function(){
		
		
		
		return false;
	}();



	
	//function ウィンドウリサイズ
	function resize(){
		n_winWidth = win.innerWidth;
		n_winHeight = win.innerHeight;
		return false;
	}
			
			
	//flow 処理開始	
	var init = function(){
		
		console.log("init");
		
		//ウィンドウ初期調整
		resize();
		win.addEventListener("resize",resize);
		
		//コンテンツ開始
		o_planeCont.init(2);
		
		return false;
	}();

	return false;
};

//contents スクリプト動作開始
if(window.addEventListener) window.addEventListener("load",init, false);
else window.attachEvent("onload",init);