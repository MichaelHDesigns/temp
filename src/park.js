// IMPORT
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// DRACO LOADER TO LOAD DRACO COMPRESSED MODELS FROM BLENDER
const dracoLoader = new DRACOLoader();
const loader = new GLTFLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
dracoLoader.setDecoderConfig({ type: 'js' });
loader.setDRACOLoader(dracoLoader);

// DIV CONTAINER CREATION TO HOLD THREEJS EXPERIENCE
const container = document.createElement('div');
document.body.appendChild(container);

// SCENE CREATION
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000');

// RENDERER CONFIG
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement);

// CAMERAS CONFIG
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(34, 16, -20);
scene.add(camera);

// MAKE EXPERIENCE FULL SCREEN
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(2);
});

// CREATE ORBIT CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);

// SCENE LIGHTS
const ambient = new THREE.AmbientLight(0xa0a0fc, 0.82);
scene.add(ambient);

const sunLight = new THREE.DirectionalLight(0xe8c37b, 1.96);
sunLight.position.set(-69, 44, 14);
scene.add(sunLight);

// LOADING GLB/GLTF MODEL FROM BLENDER
let model;
let spriteCampus;

loader.load('/src/models/gltf/marrakesh.glb', function (gltf) {
    model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.name = 'MaterialCampus.001';
        }
    });

    // Adjusted scale for the model to make it smaller
    model.scale.set(0.1, 0.1, 0.1); // Adjust the scale values as needed

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    scene.add(model);

    // LOADING SPRITE IMAGE
    const spriteTextureCampus = new THREE.TextureLoader().load('/images/sprite.png');
    const spriteMaterialCampus = new THREE.SpriteMaterial({ map: spriteTextureCampus });
    spriteCampus = new THREE.Sprite(spriteMaterialCampus);
    spriteCampus.position.set(1, 0.5, 0);
    spriteCampus.scale.set(0.3, 0.3, 0.3); // Adjusted sprite scale
    scene.add(spriteCampus);

    console.log("SpriteCampus added to the scene:", spriteCampus);
});

// INTRO CAMERA ANIMATION USING TWEEN
function introAnimation() {
    controls.enabled = false;

    // Adjusted initial camera position
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 0, z: 10 }, 3000)
        .delay(1000)
        .easing(TWEEN.Easing.Quartic.InOut)
        .start()
        .onComplete(function () {
            controls.enabled = true;
            setOrbitControlsLimits();
            TWEEN.remove(this);
        });
}

introAnimation();

// DEFINE ORBIT CONTROLS LIMITS
function setOrbitControlsLimits() {
    controls.enableDamping = true;
    controls.dampingFactor = 0.04;
    controls.minDistance = 35;
    controls.maxDistance = 60;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.maxPolarAngle = Math.PI / 2.5;
}

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', onMouseClick);

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

 mouse.y += 0.2;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(spriteCampus);

    if (intersects.length > 0) {
        window.location.href = '/src/components/about-hth.html';
    }
}

// RENDER LOOP FUNCTION
function renderLoop() {
    TWEEN.update();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(renderLoop);
}

renderLoop();
