/*
 * @Author: MD.Ghost
 * @Date: 2021-01-10 15:26:29
 * @LastEditTime: 2021-01-10 18:51:25
 * @LastEditors: Please set LastEditors
 * @Description: first scene 开场动画场景
 * @FilePath: \pal\scene\main.js
 */
import * as THREE from '../build/three.module.js';
import { Sky } from '../objs/Sky.js';
import { Water } from '../objs/Water.js';
import { OrbitControls } from '../utils/OrbitControls.js';
var controls,water, sun, mesh;
var scene,renderer,mainCarema;
function init(){
    const container = document.querySelector('#game');
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    scene = new THREE.Scene();
    mainCarema = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    scene.background = new THREE.Color(0x000000);
    createSky();
    render();
    createControls();
    animate();
    window.addEventListener( 'resize', onWindowResize, false );
}
init();
//天空
function createSky(){
    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );
    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        inclination: 0.49,
        azimuth: 0.205
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    sun = new THREE.Vector3();
    updateSun(sun,sky,parameters,pmremGenerator);
}
function updateSun(sun,sky,parameters,pmremGenerator) {
    const theta = Math.PI * ( parameters.inclination - 0.5 );
    const phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );
    sun.x = Math.cos( phi );
    sun.y = Math.sin( phi ) * Math.sin( theta );
    sun.z = Math.sin( phi ) * Math.cos( theta );

    sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
    //water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

    scene.environment = pmremGenerator.fromScene( sky ).texture;

}


function createControls(){
    controls = new OrbitControls( mainCarema, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
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