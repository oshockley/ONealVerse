import * as THREE from 'three';

export function createAdvancedSpaceship(audioManager) {
    const spaceshipGroup = new THREE.Group();
    
    // Main hull
    const hullGeometry = new THREE.CylinderGeometry(0.3, 0.8, 4, 8);
    const hullMaterial = new THREE.MeshPhongMaterial({
        color: 0x2a4d69,
        shininess: 100,
        emissive: 0x001122,
        emissiveIntensity: 0.2
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.rotation.z = Math.PI / 2;
    spaceshipGroup.add(hull);
    
    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.6, 16, 8);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e3a5f,
        transparent: true,
        opacity: 0.8,
        emissive: 0x003366,
        emissiveIntensity: 0.3
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.x = 1.5;
    cockpit.scale.set(1, 0.6, 0.8);
    spaceshipGroup.add(cockpit);
    
    // Wings
    const wingGeometry = new THREE.BoxGeometry(0.3, 2.5, 0.1);
    const wingMaterial = new THREE.MeshPhongMaterial({
        color: 0x3a5d7a,
        emissive: 0x001133,
        emissiveIntensity: 0.1
    });
    
    const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
    leftWing.position.set(-0.5, 1.4, 0);
    leftWing.rotation.z = 0.3;
    spaceshipGroup.add(leftWing);
    
    const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
    rightWing.position.set(-0.5, -1.4, 0);
    rightWing.rotation.z = -0.3;
    spaceshipGroup.add(rightWing);
    
    // Engine exhausts
    const engineGeometry = new THREE.CylinderGeometry(0.15, 0.25, 0.8, 6);
    const engineMaterial = new THREE.MeshPhongMaterial({
        color: 0x4a6b8a,
        emissive: 0x002244,
        emissiveIntensity: 0.4
    });
    
    const leftEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    leftEngine.position.set(-2.2, 0.7, 0);
    leftEngine.rotation.z = Math.PI / 2;
    spaceshipGroup.add(leftEngine);
    
    const rightEngine = new THREE.Mesh(engineGeometry, engineMaterial);
    rightEngine.position.set(-2.2, -0.7, 0);
    rightEngine.rotation.z = Math.PI / 2;
    spaceshipGroup.add(rightEngine);
    
    // Engine flames
    const flameGeometry = new THREE.ConeGeometry(0.12, 1.2, 6);
    const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0x00aaff,
        transparent: true,
        opacity: 0.8
    });
    
    const leftFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    leftFlame.position.set(-3.2, 0.7, 0);
    leftFlame.rotation.z = -Math.PI / 2;
    spaceshipGroup.add(leftFlame);
    
    const rightFlame = new THREE.Mesh(flameGeometry, flameMaterial);
    rightFlame.position.set(-3.2, -0.7, 0);
    rightFlame.rotation.z = -Math.PI / 2;
    spaceshipGroup.add(rightFlame);
    
    // Navigation lights
    const lightGeometry = new THREE.SphereGeometry(0.08, 8, 8);
    
    const redLightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xff3333,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });
    const greenLightMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x33ff33,
        emissive: 0x00ff00,
        emissiveIntensity: 0.5
    });
    
    const redLight = new THREE.Mesh(lightGeometry, redLightMaterial);
    redLight.position.set(-0.5, -1.8, 0);
    spaceshipGroup.add(redLight);
    
    const greenLight = new THREE.Mesh(lightGeometry, greenLightMaterial);
    greenLight.position.set(-0.5, 1.8, 0);
    spaceshipGroup.add(greenLight);
    
    // Energy field effect
    const fieldGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ffaa,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
    });
    const energyField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    spaceshipGroup.add(energyField);
    
    // Add glowing trail particles
    const trailParticles = createTrailParticles();
    spaceshipGroup.add(trailParticles);
    
    // Add userData for animation
    spaceshipGroup.userData = {
        type: 'advancedSpaceship',
        audioManager: audioManager,
        flames: [leftFlame, rightFlame],
        lights: [redLight, greenLight],
        energyField: energyField,
        trailParticles: trailParticles,
        speed: 0.02,
        position: { x: -50, y: 0, z: 0 },
        direction: { x: 1, y: 0, z: 0 },
        lastSoundTime: 0,
        isActive: false
    };
    
    // Initial position off-screen
    spaceshipGroup.position.set(-50, 0, 0);
    spaceshipGroup.scale.set(0.8, 0.8, 0.8);
    
    return spaceshipGroup;
}

function createTrailParticles() {
    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = 0;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = 0;
        
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
        
        sizes[i] = Math.random() * 0.3 + 0.1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                gl_FragColor = vec4(vColor, alpha * 0.6);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    return new THREE.Points(geometry, material);
}

