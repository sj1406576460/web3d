let scene, camera, group, renderer, composer, outlinePass, plusGroup;
var initWidth = 1500
var initHeight = 608
var selectedObject = null

const init = () => {
	//Scene
	scene = new THREE.Scene();
	//scene.background = new THREE.Color('#000'); //A88E77

	//Renderer
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	//renderer.setClearColor(0x000000, 1) // 设置背景颜色
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.precision='mediump'
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(initWidth, initHeight);
	// 把渲染器的渲染结果canvas对象插入到body
	//document.body.appendChild(renderer.domElement);
	// 把渲染器的渲染结果canvas对象插入到'pos'对应的div元素中
	document.getElementById("canvasBox").appendChild(renderer.domElement);


	// Camera
	const aspect = initWidth / initHeight;
	camera = new THREE.PerspectiveCamera(100, aspect,0.01,1000);
	//camera.rotation.y = (90 / 180 ) * Math.PI;
	camera.position.set(0, 0, 2);

	// Camera Controls
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.addEventListener("change", renderer);
	controls.update()
	
	/*var point = new THREE.PointLight('#fff'); //点光源  
	point.position.set(300, 100, 200); //点光源位置  
	scene.add(point); //点光源添加到场景中*/

	// Light //将环境光添加到场景中
	const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);
	
	
	var light = new THREE.DirectionalLight(0xffffff);
	scene.add(light); //将平行光添加到场景中

	const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
	spotLight.position.set(150, 150, 150)
	spotLight.castShadow = true
	scene.add(spotLight)

	const spotLight1 = new THREE.SpotLight(0xfffffff) // 创建聚光灯
	spotLight1.position.set(-150, -150, -150)
	spotLight1.castShadow = true
	scene.add(spotLight1)

	//加辅助坐标
	/*var axes = new THREE.AxesHelper(100, 20, 20); //红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴
	scene.add(axes);*/

	// Loader new THREE STLLoader
	const loader = new THREE.GLTFLoader();
	plusGroup = new THREE.Group();
	group = new THREE.Group();
	group.children=[]

	function addPlusItems(plusItems) {
		plusGroup.children = []
		plusItems.forEach((plus) => {
			let map = new THREE.TextureLoader().load('model/add.png');
			let spriteMaterial = new THREE.SpriteMaterial({
				map: map,
				sizeAttenuation: false
				//-color: 0xffffff
			});
			//为精灵贴图，其特点在于图片会始终面向用户
			let sprite = new THREE.Sprite(spriteMaterial)
			sprite.scale.set(0.12, 0.12, 0.12)
			sprite.rotation.x = 0.1 * Math.PI
			let item = group.children.find((it) => {
				return plus.stlId == it.stlId
			})
			if (item != undefined) {
				if (plus['index'] == 2) {
					sprite.position.set(item.position.x + item.x - 0.6, 1.2, 0.2)
					sprite.x = item.x
					sprite.isRight = true
				} else {
					if (plus['isEnd'] == 2) {
						sprite.position.set(item.position.x + item.x - 0.6,1.2, 0.2)
						sprite.x = item.x
						sprite.isRight = true
					} else {
						sprite.position.set(item.position.x - 0.6, 1.2, 0.2)
						sprite.x = item.x
						sprite.isRight = false
					}

				}
			}
			sprite.geometry.name = plus.stlId
			sprite.stId = plus.stlId
			sprite.name = 'plus-icon'
			plusGroup.add(sprite);
		})
		console.log(plusGroup)
	}


	function plusModel(stlId, isRight) {
		addPlusList = []
		plusGroup.children = []
		let items = models;
		let len = items.length
		if (model != null) {
			//加在右边
			loadModel(model, stlId, isRight)
		}
	}


	function preloadModel() {
		modelList.forEach((item) => {
			if (item.left == false && item.right == false) {
				$(".box-left .item").eq(item.index).addClass("disabled");
				modelList[item.index].isAvailable = false
			}
		})
	}

	function loadModel(item, stlId, isRight) {
		/**
		 * type 1:在右边添加push  
		 *      2.在左边添加unshift
		 */
		loader.load(item.stlPath, geometry => {
			geometry.scene.name = item.stlId
			geometry.scene.traverse(function(child) {
				if (child.isMesh) {
					child.material.emissive = child.material.color;
					child.material.emissiveMap = child.material.map;
					//child.material.color = new THREE.Color('#544E48');//0x7777ff 
					//child.material.color = new THREE.Color(0x7777ff);
				}
			});
			let mesh = geometry.scene
			mesh.name = item.stlId
			mesh['addLeft'] = item.left
			mesh['addRight'] = item.right
			mesh['stlId'] = item.stlId
			mesh.rotation.x = 0 * Math.PI
			mesh.rotation.y = 0 * Math.PI
			mesh.rotation.z = 0 * Math.PI
			mesh.scale.set(1, 1,1)
			let box = new THREE.Box3().expandByObject(mesh);
			mesh['x'] = box.max.x-box.min.x
			mesh['y'] = box.max.y-box.min.y
			mesh['z'] = box.max.z-box.min.z
			//geometry.computeBoundingBox();
			//let boundingBox = geometry.boundingBox;
			//var boundingBoxWidth  = boundingBox.max.x - boundingBox.min.x;
			//mesh5.translateX(1.25); //网格模型mesh平移
			//mesh['x'] =boundingBoxWidth
            scene.add(mesh)
			let index = group.children.findIndex((it) => {
				return it.stlId == stlId
			})
			if (isRight) {
				index = index + 1
			}

			group.children.splice(index, 0, mesh)
			models.splice(index, 0, item)
			dealModelList(item)
			calcPostion()
		});
	}


	function addModel(item, type) {
		/**
		 * type 1:在右边添加push  
		 *      2.在左边添加unshift
		 */
		loader.load(item.stlPath, gltf => {
			gltf.scene.name = item.stlId
			gltf.scene.castShadow=true;
			gltf.scene.traverse(function(child) {
				if (child.isMesh) {
					child.frustumCulled = false;
					 //模型阴影
					child.castShadow = true;
					//模型自发光
					child.material.emissive =  child.material.color;
					child.material.emissiveMap = child.material.map ;
				}
			});
			let mesh = gltf.scene
			mesh.name = item.stlId
			mesh['addLeft'] = item.left
			mesh['addRight'] = item.right
			mesh['stlId'] = item.stlId
			mesh.rotation.x = 0 * Math.PI
			mesh.rotation.y = 0 * Math.PI
		    mesh.scale.set(1, 1,1)
			let box = new THREE.Box3().expandByObject(mesh);
			console.log("mesh5模型大小" + JSON.stringify(box));
			mesh['x'] = box.max.x-box.min.x
			mesh['y'] = box.max.y-box.min.y
			mesh['z'] = box.max.z-box.min.z
			scene.add(mesh)
			if (type == 1) {
				group.children.push(mesh)
				models.push(item)
			} else {
				group.children.unshift(mesh)
				models.unshift(item)
			}
			calcPostion()
			console.log(models)
		});
	}


	function dealModelList(item) {
		modelList.map((it) => {
			if (it.stlId == item.stlId) {
				it.isAvailable = false
			}
		})
		$(".box-left .item").eq(item.index).addClass("disabled");
		$(".box-left .item").removeClass("active")
		model = null
		dealModelLeftRight()
	}

	function restoreModelList(item) {
		modelList.map((it) => {
			if (it.stlId == item.stlId) {
				it.isAvailable = true
			}
			if (it.left == false && it.right == false) {
				it.isAvailable = false
			}
		})
		let itemIndex = modelList.findIndex((i) => {
			return item.stlId == i.stlId
		})

		//去除已添加数据
		models = models.filter((it) => {
			return it.stlId != item.stlId
		})
		let len = models.length
		if (models.length >= 1) {
			if ((item.right && item.right == models[0].left) || (item.left && item.left == models[len - 1].right) ||
				(models[0].right && models[len - 1].left)) {
				$(".box-left .item").eq(itemIndex).removeClass("disabled");
			} else {
				modelList.map((it) => {
					if (it.stlId == item.stlId) {
						it.isAvailable = false
					}
				})
				$(".box-left .item").eq(itemIndex).addClass("disabled");
			}
		} else {
			modelList.map((it) => {
				if (it.left == false && it.right == false) {
					it.isAvailable = false
					$(".box-left .item").eq(it.index).addClass("disabled");
				} else {
					$(".box-left .item").eq(it.index).removeClass("disabled");
				}
			})
		}
		dealModelLeftRight()
		model = null

	}


	function dealModelLeftRight() {
		let isAddLeft = false
		let isAddRight = false
		models.forEach((item) => {
			if (item.left == false && item.right == true) {
				isAddLeft = true
			}

			if (item.left == true && item.right == false) {
				isAddRight = true
			}
		})

		if (isAddLeft) {
			modelList.map((item) => {
				if (item.left == false && item.right == true) {
					item.isAvailable = false
					$(".box-left .item").eq(item.index).addClass("disabled");
				}
			})
		} else {
			modelList.map((item) => {
				if (item.left == false && item.right == true) {
					item.isAvailable = true
					$(".box-left .item").eq(item.index).removeClass("disabled");
				}
			})
		}

		if (isAddRight) {
			modelList.map((item) => {
				if (item.left == true && item.right == false) {
					item.isAvailable = false
					$(".box-left .item").eq(item.index).addClass("disabled");
				}
			})
		} else {
			modelList.map((item) => {
				if (item.left == true && item.right == false) {
					item.isAvailable = true
					$(".box-left .item").eq(item.index).removeClass("disabled");
				}
			})
		}
	}

	function restoreAllModelList() {
		models = []
		$(".box-left .item").removeClass("disabled").removeClass('active')
		$("#removeAllMesh").addClass("control-button-disabled")
		model = null
		modelList.map((it) => {
			it.isAvailable = true
			if (it.left == false && it.right == false) {
				$(".box-left .item").eq(it.index).addClass("disabled");
				it.isAvailable = false
			}
		})
	}

	function deleteClass(item) {
		restoreModelList(item)
	}


	function calcPostion() {
		console.log(group)
		let totalWidth = 0
		if (group.children.length !== 0) {
			group.children.forEach(item => {
				totalWidth += item.x
			})
			console.log(totalWidth)
			let initX = -totalWidth / 2
			let diffX = 0.2
			let list = group.children;
			let listLength=list.length/2
			list.forEach((item, index) => {
				if (index == 0) {
					//item.position.x = initX + diffX
					item.position.x = initX+ diffX
				} else {
					//item.position.x = initX + diffX
					item.position.x = initX
				}
				initX = initX + item.x
				group.children[index] = item
			})
			console.log(group.children)
		} else {
			$("#removeAllMesh").addClass("control-button-disabled")
		}
	}

	var modelList = [{
			name: "915.stl",
			stlPath:"model/915.glb",
			stlId: 915,
			w: 100,
			h: 100,
			left: false,
			right: true,
			isAvailable: true,
			selectable: false,
			index: 0
		},
		{
			name: "916.stl",
			stlPath: "model/916.glb",
			stlId: 916,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable: true,
			selectable: false,
			index: 1
		},
		{
			name: "1180816.stl",
			stlPath: "model/916.glb",
			stlId: 9162,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable: true,
			selectable: false,
			index: 2
		},
		{
			name: "1180815.stl",
			stlPath: "model/917.glb",
			stlId: 917,
			w: 100,
			h: 100,
			left: true,
			right: false,
			isAvailable: true,
			selectable: false,
			index: 3
		},
		{
			name: "918.stl",
			stlPath: "model/918.glb",
			stlId: 918,
			w: 100,
			h: 100,
			left: false,
			right: true,
			isAvailable: true,
			selectable: false,
			index: 4
		},
		{
			name: "1180820.stl",
			stlPath: "model/918.glb",
			stlId: 918,
			w: 100,
			h: 100,
			left: true,
			right: false,
			isAvailable: true,
			selectable: false,
			index: 5,
			isZhuanjiao:true,
		},
		{
			name: "1180821.stl",
			stlPath: "model/918.glb",
			stlId: 1180820,
			w: 100,
			h: 100,
			left: false,
			right: false,
			isAvailable: true,
			selectable: false,
			isZhuanjiao:true,
			index: 6
		}
	]

	var addFlag = true
	var model = null
	var models = []
	var addPlusList = []
	$(function() {
       $("#load-container").hide();
		$("#load-container").click(function() {
			return false
		})

		var loadingBox = document.getElementById('loading-box')
		var range = document.getElementById('range')
		var percent = document.getElementById('percent')

		// 创建一个定时器，让里面的函数每隔20毫秒自动执行一次
		let timer = setInterval(function() {
			// 使range部分的宽度每次增加2px
			range.style.width = range.clientWidth + 2 + 'px'

			// 当宽度达到和外部盒子宽度一致时，清除定时器
			if (range.clientWidth >= 300) {
				clearInterval(timer)
				$("#load-container").hide();
			}

			// 通过range的宽度和外部盒子宽度的数值比，得到进度的百分比
			var num = parseInt((range.clientWidth / loadingBox.clientWidth) * 100) + '%'
			percent.innerHTML = num
		}, 20)
		preloadModel()

		$(".box-left .item").click(function() {
			let index = $(this).index()
			let item = modelList[index]
			
			if (item.isAvailable) {
				$(this).addClass("active").siblings().removeClass("active")
				if (group.children.length == 0) {
                    addModel(item, 1)
					$("#removeAllMesh").removeClass("control-button-disabled")
				} else {
					model = item
					let items = models;
					let len = items.length
					addPlusList = []
					if (model != null) {
						//addPlusList.push({x:group.children[0].x,stlId:group.children[0].stlId
						if (items.length == 1) {
							if (model.right == true && items[0].left == true) {
								//组合最左边位置可以添加
								addPlusList.push({
									x: group.children[0].x,
									stlId: group.children[0].stlId,
									index: 1
								})
							}

							if (model.left == true && items[0].right == true) {
								//组合的最右边位置可以添加
								addPlusList.push({
									x: group.children[0].x,
									stlId: group.children[0].stlId,
									index: 2
								})
							}
						}

						if (items.length > 1) {
							if (model.right == true && items[0].left == true) {
								//组合最左边位置可以添加
								addPlusList.push({
									x: group.children[0].x,
									stlId: group.children[0].stlId,
									index: 1
								})
							}

							if (model.left == true && items[items.length - 1].right == true) {
								if (model.right) {
									//组合的最右边位置可以添加
									addPlusList.push({
										x: group.children[items.length - 1].x,
										stlId: group.children[items.length - 1].stlId,
										index: 1,
										isEnd: 1
									})
								} else {
									//组合的最右边位置可以添加
									addPlusList.push({
										x: group.children[items.length - 1].x,
										stlId: group.children[items.length - 1].stlId,
										index: 1,
										isEnd: 2
									})
								}
							}

							if (model.left == true && model.right == true) {
								//组合的中间位置都可以添加
								for (i = 1; i < items.length; i++) {
									let it = addPlusList.find((item) => {
										return item.stlId == group.children[i].stlId
									})

									if (it != undefined) {
										addPlusList.push({
											x: group.children[i].x,
											stlId: group.children[i].stlId,
											index: 2
										})
									} else {
										addPlusList.push({
											x: group.children[i].x,
											stlId: group.children[i].stlId,
											index: 1
										})
									}
								}
							}
						}
					}
					addPlusItems(addPlusList)
				}
			}
		})


		$("#addMeshLeft").click(function() {
			let items = models;
			let len = items.length
			addPlusList = []
			plusGroup.children = []
			if (model != null) {
				//加载左边
				if (model.right && model.right == items[0].left) {
					addModel(model, 2);
					$("#addMeshLeft").addClass("control-button-disabled");
				}
			}
		})

		$("#addMeshRight").click(function() {
			addPlusList = []
			plusGroup.children = []
			let items = models;
			let len = items.length
			if (model != null) {
				//加在右边
				if (model.left && model.left == items[len - 1].right) {
					addModel(model, 1);
					$("#addMeshRight").addClass("control-button-disabled");
				}
			}
		})
		
		$("#addMeshY").click(function() {
			let item={
				name: "1180816.stl",
				stlPath: "model/916.glb",
				stlId: 9162,
				w: 100,
				h: 100,
				left: true,
				right: true,
				isAvailable: true,
				selectable: false,
				index: 2
		    }
			loader.load(item.stlPath, gltf => {
				gltf.scene.name = item.stlId
				gltf.scene.castShadow=true;
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						child.frustumCulled = false;
						 //模型阴影
						child.castShadow = true;
						//模型自发光
						child.material.emissive =  child.material.color;
						child.material.emissiveMap = child.material.map ;
					}
				});
				let mesh = gltf.scene
				mesh.name = item.stlId
				mesh['addLeft'] = item.left
				mesh['addRight'] = item.right
				mesh['isAddY'] = true
				mesh['stlId'] = item.stlId
				mesh.rotation.x = 0 * Math.PI
				mesh.rotation.y =  -Math.PI / 2
			    mesh.scale.set(1, 1,1)
				let box = new THREE.Box3().expandByObject(mesh);
				console.log("mesh5模型大小" + JSON.stringify(box));
				let totalWidth=0
				group.children.forEach(item => {
					totalWidth += item.x
				})
				mesh['x'] = box.max.x-box.min.x
				mesh['y'] = box.max.y-box.min.y
				mesh['z'] = box.max.z-box.min.z
				mesh.position.set(totalWidth/2-0.94,0,0.8)
				scene.add(mesh)
				group.children.push(mesh)
				debugger
				console.log(models)
			});
		})
		
		
		$("#addMeshY1").click(function() {
			let item={
					name: "1180815.stl",
					stlPath: "model/917.glb",
					stlId: 917,
					w: 100,
					h: 100,
					left: true,
					right: false,
					isAvailable: true,
					selectable: false,
					index: 3
			}
			
			loader.load(item.stlPath, gltf => {
				gltf.scene.name = item.stlId
				gltf.scene.castShadow=true;
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						child.frustumCulled = false;
						 //模型阴影
						child.castShadow = true;
						//模型自发光
						child.material.emissive =  child.material.color;
						child.material.emissiveMap = child.material.map ;
					}
				});
				let mesh = gltf.scene
				mesh.name = item.stlId
				mesh['addLeft'] = item.left
				mesh['addRight'] = item.right
				mesh['stlId'] = item.stlId
				mesh.rotation.x = 0 * Math.PI
				mesh.rotation.y =  -Math.PI / 2
			    mesh.scale.set(1, 1,1)
				let box = new THREE.Box3().expandByObject(mesh);
				console.log("mesh5模型大小" + JSON.stringify(box));
				let totalWidth=0
				group.children.forEach(item => {
					if(!item.isAddY){
						totalWidth += item.x
					}
				})
				mesh['x'] = box.max.x-box.min.x
				mesh['y'] = box.max.y-box.min.y
				mesh.position.set(totalWidth/2-mesh['x'],0,1.6)
				scene.add(mesh)
				debugger
				group.children.push(mesh)
				console.log(models)
			});
		})
		
		


		$("#removeMesh").click(function() {
			if (selectedObject != null) {
				addPlusList = []
				plusGroup.children = []
				let stlId = selectedObject.stlId;//
				let items = modelList.filter((item) => {
					return item.stlId == stlId
				})
				group.remove(selectedObject);
				scene.remove(selectedObject);
				deleteClass(items[0])
				calcPostion()
			}
		})

		$("#removeAllMesh").click(function() {
			selectedObject = null
			model = null
			 models.forEach((it)=>{
			     scene.children.forEach((item)=>{
					if(it.stlId==item.stlId){
						scene.remove(item)
					}
				})
			})
			group.children = []
			plusGroup.children = []
			restoreAllModelList()
		})
	})



	// 创建一个矩形平面几何体，宽度100，长度200
	var plane = new THREE.PlaneGeometry(0.55, 0.6)
	var material6 = new THREE.MeshPhongMaterial({
		//color: 0xad4fde,
		// 矩形平面网格模型默认单面显示，可以设置side属性值为THREE.DoubleSide双面显示
		//side: THREE.DoubleSide,
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
		outlinePass.edgeStrength = 6; //边缘强度
		outlinePass.edgeGlow = 0; //缓缓接近
		outlinePass.edgeThickness = 2; //边缘厚度
		outlinePass.renderToScreen = true;
		//outlinePass.pulsePeriod = 1 //闪烁
		outlinePass.usePatternTexture = false //是否使用贴图
		outlinePass.visibleEdgeColor.set('#22A7F2'); // 高光颜色0xff0000
		outlinePass.hiddenEdgeColor.set('#22A7F2'); // 阴影颜色
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
		let box = document.getElementById("canvasBox")

		//mouse.x = (event.offsetX / window.innerWidth) * 2 - 1;
		//mouse.y = -(event.offsetY / window.innerHeight) * 2 + 1;
		//通过鼠标点击位置，计算出raycaster所需点的位置，以屏幕为中心点，范围-1到1
		let x = (event.offsetX / box.offsetWidth) * 2 - 1;
		let y = -(event.offsetY / box.offsetHeight) * 2 + 1; //这里为什么是-号，没有就无法点中
        let mouse = new THREE.Vector3(x,y,1);
		//通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
		rayCaster.setFromCamera(mouse, camera);

		//获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
		//+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
		//console.log(group)
		let intersects = rayCaster.intersectObjects(group.children, true);
		//返回选中的对象
		console.log(intersects)
		return intersects;
	}


	function getPlusIntersects(event) {
		event.preventDefault(); // 阻止默认的点击事件执行
		//声明 rayCaster 和 mouse 变量
		let rayCaster = new THREE.Raycaster();
		let mouse = new THREE.Vector3(10,10,1);

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
		let intersects = rayCaster.intersectObjects(plusGroup.children, true);
		//返回选中的对象
		// console.log(intersects)
		return intersects;
	}

	//鼠标双击触发的方法
	function onMouseDblclick(event) {
		//获取raycaster和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
		let intersects = getIntersects(event);
		let plusIntersects = getPlusIntersects(event);
		console.log(intersects);
		//获取选中最近的Mesh对象
		//instance坐标是对象，右边是类，判断对象是不是属于这个类的
		if (intersects.length !== 0) {
			console.log(intersects[0].object.geometry.name);
			selectedObject = intersects[0].object.parent.parent
			outlineOperate([intersects[0].object.parent.parent])
			//group.remove(mesh5) 可以实现模型删除 remove(intersects[0].object)
			for (var i = 0; i < intersects.length; i++) {
				if (intersects[i].object.geometry.name === 'stl003') {
					//intersects[i].object.material.color.set(0xff0000); //变为红色
				} else {

				}
				//render();
			}
			$("#removeMesh").removeClass("control-button-disabled")
		} else {
			selectedObject = null
			outlineOperate([])
			$("#removeMesh").addClass("control-button-disabled")
		}

		if (plusIntersects.length !== 0) {
			if (plusIntersects[0].object.geometry.name) {
				plusModel(plusIntersects[0].object.stId, plusIntersects[0].object.isRight)
			}
		}
	}



	function onDocumentMouseMove(event) {
		// 点击屏幕创建一个向量
		let intersects = getIntersects(event);
		let plusIntersects = getPlusIntersects(event);
		console.log(intersects);
		//获取选中最近的Mesh对象
		//instance坐标是对象，右边是类，判断对象是不是属于这个类的
		if (intersects.length !== 0) {
			console.log(intersects[0].object.geometry.name);
			//group.remove(mesh5) 可以实现模型删除 remove(intersects[0].object)
			for (var i = 0; i < intersects.length; i++) {
				document.body.style.cursor = "pointer";
			}
		} else if (plusIntersects.length !== 0) {
			plusIntersects.forEach((e) => {
				var obj = e.object;
				// 判断相交的是否是精灵对象并且是对应标签的名称，如果是鼠标变小手
				if (obj instanceof THREE.Sprite && obj.name.indexOf("plus-icon") > -1) {
					document.body.style.cursor = "pointer";
				}
			})
		} else {
			document.body.style.cursor = "default";
		}
	}

	document.addEventListener('click', onMouseDblclick);
	document.addEventListener('mousemove', onDocumentMouseMove, false);
}



const animate = () => {
	//scene.add(group);
	scene.add(plusGroup);
	//debugger
	renderer.render(scene, camera);
	//scene.updateMatrixWorld(true);
	//camera.updateMatrixWorld(true);
	requestAnimationFrame(animate);
	if (composer) {
		composer.render()
	}
}

init();
