import * as THREE from 'three';

export function createSkillOrbs() {
    // Based on O'Neal Shockley's actual GitHub repositories and experience
    const skillData = [
        { name: 'React', color: 0x61dafb, icon: 'R' },
        { name: 'TypeScript', color: 0x3178c6, icon: 'TS' },
        { name: 'JavaScript', color: 0xf7df1e, icon: 'JS' },
        { name: 'Three.js', color: 0x000000, icon: '3' },
        { name: 'Vite', color: 0x646cff, icon: 'V' },
        { name: 'Python', color: 0x3776ab, icon: 'P' },
        { name: 'ComfyUI', color: 0xff6b6b, icon: 'C' },
        { name: 'AI/ML', color: 0x4CAF50, icon: 'AI' },
        { name: 'HTML5', color: 0xe34c26, icon: 'H' },
        { name: 'CSS3', color: 0x1572b6, icon: 'CSS' },
        { name: 'Node.js', color: 0x339933, icon: 'N' },
        { name: 'WebGL', color: 0x990000, icon: 'W' }
    ];
    
    const orbs = [];
    
    skillData.forEach((skill, index) => {
        const orb = createSkillOrb(skill);
        orbs.push(orb);
    });
    
    return orbs;
}

function createSkillOrb(skillData) {
    const group = new THREE.Group();
    
    // Main orb
    const orbGeometry = new THREE.SphereGeometry(1.5, 32, 32);
    const orbMaterial = new THREE.MeshPhongMaterial({
        color: skillData.color,
        transparent: true,
        opacity: 0.8,
        shininess: 100
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.castShadow = true;
    group.add(orb);
    
    // Glow effect
    const glowGeometry = new THREE.SphereGeometry(2, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: skillData.color,
        transparent: true,
        opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    group.add(glow);
    
    // Orbital rings
    for (let i = 0; i < 2; i++) {
        const ringGeometry = new THREE.RingGeometry(2.5 + i * 0.5, 2.7 + i * 0.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: skillData.color,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + i * 0.2;
        ring.rotation.z = i * 0.5;
        group.add(ring);
    }
    
    // Energy particles around orb
    const particleCount = 20;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        const radius = 3 + Math.random() * 2;
        const angle1 = Math.random() * Math.PI * 2;
        const angle2 = Math.random() * Math.PI;
        
        positions[i] = radius * Math.sin(angle2) * Math.cos(angle1);
        positions[i + 1] = radius * Math.sin(angle2) * Math.sin(angle1);
        positions[i + 2] = radius * Math.cos(angle2);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        color: skillData.color,
        size: 0.1,
        transparent: true,
        opacity: 0.8
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    group.add(particles);
    
    // Store skill data for interaction
    group.userData = {
        skillName: skillData.name,
        skillIcon: skillData.icon,
        type: 'skillOrb'
    };
    
    return group;
}