export function updateAdvancedSpaceship(spaceship, deltaTime, elapsedTime) {
    if (!spaceship || spaceship.userData.type !== 'advancedSpaceship') return;
    
    const userData = spaceship.userData;
    
    // Check if spaceship should start flying
    if (!userData.isActive && Math.random() < 0.001) { // 0.1% chance per frame
        startSpaceshipFlyby(spaceship);
    }
    
    if (!userData.isActive) return;
    
    // Update position
    userData.position.x += userData.direction.x * userData.speed;
    userData.position.y += userData.direction.y * userData.speed;
    userData.position.z += userData.direction.z * userData.speed;
    
    spaceship.position.copy(userData.position);
    
    // Animate engine flames
    userData.flames.forEach((flame, index) => {
        flame.scale.y = 1 + Math.sin(elapsedTime * 10 + index) * 0.3;
        flame.material.opacity = 0.6 + Math.sin(elapsedTime * 8) * 0.2;
    });
    
    // Animate navigation lights
    userData.lights.forEach((light, index) => {
        light.material.emissiveIntensity = 0.3 + Math.sin(elapsedTime * 6 + index * Math.PI) * 0.2;
    });
    
    // Animate energy field
    userData.energyField.rotation.x += deltaTime * 0.5;
    userData.energyField.rotation.y += deltaTime * 0.3;
    userData.energyField.material.opacity = 0.05 + Math.sin(elapsedTime * 3) * 0.05;
    
    // Update trail particles
    updateTrailParticles(userData.trailParticles, spaceship.position, deltaTime);
    
    // Spaceship rotation for dynamic movement
    spaceship.rotation.z = Math.sin(elapsedTime * 2) * 0.1;
    spaceship.rotation.y = Math.sin(elapsedTime * 1.5) * 0.05;
    
    // Play doppler sound effect
    if (elapsedTime - userData.lastSoundTime > 0.5 && userData.audioManager) {
        const distanceToCenter = spaceship.position.length();
        if (distanceToCenter < 30) {
            userData.audioManager.playDopplerEffect(600, 400, 1.5);
            userData.lastSoundTime = elapsedTime;
        }
    }
    
    // Reset if spaceship goes too far
    if (userData.position.x > 50 || userData.position.y > 30 || userData.position.z > 50) {
        resetSpaceship(spaceship);
    }
}

function startSpaceshipFlyby(spaceship) {
    const userData = spaceship.userData;
    
    // Random entry point and direction
    const entryPoints = [
        { pos: { x: -50, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 }, dir: { x: 1, y: 0, z: 0 } },
        { pos: { x: 50, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 }, dir: { x: -1, y: 0, z: 0 } },
        { pos: { x: Math.random() * 20 - 10, y: -30, z: Math.random() * 20 - 10 }, dir: { x: 0, y: 1, z: 0 } },
        { pos: { x: Math.random() * 20 - 10, y: 30, z: Math.random() * 20 - 10 }, dir: { x: 0, y: -1, z: 0 } }
    ];
    
    const entry = entryPoints[Math.floor(Math.random() * entryPoints.length)];
    
    userData.position = { ...entry.pos };
    userData.direction = { ...entry.dir };
    userData.speed = 0.15 + Math.random() * 0.1;
    userData.isActive = true;
    
    // Play flyby sound
    if (userData.audioManager) {
        userData.audioManager.playSpaceshipFlyby(1, userData.speed);
    }
}

function resetSpaceship(spaceship) {
    const userData = spaceship.userData;
    userData.isActive = false;
    userData.position = { x: -50, y: 0, z: 0 };
    spaceship.position.set(-50, 0, 0);
}

function updateTrailParticles(trailParticles, spaceshipPos, deltaTime) {
    const positions = trailParticles.geometry.attributes.position.array;
    
    // Shift existing particles back
    for (let i = positions.length - 3; i >= 3; i -= 3) {
        positions[i] = positions[i - 3];
        positions[i + 1] = positions[i - 2];
        positions[i + 2] = positions[i - 1];
    }
    
    // Add new particle at spaceship position with slight randomness
    positions[0] = spaceshipPos.x + (Math.random() - 0.5) * 0.5;
    positions[1] = spaceshipPos.y + (Math.random() - 0.5) * 0.5;
    positions[2] = spaceshipPos.z + (Math.random() - 0.5) * 0.5;
    
    trailParticles.geometry.attributes.position.needsUpdate = true;
    trailParticles.material.uniforms.time.value += deltaTime;
}
