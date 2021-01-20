/*
 * @Author: MD.Ghost
 * @Date: 2021-01-10 15:26:29
 * @LastEditTime: 2021-01-18 23:18:43
 * @LastEditors: Please set LastEditors
 * @Description: first scene 开场动画场景
 * @FilePath: \pal\scene\main.js
 */
import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../utils/OrbitControls.js';
var controls,water, sun, mesh,floor,wheelMeshes = [];
var scene,renderer,mainCarema;
function init(){
    const container = document.querySelector('#game');
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    mainCarema = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    scene.background = new THREE.Color(0x67A7B4);
    addfloor();
    //createSky();
    createTank();
    createLight();
    render();
    createControls();
    animate();
    window.addEventListener( 'resize', onWindowResize, false );
}
init();
// Lights
function createLight(){
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    //const pointLight = new THREE.PointLight( 0xffffff, 2, 1000);
    // particleLight = new THREE.Mesh(
    //     new THREE.SphereBufferGeometry( 4, 8, 8 ),
    //     new THREE.MeshBasicMaterial( { color: 0xffffff } )
    // );
    scene.add( directionalLight );
}

//添加地面
function addfloor(){
    const boxWidth = 10000;
    const boxHeight = 10;
    const boxDepth = 10000;
    //创建一个几何体（box） 作为地面
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    //创建材质
    const material = new THREE.MeshToonMaterial( { color:0xCF9E73 } );
    //创建一个网格
    const floor = new THREE.Mesh(geometry, material);
    
    //把网格加入到场景
    scene.add(floor);

}

function createControls(){
    controls = new OrbitControls( mainCarema, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 100, 0 );
    // controls.minDistance = 40.0;
    // controls.maxDistance = 200.0;
    controls.update();
}

function onWindowResize() {
    console.log(mainCarema.aspect)
    mainCarema.aspect = window.innerWidth / window.innerHeight;
    mainCarema.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.render( scene, mainCarema );
}
function animate(time) {
    time *= 0.001;  // 将时间单位变为秒
    requestAnimationFrame( animate );
    render();
    tankStartCircle(time,false);
    //stats.update();

}
function createTank(){
    //创建一个tank对象
    const tank = new THREE.Object3D();
    scene.add(tank);
    //tank身体
    const tankBody = new THREE.Object3D();
    const tank_material = new THREE.MeshToonMaterial( { color:0x37896D  } );
    const tank_wheel_material = new THREE.MeshToonMaterial( { color:0x07170C  } );
    tank.add(tankBody);
    //tank上立方体部分
    const carWidth = 100;
    const carHeight = 20;
    const carLength = 150;
    const tankBox_top_geometry = new THREE.CylinderGeometry(20,40,20,12);
    const tankBox_top =new THREE.Mesh(tankBox_top_geometry, tank_material);
    tankBox_top.position.set(0,45,0)
    tankBody.add(tankBox_top);
    //tank下立方体部分
    const tankBox_main_geometry = new THREE.BoxGeometry(carWidth,carHeight,carLength);
    const tankBox_main =new THREE.Mesh(tankBox_main_geometry, tank_material);
    tankBox_main.position.set(0,25,0)
    tankBody.add(tankBox_main);
    //tank六个轮子
    const wheelRadius = 12;
    const wheelThickness = 5;
    const wheelSegments = 8;
    const wheelGeometry = new THREE.CylinderBufferGeometry(
        wheelRadius,     // top radius
        wheelRadius,     // bottom radius
        wheelThickness,  // height of cylinder
        wheelSegments);
    const wheelPositions = [
        [-carWidth / 2 - wheelThickness / 2 , -carHeight / 2 + 30,  carLength / 3],
        [ carWidth / 2 + wheelThickness / 2 , -carHeight / 2 + 30,  carLength / 3],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2 + 30, 0],
        [ carWidth / 2 + wheelThickness / 2, -carHeight / 2 + 30, 0],
        [-carWidth / 2 - wheelThickness / 2, -carHeight / 2 + 30, -carLength / 3],
        [ carWidth / 2 + wheelThickness / 2, -carHeight / 2 + 30, -carLength / 3],
    ];
    wheelMeshes = wheelPositions.map((position) => {
        const mesh = new THREE.Mesh(wheelGeometry, tank_wheel_material);
        mesh.position.set(...position);
        mesh.rotation.z = Math.PI * .5;
        mesh.castShadow = true;
        tankBody.add(mesh);
        return mesh;
    });
    //炮筒
    const turret_geometry = new THREE.CylinderGeometry(3,3,120,12);
    const turret = new THREE.Mesh(turret_geometry, tank_material);
    const turret_angle =  0.4*Math.PI;
    turret.position.set(0,65,4/5*carWidth);
    turret.rotation.x = turret_angle;
    tankBody.add(turret);
    tankBehavior(tank);
}
function tankStartCircle(time,flag){
    if(flag){
        wheelMeshes.forEach((obj) => {
            obj.rotation.x = time * 3;
        });
    }else{
        wheelMeshes.forEach((obj) => {
            obj.rotation.x = time * 0;
        });
    }
    
}
function tankBehavior(tank){
    document.onkeydown = function(event) {
        var e = event || window.event || arguments.callee.caller.arguments[0];
        if (e && e.keyCode == 87) { //W键 前进
            tank.position.z =  tank.position.z + 5;
        }
        if (e && e.keyCode == 83) { //S键 后退
            tank.position.z =  tank.position.z - 5;
        }
        if (e && e.keyCode == 65) { //W键 前进
            tank.rotation.y += 1/120*Math.PI;
        }
        if (e && e.keyCode == 68) { //W键 前进
            tank.rotation.y -= 1/120*Math.PI;
        }

    };
}
// function render(time) {
//     time *= 0.001;  // 将时间单位变为秒
//     renderer.render(scene, mainCarema);
//     requestAnimationFrame(render);
// }
// requestAnimationFrame(render);
function render() {
    //const time = performance.now() * 0.001;
    //time *= 0.001;  // 将时间单位变为秒
    // mesh.position.y = Math.sin( time ) * 20 + 5;
    // mesh.rotation.x = time * 0.5;
    // mesh.rotation.z = time * 0.51;
    
    //water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderer.render( scene, mainCarema );
    //requestAnimationFrame(render);
}
//requestAnimationFrame(render);

export default scene;