import * as THREE from 'three';

export function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);
    
    const colorPalette = [
        new THREE.Color(0x00ff88),
        new THREE.Color(0x00ffff),
        new THREE.Color(0xff0088),
        new THREE.Color(0xffffff)
    ];
    
    for (let i = 0; i < particleCount; i++) {
        // Position
        positions[i * 3] = (Math.random() - 0.5) * 200;
        positions[i * 3 + 1] = Math.random() * 100 - 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
        
        // Velocities for movement
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        
        // Color
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        // Size
        sizes[i] = Math.random() * 2 + 1;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            audioData: { value: 0 }
        },
        vertexShader: `
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            uniform float audioData;
            
            void main() {
                vColor = color;
                
                // Audio-reactive size modulation
                float audioEffect = 1.0 + audioData * 0.5;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * audioEffect * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                if (distance > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { 
        type: 'particles',
        velocities: velocities,
        originalPositions: positions.slice()
    };
    
    return particles;
}

// Create planetary objects that move and generate audio
export function createPlanets(audioManager) {
    const planets = [];
    const planetData = [
        { radius: 2, distance: 30, speed: 0.01, color: 0xff4444, frequency: 55 },
        { radius: 1.5, distance: 45, speed: 0.008, color: 0x44ff44, frequency: 82.5 },
        { radius: 3, distance: 60, speed: 0.006, color: 0x4444ff, frequency: 110 },
        { radius: 1, distance: 75, speed: 0.004, color: 0xffff44, frequency: 165 },
        { radius: 2.5, distance: 90, speed: 0.003, color: 0xff44ff, frequency: 220 }
    ];
    
    planetData.forEach((data, index) => {
        const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
        const material = new THREE.MeshPhongMaterial({ 
            color: data.color,
            emissive: data.color,
            emissiveIntensity: 0.2,
            shininess: 100
        });
        
        const planet = new THREE.Mesh(geometry, material);
        
        // Add orbital ring
        const ringGeometry = new THREE.RingGeometry(data.distance - 0.2, data.distance + 0.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({ 
            color: data.color, 
            transparent: true, 
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        
        planet.userData = {
            type: 'planet',
            distance: data.distance,
            speed: data.speed,
            angle: Math.random() * Math.PI * 2,
            frequency: data.frequency,
            audioManager: audioManager,
            lastSoundTime: 0,
            ring: ring
        };
        
        planets.push({ planet, ring });
    });
    
    return planets;
}

// Update particles with audio reactivity
export function updateParticles(particles, time, audioData) {
    if (!particles || !particles.userData.velocities) return;
    
    const positions = particles.geometry.attributes.position.array;
    const velocities = particles.userData.velocities;
    const originalPositions = particles.userData.originalPositions;
    
    // Audio reactivity
    let audioIntensity = 0;
    if (audioData && audioData.length > 0) {
        for (let i = 0; i < audioData.length; i++) {
            audioIntensity += audioData[i];
        }
        audioIntensity /= (audioData.length * 255);
    }
    
    // Update particle positions
    for (let i = 0; i < positions.length; i += 3) {
        const index = i / 3;
        
        // Apply velocities
        positions[i] += velocities[i] * (1 + audioIntensity * 2);
        positions[i + 1] += velocities[i + 1] * (1 + audioIntensity * 2);
        positions[i + 2] += velocities[i + 2] * (1 + audioIntensity * 2);
        
        // Boundary wrapping
        if (Math.abs(positions[i]) > 100) {
            positions[i] = originalPositions[i];
        }
        if (Math.abs(positions[i + 1]) > 50) {
            positions[i + 1] = originalPositions[i + 1];
        }
        if (Math.abs(positions[i + 2]) > 100) {
            positions[i + 2] = originalPositions[i + 2];
        }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    particles.material.uniforms.time.value = time;
    particles.material.uniforms.audioData.value = audioIntensity;
}

// Update planetary movements and sync with audio
export function updatePlanets(planets, time) {
    planets.forEach(({ planet, ring }) => {
        const userData = planet.userData;
        
        // Update orbital position
        userData.angle += userData.speed;
        
        const x = Math.cos(userData.angle) * userData.distance;
        const z = Math.sin(userData.angle) * userData.distance;
        
        planet.position.set(x, 0, z);
        
        // Calculate movement data for audio
        const velocity = userData.speed * userData.distance;
        const position = { x, y: 0, z };
        
        // Trigger planetary movement sound every few seconds
        if (time - userData.lastSoundTime > 3 && userData.audioManager) {
            userData.audioManager.syncPlanetaryMovement({
                position: position,
                velocity: velocity,
                mass: planet.geometry.parameters.radius
            });
            userData.lastSoundTime = time;
        }
        
        // Rotate planet
        planet.rotation.y += 0.01;
        
        // Update ring position to match planet's orbital center
        ring.position.set(0, 0, 0);
    });
}
