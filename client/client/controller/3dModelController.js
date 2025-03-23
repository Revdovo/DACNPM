

const container = document.getElementById("canvas-container");
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0xe3f2fd, 1);
container.appendChild(renderer.domElement);

const material = new THREE.MeshStandardMaterial({ color: 0x1565C0, roughness: 0.4, metalness: 0.8 });

function createGearShape(module, teeth, pitchDiameter, holeRadius) {
    const shape = new THREE.Shape();
    const angleStep = (Math.PI * 2) / teeth;
    const addendum = module;
    const dedendum = 1.25 * module;
    const outerRadius = (pitchDiameter / 2) + addendum;
    const rootRadius = (pitchDiameter / 2) - dedendum;

    let points = [];
    for (let i = 0; i < teeth; i++) {
        const angle = i * angleStep;
        const nextAngle = (i + 1) * angleStep;

        points.push(new THREE.Vector2(Math.cos(angle) * rootRadius, Math.sin(angle) * rootRadius));
        points.push(new THREE.Vector2(Math.cos(angle + angleStep * 0.2) * outerRadius, Math.sin(angle + angleStep * 0.2) * outerRadius));
        points.push(new THREE.Vector2(Math.cos(nextAngle - angleStep * 0.2) * outerRadius, Math.sin(nextAngle - angleStep * 0.2) * outerRadius));
        points.push(new THREE.Vector2(Math.cos(nextAngle) * rootRadius, Math.sin(nextAngle) * rootRadius));
    }

    points.push(points[0]);
    shape.setFromPoints(points);

    const hole = new THREE.Path();
    hole.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(hole);

    return shape;
}

let gear;
function createGear(module, teeth, pitchDiameter, holeRadius) {
    if (gear) scene.remove(gear);

    const gearShape = createGearShape(module, teeth, pitchDiameter, holeRadius);
    const extrudeSettings = { depth: module * 10, bevelEnabled: false };
    const gearGeometry = new THREE.ExtrudeGeometry(gearShape, extrudeSettings);

    gear = new THREE.Mesh(gearGeometry, material);
    gear.geometry.center();
    scene.add(gear);
}

camera.position.set(0, 0, 120);
camera.lookAt(0, 0, 0);

const defaultModule = 3.0;
const defaultTeeth = 21;
const defaultPitchDiameter = defaultTeeth * defaultModule;
const defaultHoleRadius = defaultPitchDiameter * 0.2;

createGear(defaultModule, defaultTeeth, defaultPitchDiameter, defaultHoleRadius);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
directionalLight.position.set(5, 5, 10);
scene.add(directionalLight);

scene.background = new THREE.Color(0xE3F2FD);

let isRotating = false;
let previousMouseX, previousMouseY;

document.addEventListener("mousedown", (event) => {
    if (event.button === 2) {
        isRotating = true;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

document.addEventListener("mouseup", () => { isRotating = false; });
document.addEventListener("mousemove", (event) => {
    if (isRotating) {
        let deltaX = event.clientX - previousMouseX;
        let deltaY = event.clientY - previousMouseY;
        gear.rotation.y += deltaX * 0.01;
        gear.rotation.x += deltaY * 0.01;
        previousMouseX = event.clientX;
        previousMouseY = event.clientY;
    }
});

document.addEventListener("contextmenu", (event) => event.preventDefault());

window.addEventListener("resize", () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
