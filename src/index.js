import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { FirstPersonControls } from './helper/FirstPersonControls';
import {CameraControls} from 'three/examples/jsm/controls/experimental/CameraControls';
const ThreeBSP = require('three-js-csg')(THREE);
import wall from './assets/wall.png';
import top from './assets/top.jpg';
import head from './assets/head.jpg';
import floor from './assets/floor.jpg';
import even from './assets/event.png';
import { Vector3 } from './helper/three.module';


var scene,camera,webGLRenderer,controls,clock,e1,e2,mouse,raycaster,rootDom,rect;
rootDom = document.getElementById('root');
rect = rootDom.getBoundingClientRect();
var images = [];
function initScene(){
    scene = new THREE.Scene();
}

function initCamera(){
    camera = new THREE.PerspectiveCamera(60, rect.width / rect.height, 0.1, 1000);
    
    camera.position.x = 50;
    camera.position.y = 10;
    camera.position.z = 0;

    let position = new THREE.Vector3(-1, 10, 0);
    camera.lookAt(position);
    camera.updateMatrixWorld();
    scene.add(camera);
}

function initWebglRender(){
    webGLRenderer = new THREE.WebGLRenderer({
        antialias : true,
        alpha:true
    });

    webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
    webGLRenderer.setSize(rect.width, rect.height);
    webGLRenderer.shadowMapEnabled = true;

    // add spotlight for the shadows
    // var spotLight = new THREE.PointLight(0xffffff);
    // spotLight.position.set(0, 100, 0);
    // scene.add(spotLight);
    var light = new THREE.AmbientLight( 0xc0c0c0 ); // soft white light
    scene.add( light ); 
}

function initObjects(){
    paintFloor();
    paintTop();
    let wallHeight = 30;
    paintWalls(200, 2, wallHeight, 0, 10, -50, 1/2,0,null,true);//后面墙

    

    paintWalls(200, 2, wallHeight, 0, 10, 50, 1/2, 0,null,true);//前面墙
    paintWalls(102, 2, wallHeight, -100, 10, 0, 1/2, 0, 1/2,true);//左面墙

    var wallMesh = paintWalls(102, 2, wallHeight, 0, 10, 0, 1/2, 0, 1/2,false);//中间墙
    var windowMesh = paintGlass(15, 2, 20, 0, 5, -2, 1/2, 0, 1/2, false);
    var resultMesh = createResultMesh(wallMesh, windowMesh, true);
    scene.add(resultMesh);

    paintWalls(102, 2, wallHeight, 100, 10, 0, 1/2, 0, 1/2,true);//右面墙

    images[0] = paintImg(10,0.2,10,1, 10, 30,1/2, 0,-1/2,true,0,{x: 20,y: 10,z:30});//画
    images[1] = paintImg(10,0.2,10,1, 10, -30,1/2, 0,-1/2,true,1,{x: 20,y: 10,z:-30});//画

    images[2] = paintImg(10,0.2,10,-50, 10, 49,0.5, 1, 0,true,2, {x: -50,y: 10,z:30});//画
    images[3] = paintImg(10,0.2,10,50, 10, 49,0.5, 1, 0,true,3, {x: 50,y: 10,z:30});//画

    images[4] = paintImg(10,0.2,10,99, 10, 0,1/2, 0,1/2,true,4, {x: 60,y: 10,z:0});//画
    images[5] = paintImg(20,0.2,20,-99, 10, 0,1/2, 0,-1/2,true,5, {x: -60,y: 10,z:0});//画

    images[6] = paintImg(10,0.2,10,-50, 10, -49,-1/2, 0,null,true,6,{x: -50,y: 10,z:-30});//画
    images[7] = paintImg(10,0.2,10,50, 10, -49,-1/2, 0,null,true,7,{x: -50,y: 10,z:-30});//画


    images[8] = paintEvent(5,5,5,50,-2.5,0,0,0,0,true,0,{x:50,y:10,z:0},{x:99,y:10,z:0});
    images[9] = paintEvent(5,5,5,-50,-2.5,0,0,0,0,true,1,{x:-50,y:10,z:0},{x:-99,y:10,z:0});

}

