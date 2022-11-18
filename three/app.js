
let scene, camera, renderer;
 
const init = () => {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
 
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
	renderer.shadowMap.enabled = true // 显示阴影
	renderer.shadowMap.type = THREE.PCFSoftShadowMap
	renderer.setClearColor(0x3f3f3f, 1) // 设置背景颜色
	renderer.setPixelRatio( window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
 
    // Camera
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(100, aspect, 0.01, 100);
   // camera.rotation.y = (90 / 180 ) * Math.PI;
    camera.position.set(0,0,2);
 
    // Camera Controls 监听鼠标事件
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
 
    // Loader new THREE STLLoader
    const loader = new THREE.STLLoader();
    /*loader.load("img/2.STL", (result) => {
		debugger
        scene.add(result);
        animate();
    });*/
	loader.load("model/2.STL", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		console.log(1)
		const material = new THREE.MeshLambertMaterial({ color: 0x7777ff })
	    var mesh = new THREE.Mesh(geometry, material)
		mesh.rotation.x = -0.5 * Math.PI
		mesh.scale.set(0.6, 0.6, 0.6)
	    scene.add(mesh);
	});
	
	loader.load("model/2.STL", geometry => {
		/*var material = new THREE.MeshPhongMaterial({color:0x48D1CC});
		var mesh = new THREE.Mesh(geometry,material);*/
		// 创建材质
		console.log(2)
		const materia = new THREE.MeshLambertMaterial({ color: 0x7777ff })
	    var mesh2 = new THREE.Mesh(geometry, materia)
		mesh2.rotation.x = -0.5 * Math.PI
		mesh2.scale.set(0.6, 0.6, 0.6)
		mesh2.position.set(-0.5,0,0);
	    scene.add(mesh2);
	});
	animate();
};
 
const animate = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

init();
