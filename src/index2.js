import * as THREE from 'three';
import {FirstPersonControls} from './helper/FirstPersonControls';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import Stats from 'three/examples/jsm/libs/stats.module';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

var container, stats, controls, mixer;
var camera, scene, renderer, light;
var clock = new THREE.Clock();

init();            
animate();

function init() {

    container = document.getElementById( 'root' );
    // document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    camera.position.set( -200, 200, -400);
    let taget = new THREE.Vector3(0,0,0);
    camera.lookAt(taget);

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xa0a0a0 );
    // scene.fog = new THREE.Fog( 0xa0a0a0, 200, 1000 );

    // light = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    // light.position.set( 0, 4000, 0 );
    light = new THREE.AmbientLight( 0xf0f0f0 );
    scene.add( light );

    // light = new THREE.DirectionalLight( 0xffffff );
    // light.position.set( 0, 200, 100 );
    // light.castShadow = true;
    // light.shadow.camera.top = 180;
    // light.shadow.camera.bottom = - 100;
    // light.shadow.camera.left = - 120;
    // light.shadow.camera.right = 120;
    // scene.add( light );

    // scene.add( new CameraHelper( light.shadow.camera ) );

    // ground
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add( mesh );

    var grid = new THREE.GridHelper( 2000, 2, 0x000000, 0x000000 );
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add( grid );

    // model
    // var loader = new GLTFLoader();
    // loader.load( './light_curvedCross.glb', function ( gltf ) {
    //     console.log(gltf);
    //     // scene.add( gltf.scene );
    //     console.log(gltf.scene.position);
        
    //     gltf.scene.traverse( function ( child ) {
    //         if ( child.isMesh ) {
    //             child.material.emissive =  child.material.color;
    //             child.material.emissiveMap = child.material.map ;
    //         }
    //     } );

    //     scene.add( gltf.scene );
    
    // }, undefined, function ( error ) {
    
    //     console.error( error );
    
    // } );
    var axesHelper = new THREE.AxesHelper( 150 );
    scene.add( axesHelper );

    var loader = new FBXLoader();
    loader.load( './test.FBX', function ( object ) {
        console.log(object);
        object.scale.multiplyScalar(.1);
        // mixer = new THREE.AnimationMixer( object );

        // var action = mixer.clipAction( object.animations[ 0 ] );
        // action.play();
        // scene.add( object );
        object.traverse( function ( child ) {
        
            // var material = new THREE.MeshPhongMaterial({
            //     map:texturePlante
            // });
            // child.material=material;
            if ( child.type == 'PointLight') {
                console.log(child);
                // child.castShadow = true;
                // child.receiveShadow = true;
                child.visible = false;
                // scene.remove(child);
            };
    
        });
        scene.add( object );
        // object.traverse( function ( child ) {

        //     if ( child.isMesh ) {

        //         child.castShadow = true;
        //         child.receiveShadow = true;

        //     }

        // } );

        scene.add( object );

    } );

    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.shadowMap.enabled = true;
    container.appendChild( renderer.domElement );

    // controls = new OrbitControls( camera, renderer.domElement );
    // controls.target.set( 0, 100, 0 );
    // controls.update();

    controls = new FirstPersonControls(camera, renderer.domElement);
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

    window.addEventListener( 'resize', onWindowResize, false );

    // stats
    stats = new Stats();
    container.appendChild( stats.dom );

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

//

function animate() {

    requestAnimationFrame( animate );
    controls.update(clock.getDelta());
    // var delta = clock.getDelta();

    // if ( mixer ) mixer.update( delta );

    renderer.render( scene, camera );

    stats.update();

}