function createResultMesh(srcMesh, destMesh, addDest){
    var srcBSP = new ThreeBSP(srcMesh);
    var destBSP = new ThreeBSP(destMesh);
    var resultBSP = srcBSP.subtract(destBSP);
    var result = resultBSP.toMesh(srcMesh.material);
    result.geometry.computeFaceNormals();
    result.geometry.computeVertexNormals();
    if(addDest){
        scene.add(destMesh);
    }

    return result;
}

var paintFloor = function (){
    var loader = new THREE.TextureLoader;
    loader.load(floor, function (texture) {
        //x和y超过图片像素之后重复绘制图片
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        //设置地板重复绘制的密度是1 * 1
        texture.repeat.set(1, 1);

        //设置材质是双面材质
        var material = new THREE.MeshLambertMaterial({
            map : texture,
            side : THREE.DoubleSide
        });

        //创建普通的平面几何体
        var gemotery = new THREE.PlaneGeometry(200,100);

        //创建网格对象
        var mesh = new THREE.Mesh(gemotery,material);
        mesh.position.y = -5;
        mesh.rotation.x = Math.PI/2;
        mesh.name = 'floor';

        scene.add(mesh);
    });
}

var paintTop = function (){
    var loader = new THREE.TextureLoader;
    loader.load(top, function (texture) {
        //x和y超过图片像素之后重复绘制图片
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        //设置地板重复绘制的密度是1 * 1
        texture.repeat.set(1, 1);

        //设置材质是双面材质
        var material = new THREE.MeshLambertMaterial({
            map : texture,
            side : THREE.DoubleSide
        });

        //创建普通的平面几何体
        var gemotery = new THREE.PlaneGeometry(200,100);

        //创建网格对象
        var mesh = new THREE.Mesh(gemotery,material);
        mesh.position.y = 25;
        mesh.rotation.x = Math.PI/2;
        mesh.name = 'top';
        scene.add(mesh);
    });
}

var paintEvent = function(width, depth, height, x, y, z, rotationX, rotationY, rotationZ,addmesh,id,lookPosition,targetPosition){
    var texture = new THREE.TextureLoader().load(even);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshLambertMaterial({
        map : texture,
        side : THREE.DoubleSide
    });

    //创建长方体几何体
    var gemotery = new THREE.BoxGeometry(width, depth, height);

    //创建网格对象以及进行位置的设定
    var mesh = new THREE.Mesh(gemotery,material);
    mesh.position.set(x,y,z)
    mesh.rotation.x = Math.PI * rotationX;
    mesh.rotation.y = Math.PI * rotationY;
    if(rotationZ){
        mesh.rotation.z = Math.PI * rotationZ;
    }
    mesh.name = 'event'+id;
    mesh.lookPosition = lookPosition;
    mesh.targetPosition = targetPosition;
    addmesh && scene.add(mesh);
    return mesh;
}

var paintImg = function(width, depth, height, x, y, z, rotationX, rotationY, rotationZ,addmesh,id,lookPosition){
    var texture = new THREE.TextureLoader().load(head);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshLambertMaterial({
        map : texture,
        side : THREE.DoubleSide
    });

    //创建长方体几何体
    var gemotery = new THREE.BoxGeometry(width, depth, height);

    //创建网格对象以及进行位置的设定
    var mesh = new THREE.Mesh(gemotery,material);
    mesh.position.set(x,y,z)
    mesh.rotation.x = Math.PI * rotationX;
    mesh.rotation.y = Math.PI * rotationY;
    if(rotationZ){
        mesh.rotation.z = Math.PI * rotationZ;
    }
    mesh.name = 'img'+id;
    mesh.lookPosition = lookPosition;
    addmesh && scene.add(mesh);
    return mesh;
}

