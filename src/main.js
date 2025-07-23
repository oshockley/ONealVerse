import * as THREE from 'three';
import { gsap } from 'gsap';
import { GUI } from 'lil-gui';

// Scene components
import { createScene } from './scene/scene.js';
import { createCamera } from './scene/camera.js';
import { createRenderer } from './scene/renderer.js';
import { createLights } from './scene/lights.js';
import { createEnvironment } from './scene/environment.js';
import { createParticles, createPlanets, updateParticles, updatePlanets } from './effects/particles.js';
import { createPostProcessing } from './effects/postprocessing.js';

// Game objects
import { createFloatingIslands } from './objects/islands.js';
import { createSkillOrbs } from './objects/skillOrbs.js';
import { createProjectPortals } from './objects/projectPortals.js';
import { createSpaceship } from './objects/spaceship.js';
import { createCharacter } from './objects/character.js';
import { createAdvancedSpaceship, updateAdvancedSpaceship } from './objects/advancedSpaceship.js';

// Managers
import { InputManager } from './managers/inputManager.js';
import { AudioManager } from './managers/audioManager.js';
import { UIManager } from './managers/uiManager.js';
import { AnimationManager } from './managers/animationManager.js';

class Portfolio3D {
    constructor() {
        this.canvas = document.querySelector('#webgl');
        this.loadingScreen = document.querySelector('#loading-screen');
        
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        
        // Managers
        this.inputManager = null;
        this.audioManager = null;
        this.uiManager = null;
        this.animationManager = null;
        
        // Scene objects
        this.spaceship = null;
        this.character = null;
        this.islands = [];
        this.skillOrbs = [];
        this.projectPortals = [];
        this.particles = null;
        this.planets = [];
        this.advancedSpaceship = null;
        
        // State
        this.isLoaded = false;
        this.currentSection = 'home';
        this.clock = new THREE.Clock();
        
        this.init();
    }
    
    async init() {
        try {
            // Show loading
            this.showLoading();
            
            // Initialize core components
            await this.initCore();
            
            // Initialize scene objects
            await this.initSceneObjects();
            
            // Initialize managers
            this.initManagers();
            
            // Initialize GUI for debugging
            this.initGUI();
            
            // Start render loop
            this.animate();
            
            // Hide loading and show content
            this.hideLoading();
            
        } catch (error) {
            console.error('Failed to initialize portfolio:', error);
        }
    }
    
    showLoading() {
        this.loadingScreen.style.display = 'flex';
    }
    
    hideLoading() {
        console.log('Hiding loading screen...');
        // Force hide the loading screen
        this.loadingScreen.style.display = 'none';
        document.body.classList.add('loaded');
        this.isLoaded = true;
        console.log('Portfolio loaded successfully!');
    }
    
    async initCore() {
        // Create scene
        this.scene = createScene();
        
        // Create camera
        this.camera = createCamera();
        
        // Create renderer
        this.renderer = createRenderer(this.canvas);
        
        // Create lights
        const lights = createLights();
        lights.forEach(light => this.scene.add(light));
        
        // Create environment
        const environment = await createEnvironment();
        this.scene.add(environment);
        
        // Create particles
        this.particles = createParticles();
        this.scene.add(this.particles);
        
        // Create post-processing
        this.composer = createPostProcessing(this.scene, this.camera, this.renderer);
    }
    
    async initSceneObjects() {
        try {
            console.log('Initializing scene objects...');
            
            // Create floating islands
            console.log('Creating floating islands...');
            this.islands = await createFloatingIslands();
            this.islands.forEach(island => this.scene.add(island));
            
            // Create skill orbs
            console.log('Creating skill orbs...');
            this.skillOrbs = createSkillOrbs();
            this.skillOrbs.forEach(orb => this.scene.add(orb));
            
            // Create project portals
            console.log('Creating project portals...');
            this.projectPortals = await createProjectPortals();
            this.projectPortals.forEach(portal => this.scene.add(portal));
            
            // Create spaceship (player)
            console.log('Creating spaceship...');
            this.spaceship = await createSpaceship();
            this.scene.add(this.spaceship);
            
            // Create running character
            console.log('Creating character...');
            this.character = await createCharacter();
            this.scene.add(this.character);
            
            console.log('Scene objects initialized successfully!');
        } catch (error) {
            console.error('Error initializing scene objects:', error);
            throw error;
        }
    }
    
