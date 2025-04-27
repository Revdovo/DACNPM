const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xe3f2fd, 1);

container.appendChild(renderer.domElement);

function createShaftWithPegs(length, radius, pegSize) {
    const shaftGeometry = new THREE.CylinderGeometry(radius, radius, length, 32);
    const shaftMaterial = new THREE.MeshPhongMaterial({ color: 0x455a64 });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);

    const pegGeometry = new THREE.BoxGeometry(pegSize, pegSize + 0.5, pegSize);
    const pegMaterial = new THREE.MeshPhongMaterial({ color: 0x455a64 });

    const shaftPeg1 = new THREE.Mesh(pegGeometry, pegMaterial);
    shaftPeg1.position.set(0, length / 2 + pegSize / 2, 0);
    shaftPeg1.position.x -= 0.3;
    shaftPeg1.position.y -= 0.6;
    shaft.add(shaftPeg1);

    const shaftPeg2 = new THREE.Mesh(pegGeometry, pegMaterial);
    shaftPeg2.position.set(0, -length / 2 - pegSize / 2, 0);
    shaftPeg2.position.x -= 0.3;
    shaftPeg2.position.y += 0.6;
    shaft.add(shaftPeg2);

    return shaft;
}

const engineBodyGeometry = new THREE.CylinderGeometry(2, 2, 4, 32);
const engineBodyMaterial = new THREE.MeshPhongMaterial({ color: 0x607d8b });
const engineBody = new THREE.Mesh(engineBodyGeometry, engineBodyMaterial);

engineBody.rotation.z = Math.PI / 2; 
engineBody.position.x = -4;
engineBody.position.z = 0;
engineBody.position.y = 0
scene.add(engineBody);

const shaft1 = createShaftWithPegs(3, 0.3, 0.2);

shaft1.rotation.z = Math.PI / 2;

shaft1.position.x = engineBody.position.x + 2;
scene.add(shaft1);

const smallBevelGearGeometry = new THREE.CylinderGeometry(0.8, 1, 0.4, 32, 1, false);
const smallBevelGearMaterial = new THREE.MeshPhongMaterial({ color: 0xff9800 });
const smallBevelGear = new THREE.Mesh(smallBevelGearGeometry, smallBevelGearMaterial);

smallBevelGear.rotation.z = Math.PI / 2 + Math.PI;
smallBevelGear.position.x = shaft1.position.x + 1.25;
scene.add(smallBevelGear);

const largeBevelGearGeometry = new THREE.CylinderGeometry(1.8, 2, 0.5, 32, 1, false);
const largeBevelGearMaterial = new THREE.MeshPhongMaterial({ color: 0xff9800 });
const largeBevelGear = new THREE.Mesh(largeBevelGearGeometry, largeBevelGearMaterial);

largeBevelGear.rotation.x = Math.PI / 2;
largeBevelGear.position.x = smallBevelGear.position.x + 2;
largeBevelGear.position.y = smallBevelGear.position.y;
largeBevelGear.position.z = -1;
scene.add(largeBevelGear);

const shaft2 = createShaftWithPegs(4, 0.3, 0.2);

shaft2.rotation.x = Math.PI / 2;
shaft2.position.x = largeBevelGear.position.x;
shaft2.position.y = largeBevelGear.position.y;
shaft2.position.z = largeBevelGear.position.z + 1.65 ;
scene.add(shaft2);

const smallStraightGearGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
const smallStraightGearMaterial = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
const smallStraightGear = new THREE.Mesh(smallStraightGearGeometry, smallStraightGearMaterial);

smallStraightGear.rotation.x = Math.PI / 2;
smallStraightGear.position.x = shaft2.position.x;
smallStraightGear.position.z = shaft2.position.z + 1.65;
scene.add(smallStraightGear);

const largeStraightGearGeometry = new THREE.CylinderGeometry(2, 2, 0.5, 32);
const largeStraightGearMaterial = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
const largeStraightGear = new THREE.Mesh(largeStraightGearGeometry, largeStraightGearMaterial);

