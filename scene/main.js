/*
 * @Author: MD.Ghost
 * @Date: 2021-01-10 15:26:29
 * @LastEditTime: 2021-01-10 18:51:25
 * @LastEditors: Please set LastEditors
 * @Description: first scene 开场动画场景
 * @FilePath: \pal\scene\main.js
 */
import * as THREE from '../build/three.module.js';
import { OrbitControls } from '../utils/OrbitControls.js';
var controls,water, sun, mesh,floor;
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
function animate() {
    requestAnimationFrame( animate );
    render();
    //stats.update();

}
// function render(time) {
//     time *= 0.001;  // 将时间单位变为秒
//     renderer.render(scene, mainCarema);
//     requestAnimationFrame(render);
// }
// requestAnimationFrame(render);
function render() {

    //const time = performance.now() * 0.001;

    // mesh.position.y = Math.sin( time ) * 20 + 5;
    // mesh.rotation.x = time * 0.5;
    // mesh.rotation.z = time * 0.51;

    //water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    renderer.render( scene, mainCarema );

}

export default scene;