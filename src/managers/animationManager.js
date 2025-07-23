import { gsap } from 'gsap';

export class AnimationManager {
    constructor(portfolio) {
        this.portfolio = portfolio;
        this.activeAnimations = new Map();
    }
    
    update(deltaTime) {
        // Update time-based animations
        this.updateTimeBasedAnimations(deltaTime);
    }
    
    updateTimeBasedAnimations(deltaTime) {
        const time = performance.now() * 0.001;
        
        // Update project portal shaders
        this.portfolio.projectPortals?.forEach(portal => {
            const material = portal.userData.material;
            if (material && material.uniforms && material.uniforms.time) {
                material.uniforms.time.value = time;
            }
        });
        
        // Update particle time if using custom shader
        if (this.portfolio.particles?.material?.uniforms?.time) {
            this.portfolio.particles.material.uniforms.time.value = time;
        }
    }
    
    triggerSectionTransition(section) {
        // Animate skill orbs based on section
        switch (section) {
            case 'skills':
                this.animateSkillOrbsIn();
                break;
            case 'projects':
                this.animateProjectPortals();
                break;
            case 'about':
                this.animateSpaceshipIntro();
                this.animateCharacterGreeting();
                break;
            default:
                this.resetAnimations();
        }
    }
    
    animateSkillOrbsIn() {
        if (!this.portfolio.skillOrbs) return;
        
        this.portfolio.skillOrbs.forEach((orb, index) => {
            if (!orb) return;
            
            // Store original position
            if (!orb.userData.originalPosition) {
                orb.userData.originalPosition = orb.position.clone();
            }
            
            // Animate from center outward
            gsap.fromTo(orb.position, {
                x: 0,
                y: 0,
                z: 0
            }, {
                x: orb.userData.originalPosition.x,
                y: orb.userData.originalPosition.y,
                z: orb.userData.originalPosition.z,
                duration: 1 + index * 0.1,
                ease: "back.out(1.7)",
                delay: index * 0.1
            });
            
            // Animate scale
            gsap.fromTo(orb.scale, {
                x: 0,
                y: 0,
                z: 0
            }, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)",
                delay: index * 0.1
            });
        });
    }
    
    animateProjectPortals() {
        if (!this.portfolio.projectPortals) return;
        
        this.portfolio.projectPortals.forEach((portal, index) => {
            if (!portal) return;
            
            // Pulse animation
            gsap.to(portal.scale, {
                x: 1.2,
                y: 1.2,
                z: 1.2,
                duration: 0.5,
                ease: "power2.inOut",
                yoyo: true,
                repeat: 1,
                delay: index * 0.2
            });
            
            // Rotate portal
            gsap.to(portal.rotation, {
                y: portal.rotation.y + Math.PI * 2,
                duration: 2,
                ease: "power2.inOut",
                delay: index * 0.2
            });
        });
    }
    
    animateSpaceshipIntro() {
        if (!this.portfolio.spaceship) return;
        
        const spaceship = this.portfolio.spaceship;
        
        // Store original position
        if (!spaceship.userData.originalPosition) {
            spaceship.userData.originalPosition = spaceship.position.clone();
        }
        
        // Fly in from distance
        gsap.fromTo(spaceship.position, {
            x: spaceship.userData.originalPosition.x - 50,
            y: spaceship.userData.originalPosition.y + 20,
            z: spaceship.userData.originalPosition.z - 50
        }, {
            x: spaceship.userData.originalPosition.x,
            y: spaceship.userData.originalPosition.y,
            z: spaceship.userData.originalPosition.z,
            duration: 3,
            ease: "power2.out"
        });
        
        // Spin during entry
        gsap.to(spaceship.rotation, {
            y: spaceship.rotation.y + Math.PI * 4,
            duration: 3,
            ease: "power2.out"
        });
    }
    
    animateCharacterGreeting() {
        if (!this.portfolio.character) return;
        
        const character = this.portfolio.character;
        const userData = character.userData;
        
        // Temporarily stop running
        userData.isRunning = false;
        
        // Make character jump and wave
        gsap.to(character.position, {
            y: character.position.y + 3,
            duration: 0.5,
            ease: "power2.out",
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                userData.isRunning = true; // Resume running
            }
        });
        
        // Wave animation with arms
        gsap.to(userData.rightArm.rotation, {
            z: -Math.PI / 3,
            duration: 0.3,
            ease: "power2.inOut",
            yoyo: true,
            repeat: 3
        });
        
        // Scale up aura during greeting
        gsap.to(userData.aura.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 1,
            ease: "elastic.out(1, 0.3)",
            yoyo: true,
            repeat: 1
        });
    }
    
    resetAnimations() {
        // Reset all objects to their default states
        this.portfolio.skillOrbs?.forEach(orb => {
            if (orb && orb.userData.originalPosition) {
                gsap.to(orb.position, {
                    x: orb.userData.originalPosition.x,
                    y: orb.userData.originalPosition.y,
                    z: orb.userData.originalPosition.z,
                    duration: 1,
                    ease: "power2.inOut"
                });
                
                gsap.to(orb.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
        });
        
        this.portfolio.projectPortals?.forEach(portal => {
            if (portal) {
                gsap.to(portal.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.5,
                    ease: "power2.inOut"
                });
            }
        });
    }
    
    animateOnHover(object, type = 'scale') {
        if (!object) return;
        
        const animationKey = `hover_${object.uuid}`;
        
        // Kill existing animation
        if (this.activeAnimations.has(animationKey)) {
            this.activeAnimations.get(animationKey).kill();
        }
        
        let animation;
        
        switch (type) {
            case 'scale':
                animation = gsap.to(object.scale, {
                    x: 1.1,
                    y: 1.1,
                    z: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                break;
            case 'float':
                animation = gsap.to(object.position, {
                    y: object.position.y + 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                break;
            case 'glow':
                if (object.material) {
                    animation = gsap.to(object.material, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                break;
        }
        
        if (animation) {
            this.activeAnimations.set(animationKey, animation);
        }
    }
    
    animateOnHoverEnd(object, type = 'scale') {
        if (!object) return;
        
        const animationKey = `hover_${object.uuid}`;
        
        // Kill existing animation
        if (this.activeAnimations.has(animationKey)) {
            this.activeAnimations.get(animationKey).kill();
        }
        
        let animation;
        
        switch (type) {
            case 'scale':
                animation = gsap.to(object.scale, {
                    x: 1,
                    y: 1,
                    z: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                break;
            case 'float':
                animation = gsap.to(object.position, {
                    y: object.position.y - 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                break;
            case 'glow':
                if (object.material) {
                    animation = gsap.to(object.material, {
                        opacity: 0.8,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                }
                break;
        }
        
        if (animation) {
            this.activeAnimations.set(animationKey, animation);
        }
    }
    
    createParticleExplosion(position, color = 0x00ff88) {
        // Create temporary particle explosion effect
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 4, 4),
                new THREE.MeshBasicMaterial({ color })
            );
            
            particle.position.copy(position);
            this.portfolio.scene.add(particle);
            particles.push(particle);
            
            // Animate particle outward
            const direction = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            ).normalize();
            
            gsap.to(particle.position, {
                x: position.x + direction.x * 10,
                y: position.y + direction.y * 10,
                z: position.z + direction.z * 10,
                duration: 1,
                ease: "power2.out"
            });
            
            gsap.to(particle.material, {
                opacity: 0,
                duration: 1,
                ease: "power2.out",
                onComplete: () => {
                    this.portfolio.scene.remove(particle);
                    particle.geometry.dispose();
                    particle.material.dispose();
                }
            });
        }
    }
    
    makeCharacterReact(reactionType = 'excited') {
        if (!this.portfolio.character) return;
        
        const character = this.portfolio.character;
        const userData = character.userData;
        
        switch (reactionType) {
            case 'excited':
                // Quick spin and jump
                gsap.to(character.rotation, {
                    y: character.rotation.y + Math.PI * 2,
                    duration: 0.8,
                    ease: "power2.inOut"
                });
                
                gsap.to(character.position, {
                    y: character.position.y + 2,
                    duration: 0.4,
                    ease: "power2.out",
                    yoyo: true,
                    repeat: 1
                });
                break;
                
            case 'curious':
                // Stop and look around
                const wasRunning = userData.isRunning;
                userData.isRunning = false;
                
                gsap.to(userData.head.rotation, {
                    y: Math.PI / 4,
                    duration: 0.5,
                    ease: "power2.inOut",
                    yoyo: true,
                    repeat: 1,
                    onComplete: () => {
                        userData.isRunning = wasRunning;
                    }
                });
                break;
                
            case 'celebrate':
                // Arms up celebration
                gsap.to(userData.leftArm.rotation, {
                    x: -Math.PI / 2,
                    z: Math.PI / 4,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
                
                gsap.to(userData.rightArm.rotation, {
                    x: -Math.PI / 2,
                    z: -Math.PI / 4,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
                
                // Reset arms after celebration
                setTimeout(() => {
                    gsap.to(userData.leftArm.rotation, {
                        x: 0,
                        z: Math.PI / 6,
                        duration: 0.5
                    });
                    gsap.to(userData.rightArm.rotation, {
                        x: 0,
                        z: -Math.PI / 6,
                        duration: 0.5
                    });
                }, 2000);
                break;
        }
    }
    
    dispose() {
        // Clean up animations
        this.activeAnimations.forEach(animation => {
            animation.kill();
        });
        this.activeAnimations.clear();
    }
}