var paintWalls = function (width, depth, height, x, y, z, rotationX, rotationY, rotationZ,addmesh){
    // var loader = new THREE.TextureLoader;
    var texture = new THREE.TextureLoader().load(wall);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshLambertMaterial({
        map : texture,
        side : THREE.DoubleSide
    });

    //创建长方体几何体
    var gemotery = new THREE.BoxGeometry(width, depth, height);

    //创建网格对象以及进行位置的设定
    var mesh = new THREE.Mesh(gemotery,material);
    mesh.position.set(x,y,z)
    mesh.rotation.x = Math.PI * rotationX;
    mesh.rotation.y = Math.PI * rotationY;
    if(rotationZ){
        mesh.rotation.z = Math.PI * rotationZ;
    }
    mesh.name = 'wall';
    addmesh && scene.add(mesh);
    return mesh;

}

var paintGlass = function (width, depth, height, x, y, z, rotationX, rotationY, rotationZ, addMesh){
    var material = new THREE.MeshBasicMaterial({
        color : 0xffffff,
        transparent : true,
        opacity : 0
    });

    //创建长方体几何体
    var gemotery = new THREE.BoxGeometry(width, depth, height);

    //创建网格对象以及进行位置的设定
    var mesh = new THREE.Mesh(gemotery,material);
    mesh.position.set(x,y,z)
    mesh.rotation.x = Math.PI * rotationX;
    mesh.rotation.y = Math.PI * rotationY;
    if(rotationZ) {
        mesh.rotation.z = Math.PI * rotationZ;
    }

    if(addMesh) {
        scene.add(mesh);
    }

    return mesh;
}

var lookPosition = {},dis={},obejctPosition, dis_look={},nowTargetPosition,jia=100;
function render() {
    requestAnimationFrame(render);
    // y += 0.01;
    // let position = new THREE.Vector3(-10, y, -10)
    // camera.lookAt(position);
    controls.update(clock.getDelta());
    //raycaster.setFromCamera( mouse, camera );
    // if (lookPosition && dis && (Math.abs(camera.position.x - lookPosition.x) > Math.abs(dis.x) || 
    // Math.abs(camera.position.y - lookPosition.y) > Math.abs(dis.y) || 
    // Math.abs(camera.position.z - lookPosition.z) > Math.abs(dis.z))) {
    //     camera.position.x += dis.x;
    //     camera.position.y += dis.y;
    //     camera.position.z += dis.z;
       
    //     // camera.updateMatrixWorld();
    // } else {
    //     lookPosition = null;
    //     dis.x = 0;
    //     dis.y = 0;
    //     dis.z = 0;
       
    //     // if (obejctPosition) {
    //     //     // let posi = new THREE.Vector3(obejctPosition.x,obejctPosition.y,obejctPosition.z);
    //     //     // camera.lookAt(posi);
    //     //     obejctPosition = null;
    //     //     // nowTargetPosition = null;
        // }
        
    // }

    // if (nowTargetPosition && dis_look && (
    //     Math.abs(nowTargetPosition.x - obejctPosition.x) > Math.abs(dis_look.x) || 
    //     Math.abs(nowTargetPosition.y - obejctPosition.y) > Math.abs(dis_look.y) || 
    //     Math.abs(nowTargetPosition.z - obejctPosition.z) > Math.abs(dis_look.z)
    // )) {
    //     jia++;
    //     nowTargetPosition.x += dis_look.x;
    //     nowTargetPosition.y += dis_look.y;
    //     nowTargetPosition.z += dis_look.z;
    //     console.log(dis_look);
    //     controls.lookAt(nowTargetPosition);
    // } else {
    //     dis_look.x = 0;
    //     dis_look.y = 0;
    //     dis_look.z = 0;
    //     nowTargetPosition = null;
    // }
    if (jia < 100) {
        jia++;
        camera.position.x += dis.x;
        camera.position.y += dis.y;
        camera.position.z += dis.z;
        nowTargetPosition.x += dis_look.x;
        nowTargetPosition.y += dis_look.y;
        nowTargetPosition.z += dis_look.z;
        controls.lookAt(nowTargetPosition);

    } else {
        
    }
    
    
    webGLRenderer.render(scene, camera);
}

