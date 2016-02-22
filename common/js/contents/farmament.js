(function (window,document) {
	"use strict";



	/*private property

	--------------------------------------------------------------------*/
	var win = window,
		doc = document,
		n_winWidth = 2000,
		n_winHeight = 1200,
		n_fps = 20,
		n_endAngle = 3.141592653589793*2;
	
	var d_planeArea = doc.getElementById("planeArea");
	var $planeArea = $(d_planeArea);

	
	

	/*private method
	--------------------------------------------------------------------*/
	var abs = function(num){
		var a = num;
		return a>0?a:-a;
	};
	
	
	
	
	/*private method
	--------------------------------------------------------------------*/
	var Plane = function(opt_prop){
		var _opt = opt_prop;
		this.x 	= _opt.x;
		this.y 	= _opt.y;
		this.ex = 0;
		this.ey = 0;
		this.size 		= _opt.size;
		this.radius 	= _opt.radius;
		this.duration 	= 12;
		this.moveCls 	= null;
		this.dom 		= _opt.dom;
		this.init();
	},
		PlaneMember = Plane.prototype;
	
	
	PlaneMember.init = function(){
		var that = this,
			_style 	= this.dom.style,
			_size 	= this.size + "px";
		
		that.ex = 0;
		that.ey = that.y + ((Math.random()*400) - 200)>>0;
		that.duration = ((Math.random()*that.duration)>>0) + 5;

		var num = (Math.random()*2);
		if(num > 1) that.ex = n_winWidth + 20;
		else that.ex = -20;

		//css調整
		_style.width 	= _size;
		_style.height 	= _size;

		//トランジション調整
		var delay = (Math.random()*3)>>0;
		_style.transitionDuration = that.duration + "s";
		_style.animationDelay = delay + "s";

		//座標調整
		var s_transform = "translate("+ that.x +"px,"+ that.y +"px)";
		_style.transform = s_transform;

		//イベントハンドラ
		this.dom.addEventListener("transitionend",that.restart,true);

		//表示
		_style.display = "block";

		setTimeout(function(){
			s_transform = "translate("+ that.ex +"px,"+ that.ey +"px)";
			_style.transform = s_transform;
		},10)
	};
	
	PlaneMember.restart = function(){
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
		},100);
	};
	
	
	/*============================================================
	//object PlaneContainerオブジェクト
	============================================================*/
	var PlaneContainer = function(){
		this.ary = [];
	},
		PlaneContainerMember = PlaneContainer.prototype;
	
	PlaneContainerMember.init = function(_len){
		this.len = _len;
		var s_id = "";
		var s_spd = "";
		var s_dom = "";
		var d_id = null;

		//DOM作成
		//Planeオブジェクト作成
		for(var i = 0; i < this.len; i++){
			s_id 	= "plane_0"+i;
			s_spd 	= "plane-spd_01";
			s_dom 	= "<div id='" + s_id + "' class='plane "+ s_spd +"'> </div>";
			$planeArea.append(s_dom);
			d_id 	= doc.getElementById(s_id);
			this.ary[i] = d_id;

			var sx = (Math.random()*n_winWidth) >> 0,
				sy = (Math.random()*n_winHeight) >> 0,
				plane = new Plane({
					dom	:d_id,
					x	:sx,
					y	:sy,
					size:2,
					radius:30
				});
		}
	};
	
	var o_planeCont = new PlaneContainer();

	
	

	/*============================================================
	//function コンテンツ部分
	============================================================*/
	
	//function ウィンドウリサイズ
	function resize(){
		n_winWidth = win.innerWidth;
		n_winHeight = win.innerHeight;
	}
			
			
	//flow 処理開始	
	var init = function(){
		
		//ウィンドウ初期調整
		resize();
		win.addEventListener("resize",resize);
		
		//コンテンツ開始
		o_planeCont.init(2);
	}();

	

}(window,document));