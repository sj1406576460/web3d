let scene, camera, renderer, composer, outlinePass, plusGroup,groupX,groupY,guideLineContainer;
let guideLineContainerList = [];
var initWidth = 1500
var initHeight = 640  //场景canvas高度
var selectedObject = null
var isExistRotateY=false  //转角是否存在，默认只允许一个转角
var zhuanjiaoZ=0

const init = () => {
	//Scene
	scene = new THREE.Scene();
	//scene.background = new THREE.Color('#000'); //A88E77

	//Renderer
	renderer = new THREE.WebGLRenderer({
		alpha:true,//渲染器透明
		antialias:true,//抗锯齿
		precision:'highp',//着色器开启高精度
	});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	//renderer.setClearColor(0x000000, 1) // 设置背景颜色
	renderer.outputEncoding = THREE.sRGBEncoding;
	//renderer.precision='mediump'
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	renderer.setSize(initWidth, initHeight);
	// 把渲染器的渲染结果canvas对象插入到body
	//document.body.appendChild(renderer.domElement);
	// 把渲染器的渲染结果canvas对象插入到'nb+pos'对应的div元素中
	document.getElementById("canvasBox").appendChild(renderer.domElement);

	// Camera initWidth / initHeight
	const aspect = initWidth / initHeight;
	camera = new THREE.PerspectiveCamera(40, aspect,0.01,1000);
	/*camera.rotation.y = (90 / 180 ) * Math.PI;*/
	camera.position.set(0, 0.2, 2);

	// Camera Controls
	let controls = new THREE.OrbitControls(camera, renderer.domElement);
	//controls.addEventListener("change", renderer);
	controls.update()
	
	var point = new THREE.PointLight('#000'); //点光源  
	point.position.set(50, 20, 10); //点光源位置  
	scene.add(point); //点光源添加到场景中
	scene.receiveShadow = true;

	// Light //将环境光添加到场景中
	/*const ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);*/
	
	let hslight = new THREE.HemisphereLight(0xbbbbff, 0x444422, 1.5);
	hslight.castShadow = true;   //warn THREE.WebGLShadowMap:", c, "has no shadow.
	scene.add(hslight);
	
	/*let ambientLight = new THREE.AmbientLight (0x888888);
	scene.add (ambientLight)
	
	let light = new THREE.DirectionalLight (0x888888);
	light.position.set (0.0, 0.0, 1.0);
	scene.add (light);
	
     //将平行光添加到场景中*/

	const spotLight = new THREE.SpotLight(0xffffff) // 创建聚光灯
	spotLight.position.set(50, 20, 10)
	spotLight.castShadow = true
	spotLight.shadow.normalBias = 1e-2;
	spotLight.shadow.bias = - 1e-3;
	scene.add(spotLight)

	const spotLight1 = new THREE.SpotLight(0xfffffff) // 创建聚光灯
	spotLight1.position.set(-50, -20, -10)
	spotLight1.castShadow = true
	scene.add(spotLight1)
	
	const material = new THREE.LineBasicMaterial({
		color: 0x5500ff,
		linewidth: 3,
		linecap: 'round', //ignored by WebGLRenderer
		linejoin:  'round' //ignored by WebGLRenderer
	});
	
	/**const points = [];
	points.push( new THREE.Vector3( 0.1, -0.1, 0.2 ));
	points.push( new THREE.Vector3( -0.3,-0.1, 0.2));
	const geometry = new THREE.BufferGeometry().setFromPoints( points );
	const line = new THREE.Line( geometry, material );
	scene.add( line );
	
	const points2 = [];
	points2.push( new THREE.Vector3( 0.1,0.3, 0.2 ));
	points2.push( new THREE.Vector3( 0.1,-0.1, 0.2));
	const geometry2 = new THREE.BufferGeometry().setFromPoints( points2 );
	const line2 = new THREE.Line( geometry2, material );
	scene.add( line2 );
	
	const points3 = [];
	points3.push( new THREE.Vector3( 0.1,-0.1, -0.2));
	points3.push( new THREE.Vector3( 0.1,-0.1, 0.2));
	const geometry3 = new THREE.BufferGeometry().setFromPoints( points3 );
	const line3 = new THREE.Line( geometry3, material );
	scene.add( line3 );**/

	//加辅助坐标
	/*var axes = new THREE.AxesHelper(100, 20, 20); //红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴
	scene.add(axes);*/

	//Loader new THREE STLLoader
	const loader = new THREE.GLTFLoader();
	plusGroup = new THREE.Group();
	plusGroupY = new THREE.Group();
	groupX = new THREE.Group();
	groupX.children=[]
	
	groupY = new THREE.Group();
	groupY.children=[]
	
	let guideLineMesh = null
	function addGuideLineCube(plusItems){
		// let addedItem = scene.getObjectByProperty('stlId',plusItems[0].stlId)
		removeAllGuideLineCube()
		plusItems.forEach((plus) => {
			console.log("🚀 ~ file: demo.js:115 ~ plusItems.forEach ~ plus:", plus)
	
			let item = groupX.children.find((it) => {
				return plus.stlId == it.stlId
			})
	
			if (item != undefined) {
				console.log("🚀 ~ file: demo.js:89 ~ plusItems.forEach ~ item:", item)
				guideLineContainer = new THREE.Object3D(); // 创建容器
	
				var material = new THREE.MeshBasicMaterial({ color: 0XC0E9F3, transparent: true, opacity: 0.5 });
				var geometry = new THREE.BoxGeometry(item.x, item.y, 0.02); // 创建立方体几何对象
				guideLineMesh = new THREE.Mesh(geometry, material);// 创建立方体网格模型
		
				guideLineContainer.add(guideLineMesh); // 将立方体添加到容器中
	
				guideLineMesh.rotation.y = Math.PI / 2
		
				if (plus['index'] == 2) {
					guideLineContainer.position.set(item.position.x + item.x/2, item.position.y + item.y/2, item.position.z)
				} else {
					if (plus['isEnd'] == 2) {
						guideLineContainer.position.set(item.position.x + item.x/2, item.position.y + item.y/2, item.position.z)
					} else {
						guideLineContainer.position.set(item.position.x - item.x/2, item.position.y + item.y/2, item.position.z)
					}	
				}
				scene.add(guideLineContainer); // 将容器添加到场景中
				guideLineContainerList.push(guideLineContainer)	
			}
		})
	}
	
	let guideLineMeshY = null
	function addGuideLineCubeY(plusItems){
		// let addedItem = scene.getObjectByProperty('stlId',plusItems[0].stlId)
		removeAllGuideLineCube()
		plusItems.forEach((plus) => {
			console.log("🚀 ~ file: demo.js:115 ~ plusItems.forEach ~ plus:", plus)
	
			let item = groupX.children.find((it) => {
				return plus.stlId == it.stlId
			})
	
			if (item == undefined) {
				console.log("🚀 ~ file: demo.js:89 ~ plusItems.forEach ~ item:", item)
				guideLineContainer = new THREE.Object3D(); // 创建容器
	
				var material = new THREE.MeshBasicMaterial({ color: 0XC0E9F3, transparent: true, opacity: 0.5 });
				var geometry = null
				let group_item = groupX.children[groupX.children.length-1]
				if(groupY.children.length>0){
					//geometry = new THREE.BoxGeometry(0.01, item.y, item.z);
					geometry = new THREE.BoxGeometry(0.01, group_item.y, group_item.z); // 创建立方体几何对象
				}else{
					geometry = new THREE.BoxGeometry(0.01, group_item.y, group_item.z);
				}
				guideLineMeshY = new THREE.Mesh(geometry, material);// 创建立方体网格模型
				guideLineContainer.add(guideLineMeshY); // 将立方体添加到容器中
	
				guideLineMeshY.rotation.y = Math.PI/2 
				let groupx_item = groupX.children[groupX.children.length-1]
				if(groupY.children.length>0){
					let yz=groupx_item.z/2;
					groupY.children.forEach((item)=>{
						yz+=item.z
					})
					guideLineContainer.position.set(0.16,0.08,yz)
				}else{
					guideLineContainer.position.set(0.16,0.08,groupx_item.z/2)
				}
				scene.add(guideLineContainer); // 将容器添加到场景中
				guideLineContainerList.push(guideLineContainer)	
			}
		})
	}

	function addPlusItems(plusItems) {
		plusGroup.children = []
		plusItems.forEach((plus) => {
			let map = new THREE.TextureLoader().load('img/add-button.png');
			let spriteMaterial = new THREE.SpriteMaterial({
				map: map,
				sizeAttenuation: false,//保持本身大小
				//transparent: true,
				depthWrite:false
				//-color: 0xffffff
			});
			//为精灵贴图，其特点在于图片会始终面向用户
			let sprite = new THREE.Sprite(spriteMaterial)
			sprite.scale.set(0.06, 0.06, 0.06)
			sprite.rotation.x = 0.1 * Math.PI
			
			let item = groupX.children.find((it) => {
				return plus.stlId == it.stlId
			})
			
			if (item != undefined) {
				if (plus['index'] == 2) {
					sprite.position.set(item.position.x + item.x/2, item.position.y + item.y + 0.06, 0.2)
					sprite.x = item.x
					sprite.isRight = true
				} else {
					if (plus['isEnd'] == 2) {
						sprite.position.set(item.position.x + item.x/2,item.position.y + item.y + 0.06, 0.2)
						sprite.x = item.x
						sprite.isRight = true
					} else {
						sprite.position.set(item.position.x-item.x/2, item.position.y + item.y + 0.06, 0.2)
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
	}
	
	
	function addPlusItemsY(plusItems) {
		plusGroupY.children = []
		plusItems.forEach((plus,index) => {
			let map = new THREE.TextureLoader().load('img/add-button.png');
			let spriteMaterial = new THREE.SpriteMaterial({
				map: map,
				sizeAttenuation: false
			});
			//为精灵贴图，其特点在于图片会始终面向用户
			let sprite = new THREE.Sprite(spriteMaterial)
			sprite.scale.set(0.06, 0.06, 0.06)
			sprite.geometry.name = plus.stlId
			
			let initItem=groupX.children[groupX.children.length-1]
			//这里还得修改判断
			if(groupY.children.length>0){
				sprite.position.set(initItem.x/2,0.33, 0.5)
			}else{
				sprite.position.set(initItem.x/2,0.33, 0.2)
			}
			sprite.stId = plus.stlId
			sprite.name = 'plus-icon'
			plusGroupY.add(sprite);
		})
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
	
	
	function addModelY(item,index){
		if(item.isAvailable){
			loader.load(item.stlPath, gltf => {
				gltf.scene.name = item.stlId
				gltf.scene.castShadow=true;
				gltf.scene.traverse(function(child) {
					if (child.isMesh) {
						child.frustumCulled = false;
						 //模型阴影
						child.castShadow = true;
						//模型自发光
						//child.material.emissive =  child.material.color;
						child.material.color = new THREE.Color('#2E3135');
						//child.material.emissiveMap = child.material.map;
					}
				});
				let mesh = gltf.scene
				mesh.name = item.stlId
				mesh['addLeft'] = item.left
				mesh['addRight'] = item.right
				mesh['rotateY']= item.rotateY
				mesh['zhuanjiaoLeft'] = item.zhuanjiaoLeft
				mesh['zhuanjiaoRight'] = item.zhuanjiaoRight
				mesh['isAddY'] = true
				mesh['stlId'] = item.stlId
				mesh.rotation.x = 0 * Math.PI
				// Math.PI / 6 等于 30度（弧度制）  90度
				mesh.rotation.y = -Math.PI / 2
			    mesh.scale.set(0.4, 0.4, 0.4)
				let box = new THREE.Box3().expandByObject(mesh);
				let totalWidth=0
				let isLastRotateRight=true
				let isLastWidth=0
				groupX.children.forEach(item => {
					totalWidth += item.x
				})
				
				mesh['x'] = box.max.x-box.min.x
				mesh['y'] = box.max.y-box.min.y
				mesh['z'] = box.max.z-box.min.z
				
				let totalZ=0
				groupY.children.forEach(it => {
					totalZ += Math.abs(it.z)
					if(it.rotateY && !it.zhuanjiaoRight){
						isLastRotateRight=false
						isLastWidth=it.z
					}
				})
				
				if(!isLastRotateRight){
					mesh.position.set(totalWidth/2-mesh['x'],-0.1,zhuanjiaoZ+(totalZ-isLastWidth))
					scene.add(mesh)
					//splice 参数依次为从哪开始插入的下标，删除项目数，添加到数组的新项目
					groupY.children.splice(groupY.children.length-1,0,mesh)
					modelsY.splice(index-1, 0, item)
					calcPositionY()
				}else{
					mesh.position.set(totalWidth/2-mesh['x'],-0.1,zhuanjiaoZ+totalZ)
					scene.add(mesh)
					groupY.children.push(mesh)
					modelsY.splice(index, 0, item)
				}
				
				/*mesh.position.set(totalWidth/2-mesh['x'],-0.1,zhuanjiaoZ+totalZ)
				scene.add(mesh)
				groupY.children.push(mesh)
				models.splice(index, 0, item)*/
				
				$(".box-left .item").eq(index).addClass("disabled")
				if(item.rotateY && !item.zhuanjiaoRight){
					modelList.map((it,i)=>{
					   if(item.index==i){
						  it.isAvailable=false
						  $(".box-left .item").eq(i).addClass("disabled"); 
					   }
					})
				}else{
					modelList.map((it,i)=>{
					   if(item.index==i){
						  it.isAvailable=false
						  $(".box-left .item").eq(i).addClass("disabled"); 
					   }
					})
				}
			})
		}
	}
	
	
	function plusYModel(stlId) {
		addPlusListY = []
		plusGroupY.children = []
		let items = models;
		let len = items.length
		if (model != null) {
			//加在右边
			addModelY(model,model.index)
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
				child.updateMatrixWorld(true);
				child.geometry.applyMatrix4(child.matrixWorld);
				if (child.isMesh) {
					//child.material.emissive = child.material.color;
					//child.material.emissiveMap = child.material.map;
					child.material.castShadow = true;
					
					child.material.color = new THREE.Color('#2E3135');
					//child.material.emissiveMap = child.material.map;
					child.material.side = THREE.DoubleSide;
				}
			})
			
			let mesh = geometry.scene
			mesh.name = item.stlId
			mesh['addLeft'] = item.left
			mesh['addRight'] = item.right
			mesh['isZhuanjiao'] = item.isZhuanjiao
			mesh['stlId'] = item.stlId
			mesh.rotation.x = 0 * Math.PI
			mesh.rotation.y = 0 * Math.PI
			mesh.rotation.z = 0 * Math.PI
			mesh.translateY(-0.1) 
			mesh.scale.set(0.4, 0.4, 0.4)
			
			let box = new THREE.Box3().expandByObject(mesh);
			mesh['x'] = box.max.x-box.min.x
			mesh['y'] = box.max.y-box.min.y
			mesh['z'] = box.max.z-box.min.z
			
			if(item.isZhuanjiao){
				zhuanjiaoZ=mesh['z']-0.07
			}
			
            scene.add(mesh)
			// 获取模型对象的父级
			let parent = mesh.parent;
			//修改父级的位置、旋转和缩放
			//parent.position.y-=0.2;
			if(parent.rotation.x!=Math.PI / 12){
			   parent.rotation.x= Math.PI / 12; // Math.PI / 6 等于 30度（弧度制）
			}
			
			let index = groupX.children.findIndex((it) => {
				return it.stlId == stlId
			})
			
			if (isRight) {
				index = index + 1
			}
			
			if(!item["isZhuanjiao"] && (item["zhuanjiaoLeft"] || item["zhuanjiaoRight"])){
				groupY.children.splice(index, 0, mesh)
			}else{
				groupX.children.splice(index, 0, mesh)
			}
			
			models.splice(index, 0, item)
			
			if(item.isZhuanjiao && item.isAvailable){
				isExistRotateY=true
				modelList.map((item,index)=>{
					if(item.rotateY){
						item.isAvailable=true
						$(".box-left .item").eq(index).removeClass("disabled")
					}
					return item;
				})
			}
			dealModelList(item)
			calcPosition()
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
				child.updateMatrixWorld(true);
				child.geometry.applyMatrix4(child.matrixWorld);
				if (child.isMesh) {
					//child.frustumCulled = false;
					///模型阴影
					//child.castShadow = true;
					//模型自发光
					//child.material.emissive =  child.material.color;
					//child.material.emissiveMap = child.material.map;
				    child.material.color = new THREE.Color('#2E3135');
					//child.material.wireframe = true 整体轮廓图
				}
			});
			let mesh = gltf.scene
			mesh.name = item.stlId
			mesh['addLeft'] = item.left
			mesh['addRight'] = item.right
			mesh['stlId'] = item.stlId
			mesh['isZhuanjiao'] = item.isZhuanjiao
			mesh.translateY(-0.1)
			mesh.rotation.x = 0 * Math.PI
			mesh.rotation.y = 0 * Math.PI
		    mesh.scale.set(0.4, 0.4, 0.4)
			mesh.castShadow = mesh.receiveShadow = true;
			let box = new THREE.Box3().expandByObject(mesh);
			mesh['x'] = box.max.x-box.min.x
			mesh['y'] = box.max.y-box.min.y
			mesh['z'] = box.max.z-box.min.z
			
			if(item.isZhuanjiao){
				zhuanjiaoZ=mesh['z'];
			}
			scene.add(mesh)
			// 获取模型对象的父级
			let parent = mesh.parent;
			// 修改父级的位置、旋转和缩放
			// parent.position.y-=0.2;
			parent.rotation.x= Math.PI / 12; // Math.PI / 6 等于 30度（弧度制）
			if (type == 1) {
				groupX.children.push(mesh)
				models.push(item)
			} else {
				groupX.children.unshift(mesh)
				models.unshift(item)
			}
			calcPosition()
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
			if (it.left == false && it.right == false) {
				it.isAvailable = false
			}
			if (it.stlId == item.stlId) {
				it.isAvailable = true
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
					it.isAvailable = true
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


	function calcPosition() {
		let totalWidth = 0
		if (groupX.children.length !== 0) {
			groupX.children.forEach(item => {
			   totalWidth += item.x
			})
			let initX = -totalWidth / 2
			let diffX = 0.06
			let list = groupX.children;
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
				groupX.children[index] = item
			})
			if(groupY.children.length>0){
				calcPositionY();
			}
		} else {
			$("#removeAllMesh").addClass("control-button-disabled")
		}
	}
	
	function calcPositionY() {
		let totalX = 0
		if (groupY.children.length !== 0) {
			let groupXLength=0
			if(groupX.children.length>0){
				groupXLength=groupX.children.length;
				groupX.children.forEach(item => {
				   totalX += item.x
				})
			}
			
			let initX = zhuanjiaoZ
			let diffX = 0.015
			let list = groupY.children;
			list.forEach((item, index) => {
				if (index == 0) {
					item.position.z = initX+diffX
				} else {
					item.position.z = initX
				}
				if(groupX.children.length>1){
					item.position.x = totalX/2-groupX.children[groupXLength-1].x
				}else{
					item.position.x = -0.13
				}
				initX = initX + item.z
				groupY.children[index] = item
				/*if(item.rotateY && !item.zhuanjiaoRight){
					modelList.forEach((it,i)=>{
					   $(".box-left .item").eq(i).addClass("disabled");
					})
				}*/
			})
		} else {
			$("#removeAllMesh").addClass("control-button-disabled")
		}
	}

	var modelList = [{
			name: "915.stl",
			stlPath:"model/915.glb",//87213/8721316.glb
			stlId: 915,
			w: 100,
			h: 100,
			left: false,
			right: true,
			isAvailable: true,
			selectable: false,
			isZhuanjiao:false,
			index: 0,
			rotateX:true,//代表属于X轴拼接的模型
			rotateY:false,//代表不属于Y轴拼接的模型
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
			isZhuanjiao:false,
			index: 1,
			rotateX:true,//代表属于X轴拼接的模型
			rotateY:false,//代表不属于Y轴拼接的模型
		},
		{
			name: "918.stl",
			stlPath: "model/918.glb",
			stlId: 918,
			w: 100,
			h: 100,
			left: true,
			right: false,
			isZhuanjiao:false,
			isAvailable: true,
			selectable: false,
			index: 2,
			rotateX:true,//代表属于X轴拼接的模型
			rotateY:false,//代表不属于Y轴拼接的模型
		},
		{
			name: "917.stl 转角",
			stlPath: "model/917.glb",
			stlId: 917,
			w: 100,
			h: 100,
			left: true,
			right: false,
			isAvailable: true,
			selectable: false,
			index: 3,
			isZhuanjiao:true,
			zhuanjiaoLeft:true,
			zhuanjiaoRight:true,
			rotateX:true,//代表可属于X轴拼接的模型
			rotateY:false,//代表可属于Y轴拼接的模型
		},
		{
			name: "919.stl",
			stlPath: "model/916.glb",
			stlId: 919,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable: false,
			selectable: false,
			isZhuanjiao:false,
			zhuanjiaoLeft:true,
			zhuanjiaoRight:true,
			rotateX:false,//代表不属于X轴拼接的模型
			rotateY:true,//代表属于Y轴拼接的模型
			index: 4
		},
		{
			name: "920.stl",
			stlPath: "model/918.glb",
			stlId: 920,
			w: 100,
			h: 100,
			left: true,
			right: true,
			isAvailable: false,
			selectable: false,
			isZhuanjiao:false,
			zhuanjiaoLeft:true,
			zhuanjiaoRight:false,
			rotateX:false,//代表不属于X轴拼接的模型
			rotateY:true,//代表属于Y轴拼接的模型
			index: 5
		}
	]

	var addFlag = true
	var model = null
	var models = []
	var modelsY = []
	var addPlusList = []
	var addPlusListY = []
	
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
		
		//preloadModel() 预加载
		modelList.forEach((item,index)=>{
			if(!item.isAvailable){
				$(".box-left .item").eq(index).addClass("disabled");
			}
		})

		$(".box-left .item").click(function() {
			let index = $(this).index()
			let item = modelList[index]
			/*if(item.isZhuanjiao && item.isAvailable){
				isExistRotateY=true
				modelList.map((item,index)=>{
					if(item.rotateY){
						item.isAvailable=true
						$(".box-left .item").eq(index).removeClass("disabled")
					}
					return item;
				})
			}*/
			
			//如果存在转角且模型可用，并且也是Y轴方向可拼接，则添加模型
			if(isExistRotateY && item.rotateY && item.isAvailable && !item.isZhuanjiao){
				addPlusListY = [];
				if(groupY.children.length==0 && groupX.children.length>0){
					addPlusListY.push({
						stlId: item.stlId,
						index: 1
					})
					model = item
					addPlusItemsY(addPlusListY);
					addGuideLineCubeY(addPlusListY)
				}else{
					addPlusListY.push({
						stlId: item.stlId,
						index: groupY.children.length-1
					})
					model = item
					addPlusItemsY(addPlusListY);
					addGuideLineCubeY(addPlusListY)
				}
			}
			
			
			if (item.isAvailable && item.rotateX) {
				$(this).addClass("active").siblings().removeClass("active")
				if (groupX.children.length == 0) {
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
									x: groupX.children[0].x,
									stlId: groupX.children[0].stlId,
									index: 1,
									isOnlyLeft:true
								})
							}

							if (model.left == true && items[0].right == true) {
								//组合的最右边位置可以添加
								addPlusList.push({
									x: groupX.children[0].x,
									stlId: groupX.children[0].stlId,
									index: 2
								})
							}
						}

						if (items.length > 1) {
							if (model.right == true && items[0].left == true) {
								//组合最左边位置可以添加
								addPlusList.push({
									x: groupX.children[0].x,
									stlId: groupX.children[0].stlId,
									index: 1
								})
							}

							if (model.left == true && items[items.length - 1].right == true) {
								if (model.right) {
									//组合的最右边位置可以添加
									addPlusList.push({
										x: groupX.children[items.length - 1].x,
										stlId: groupX.children[items.length - 1].stlId,
										index: 1,
										isEnd: 1
									})
								} else {
									//组合的最右边位置可以添加
									addPlusList.push({
										x: groupX.children[items.length - 1].x,
										stlId: groupX.children[items.length - 1].stlId,
										index: 1,
										isEnd: 2
									})
								}
							}

							if (model.left == true && model.right == true) {
								//组合的中间位置都可以添加
								for (i = 1; i < items.length; i++) {
									let it = addPlusList.find((item) => {
										return item.stlId == groupX.children[i].stlId
									})

									if (it != undefined) {
										addPlusList.push({
											x: groupX.children[i].x,
											stlId: groupX.children[i].stlId,
											index: 2
										})
									} else {
										addPlusList.push({
											x: groupX.children[i].x,
											stlId: groupX.children[i].stlId,
											index: 1
										})
									}
								}
							}
						}
					}
					addPlusItems(addPlusList)
					addGuideLineCube(addPlusList)
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
						//child.material.emissiveMap = child.material.map;
						child.material.color = new THREE.Color('#2E3135');
					}
				});
				let mesh = gltf.scene
				mesh.name = item.stlId
				mesh['addLeft'] = item.left
				mesh['addRight'] = item.right
				mesh['isAddY'] = true
				mesh['stlId'] = item.stlId
				mesh.rotation.x = 0 * Math.PI
				// Math.PI / 6 等于 30度（弧度制）  90度
				mesh.rotation.y =  -Math.PI / 2
			    mesh.scale.set(0.4, 0.4, 0.4)
				let box = new THREE.Box3().expandByObject(mesh);
				let totalWidth=0
				groupX.children.forEach(item => {
					totalWidth += item.x
				})
				mesh['x'] = box.max.x-box.min.x
				mesh['y'] = box.max.y-box.min.y
				mesh['z'] = box.max.z-box.min.z
				mesh.position.set(totalWidth/2-mesh['x'],-0.1,0.306)
				scene.add(mesh)
				groupX.children.push(mesh)
			});
		})
		
		
		$("#addMeshY1").click(function() {
			let item={
				name: "1180815.stl",
				stlPath: "model/918.glb",
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
						//child.material.emissiveMap = child.material.map;
						//child.material.color = new THREE.Color('#202C2E');
					}
				});
				let mesh = gltf.scene
				mesh.name = item.stlId
				mesh['addLeft'] = item.left
				mesh['addRight'] = item.right
				mesh['stlId'] = item.stlId
				mesh.rotation.x = 0 * Math.PI
				mesh.rotation.y = -Math.PI / 2
			    mesh.scale.set(0.4, 0.4, 0.4)
				let box = new THREE.Box3().expandByObject(mesh);
				let totalWidth=0
				groupX.children.forEach(item => {
					if(!item.isAddY){
						totalWidth += item.x
					}
				})
				mesh['x'] = box.max.x-box.min.x
				mesh['y'] = box.max.y-box.min.y
				mesh['z'] = box.max.z-box.min.z
				mesh.position.set(totalWidth/2-mesh['x'],-0.1,0.606)
				scene.add(mesh)
				groupX.children.push(mesh)
			})
		})
		

		$("#removeMesh").click(function(e) {
			
			if (selectedObject != null) {
				addPlusList = []
				plusGroup.children = []
				let stlId = selectedObject.stlId;
				
				let items = modelList.filter((item) => {
					return item.stlId == stlId
				})
				
				if(items[0]["rotateY"]){
					groupY.remove(selectedObject);
					calcPositionY()
				}else{
					if(groupY.children.length>0){
						if(selectedObject["isZhuanjiao"]){
							$("#removeMesh").addClass("show");
							setTimeout(function(){
								$("#removeMesh").removeClass("show");
							},3000)
							e.stopPropagation()
							//alert("转角已存在拼接模型,不能删除!若要删除，请先删除转角已拼接模型")
							return;
						}else{
							groupX.remove(selectedObject);
							calcPosition()
							calcPositionY()
						}
					}else{
						if(selectedObject["isZhuanjiao"]){
							modelList.map((item,index)=>{
								if(selectedObject.stlId===item.stlId){
									  item.isAvailable=true
								}else{
									if(item.rotateY && item.isAvailable){
									  item.isAvailable =false
									  $(".box-left .item").eq(index).addClass("disabled")
									}
								}
							})
							groupX.remove(selectedObject);
						}else{
							groupX.remove(selectedObject);
						}
						calcPosition()
					}
				}
				scene.remove(selectedObject);
				deleteClass(items[0])
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
			groupX.children = []
			groupY.children = []
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
	//mesh6.rotation.y = 0.54 * Math.PI
	//mesh6.rotation.z = 0. * Math.PI
	mesh6.position.set(0.82, 0.25, 0)
	//scene.add(mesh6)

	/**
	 * 包围盒全自动计算：模型整体居中
	 */
	var box3 = new THREE.Box3()
	// 计算层级模型group的包围盒
	// 模型group是加载一个三维模型返回的对象，包含多个网格模型
	box3.expandByObject(groupX)
	// 计算一个层级模型对应包围盒的几何体中心在世界坐标中的位置
	var center = new THREE.Vector3()
	box3.getCenter(center)
	console.log('查看几何体中心坐标', center);
	/* 重新设置模型的位置，使之居中。
	group.position.x = group.position.x - center.x
	group.position.y = group.position.y - center.y
	group.position.z = group.position.z - center.z*/
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
		let intersects = rayCaster.intersectObjects(groupX.children.concat(groupY.children), true);
		//返回选中的对象
		return intersects;
	}
	
	
	function getPlusYIntersects(event) {
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
		 
		let intersects = rayCaster.intersectObjects(plusGroupY.children, true);
		//返回选中的对象
		// console.log(intersects)
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
        //mouse.x = ((event.clientX - document.getElementById("canvasBox").getBoundingClientRect().left) / document.getElementById("canvasBox").offsetWidth) * 2 - 1;
        //mouse.y = -((event.clientY - document.getElementById("canvasBox").getBoundingClientRect().top) / document.getElementById("canvasBox").offsetHeight) * 2 + 1;
		//通过鼠标点击的位置(二维坐标)和当前相机的矩阵计算出射线位置
		rayCaster.setFromCamera(mouse, camera);
		 
		/*let standardVector = new THREE.Vector3(mouse.x, mouse.y, 1);// 标准设备坐标
		// 标准设备坐标转世界坐标
		let worldVector = standardVector.unproject(camera);
		// 射线投射方向单位向量(worldVector坐标减相机位置坐标)
		let ray = worldVector.sub(camera.position).normalize();
        let rayCaster = new THREE.Raycaster(camera.position, ray);*/
		//获取与射线相交的对象数组， 其中的元素按照距离排序，越近的越靠前。
		//+true，是对其后代进行查找，这个在这里必须加，因为模型是由很多部分组成的，后代非常多。
		let intersects = rayCaster.intersectObjects(plusGroup.children, true);
		//返回选中的对象
		// console.log(intersects)
		return intersects;
	}
	
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
		outlinePass.visibleEdgeColor.set('#22A7F2'); // 高光颜色0xff0000 #22A7F2 #55557f
		outlinePass.hiddenEdgeColor.set('#22A7F2'); // 阴影颜色
		outlinePass.usePatternTexture = false; //是否使用父级的材质
		outlinePass.downSampleRatio = 2; // 边框弯曲度
	
		effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
		effectFXAA.uniforms['resolution'].value.set(1 / initWidth, 1 / initHeight);
		composer.addPass(effectFXAA);
	
		//outlinePass.clear = true;
		composer.addPass(outlinePass)
	}

	//鼠标双击触发的方法
	function onMouseDblclick(event) {
		//获取raycaster和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
		let intersects = getIntersects(event);
		let plusIntersects = getPlusIntersects(event);
		let plusYIntersects = getPlusYIntersects(event);
		console.log(intersects);
		//获取选中最近的Mesh对象
		//instance坐标是对象，右边是类，判断对象是不是属于这个类的
		if (intersects.length !== 0) {
			console.log(intersects[0].object.geometry.name);
			selectedObject = intersects[0].object.parent.parent
			//outlineOperate([intersects[0].object.parent.parent])
			//group.remove(mesh5) 可以实现模型删除 remove(intersects[0].object)
			for (var i = 0; i < intersects.length; i++) {
				if (intersects[i].object.geometry.name === 'stl003') {
					//intersects[i].object.material.color.set(0xff0000); //变为红色
				} else {

				}
			}
			$("#removeMesh").removeClass("control-button-disabled")
		} else {
			selectedObject = null
			//outlineOperate([])
			$("#removeMesh").addClass("control-button-disabled")
		}

		if (plusIntersects.length !== 0) {
			if (plusIntersects[0].object.geometry.name) {
				removeAllGuideLineCube()
				plusModel(plusIntersects[0].object.stId, plusIntersects[0].object.isRight)
			}
		}
		
		if (plusYIntersects.length !== 0) {
			if (plusYIntersects[0].object.geometry.name) {
				removeAllGuideLineCube()
				plusYModel(plusYIntersects[0].object.stId)
			}
		}
		
	}
	
	
	//移除所有的辅助幕墙
	function removeAllGuideLineCube(){
		if(guideLineContainerList.length > 0){
			guideLineContainerList.forEach((item)=>{
				scene.remove(item)
				guideLineContainer = null
			})
		}
	}



	function onDocumentMouseMove(event) {
		// 点击屏幕创建一个向量
		let intersects = getIntersects(event);
		let plusIntersects = getPlusIntersects(event);
		let plusYIntersects = getPlusYIntersects(event);
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
		} else if(plusYIntersects.length !== 0){
			plusYIntersects.forEach((e) => {
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
	scene.add(plusGroupY);
	//debugger
	renderer.gammaOutput = true;
	renderer.render(scene, camera);
	//scene.updateMatrixWorld(true);
	//camera.updateMatrixWorld(true);
	requestAnimationFrame(animate);
	if (composer) {
		composer.render()
	}
}

init();