function addEvent(){
    
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    
    function onMouseClick(event){

        //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标
    
        mouse.x = (event.clientX / rect.width) * 2 - 1;
        mouse.y = -(event.clientY/rect.height) *2 + 1;

        // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
        raycaster.setFromCamera( mouse, camera );
    
        // 获取raycaster直线和所有模型相交的数组集合
        var intersects = raycaster.intersectObjects(images);
        console.log(intersects);
        if (intersects.length > 0) {
            // camera.position.x = intersects[0].object.lookPosition.x;
            // camera.position.y = intersects[0].object.lookPosition.y;
            // camera.position.z = intersects[0].object.lookPosition.z;
            dis.x = (intersects[0].object.lookPosition.x - camera.position.x) / 100;
            dis.y = (intersects[0].object.lookPosition.y - camera.position.y) / 100;
            dis.z = (intersects[0].object.lookPosition.z - camera.position.z) / 100;
            lookPosition = intersects[0].object.lookPosition;
            obejctPosition = intersects[0].object.targetPosition || intersects[0].object.position;
            nowTargetPosition = controls.nowTargetPosition;
            dis_look.x = (obejctPosition.x-nowTargetPosition.x) / 100;
            dis_look.y = (obejctPosition.y-nowTargetPosition.y) / 100;
            dis_look.z = (obejctPosition.z-nowTargetPosition.z) / 100;
            jia = 0;
            // console.log(nowTargetPosition);
            // console.log(obejctPosition);
            // console.log(dis_look);
            // camera.translateZ( - ( intersects[0].object.lookPosition.z- camera.position.z));
            // let posi = new THREE.Vector3(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
            // camera.lookAt(posi);
            // camera.updateMatrixWorld();
        }
        
        //将所有的相交的模型的颜色设置为红色
        // for ( var i = 0; i < intersects.length; i++ ) {
    
        //     intersects[ i ].object.material.color.set( 0xff0000 );
        // }
    
    }
    webGLRenderer.domElement.addEventListener( 'click', onMouseClick, false );
}


    

function init(){
    initScene();
    initCamera();
    initWebglRender();
    initObjects();
    
    document.getElementById("root").appendChild(webGLRenderer.domElement);

    // let orbit = new OrbitControls(camera, webGLRenderer.domElement);
    // orbit.update();
    // orbit.addEventListener('change', render);

    controls = new FirstPersonControls(camera, webGLRenderer.domElement);
    controls.activeLook = false;
    controls.movementSpeed = 1;
    controls.constrainVertical = true;
    controls.lookSpeed = 0.05; //鼠标移动查看的速度
    controls.lookVertical = true;
    controls.mouseDragOn = true;
    controls.dragToLook = true;
    controls.movementSpeed = 10; //相机移动速度
    controls.noFly = true;
    controls.constrainVertical = false; //约束垂直
    controls.verticalMin = 1.0;
    controls.verticalMax = 2.0;
    controls.lon = -100; //进入初始视角x轴的角度
    controls.lat = 0; //初始视角进入后y轴的角度
    clock = new THREE.Clock();


    // var cameraControl = new CameraControls(camera, webGLRenderer.domElement);
    // cameraControl.target = new THREE.Vector3(50, 10, 0);
    // cameraControl.rotateSpeed = 0.3;
    // cameraControl.update();
    addEvent();
    render();
}
//确保init方法在网页加载完毕后被调用
window.onload = init;