    initManagers() {
        // Audio manager for sound effects (initialize first)
        this.audioManager = new AudioManager();
        
        // Input manager for controls
        this.inputManager = new InputManager(this.camera, this.spaceship);
        
        // UI manager for interface interactions
        this.uiManager = new UIManager(this);
        
        // Animation manager for smooth transitions
        this.animationManager = new AnimationManager(this);
        
        // Create planets after audio manager is ready
        this.planets = createPlanets(this.audioManager);
        this.planets.forEach(({ planet, ring }) => {
            this.scene.add(planet);
            this.scene.add(ring);
        });
        
        // Create advanced spaceship
        this.advancedSpaceship = createAdvancedSpaceship(this.audioManager);
        this.scene.add(this.advancedSpaceship);
        
        // Start ambient space sounds
        setTimeout(() => {
            this.audioManager.playAmbient();
        }, 1000);
    }
    
    initGUI() {
        // Debug GUI (remove in production)
        if (window.location.search.includes('debug')) {
            const gui = new GUI();
            
            const cameraFolder = gui.addFolder('Camera');
            cameraFolder.add(this.camera.position, 'x', -50, 50);
            cameraFolder.add(this.camera.position, 'y', -50, 50);
            cameraFolder.add(this.camera.position, 'z', -50, 50);
            
            const lightsFolder = gui.addFolder('Lights');
            // Add light controls here
            
            gui.close();
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();
        
        if (this.isLoaded) {
            // Get audio data for reactive effects
            const audioData = this.audioManager?.getAudioData();
            
            // Update managers
            this.inputManager?.update(deltaTime);
            this.animationManager?.update(deltaTime);
            
            // Update scene objects with audio sync
            this.updateSpaceship(deltaTime, elapsedTime);
            this.updateCharacter(deltaTime, elapsedTime);
            this.updateSkillOrbs(deltaTime, elapsedTime);
            this.updateParticles(deltaTime, elapsedTime, audioData);
            this.updateProjectPortals(deltaTime, elapsedTime);
            this.updatePlanets(deltaTime, elapsedTime);
            this.updateAdvancedSpaceship(deltaTime, elapsedTime);
            
            // Update camera based on current section
            this.updateCamera(deltaTime);
        }
        
        // Render
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    updateSpaceship(deltaTime, elapsedTime) {
        if (!this.spaceship) return;
        
        // Gentle floating animation
        this.spaceship.position.y += Math.sin(elapsedTime * 2) * 0.01;
        this.spaceship.rotation.y += deltaTime * 0.5;
        
        // Add some gentle rotation
        this.spaceship.rotation.z = Math.sin(elapsedTime * 1.5) * 0.1;
    }
    
    updateCharacter(deltaTime, elapsedTime) {
        if (!this.character) return;
        
        const userData = this.character.userData;
        if (!userData.isRunning) return;
        
        // Update running path
        userData.currentAngle += deltaTime * userData.runningSpeed / userData.pathRadius;
        
        // Calculate new position on circular path around the main platform
        const x = Math.cos(userData.currentAngle) * userData.pathRadius;
        const z = Math.sin(userData.currentAngle) * userData.pathRadius;
        this.character.position.set(x, -19, z);
        
        // Make character face movement direction
        this.character.rotation.y = userData.currentAngle + Math.PI / 2;
        
        // Running animation
        const runCycle = elapsedTime * 8 + userData.animationOffset; // Fast running cycle
        
        // Arm swinging
        userData.leftArm.rotation.x = Math.sin(runCycle) * 0.8;
        userData.rightArm.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        
        // Leg movement
        userData.leftLeg.rotation.x = Math.sin(runCycle + Math.PI) * 0.6;
        userData.rightLeg.rotation.x = Math.sin(runCycle) * 0.6;
        
        // Foot positioning
        userData.leftFoot.position.y = -0.65 + Math.abs(Math.sin(runCycle + Math.PI)) * 0.2;
        userData.rightFoot.position.y = -0.65 + Math.abs(Math.sin(runCycle)) * 0.2;
        
        // Body bobbing
        userData.body.position.y = 0.6 + Math.abs(Math.sin(runCycle * 2)) * 0.1;
        userData.head.position.y = 1.5 + Math.abs(Math.sin(runCycle * 2)) * 0.1;
        
        // Aura pulsing
        const pulseScale = 1 + Math.sin(elapsedTime * 4) * 0.1;
        userData.aura.scale.setScalar(pulseScale);
        userData.aura.rotation.y += deltaTime * 2;
        
        // Update trail effect
        this.updateCharacterTrail();
    }
    
    updateSkillOrbs(deltaTime, elapsedTime) {
        this.skillOrbs.forEach((orb, index) => {
            if (!orb) return;
            
            // Orbiting animation
            const angle = elapsedTime * 0.5 + (index * Math.PI * 2) / this.skillOrbs.length;
            const radius = 15;
            
            orb.position.x = Math.cos(angle) * radius;
            orb.position.z = Math.sin(angle) * radius;
            orb.position.y = 5 + Math.sin(elapsedTime * 2 + index) * 2;
            
            // Rotation
            orb.rotation.y += deltaTime * 2;
            orb.rotation.x += deltaTime * 1;
        });
    }
    
    updateParticles(deltaTime, elapsedTime, audioData) {
        if (!this.particles) return;
        
        // Use the imported updateParticles function with audio sync
        updateParticles(this.particles, elapsedTime, audioData);
        
        // Sync star twinkle sounds with particle intensity
        if (this.audioManager && Math.random() < 0.01) {
            this.audioManager.syncStarMovement(1000, 0.3);
        }
    }
    
    updatePlanets(deltaTime, elapsedTime) {
        if (!this.planets || this.planets.length === 0) return;
        
        // Use the imported updatePlanets function
        updatePlanets(this.planets, elapsedTime);
    }
    
    updateAdvancedSpaceship(deltaTime, elapsedTime) {
        if (!this.advancedSpaceship) return;
        
        // Use the imported updateAdvancedSpaceship function
        updateAdvancedSpaceship(this.advancedSpaceship, deltaTime, elapsedTime);
    }
    
    updateProjectPortals(deltaTime, elapsedTime) {
        this.projectPortals.forEach((portal, index) => {
            if (!portal) return;
            
            // Beach-themed floating animation (more gentle)
            portal.position.y = 2 + Math.sin(elapsedTime * 0.8 + index * 1.5) * 1.5;
            
            // Gentle swaying like beach decorations
            portal.rotation.y += deltaTime * 0.3;
            
            // Portal-specific animations based on type
            const portalType = portal.userData.portalType;
            if (portalType === 'seashell') {
                portal.rotation.z = Math.sin(elapsedTime + index) * 0.1;
            } else if (portalType === 'messageBottle') {
                portal.rotation.x = Math.sin(elapsedTime * 0.5 + index) * 0.05;
            }
        });
    }
    
    updateEnvironment(deltaTime, elapsedTime) {
        if (!this.environment) return;
        
        // Animate ocean waves
        this.environment.children.forEach(child => {
            if (child.userData && child.userData.material && child.userData.material.uniforms) {
                // Update ocean wave animation
                child.userData.material.uniforms.time.value = elapsedTime;
            }
            
            // Animate seagulls
            if (child.userData && child.userData.type === 'seagulls') {
                const positions = child.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    // Circular flight pattern
                    const index = i / 3;
                    const speed = 0.5;
                    const radius = 80 + Math.sin(elapsedTime * 0.3 + index) * 20;
                    
                    positions[i] = Math.cos(elapsedTime * speed + index * 2) * radius;
                    positions[i + 2] = Math.sin(elapsedTime * speed + index * 2) * radius;
                    positions[i + 1] = 40 + Math.sin(elapsedTime * 0.8 + index) * 10;
                }
                child.geometry.attributes.position.needsUpdate = true;
            }
            
            // Animate ocean spray particles
            if (child.userData && child.userData.type === 'oceanSpray') {
                if (child.material.uniforms) {
                    child.material.uniforms.time.value = elapsedTime;
                }
            }
            
            // Sway palm tree leaves
            if (child.children) {
                child.children.forEach(leafGroup => {
                    if (leafGroup.children) {
                        leafGroup.children.forEach((leaf, leafIndex) => {
                            if (leaf.geometry && leaf.geometry.type === 'ConeGeometry') {
                                leaf.rotation.z = Math.sin(elapsedTime * 2 + leafIndex) * 0.2;
                            }
                        });
                    }
                });
            }
        });
    }
    
    updateCamera(deltaTime) {
        // Camera follows the current section focus
        const targetPositions = {
            home: { x: 0, y: 15, z: 25 },
            about: { x: -20, y: 10, z: 15 },
            skills: { x: 0, y: 20, z: 30 },
            projects: { x: 20, y: 15, z: 20 },
            contact: { x: 0, y: 25, z: 35 }
        };
        
        const target = targetPositions[this.currentSection] || targetPositions.home;
        
        // Smooth camera transition
        gsap.to(this.camera.position, {
            duration: 2,
            x: target.x,
            y: target.y,
            z: target.z,
            ease: "power2.inOut"
        });
        
        // Look at center
        this.camera.lookAt(0, 0, 0);
    }
    
    updateCharacterTrail() {
        if (!this.character) return;
        
        const userData = this.character.userData;
        const trail = userData.trail;
        
        // Add current position to trail
        userData.trailPoints.unshift({
            x: this.character.position.x,
            y: this.character.position.y + 0.5,
            z: this.character.position.z
        });
        
        // Limit trail length
        if (userData.trailPoints.length > 50) {
            userData.trailPoints.pop();
        }
        
        // Update trail geometry
        const positions = trail.geometry.attributes.position.array;
        for (let i = 0; i < userData.trailPoints.length; i++) {
            const point = userData.trailPoints[i];
            if (point) {
                positions[i * 3] = point.x;
                positions[i * 3 + 1] = point.y;
                positions[i * 3 + 2] = point.z;
            }
        }
        
        // Fill remaining positions with the last point to avoid gaps
        for (let i = userData.trailPoints.length; i < 50; i++) {
            const lastPoint = userData.trailPoints[userData.trailPoints.length - 1];
            if (lastPoint) {
                positions[i * 3] = lastPoint.x;
                positions[i * 3 + 1] = lastPoint.y;
                positions[i * 3 + 2] = lastPoint.z;
            }
        }
        
        trail.geometry.attributes.position.needsUpdate = true;
    }
    
    navigateToSection(section) {
        if (this.currentSection === section) return;
        
        this.currentSection = section;
        this.animationManager?.triggerSectionTransition(section);
        this.audioManager?.playNavigationSound();
    }
    
    onWindowResize() {
        // Update camera
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Update composer
        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
        }
    }
}

// Initialize the portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const portfolio = new Portfolio3D();
    
    // Handle window resize
    window.addEventListener('resize', () => portfolio.onWindowResize());
    
    // Make portfolio globally accessible for debugging
    window.portfolio = portfolio;
});

export default Portfolio3D;
