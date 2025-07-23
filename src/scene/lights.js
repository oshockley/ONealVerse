import * as THREE from 'three';

export function createLights() {
    const lights = [];
    
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    lights.push(ambientLight);
    
    // Main directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    
    // Shadow settings
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    
    lights.push(directionalLight);
    
    // Accent lights with colors
    const accentLight1 = new THREE.PointLight(0x00ff88, 0.8, 30);
    accentLight1.position.set(-15, 10, -15);
    lights.push(accentLight1);
    
    const accentLight2 = new THREE.PointLight(0x00ffff, 0.6, 25);
    accentLight2.position.set(15, 8, 15);
    lights.push(accentLight2);
    
    const accentLight3 = new THREE.PointLight(0xff0088, 0.4, 20);
    accentLight3.position.set(0, 25, 0);
    lights.push(accentLight3);
    
    return lights;
}
