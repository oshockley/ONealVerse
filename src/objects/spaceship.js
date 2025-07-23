import * as THREE from 'three';

export async function createSpaceship() {
    const group = new THREE.Group();
    
    // Main hull
    const hullGeometry = new THREE.ConeGeometry(1, 4, 8);
    const hullMaterial = new THREE.MeshPhongMaterial({
        color: 0x666666,
        shininess: 100
    });
    const hull = new THREE.Mesh(hullGeometry, hullMaterial);
    hull.rotation.x = Math.PI;
    hull.castShadow = true;
    group.add(hull);
    
    // Cockpit
    const cockpitGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    const cockpitMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const cockpit = new THREE.Mesh(cockpitGeometry, cockpitMaterial);
    cockpit.position.y = 1.5;
    cockpit.scale.y = 0.6;
    group.add(cockpit);
    
    // Wings
    for (let i = 0; i < 2; i++) {
        const wingGeometry = new THREE.BoxGeometry(3, 0.2, 1.5);
        const wingMaterial = new THREE.MeshPhongMaterial({
            color: 0x444444
        });
        const wing = new THREE.Mesh(wingGeometry, wingMaterial);
        wing.position.y = -0.5;
        wing.position.x = i === 0 ? -2 : 2;
        wing.castShadow = true;
        group.add(wing);
        
        // Wing lights
        const lightGeometry = new THREE.SphereGeometry(0.1, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({
            color: i === 0 ? 0xff0000 : 0x00ff00
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(i === 0 ? -3 : 3, -0.5, 0.5);
        group.add(light);
    }
    
    // Engine exhausts
    for (let i = 0; i < 3; i++) {
        const exhaustGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1, 8);
        const exhaustMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333
        });
        const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
        exhaust.position.set(
            (i - 1) * 0.8,
            -2.5,
            0
        );
        group.add(exhaust);
        
        // Engine glow
        const glowGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,
            transparent: true,
            opacity: 0.7
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(
            (i - 1) * 0.8,
            -3,
            0
        );
        group.add(glow);
    }
    
    // Energy field around ship
    const fieldGeometry = new THREE.SphereGeometry(2.5, 16, 16);
    const fieldMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    group.add(field);
    
    // Position the spaceship
    group.position.set(0, 5, 0);
    group.scale.setScalar(1.5);
    
    // Store animation references
    group.userData = {
        type: 'spaceship',
        cockpit: cockpit,
        field: field,
        engineGlows: group.children.filter(child => 
            child.material && child.material.color && 
            child.material.color.getHex() === 0x00ff88
        )
    };
    
    return group;
}
