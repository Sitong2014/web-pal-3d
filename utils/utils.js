/*
 * @Author: your name
 * @Date: 2021-01-10 12:41:16
 * @LastEditTime: 2021-01-10 16:32:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \pal\utils\utils.js
 */

//创建透视摄像机
export function createCamera(option,THREE){
        const fov = option.fov || 75;
        const aspect = option.aspect || 2;  
        const near = option.near || 1;
        const far = option.far || 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.x = option.x || 0;
        camera.position.y = option.y || 0;
        camera.position.z = option.z || 0;
        return camera;
}
