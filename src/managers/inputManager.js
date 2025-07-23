import * as THREE from 'three';

export class InputManager {
    constructor(camera, spaceship) {
        this.camera = camera;
        this.spaceship = spaceship;
        
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isMouseDown = false;
        this.previousMouse = new THREE.Vector2();
        
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false,
            space: false
        };
        
        this.initEventListeners();
    }
    
    initEventListeners() {
        // Mouse events
        window.addEventListener('mousemove', (event) => {
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            if (this.isMouseDown) {
                const deltaX = event.clientX - this.previousMouse.x;
                const deltaY = event.clientY - this.previousMouse.y;
                
                this.rotateCamera(deltaX, deltaY);
            }
            
            this.previousMouse.set(event.clientX, event.clientY);
        });
        
        window.addEventListener('mousedown', () => {
            this.isMouseDown = true;
        });
        
        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        window.addEventListener('wheel', (event) => {
            this.zoomCamera(event.deltaY);
        });
        
        // Keyboard events
        window.addEventListener('keydown', (event) => {
            this.handleKeyDown(event.key.toLowerCase());
        });
        
        window.addEventListener('keyup', (event) => {
            this.handleKeyUp(event.key.toLowerCase());
        });
        
        // Touch events for mobile
        window.addEventListener('touchstart', this.handleTouchStart.bind(this));
        window.addEventListener('touchmove', this.handleTouchMove.bind(this));
        window.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleKeyDown(key) {
        switch (key) {
            case 'w':
            case 'arrowup':
                this.keys.w = true;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = true;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = true;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = true;
                break;
            case ' ':
                this.keys.space = true;
                break;
        }
    }
    
    handleKeyUp(key) {
        switch (key) {
            case 'w':
            case 'arrowup':
                this.keys.w = false;
                break;
            case 'a':
            case 'arrowleft':
                this.keys.a = false;
                break;
            case 's':
            case 'arrowdown':
                this.keys.s = false;
                break;
            case 'd':
            case 'arrowright':
                this.keys.d = false;
                break;
            case ' ':
                this.keys.space = false;
                break;
        }
    }
    
    handleTouchStart(event) {
        if (event.touches.length === 1) {
            this.isMouseDown = true;
            this.previousMouse.set(event.touches[0].clientX, event.touches[0].clientY);
        }
    }
    
    handleTouchMove(event) {
        if (event.touches.length === 1 && this.isMouseDown) {
            const deltaX = event.touches[0].clientX - this.previousMouse.x;
            const deltaY = event.touches[0].clientY - this.previousMouse.y;
            
            this.rotateCamera(deltaX, deltaY);
            this.previousMouse.set(event.touches[0].clientX, event.touches[0].clientY);
        }
    }
    
    handleTouchEnd() {
        this.isMouseDown = false;
    }
    
    rotateCamera(deltaX, deltaY) {
        const sensitivity = 0.005;
        
        // Horizontal rotation (around Y axis)
        const horizontalAngle = -deltaX * sensitivity;
        this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), horizontalAngle);
        
        // Vertical rotation (limit to prevent flipping)
        const verticalAngle = -deltaY * sensitivity;
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);
        
        const right = new THREE.Vector3();
        right.crossVectors(cameraDirection, new THREE.Vector3(0, 1, 0)).normalize();
        
        this.camera.position.applyAxisAngle(right, verticalAngle);
        
        // Always look at center
        this.camera.lookAt(0, 0, 0);
    }
    
    zoomCamera(delta) {
        const zoomSpeed = 0.1;
        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        
        const distance = this.camera.position.length();
        const newDistance = Math.max(10, Math.min(100, distance + delta * zoomSpeed));
        
        this.camera.position.normalize().multiplyScalar(newDistance);
    }
    
    update(deltaTime) {
        // Handle keyboard movement
        const moveSpeed = 20;
        
        if (this.keys.w) {
            // Move camera closer
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            this.camera.position.add(direction.multiplyScalar(moveSpeed * deltaTime));
        }
        
        if (this.keys.s) {
            // Move camera away
            const direction = new THREE.Vector3();
            this.camera.getWorldDirection(direction);
            this.camera.position.add(direction.multiplyScalar(-moveSpeed * deltaTime));
        }
        
        if (this.keys.a) {
            // Rotate left
            this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), moveSpeed * deltaTime * 0.1);
        }
        
        if (this.keys.d) {
            // Rotate right
            this.camera.position.applyAxisAngle(new THREE.Vector3(0, 1, 0), -moveSpeed * deltaTime * 0.1);
        }
        
        // Always look at center
        this.camera.lookAt(0, 0, 0);
        
        // Update raycaster for interaction detection
        this.raycaster.setFromCamera(this.mouse, this.camera);
    }
    
    getRaycaster() {
        return this.raycaster;
    }
}
