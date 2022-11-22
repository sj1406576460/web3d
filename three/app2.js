let scene, camera, group, renderer, composer, outlinePass;

const init = () => {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000, 0.01);

	// Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setClearColor(0x000000, 1) // 设置背景颜色
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

	var axes = new THREE.AxisHelper(100, 20, 20); //红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴
	scene.add(axes);




	group = new THREE.Group();

	// Loader new THREE STLLoader
	const loader = new THREE.STLLoader();
	/*loader.load("img/2.STL", (result) => {
		debugger
        scene.add(result);
        animate();
    });*/
	loader.load("model/1180813.stl", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		//获取模型的大小
		console.log(JSON.stringify(geometry.computeBoundingBox()));
		console.log(3)
		const materia = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		geometry.name = "stl0013"
		let mesh13 = new THREE.Mesh(geometry, materia)
		mesh13.rotation.x = -0.5 * Math.PI
		mesh13.rotation.y = 0 * Math.PI
		mesh13.rotation.z = 0 * Math.PI
		mesh13.scale.set(0.005, 0.005, 0.005)


		var box13 = new THREE.Box3().setFromObject(mesh13);
		let size = box13.getSize();
		console.log("mesh13模型大小" + JSON.stringify(size));
		mesh13['x'] = size.x
		group.add(mesh13)
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
		mesh2['addLeft'] = false
		mesh2['addRight'] = true
		mesh2.rotation.x = -0.5 * Math.PI
		mesh2.scale.set(0.6, 0.6, 0.6)
		//mesh2.position.set(420,200,120);
		//mesh2.translateX(0.5); //网格模型mesh平移
		//mesh2.rotateX(Math.PI/4)
		//scene.add(mesh2);


		var box2 = new THREE.Box3().setFromObject(mesh2);
		let size = box2.getSize();
		console.log("mesh2模型大小" + JSON.stringify(size));
		mesh2['x'] = size.x
		group.add(mesh2)
	});

	loader.load("model/1180815.stl", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		//获取模型的大小
		console.log(JSON.stringify(geometry.computeBoundingBox()));
		console.log(3)
		const materia = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		geometry.name = "stl003"
		let mesh3 = new THREE.Mesh(geometry, materia)
		mesh3['addLeft'] = true
		mesh3['addRight'] = false
		mesh3.rotation.x = -0.5 * Math.PI
		mesh3.rotation.y = 0 * Math.PI
		mesh3.rotation.z = 0 * Math.PI
		mesh3.scale.set(0.005, 0.005, 0.005)
		//mesh3.translateX(-0.72); //网格模型mesh平移

		let box3 = new THREE.Box3().setFromObject(mesh3);
		let size = box3.getSize();
		mesh3['x'] = size.x
		console.log("mesh2模型大小" + JSON.stringify(size));
		group.add(mesh3)

	});


	loader.load("model/1180818.stl", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		//获取模型的大小
		console.log(JSON.stringify(geometry.computeBoundingBox()));
		console.log(3)
		const materia = new THREE.MeshLambertMaterial({
			color: 0x7777ff
		})
		geometry.name = "stl005"
		let mesh5 = new THREE.Mesh(geometry, materia)
		mesh5.rotation.x = -0.5 * Math.PI
		mesh5.rotation.y = 0 * Math.PI
		mesh5.rotation.z = 0 * Math.PI
		mesh5.scale.set(0.005, 0.005, 0.005)
		//mesh5.translateX(1.25); //网格模型mesh平移

		let box5 = new THREE.Box3().setFromObject(mesh5);
		let size = box5.getSize();
		console.log("mesh5模型大小" + JSON.stringify(size));
		mesh5['x'] = size.x
		group.add(mesh5)
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


	// 创建一个矩形平面几何体，宽度100，长度200
	var plane = new THREE.PlaneGeometry(0.55, 0.6)
	var material6 = new THREE.MeshPhongMaterial({
		color: 0xad4fde,
		// 矩形平面网格模型默认单面显示，可以设置side属性值为THREE.DoubleSide双面显示
		side: THREE.DoubleSide,
		transparent: true
	});
	var mesh6 = new THREE.Mesh(plane, material6);
	mesh6.rotation.x = 0 * Math.PI
	mesh6.rotation.y = 0.54 * Math.PI
	mesh6.rotation.z = 0. * Math.PI
	mesh6.position.set(0.82, 0.25, 0)
	//scene.add(mesh6)


	/**
	 * 包围盒全自动计算：模型整体居中
	 */
	var box3 = new THREE.Box3()
	// 计算层级模型group的包围盒
	// 模型group是加载一个三维模型返回的对象，包含多个网格模型
	box3.expandByObject(group)
	// 计算一个层级模型对应包围盒的几何体中心在世界坐标中的位置
	var center = new THREE.Vector3()
	box3.getCenter(center)
	console.log('查看几何体中心坐标', center);
	console.log('查看组合体', group);
	/* 重新设置模型的位置，使之居中。
	group.position.x = group.position.x - center.x
	group.position.y = group.position.y - center.y
	group.position.z = group.position.z - center.z*/
	let totalWidth = 0
	group.children.forEach(item => {
		totalWidth += item.x
	})
	console.log(totalWidth)
	let initX = -totalWidth / 2
	group.children.map((item, index) => {
		item.position.x = initX
		initX = initX + item.x
		return {
			item
		}
	})

	console.log(group);


	function outlineOperate(selectedObjects) {
		composer = new THREE.EffectComposer(renderer);
		const renderPass = new THREE.RenderPass(scene, camera);
		composer.addPass(renderPass);
		outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera,
			selectedObjects);
		outlinePass.edgeStrength = 2; //边缘强度
		outlinePass.edgeGlow = 0.5; //缓缓接近
		outlinePass.edgeThickness = 0.2; //边缘厚度
		outlinePass.renderToScreen = true;
		//outlinePass.pulsePeriod = 1 //闪烁
		outlinePass.usePatternTexture = false //是否使用贴图
		outlinePass.visibleEdgeColor.set(0xffffff); // 高光颜色0xff0000
		outlinePass.hiddenEdgeColor.set(0xffffff); // 阴影颜色
		outlinePass.usePatternTexture = false; //是否使用父级的材质
		outlinePass.downSampleRatio = 2; // 边框弯曲度

		effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
		composer.addPass(effectFXAA);

		//outlinePass.clear = true;
		composer.addPass(outlinePass)
	}


	animate();

	//获取与射线相交的对象数组
	function getIntersects(event) {
		event
			.preventDefault(); // 阻止默认的点击事件执行, https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault
		//console.log("event.clientX:" + event.clientX);
		//console.log("event.clientY:" + event.clientY);

		//声明 rayCaster 和 mouse 变量
		let rayCaster = new THREE.Raycaster();
		let mouse = new THREE.Vector2();

		//通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
		mouse.x = ((event.clientX - document.body.getBoundingClientRect().left) / document.body.offsetWidth) * 2 -
			1;
		mouse.y = -((event.clientY - document.body.getBoundingClientRect().top) / document.body.offsetHeight) * 2 +
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
		//获取选中最近的Mesh对象
		//instance坐标是对象，右边是类，判断对象是不是属于这个类的
		if (intersects.length !== 0) {
			console.log(intersects[0].object.geometry.name);
			outlineOperate([intersects[0].object])
			//group.remove(mesh5) 可以实现模型删除 remove(intersects[0].object)
			for (var i = 0; i < intersects.length; i++) {
				if (intersects[i].object.geometry.name === 'stl003') {
					//intersects[i].object.material.color.set(0xff0000); //变为红色
				} else {

				}
				//render();
			}

		} else {
			outlineOperate([])
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
