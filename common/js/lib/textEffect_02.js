function LetterFader(_id,_duration,_delay,_ease){

	this.id = document.getElementById(_id);
	this.duration = _duration || this.duration;
	this.delay = _delay || this.delay;
	this.ease = _ease || this.ease;

	this.init();
	//this.callBack = function(){  };            
	return false;
};
LetterFader.prototype = $.extend({
	id:null,
	$id:null,
	$cls:null,
	lettersCls:"efl",
	$idAry:[],
	beginProp:{"opacity":0},
	endProp:{"opacity":1},
	duration:800,
	delay:30,
	textLen:0,
	ease:"linear",
	animType:"",
	flow:true,
	timer:null,

	init:function(){

		var that = this,
			dom_id = that.id,
			s_id = dom_id.id,
			s_context = dom_id.textContent || dom_id.innerText,
			ary_letter = [],
			n_len = this.textLen = s_context.length;

		this.$id = $(this.id);

		//DOMのテキスト取得し、DOMを一旦空白にして、一文字ずつ、配列に格納
		ary_letter = s_context.split("");
		s_context = "";

		//一文字ずつ、spanタグで包み、htmlに結合
		for(var i=0; i<n_len; i++) s_context += "<span id='"+s_id+"_"+i+"'>" + ary_letter[i] + "</span>";
		dom_id.innerHTML = s_context;

		//配列に格納
		that.$idAry = (function(){
			var ary = [];
			var lettersID;
			for(var i = 0; i < n_len; i++){
				lettersID = $(document.getElementById(s_id+"_"+i));
//					lettersID.css(that.beginProp);
				ary[i] = lettersID;
			};
			return ary;
		})();
		return false;	
	},

	reset:function(){
		var $idAry = this.$idAry,
			timer = this.timer,
			n_arrText = this.textLen,
			prop = (this.flow !== "out") ? this.beginProp : this.endProp;
		if(timer)clearTimeout(timer);
		for(var n = 0; n<n_arrText; n++) $idAry[n].finish().css(prop);
	},

	random:function(_flow){
		var that = this,
			$idAry = that.$idAry,
			a_number = [],
			s_ease = that.ease,
			n_arrText = that.textLen,
			n_dly = that.delay,
			n_spd = that.duration,
			n_count = n_arrText,
			flow =  that.flow = _flow,
			prop = (flow !== "out") ? that.endProp : that.beginProp;

		that.reset();

		//文字オブジェクトを配列に格納し、要素をシャッフル
		for(var n = 0; n < n_arrText; n++) a_number[n] = n;

		var interval = function(){
			if(n_count === 0) return false;
			var rnd = Math.random()*n_count >> 0;
			var next = a_number[rnd];
			var $obj = $idAry[next];
			$obj.animate(prop,n_spd,s_ease);
			a_number.splice(rnd,1);
			n_count -= 1;
			that.timer = setTimeout(interval,n_dly);
		};
		interval();
		return false;
	},

	foward:function(_flow){
		var that = this,
			$idAry = that.$idAry,
			s_ease = that.ease,
			n_arrText = that.textLen,
			n_dly = that.delay,
			n_spd = that.duration,
			n_count = 0,
			flow =  that.flow = _flow,
			prop = (flow !== "out") ? that.endProp : that.beginProp;

		that.reset();

		var interval = function(){
			if(n_count === n_arrText) return false;
			var $obj = $idAry[n_count];
			$obj.animate(prop,n_spd,s_ease);
			n_count += 1;
			that.timer = setTimeout(interval,n_dly);
			return false;
		};
		interval();
		return false;
	},

	back:function(_flow){
		var that = this,
			$idAry = that.$idAry,
			s_ease = that.ease,
			n_arrText = that.textLen,
			n_dly = that.delay,
			n_spd = that.duration,
			n_count = n_arrText-1,
			flow =  that.flow = _flow,
			prop = (flow !== "out") ? that.endProp : that.beginProp;

		that.reset();

		var interval = function(){
			if(n_count === -1) return false;
			var $obj = $idAry[n_count];
			$obj.animate(prop,n_spd,s_ease);
			n_count -= 1;
			that.timer = setTimeout(interval,n_dly);
			return false;
		};
		interval();
		return false;
	},

	animation:function(_method){
		var that = this;
		var s_method = _method || that.animType;
		if(s_method === "foward") that.foward(that.flow);
		else if(s_method === "random") that.random(that.flow);
		else if(s_method === "back") that.back(that.flow);
		return false;
	},

	addRunBtn:function(_method,_flow){
		var that = this,
			dom_id = that.id,
			sty_id = dom_id.style,
			s_id = dom_id.id+"_Btn",
			s_btnHTML = "<span class='btnRun' id='"+s_id+"'>run</span>",
			flow = this.flow = _flow;

		that.animType = _method;
		sty_id.position = "relative";
		that.$id.prepend(s_btnHTML);
		$(document.getElementById(s_id)).on("click",function(){
			that.animation();
		})
		return false;
	}
});
	

	
