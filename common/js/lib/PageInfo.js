/*==============================================================================

	コンテンツ共通　ページ情報オブジェクト

	・基本の状態を維持する必要は無く、プロジェクトによってカスタマイズする

	・head内で読み込ませて使用
	・戻り値の関数は分岐処理などに利用する
	・CSS読み込み
	・viewportなどを操作する

==============================================================================*/
function PageInfo(){
	this.osCheck();
	this.uaCheck();
	this.deviceCheck();
	return false;
};

PageInfo.prototype = {
	OS:"",
	UA:"",			//ユーザーエージェント
	ID:"",
	Class:"",	//class
	VER:"not IE",	//ブラウザバージョン IE用
	mobile:false,	//スマートフォン判定
	device:"pc",

	//IDの取得（IEの場合はwrapperにIE追加）
	getID:function(){
		var doc = document;
		var bodys = doc.getElementsByTagName("body")[0];
		var classStr = this.UA;

		this.ID = bodys.getAttribute('id');
		this.Class = bodys.getAttribute("class");

		if(classStr !== "ie") doc.getElementById("wrapper").className = classStr;
		return false;
	},

	/* @method */
	osCheck:function(){
		if (navigator.platform.indexOf("Win") != -1) this.OS = "windows";
		else this.OS = "mac";
		return false;
	},

	//UAチェック
	uaCheck:function(){

		var s_UA = "";
		var s_version = "";

		var wn = window.navigator,
			s_browserUA = wn.userAgent.toLowerCase(),
			s_ieUA = wn.appVersion.toLowerCase();

		//ブラウザ確認
		if(s_browserUA.indexOf("msie") !== -1){
			s_UA = "ie";
			if(s_ieUA.indexOf("msie 8.") !== -1) s_version = 'ie8';
			else if (s_ieUA.indexOf("msie 7.") !== -1) s_version =  'ie7';
			else if (s_ieUA.indexOf("msie 6.") !== -1) s_version = 'ie6';
			else if (s_ieUA.indexOf("msie 9.") !== -1) s_version = "ie9";	//IE9以上
			else s_version = "ie10";
		}else if(s_browserUA.indexOf('trident/7') !== -1){
			s_UA = "ie";
			s_version = 'ie11';
		}else{
			if(s_browserUA.indexOf("firefox") !== -1) s_UA = "firefox";
			else s_UA = "webkit";
		};

		//値をプロパティに帰属させる
		this.UA = s_UA;
		this.VER = s_version;

		return false;
	},

	//デバイスチェック
	deviceCheck:function(){
		var n_height = 0;
		var s_device = "pc";
		var s_deviceUA = navigator.userAgent;
		var b_Mobile = false;

		if((s_deviceUA.indexOf('Android') > 0 && s_deviceUA.indexOf('Mobile') == -1) || s_deviceUA.indexOf('A1_07') > 0 || s_deviceUA.indexOf('SC-01C') > 0 || s_deviceUA.indexOf('iPad') > 0){
			b_Mobile = true;
			s_device = "tablet";
		}else if ((s_deviceUA.indexOf('iPhone') > 0 && s_deviceUA.indexOf('iPad') == -1) || s_deviceUA.indexOf('iPod') > 0 || (s_deviceUA.indexOf('Android') > 0 && s_deviceUA.indexOf('Mobile') > 0)){
			b_Mobile = true;
			s_device = "sp";
		};

		this.device = s_device;
		this.mobile = b_Mobile;
		return false;
	},

	//クエリチェック
	ulrQueryCheck:function(){
		var s_qs = "id=PC";
		var s_ls = location.search;

		//クエリ確認
		if (s_ls.length === 0) return false;
		s_qs = s_ls.substr(1).split("&").toString();
		if(s_qs === "id=PC") this.mobile = false;
		else if(s_qs === "id=SP") this.mobile = true;
		return false;
	},

	//PC用css記述
	pcCSS:function(css){
		if(this.mobile === true) return false;
		var doc = document;
		var cssPath = css;
		var link = doc.createElement('link');
		var head = doc.getElementsByTagName('head');
		link.href = cssPath;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		head.item(0).appendChild(link);
		return false;
	},

	//モバイル用css記述
	mobileCSS:function(css){
		if(this.mobile === false) return false;
		var doc = document;
		var cssPath = css;
		var link = doc.createElement('link');
		var head = doc.getElementsByTagName('head');
		link.href = cssPath;
		link.type = 'text/css';
		link.rel = 'stylesheet';
		head.item(0).appendChild(link);
		return false;
	},

	//viewport記述
	responseViewPort:function(){
		var doc = document;
		var property = (this.mobile === true) ? 'width=device-width' : 'width=950px';
		var meta = doc.createElement('meta');
		meta.setAttribute('name','viewport');
		meta.setAttribute('content',property);
		doc.getElementsByTagName('head')[0].appendChild(meta); 
		return false;
	}
}
