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
const camera = new THREE.PerspectiveCamera(130, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set(0, 2, 10); // Adjusted initial camera position
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
let spriteMarket;

loader.load('/src/models/gltf/mexico.glb', function (gltf) {
    model = gltf.scene;
    model.traverse((child) => {
        if (child.isMesh) {
            child.name = 'MaterialMarket.001';
        }
    });

    // Adjusted scale for the model
    model.scale.set(0.1, 0.1, 0.1);

    // Center the model
    model.position.set(0, 0, 0);

    scene.add(model);

    // LOADING SPRITE IMAGE
    const spriteTextureMarket = new THREE.TextureLoader().load('/images/sprite.png');
    const spriteMaterialMarket = new THREE.SpriteMaterial({ map: spriteTextureMarket });
    spriteMarket = new THREE.Sprite(spriteMaterialMarket);
    spriteMarket.position.set(-3, 27, -7);
    spriteMarket.scale.set(5, 5, 5); // Adjusted sprite scale
    scene.add(spriteMarket);

    console.log("SpriteMarket added to the scene:", spriteMarket);
});

// INTRO CAMERA ANIMATION USING TWEEN
function introAnimation() {
    controls.enabled = false;

    new TWEEN.Tween(camera.position.set(26, 4, -35))
        .to({ x: 16, y: 50, z: -0.1 }, 6500)
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

    const intersects = raycaster.intersectObject(spriteMarket);

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
