let scene, camera, group, renderer, composer, outlinePass;
var initWidth = 1200
var initHeight = 600
var selectedObject=null

const init = () => {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color('#000000');//

	// Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setClearColor(0x000000, 1) // 设置背景颜色
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(initWidth, initHeight);
	// 把渲染器的渲染结果canvas对象插入到body
	//document.body.appendChild(renderer.domElement);
	// 把渲染器的渲染结果canvas对象插入到'pos'对应的div元素中
	document.getElementById("canvasBox").appendChild(renderer.domElement);




	// Camera
	const aspect = initHeight / initHeight;
	camera = new THREE.PerspectiveCamera(100, aspect, 0.01, 100);
	// camera.rotation.y = (90 / 180 ) * Math.PI;
	camera.position.set(0, 0, 3);

	// Camera Controls
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.addEventListener("change", renderer);
	controls.update()

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
	//scene.add(axes);


	group = new THREE.Group();

	// Loader new THREE STLLoader
	const loader = new THREE.STLLoader();
	/*loader.load("model/1180813.stl", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);
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
		mesh13.scale.set(0.006, 0.006, 0.006)


		var box13 = new THREE.Box3().setFromObject(mesh13);
		let size = box13.getSize();
		console.log("mesh13模型大小" + JSON.stringify(size));
		mesh13['x'] = size.x
		group.add(mesh13)
	});*/

    
	function addModel(item,type) {
		/**
		 * type 1:在右边添加push  
		 *      2.在左边添加unshift
		 */
		loader.load(item.stlPath, geometry => {
			/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
			var mesh = new THREE.Mesh(geometry,material);*/
			// 创建材质
			//获取模型的大小
			console.log(JSON.stringify(geometry.computeBoundingBox()));
			console.log(3)
			const materia = new THREE.MeshLambertMaterial({
			   //color: '#605A54'
			   color: 0x7777ff
			})
			geometry.name = item.stlId
			let mesh = new THREE.Mesh(geometry, materia)
			mesh['addLeft'] = item.left
			mesh['addRight'] = item.right
			mesh.rotation.x = -0.5 * Math.PI
			mesh.rotation.y = 0 * Math.PI
			mesh.rotation.z = 0 * Math.PI
			mesh.scale.set(0.006, 0.006, 0.006)
			//mesh5.translateX(1.25); //网格模型mesh平移
			let box3 = new THREE.Box3().setFromObject(mesh);
			let size = box3.getSize();
			console.log("mesh5模型大小" + JSON.stringify(size));
			mesh['x'] = size.x
			if(type==1){
			  group.children.push(mesh)
			  models.push(item)
			  dealModelList(item)
			}else{
			  group.children.unshift(mesh)
			  models.unshift(item)
			  dealModelList(item)
			}
			calcPostion()
		});
	}
	
	
	function dealModelList(item){
		modelList.map((it)=>{
			if(it.stlId==item.stlId){
				it.isAvailable=false
			}
		})
		$(".box-left .item").eq(item.index).addClass("disabled");
		$(".box-left .item").removeClass("active")
		model=null
	}
	
	function restoreModelList(item){
	    let index=item.index
		modelList.map((it)=>{
			if(it.stlId==item.stlId){
				it.isAvailable=true
			}
		})
		
		//去除已添加数据
		models=models.filter((it)=>{
			return it.stlId!=item.stlId
		})
		let len=models.length
		if(models.length>1){
			if((item.right && item.right==models[0].left) || (item.left && item.left==models[len-1].right) && models[0].right && models[len-1].left){
				$(".box-left .item").eq(index).removeClass("disabled")
			}else{
				modelList.map((it)=>{
					if(it.stlId==item.stlId){
						it.isAvailable=false
					}
				})
				$(".box-left .item").eq(index).addClass("disabled")
			}
		}
		model=null
		
	}
	
	function restoreAllModelList(){
		modelList.map((it)=>{
		   it.isAvailable=true
		})
		models=[]
		$(".box-left .item").removeClass("disabled")
		model=null
	}
	
	function deleteClass(item){
		restoreModelList(item)
	}
	
	
	function calcPostion(){
		console.log(group)
		let totalWidth = 0
		if (group.children.length !== 0) {
			group.children.forEach(item => {
				totalWidth += item.x
			})
			console.log(totalWidth)
			let initX = -totalWidth / 2
			let diffX=0.4
			let list = group.children;
			list.forEach((item, index) => {
				if (index == 0) {
					item.position.x = initX+diffX
				} else {
					item.position.x = initX+diffX
				}
				initX = initX + item.x
				group.children[index] = item
			})
		}
	}

	var modelList = [{
			name: "1180813.stl",
			stlPath: "model/1180813.stl",
			stlId: 1180813,
			w: 100,
			h: 100,
			left: false,
			right: true,
			isAvailable:true,
			selectable:false,
			index:0
		},
		{
			name: "1180818.stl",
			stlPath: "model/1180818.stl",
			stlId: 1180818,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable:true,
			selectable:false,
			index:1
		},
		{
			name: "1180815.stl",
			stlPath: "model/1180815.stl",
			stlId: 1180815,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable:true,
			selectable:false,
			index:2
		}
	]

    var addFlag=true
	var model=null
	var models=[]
	$(function() {
		
		$(".box-left .item").click(function() {
			let index = $(this).index()
			let item = modelList[index]
			if(item.isAvailable){
				$(this).addClass("active").siblings().removeClass("active")
				if(group.children.length==0){
					addModel(item,1)
				}else{
					model=item
				}
			}
			
		})
		
		$("#addMeshRight").click(function(){
			let items=models;
			let len=items.length
			if(model!=null){
				/*if((items[0].left==model.right && model.right) || (items[0].right==model.left && model.left)){
					if(model.left==true){
						//加在右边
						addModel(model,1)
					}else{
						//加载左边
						addModel(model,2)
					}
				}*/
				debugger
				
				//加载左边
				if(model.right && model.right==items[0].left){
					addModel(model,2)
				}
				
				//加在右边
				if(model.left && model.left==items[len-1].right){
					addModel(model,1)
				}
			}
		})
		
		
		$("#removeMesh").click(function(){
			if(selectedObject!=null){
				let stlId=selectedObject.geometry.name;
				let items=modelList.filter((item)=>{
					return item.stlId==stlId
				})
			    group.remove(selectedObject);
				deleteClass(items[0])
			    calcPostion()
			 }
		})
		
		$("#removeAllMesh").click(function(){
			selectedObject=null
			model=null
			group.children=[]
			restoreAllModelList()
		})
	})



	const geometry = new THREE.TorusGeometry(0.2, 0.1, 2, 10);
	const material = new THREE.MeshBasicMaterial({
		color: 0x7777ff
	});
	geometry.name = "stl004"
	const torus = new THREE.Mesh(geometry, material);
	torus.position.set(-2, 0, 0)
	torus.rotation.x = 1 * Math.PI
	//group.add(torus)


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

	function outlineOperate(selectedObjects) {
		composer = new THREE.EffectComposer(renderer);
		const renderPass = new THREE.RenderPass(scene, camera);
		composer.addPass(renderPass);
		outlinePass = new THREE.OutlinePass(new THREE.Vector2(initWidth, initHeight), scene, camera,
			selectedObjects);
		outlinePass.edgeStrength = 2; //边缘强度
		outlinePass.edgeGlow = 0.5; //缓缓接近
		outlinePass.edgeThickness = 0.3; //边缘厚度
		outlinePass.renderToScreen = true;
		//outlinePass.pulsePeriod = 1 //闪烁
		outlinePass.usePatternTexture = false //是否使用贴图
		outlinePass.visibleEdgeColor.set('#ffffff'); // 高光颜色0xff0000
		outlinePass.hiddenEdgeColor.set('#ffffff'); // 阴影颜色
		outlinePass.usePatternTexture = false; //是否使用父级的材质
		outlinePass.downSampleRatio = 2; // 边框弯曲度

		effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / initWidth, 1 / initHeight);
		composer.addPass(effectFXAA);

		//outlinePass.clear = true;
		composer.addPass(outlinePass)
	}


	animate();

	//获取与射线相交的对象数组
	function getIntersects(event) {
		event.preventDefault(); // 阻止默认的点击事件执行
		//console.log("event.clientX:" + event.clientX);
		//console.log("event.clientY:" + event.clientY);

		//声明 rayCaster 和 mouse 变量
		let rayCaster = new THREE.Raycaster();
		let mouse = new THREE.Vector2();

		let box = document.getElementById("canvasBox")

		//mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
		//mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
		//通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
		mouse.x = (event.offsetX / box.offsetWidth) * 2 - 1;
		mouse.y = -(event.offsetY / box.offsetHeight) * 2 + 1; //这里为什么是-号，没有就无法点中

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
			selectedObject=intersects[0].object
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
			selectedObject=null
			outlineOperate([])
		}
	}

	document.addEventListener('click', onMouseDblclick);
};






const animate = () => {
	/**
	 * 包围盒全自动计算：模型整体居中
	 */
	/*var box3 = new THREE.Box3()
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
	
	scene.add(group);

	renderer.render(scene, camera);
	//scene.updateMatrixWorld(true);
	//camera.updateMatrixWorld(true);
	requestAnimationFrame(animate);
	if (composer) {
		composer.render()
	}
}

init();
