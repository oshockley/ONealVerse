import * as THREE from 'three';

export async function createCharacter() {
    const group = new THREE.Group();
    
    // Character body (simple humanoid)
    const bodyGeometry = new THREE.CapsuleGeometry(0.4, 1.2, 4, 8);
    const bodyMaterial = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.6;
    body.castShadow = true;
    group.add(body);
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const headMaterial = new THREE.MeshPhongMaterial({
        color: 0xffdbac,
        shininess: 10
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    head.castShadow = true;
    group.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.1, 1.55, 0.25);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.1, 1.55, 0.25);
    group.add(rightEye);
    
    // Arms
    const armGeometry = new THREE.CapsuleGeometry(0.15, 0.8, 4, 8);
    const armMaterial = new THREE.MeshPhongMaterial({
        color: 0x4444ff,
        shininess: 30
    });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.6, 1, 0);
    leftArm.rotation.z = Math.PI / 6;
    leftArm.castShadow = true;
    group.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.6, 1, 0);
    rightArm.rotation.z = -Math.PI / 6;
    rightArm.castShadow = true;
    group.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CapsuleGeometry(0.18, 0.9, 4, 8);
    const legMaterial = new THREE.MeshPhongMaterial({
        color: 0x2222aa,
        shininess: 30
    });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.25, -0.15, 0);
    leftLeg.castShadow = true;
    group.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.25, -0.15, 0);
    rightLeg.castShadow = true;
    group.add(rightLeg);
    
    // Feet
    const footGeometry = new THREE.BoxGeometry(0.3, 0.15, 0.5);
    const footMaterial = new THREE.MeshPhongMaterial({
        color: 0x111111,
        shininess: 100
    });
    
    const leftFoot = new THREE.Mesh(footGeometry, footMaterial);
    leftFoot.position.set(-0.25, -0.65, 0.1);
    leftFoot.castShadow = true;
    group.add(leftFoot);
    
    const rightFoot = new THREE.Mesh(footGeometry, footMaterial);
    rightFoot.position.set(0.25, -0.65, 0.1);
    rightFoot.castShadow = true;
    group.add(rightFoot);
    
    // Energy trail effect
    const trailGeometry = new THREE.BufferGeometry();
    const trailMaterial = new THREE.PointsMaterial({
        color: 0x00ff88,
        size: 0.2,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    const trailPositions = new Float32Array(50 * 3); // 50 trail points
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    
    const trail = new THREE.Points(trailGeometry, trailMaterial);
    group.add(trail);
    
    // Glowing aura around character
    const auraGeometry = new THREE.SphereGeometry(1.2, 16, 16);
    const auraMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff88,
        transparent: true,
        opacity: 0.1,
        wireframe: true
    });
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = 0.4;
    group.add(aura);
    
    // Scale the character
    group.scale.setScalar(1.2);
    
    // Store character parts for animation
    group.userData = {
        type: 'character',
        body: body,
        head: head,
        leftArm: leftArm,
        rightArm: rightArm,
        leftLeg: leftLeg,
        rightLeg: rightLeg,
        leftFoot: leftFoot,
        rightFoot: rightFoot,
        trail: trail,
        aura: aura,
        trailPoints: [],
        runningSpeed: 8, // Units per second
        pathRadius: 12, // Radius of circular path
        currentAngle: 0,
        isRunning: true,
        animationOffset: Math.random() * Math.PI * 2 // Random starting animation phase
    };
    
    // Position character on the platform initially
    group.position.set(12, -19, 0);
    
    return group;
}
