/*==================================================================
	描画処理用支援ライブラリ Planet
==================================================================*/
var Planet = function(){};
Planet.prototype = {
	/* シード値を与えてRGB値を返す
	 * @param{Number} 256色
	 * @param{Number} 固定シード値
	 * @return{String} 色番号
	*/
	getRndRGB:function(_rnd,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			rgb = "rgb("+r+", "+g+", "+b+")";
		return rgb;
	},
	/* シード値を与えてRGB値を返す
	 * @param{Number} 赤
	 * @param{Number} 青
	 * @param{Number} 緑
	 * @param{Number} 固定シード値
	 * @return{String} 色番号
	*/
	getRndRGB_02:function(_r,_g,_b,_plus){
		var plus = _plus || 0,
			r = ((Math.random()*_r)>>0) + plus,
			g = ((Math.random()*_g)>>0) + plus,
			b = ((Math.random()*_b)>>0) + plus,
			rgb = "rgb("+r+", "+g+", "+b+")";
		return rgb;
	},
	/* シード値を与えてRGBA値を返す
	 * @param{Number} 256色
	 * @param{Number} 透明度
	 * @param{Number} 固定シード値
	 * @return{String} 色番号
	*/
	getRndRGBA:function(_rnd,_alpha,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	},
	/* シード値を与えてランダムなHEX値を返す
	 * @param{Number} 256色
	 * @return{String} 色番号
	*/
	getRndHEX:function(_rnd){
		var cseed = ( Math.random()*_rnd ) >> 0;
		// 色の計算R ≒ 256 * n / 3, G ≒ 256 * n / 7, B ≒ 256 * n / 5
		var cnum = ( cseed++ * 0x552433 ) % 0x1000000;
		var hex = "000000" + cnum.toString(16);
		return "#" + hex.substr( hex.length - 6, 6 );
	},
	/* 差の絶対値の計算
	 * @param{Number}
	 * @return{Number}
	*/
	abs:function(_num){
		var a = _num;
		a = a>0?a:-a;
		return a;
	},
	/* ２点間の距離算出
	 * @param{Object} ポイント01
	 * @param{Object} ポイント02
	 * @return{Number} 距離
	*/
	getPointDistance:function(_p1,_p2){
		var p1 = _p1,
			p2 = _p2,
			a = 0,
			b = 0,
			d = 0;
		a = p1.x - p2.x;
		b = p1.y - p2.y;
		d = Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
		return d;
	}
};