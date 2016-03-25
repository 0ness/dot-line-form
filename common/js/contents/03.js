(function (window,document) {
	"use strict";

		
	

	/* static property
	--------------------------------------------------------------------*/
	var winWidth	= window.innerWidth,
		winHeight	= window.innerHeight;

	var container 	= document.getElementById("container"),
		stats,
		camera 		= new THREE.PerspectiveCamera( 27, winWidth / winHeight, 1, 9000 ),
		scene 		= new THREE.Scene(),
		renderer,
		xGeometry,
		zGeometry,
		xMesh,
		zMesh,
		xMaterial,
		zMaterial;
	
	var yPoints		= [],
		xLines		= [],
		zLines		= [];
	
	var waveTime	= 0;
	
	
	
	
	/*　object dat.GUI用オブジェクト
	--------------------------------------------------------------------*/
	var GUI 	= new dat.GUI(),
		param 	= {
			meshX:0.38,
			meshRotateY:0.01,
			doMeshRotate:true,
			meshOpacity:1,
			cameraY:0,
			cameraZ:2900,
			fogLevel:40,
			waveHeight:180,
			waveOffset:1.9,
			waveSpd:0.01,
			xLineColor:"#0042f7",
			zLineColor:"#0042f7",
			bgColor	:"#000"
		};
	/*
	GUI.remember(param);
	GUI.add(param,'meshX',-2,2);
	GUI.add(param,'meshRotateY',-0.1,0.1);
	GUI.add(param,'doMeshRotate');
	GUI.add(param,'meshOpacity',0.01,1);
	GUI.add(param,'cameraY',-1000,1000);
	GUI.add(param,'cameraZ',0,5000);
	GUI.add(param,'fogLevel',0,130);
	GUI.add(param,'waveHeight',10,500);
	GUI.add(param,'waveOffset',0.1,5);
	GUI.add(param,'waveSpd',0.001,0.1);
	GUI.addColor(param,"xLineColor");
	GUI.addColor(param,"zLineColor");
	GUI.addColor(param,"bgColor");
	*/
	
	
	
	/*　object stats
	--------------------------------------------------------------------*/
	//statsオブジェクト生成
	stats = new Stats();
	var _statsElm = stats.domElement;
	_statsElm.setAttribute("style","position:absolute; bottom:0px; right:0px;");
	container.appendChild( stats.domElement );

	
	
	var GravityWaver = function(){
		this.init();
		this.loop();
	},
		Member = GravityWaver.prototype;
	


	/* method
	--------------------------------------------------------------------*/
	Member.init = function() {

		//表示オブジェクト化、シーンへ追加
		zGeometry = new THREE.Geometry();
		xGeometry = new THREE.Geometry();
		var _size 	= 1500,
			_zSize 	= 2500,
			_step 	= 40,
			_zLen 	= _zSize*2/_step,
			_xCount = 0,
			_zCount = 0,
			_lCount = 0;
		
		//y軸
		for(var z=-_zSize; z<=_zSize; z+=_step){
			yPoints[_zCount] = []
			for(var x=-_size; x<=_size; x+=_step){
				yPoints[_zCount][_xCount] = (( noise.perlin2(x / 1000,z / 1000) * 200) * 100 | 0) / 100;
				_xCount ++;
			}
			_xCount = 0;
			_zCount++;
		};
		
		//z軸
		_xCount = _zCount = 0;
		for(var z=-_zSize; z<=_zSize; z+=_step){
			var _y = yPoints[_zCount];
			for(var x=-_size; x<=_size; x+=_step){
				
				//Lineでの実装
//				var _geo = new THREE.Geometry(),
//					_mat = new THREE.LineBasicMaterial({color: 0x0000ff}),
//					_line;
//				_geo.vertices.push(
//					new THREE.Vector3(x,_y[_xCount],z), 
//					new THREE.Vector3(x+_step,_y[_xCount+1],z)
//				);
//				_line = new THREE.Line(_geo,_mat);
//				zLines[_lCount] = _line;
//				scene.add(_line);
				
				//LineSegmentsでの実装
				zGeometry.vertices.push( new THREE.Vector3(x,_y[_xCount],z) );
				zGeometry.vertices.push( new THREE.Vector3(x+_step,_y[_xCount+1],z) );
				_xCount ++;
				_lCount ++;
			}
			_xCount = 0;
			_zCount++;
		}
		
		//x軸
		_xCount = _zCount = _lCount = 0;
		for(var x=-_size; x<=_size; x+=_step){
			for(var z=-_zSize; z<=_zSize; z+=_step){
				var _next = _zCount+1;
				if(_next > _zLen) continue;
				
				//Lineでの実装
//				var _geo = new THREE.Geometry(),
//					_mat = new THREE.LineBasicMaterial({color: 0x0000ff}),
//					_line;
//				_geo.vertices.push(
//					new THREE.Vector3(x,yPoints[_zCount][_xCount],z),
//					new THREE.Vector3(x,yPoints[_next][_xCount],z+_step)
//				);
//				_line = new THREE.Line(_geo,_mat);
//				xLines[_lCount] = _line;
//				scene.add(_line);

				//LineSegmentsでの実装
				xGeometry.vertices.push( new THREE.Vector3(x,yPoints[_zCount][_xCount],z) );
				xGeometry.vertices.push( new THREE.Vector3(x,yPoints[_next][_xCount],z+_step) );
				_zCount ++;
				_lCount ++;
			}
			_zCount = 0;
			_xCount++;
		}
		
		var _blend = THREE.NoBlending,
			_blendDist= THREE.OneFactor,
			_blendSrc = THREE.OneFactor,
			_xMatParam = {linewidth:1,fog:true,transparent:true,opacity:1,color:param.xLineColor},
			_zMatParam = {linewidth:1,fog:true,transparent:true,opacity:1,color:param.zLineColor};

		xMaterial 	= new THREE.LineBasicMaterial(_xMatParam);
		zMaterial 	= new THREE.LineBasicMaterial(_zMatParam);
		xMesh 		= new THREE.LineSegments( xGeometry, xMaterial);
		zMesh 		= new THREE.LineSegments( zGeometry, zMaterial);
		
		//シーンに追加
		scene.add( xMesh );
		scene.add( zMesh );
		scene.fog = new THREE.FogExp2(0x000000, param.fogLevel*0.00001);

		
		//レンダラー生成
//		renderer = new THREE.CanvasRenderer();
		renderer = new THREE.WebGLRenderer({ antialias:true,alpha:true});
		renderer.setPixelRatio( window.devicePixelRatio);
		renderer.setSize( winWidth, winHeight);
//		renderer.gammaInput = true;
//		renderer.gammaOutput = true;
		container.appendChild( renderer.domElement );
		
		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
	};
	
	Member.createColor = function(_rnd,_alpha,_plus){
		var rnd = _rnd || 255,
			plus = _plus || 0,
			r = ((Math.random()*rnd)>>0) + plus,
			g = ((Math.random()*rnd)>>0) + plus,
			b = ((Math.random()*rnd)>>0) + plus,
			a = _alpha || 1,
			rgba = "rgba("+r+", "+g+", "+b+","+a+")";
		return rgba;
	};

	/**
	 * ポイントのy座標を調整
	 */
	Member.changeYposition = function(){
		var _maxLen 	= (yPoints[0].length-1)*yPoints.length*2,
			_vCount 	= 0,
			_y			= yPoints,
			_yLen		= _y.length,
			_yChildLen 	= _y[0].length,
			_xGeo		= xGeometry,
			_zGeo 		= zGeometry,
			_zLine;

		//y軸
		for(var z=0; z<_yLen; z++){
			_zLine = _y[z];
			for(var x=0; x<_yChildLen; x++) _zLine[x] = (this.waveMotion(x,z,waveTime) * 10 | 0) / 10;
		};
		
		//z軸
		for(var z=0; z<_yLen; z++){
			_zLine = _y[z];
			for(var x=0; x<_yChildLen; x++){
				_zGeo.vertices[_vCount].y 	=  _zLine[x];
				_zGeo.vertices[_vCount+1].y =  _zLine[x+1];
				_vCount += 2;
			}
		};
		
		//x軸
		_vCount = 0;
		for(var x=0; x<_yChildLen; x++){
			for(var z=0; z<_yLen-1; z++){
				if(_vCount >= _maxLen) continue;
				_xGeo.vertices[_vCount].y 	= _y[z][x];
				_xGeo.vertices[_vCount+1].y = _y[z+1][x];
				_vCount += 2;
			}
		};
		
		_xGeo.verticesNeedUpdate = _zGeo.verticesNeedUpdate = true;
		waveTime ++;
	};
	
	/**
	 * 波の動き
	 * @param   {number} x x座標
	 * @param   {number} y y座標
	 * @param   {number} t モーションの時間
	 *　@returns {number} 次のy座標
	 */
	Member.waveMotion = function (x, y, t) {
		var _height = param.waveHeight,
			_spd 	= 8,
			_offset = param.waveOffset,
			_time	= t * param.waveSpd;
		return Math.sin( ( x / 20 ) * _offset + ( _time / _spd ) ) * Math.cos( ( y / 20 ) * _offset + ( _time / _spd ) ) * _height;
	};

	/**
	 * リサイズ処理
	 */
	Member.onWindowResize = function() {
		winWidth	= window.innerWidth;
		winHeight	= window.innerHeight;
		camera.aspect = winWidth / winHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( winWidth, winHeight );
	};

	/**
	 * ループ処理
	 */
	Member.loop = function() {
		var _self = this;
		this.render();
		stats.update();
		window.requestAnimationFrame(this.loop.bind(_self));
	};
	
	/**
	 * レンダリング
	 */
	Member.render = function() {
		var _camera = camera,
			_xm		= xMesh,
			_zm		= zMesh;
		
		xMaterial.color = new THREE.Color(param.xLineColor);
		zMaterial.color = new THREE.Color(param.zLineColor);
		
		_xm.rotation.x = _zm.rotation.x = param.meshX;
		xMaterial.opacity = zMaterial.opacity = param.meshOpacity;
		if(param.doMeshRotate) _xm.rotation.y = _zm.rotation.y = (Date.now() * 0.001 * param.meshRotateY * 10000 | 0)/10000;
		_camera.position.y = param.cameraY;
		_camera.position.z = param.cameraZ;
		
		scene.fog = new THREE.FogExp2(param.bgColor, param.fogLevel*0.00001);

		this.changeYposition();
		renderer.setClearColor(param.bgColor,1);
		renderer.render( scene, _camera );
	};


	window.GravityWaver = GravityWaver;
}(window,document));

var Index = new GravityWaver();