largeStraightGear.rotation.x = Math.PI / 2;
largeStraightGear.position.x = smallStraightGear.position.x + 3;
largeStraightGear.position.z = smallStraightGear.position.z
scene.add(largeStraightGear);

const shaft3 = createShaftWithPegs(6, 0.3, 0.2);

shaft3.rotation.x = Math.PI / 2;
shaft3.position.x = largeStraightGear.position.x;
shaft3.position.y = largeStraightGear.position.y;
shaft3.position.z = largeStraightGear.position.z - 2.65;
scene.add(shaft3);

const sprocket1Geometry = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 24);
const sprocket1Material = new THREE.MeshPhongMaterial({ color: 0x9e9e9e });
const sprocket1 = new THREE.Mesh(sprocket1Geometry, sprocket1Material);
sprocket1.rotation.x = Math.PI / 2;
sprocket1.position.set(shaft3.position.x, shaft3.position.y, shaft3.position.z - 2.75);
scene.add(sprocket1);

const sprocket2Geometry = new THREE.CylinderGeometry(0.9, 0.9, 0.3, 48);
const sprocket2Material = new THREE.MeshPhongMaterial({ color: 0x9e9e9e });
const sprocket2 = new THREE.Mesh(sprocket2Geometry, sprocket2Material);
sprocket2.rotation.x = Math.PI / 2;

sprocket2.position.set(sprocket1.position.x - 3, sprocket1.position.y, sprocket1.position.z); 
scene.add(sprocket2);

class Arc3D extends THREE.Curve {
    constructor(center, radius, startAngle, endAngle, clockwise) {
        super();
        this.center = center;
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.clockwise = clockwise;
    }

    getPoint(t) {
        const deltaAngle = this.clockwise 
            ? this.startAngle - t * (this.startAngle - this.endAngle) 
            : this.startAngle + t * (this.endAngle - this.startAngle);

        return new THREE.Vector3(
            this.center.x + this.radius * Math.sin(deltaAngle),
            this.center.y + this.radius * Math.cos(deltaAngle),
            this.center.z 
        );
    }
}

const center1 = new THREE.Vector3(sprocket1.position.x, sprocket1.position.y, sprocket1.position.z);
const center2 = new THREE.Vector3(sprocket2.position.x, sprocket2.position.y, sprocket2.position.z);

const radius1 = 0.6;
const radius2 = 0.9;

const dx = center2.x - center1.x;
const distance = dx;

const ratio = THREE.MathUtils.clamp((radius2 - radius1) / distance, -1, 1);
const centerAngle1 = Math.PI / 2;
const alpha = Math.acos(ratio);

const smallStartAngle = centerAngle1 - alpha;
const smallEndAngle = centerAngle1 + alpha;

const arcSmall = new Arc3D(center1, radius1, smallStartAngle, smallEndAngle, true);

const centerAngle2 = -Math.PI / 2;
const largeStartAngle = centerAngle2 - alpha;
const largeEndAngle = centerAngle2 + alpha;

const arcLarge = new Arc3D(center2, radius2, largeStartAngle, largeEndAngle, false);

const chainPath = new THREE.CurvePath();
chainPath.add(arcSmall);
chainPath.add(arcLarge);

const chainMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    roughness: 0.4,
    metalness: 0.8,
});

const chainGeometry = new THREE.TubeGeometry(chainPath, 100, 0.05, 8, true);

const chain = new THREE.Mesh(chainGeometry, chainMaterial);
scene.add(chain);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7.5);
scene.add(light);

const lightOffset = new THREE.Vector3(5, 5, 5);

