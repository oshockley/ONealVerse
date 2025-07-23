import * as THREE from 'three';

export async function createEnvironment() {
    const group = new THREE.Group();
    
    // Create starfield
    const starField = createStarField();
    group.add(starField);
    
    // Create nebula clouds
    const nebula = createNebula();
    group.add(nebula);
    
    // Create grid floor
    const gridFloor = createGridFloor();
    group.add(gridFloor);
    
    return group;
}

function createStarField() {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2,
        transparent: true,
        opacity: 0.8
    });
    
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 400;     // x
        positions[i + 1] = (Math.random() - 0.5) * 400; // y
        positions[i + 2] = (Math.random() - 0.5) * 400; // z
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    return new THREE.Points(geometry, material);
}

function createNebula() {
    const group = new THREE.Group();
    
    // Create multiple nebula clouds with different colors
    const nebulaColors = [0x00ff88, 0x00ffff, 0xff0088, 0x8800ff];
    
    nebulaColors.forEach((color, index) => {
        const geometry = new THREE.SphereGeometry(30, 32, 32);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        
        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.set(
            (Math.random() - 0.5) * 200,
            (Math.random() - 0.5) * 100,
            (Math.random() - 0.5) * 200
        );
        
        group.add(nebula);
    });
    
    return group;
}

function createGridFloor() {
    const size = 100;
    const divisions = 50;
    
    const gridHelper = new THREE.GridHelper(size, divisions, 0x00ff88, 0x004444);
    gridHelper.position.y = -20;
    gridHelper.material.opacity = 0.3;
    gridHelper.material.transparent = true;
    
    return gridHelper;
}
