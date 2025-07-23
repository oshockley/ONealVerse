import * as THREE from 'three';

export async function createFloatingIslands() {
    const islands = [];
    
    // Main central island
    const mainIsland = createIsland(8, 0x00ff88);
    mainIsland.position.set(0, 0, 0);
    islands.push(mainIsland);
    
    // Skill islands
    const skillPositions = [
        { x: -25, y: 5, z: -15 },
        { x: 25, y: 8, z: -10 },
        { x: -20, y: 12, z: 20 },
        { x: 30, y: 6, z: 25 }
    ];
    
    skillPositions.forEach((pos, index) => {
        const island = createIsland(4, 0x00ffff);
        island.position.set(pos.x, pos.y, pos.z);
        islands.push(island);
    });
    
    // Project islands
    const projectPositions = [
        { x: 0, y: 15, z: -30 },
        { x: -35, y: 10, z: 0 },
        { x: 35, y: 18, z: 15 }
    ];
    
    projectPositions.forEach((pos, index) => {
        const island = createIsland(6, 0xff0088);
        island.position.set(pos.x, pos.y, pos.z);
        islands.push(island);
    });
    
    return islands;
}

function createIsland(size, color) {
    const group = new THREE.Group();
    
    // Base rock
    const rockGeometry = new THREE.CylinderGeometry(size, size * 1.2, 3, 8);
    const rockMaterial = new THREE.MeshLambertMaterial({
        color: 0x444444,
        roughness: 0.8
    });
    const rock = new THREE.Mesh(rockGeometry, rockMaterial);
    rock.receiveShadow = true;
    group.add(rock);
    
    // Glowing core
    const coreGeometry = new THREE.SphereGeometry(size * 0.2, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.8
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    core.position.y = 1;
    group.add(core);
    
    // Energy rings
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.RingGeometry(size * 0.5 + i, size * 0.6 + i, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.3 - i * 0.1,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.y = 2 + i * 0.5;
        ring.rotation.x = Math.PI / 2;
        group.add(ring);
    }
    
    // Add floating crystals
    for (let i = 0; i < 5; i++) {
        const crystalGeometry = new THREE.ConeGeometry(0.3, 1.5, 6);
        const crystalMaterial = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        
        const angle = (i / 5) * Math.PI * 2;
        crystal.position.set(
            Math.cos(angle) * size * 0.8,
            2 + Math.random() * 2,
            Math.sin(angle) * size * 0.8
        );
        crystal.rotation.y = angle;
        crystal.castShadow = true;
        
        group.add(crystal);
    }
    
    return group;
}
