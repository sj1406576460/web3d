let scene, camera, renderer, composer, outlinePass;

const init = () => {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	// Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setClearColor(0x3f3f3f, 1) // 设置背景颜色
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);



	// Camera
	const aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera(100, aspect, 0.01, 100);
	// camera.rotation.y = (90 / 180 ) * Math.PI;
	camera.position.set(0, 0, 2);

	// Camera Controls
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.addEventListener("change", renderer);

	// Light
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
	scene.add(ambientLight);

	const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
	spotLight.position.set(150, 150, 150)
	spotLight.castShadow = true
	scene.add(spotLight)

	const spotLight1 = new THREE.SpotLight(0xffffff) // 创建聚光灯
	spotLight1.position.set(-150, -150, -150)
	spotLight1.castShadow = true
	scene.add(spotLight1)



	var group = new THREE.Group();

	// Loader new THREE STLLoader
	const loader = new THREE.STLLoader();
	/*loader.load("img/2.STL", (result) => {
		debugger
        scene.add(result);
        animate();
    });*/
	loader.load("model/1.STL", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		console.log(1)
		const material = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		///先将对应的模型加入 对应的groud中，再讲整个groud 加入场景，同时为模型定义唯一的名字，方便后期知道是否点击了整个模型
		geometry.name = "stl001"
		var mesh = new THREE.Mesh(geometry, material)
		mesh.rotation.x = -0.5 * Math.PI
		mesh.scale.set(0.6, 0.6, 0.6)
		//scene.add(mesh)
		group.add(mesh)
	});

	loader.load("model/2.STL", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		console.log(2)
		const materia = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		geometry.name = "stl002"
		var mesh2 = new THREE.Mesh(geometry, materia)
		mesh2.rotation.x = -0.5 * Math.PI
		mesh2.scale.set(0.6, 0.6, 0.6)
		mesh2.translateX(0.5); //网格模型mesh平移
		group.add(mesh2)
		outlineMeshBasicMaterial(mesh2, scene)
	});

	loader.load("model/1180815.stl", geometry => {
		//获取模型的大小
		console.log(3)
		const materia = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		geometry.name = "stl003"
		let mesh3 = new THREE.Mesh(geometry, materia)
		mesh3.rotation.x = -0.5 * Math.PI
		mesh3.rotation.y = 0 * Math.PI
		mesh3.rotation.z = 0 * Math.PI
		mesh3.scale.set(0.005, 0.005, 0.005)
		mesh3.translateX(-0.75); //网格模型mesh平移
		group.add(mesh3)
		outlineMeshBasicMaterial(mesh3, scene)
	});

	const geometry = new THREE.TorusGeometry(0.2, 0.1, 2, 10);
	const material = new THREE.MeshBasicMaterial({
		color: 0x7777ff
	});
	geometry.name = "stl004"
	const torus = new THREE.Mesh(geometry, material);
	torus.position.set(-2, 0, 0)
	torus.rotation.x = 1 * Math.PI
	//group.add(torus)
	scene.add(group);
	console.log(scene)


	function outlineOperate(selectedObjects) {
		composer = new THREE.EffectComposer(renderer);
		const renderPass = new THREE.RenderPass(scene, camera);
		composer.addPass(renderPass);
		outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera,
			selectedObjects);
		outlinePass.edgeStrength = 10; //边缘强度
		outlinePass.edgeGlow = 1; //缓缓接近
		outlinePass.edgeThickness = 4; //边缘厚度
		outlinePass.renderToScreen = true;
		//outlinePass.pulsePeriod = 1 //闪烁
		outlinePass.usePatternTexture = false //是否使用贴图
		outlinePass.visibleEdgeColor.set(0xf00000); // 高光颜色
		outlinePass.hiddenEdgeColor.set(0x000000); // 阴影颜色
		composer.addPass(outlinePass);
	}

	function outlineMeshBasicMaterial(mesh, scene) {
		var outlineMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			side: THREE.BackSide
		});
		var outlineMesh = new THREE.Mesh(mesh.geometry, outlineMaterial);
		outlineMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z)
		outlineMesh.scale.set(0.0052, 0.0052, 0.005)
		outlineMesh.rotation.x = -0.5 * Math.PI
		outlineMesh.rotation.y = 0 * Math.PI
		outlineMesh.rotation.z = 0 * Math.PI
		scene.add(outlineMesh);
	}

	/**
	 * 简单使用 法线 进行描边处理
	 * @param {Object} mesh 要描边的物体
	 * @param {Object} scene
	 */
	function outLineNormalMaterial(mesh, scene) {
		var outlineMaterial = getOutLineNormalMaterial(0.1);
		var outlineMesh = new THREE.Mesh(mesh.geometry, outlineMaterial);
		outlineMesh.position.set(mesh.position.x, mesh.position.y, mesh.position.z)
		outlineMesh.scale.set(0.0052, 0.0052, 0.005)
		outlineMesh.rotation.x = -0.5 * Math.PI
		outlineMesh.rotation.y = 0 * Math.PI
		outlineMesh.rotation.z = 0 * Math.PI
		scene.add(outlineMesh);
	}

	/**
	 * 简单发现扩展描边
	 * @param {float} lineWidth 描边宽带
	 * @param {float} lineAlpha 描边的透明度
	 * @param {Object} lineColor 描边颜色
	 */
	function getOutLineNormalMaterial(lineWidth = 1.0, lineAlpha = 1.0, lineColor = {
		r: 1.0,
		g: 1.0,
		b: 0
	}) {
		let uniforms = {
			lineWidth: {
				value: lineWidth
			},
			lineColor: {
				value: new THREE.Color(lineColor.r, lineColor.g, lineColor.b)
			},
			lineAlpha: {
				value: lineAlpha
			},
			timer: {
				value: 3.14
			}
		}

		let vertexShader = `
							  uniform float lineWidth;
							  void main()
							  {
							    gl_Position = projectionMatrix * modelViewMatrix * vec4( position + normal * lineWidth, 1.0 );
							  }
							  `
		let fragmentShader = `
							  uniform vec3 lineColor;
							  uniform float lineAlpha;
							  uniform float timer;
							  void main(){
							    float factor = (sin(timer * 10.0 + 3.14 / 2.0) + 1.0) / 2.0;
							    float alpha = lineAlpha * factor;
							    gl_FragColor = vec4( lineColor , alpha);
							  }`
		let material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			side: THREE.BackSide,
			transparent: true
		});
		return material
	}



	animate();
	//获取与射线相交的对象数组
	function getIntersects(event) {
		event
	.preventDefault(); // 阻止默认的点击事件执行, https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault

		//声明 rayCaster 和 mouse 变量
		let rayCaster = new THREE.Raycaster();
		let mouse = new THREE.Vector2();

		//通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
		mouse.x = (event.clientX / document.body.offsetWidth) * 2 -
			1;
		mouse.y = -(event.clientY / document.body.offsetHeight) * 2 +
			1; //这里为什么是-号，没有就无法点中

		//通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
		rayCaster.setFromCamera(mouse, camera);

		//获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
		//+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
		console.log(group)
		let intersects = rayCaster.intersectObjects(group.children, true);

		//返回选中的对象
		// console.log(intersects)
		return intersects;
	}

	//鼠标双击触发的方法
	function onMouseDblclick(event) {
		//获取raycaster和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
		let intersects = getIntersects(event);
		console.log(intersects);
		console.log(intersects[0].object.geometry.name);

		//outlineOperate([intersects[0].object])

		//获取选中最近的Mesh对象
		//instance坐标是对象，右边是类，判断对象是不是属于这个类的
		if (intersects.length !== 0 && intersects[0].object.geometry.name === 'stl003') {

			for (var i = 0; i < intersects.length; i++) {
				if (intersects[i].object.geometry.name === 'stl003') {
					intersects[i].object.material.color.set(0xff0000); //变为红色
				} else {

				}
			}

		} else {
			console.log('未选中 Mesh!');
		}
	}

	document.addEventListener('click', onMouseDblclick);
};






const animate = () => {
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	if (composer) {
		composer.render()
	}
}

init();
