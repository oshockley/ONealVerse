import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    
    // Set background to space-like gradient
    scene.background = new THREE.Color(0x0a0a0a);
    
    // Add fog for depth
    scene.fog = new THREE.Fog(0x0a0a0a, 50, 200);
    
    return scene;
}