const cameraPositions = {
    tab1: {
        position: { x: engineBody.position.x + 4, y: engineBody.position.y + 5, z: engineBody.position.z + 1 },
        target: engineBody.position
    },
    tab2: {
        position: { x: largeBevelGear.position.x + 2, y: largeBevelGear.position.y + 4, z: largeBevelGear.position.z + 2 },
        target: largeBevelGear.position
    },
    tab3: {
        position: { x: largeStraightGear.position.x - 1, y: largeStraightGear.position.y + 2, z: largeStraightGear.position.z + 4 },
        target: new THREE.Vector3(
            largeStraightGear.position.x - 1,
            largeStraightGear.position.y,
            largeStraightGear.position.z
        )
    },
    
    tab4: {
        position: { x: sprocket1.position.x - 1.5, y: sprocket1.position.y + 1, z: sprocket1.position.z - 3 },
        target: new THREE.Vector3(
            sprocket1.position.x - 2,
            sprocket1.position.y,
            sprocket1.position.z
        )
    },
    tab5: {
        position: { x: 8, y: 5, z: 0 },
        target: shaft1.position
    },
    tab6: {
        position: { x: 6, y: 4, z: 6 },
        target: scene.position
    }
};

let targetPosition = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
let moveSpeed = 0.05;
let rotationSpeed = 0.05;
let isMovingToDTab = true;

let dTabPosition = new THREE.Vector3(6, 4, 6);
let tab5LookAt = new THREE.Vector3();
let currentTab = 'tab1';
let clicked = false;

function updateCameraPosition(tab) {
    const config = cameraPositions[tab];
    if (config) {
        targetPosition.set(config.position.x, config.position.y, config.position.z);
        targetLookAt.set(config.target.x, config.target.y, config.target.z);
    }

    currentTab = tab;
    hideTab()
    clicked = false;

    isMovingToDTab = true;
}

const resultSelector = document.getElementById('resultSelector');
resultSelector.addEventListener('change', (event) => {
    const selectedTab = event.target.value;
    updateCameraPosition(selectedTab);
});

updateCameraPosition(currentTab);

const toggleResultBtn = document.getElementById('toggleResultBtn');
toggleResultBtn.addEventListener('click', (event) => {
    if(!clicked){
        showTab(currentTab);
        clicked = true;
    }
    else {
        hideTab();
        clicked = false;
    }
})

function hideTab() {
    document.querySelectorAll('.tab-content > div').forEach(tab => tab.classList.add('d-none'));
    document.querySelector('.result-container').classList.add('d-none');
}

function showTab(tabId) {
    document.querySelectorAll('.tab-content > div').forEach(tab => tab.classList.add('d-none'));

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.remove('d-none');

    document.querySelector('.result-container').classList.remove('d-none');
}

function animate() {
    requestAnimationFrame(animate);

    if (isMovingToDTab) {
        camera.position.lerp(dTabPosition, moveSpeed);
        const currentLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
        const lookAtDirection = tab5LookAt.clone().sub(currentLookAt);
        camera.lookAt(currentLookAt.add(lookAtDirection.multiplyScalar(rotationSpeed)));

        if (camera.position.distanceTo(dTabPosition) < 0.1) {
            isMovingToDTab = false;
        }
    } else {
        camera.position.lerp(targetPosition, moveSpeed);
        const currentLookAt = new THREE.Vector3().copy(camera.position).add(camera.getWorldDirection(new THREE.Vector3()));
        const lookAtDirection = targetLookAt.clone().sub(currentLookAt);
        camera.lookAt(currentLookAt.add(lookAtDirection.multiplyScalar(rotationSpeed)));
    }
    light.position.copy(camera.position);
    
    shaft1.rotation.x += 1;
    smallBevelGear.rotation.x += 1;
    largeBevelGear.rotation.y -= 0.2;
    shaft2.rotation.y -= 0.2;
    smallStraightGear.rotation.y -= 0.2;
    largeStraightGear.rotation.y += 0.04;
    shaft3.rotation.y += 0.04;
    sprocket1.rotation.y += 0.04;
    sprocket2.rotation.y += 0.008;

    renderer.render(scene, camera);
}
animate();