import * as THREE from 'three';

export async function createProjectPortals() {
    // O'Neal Shockley's recent GitHub repositories
    const projectsData = [
        {
            name: 'DreamLayer AI',
            color: 0xff6b6b,
            description: 'Modern Stable Diffusion WebUI with ComfyUI backend',
            technologies: ['React', 'TypeScript', 'Python', 'ComfyUI', 'AI/ML'],
            url: 'https://github.com/oshockley/DreamLayer'
        },
        {
            name: 'LevelUpPortfolio',
            color: 0x00d4ff,
            description: 'Game-themed React portfolio with retro gaming aesthetic',
            technologies: ['React', 'CSS3', 'JavaScript'],
            url: 'https://github.com/oshockley/LevelUpPortfolio'
        },
        {
            name: 'ShockStack',
            color: 0x646cff,
            description: 'Modern React application with Vite and Tailwind CSS',
            technologies: ['React', 'Vite', 'Tailwind CSS', 'JavaScript'],
            url: 'https://github.com/oshockley/ShockStack'
        },
        {
            name: 'NeuroBank',
            color: 0x9c27b0,
            description: 'Banking system with object-oriented design',
            technologies: ['Python', 'OOP', 'Financial'],
            url: 'https://github.com/oshockley/NeuroBank'
        }
    ];
    
    const portals = [];
    
    projectsData.forEach((project, index) => {
        const portal = createProjectPortal(project, index);
        
        // Position portals in a circle
        const angle = (index / projectsData.length) * Math.PI * 2;
        const radius = 40;
        portal.position.set(
            Math.cos(angle) * radius,
            10 + index * 3,
            Math.sin(angle) * radius
        );
        
        // Store project data for interactions
        portal.userData = {
            projectData: project,
            type: 'projectPortal'
        };
        
        portals.push(portal);
    });
    
    return portals;
}

function createProjectPortal(projectData, index) {
    const group = new THREE.Group();
    
    // Portal frame
    const frameGeometry = new THREE.RingGeometry(3, 4, 32);
    const frameMaterial = new THREE.MeshBasicMaterial({
        color: projectData.color,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
    });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    group.add(frame);
    
    // Portal center
    const centerGeometry = new THREE.CircleGeometry(2.8, 32);
    const centerMaterial = new THREE.MeshBasicMaterial({
        color: projectData.color,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    group.add(center);
    
    // Project name label
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Project name
    context.fillStyle = '#ffffff';
    context.font = 'bold 20px Arial';
    context.textAlign = 'center';
    context.fillText(projectData.name, 128, 30);
    
    // Technologies
    context.fillStyle = 'rgba(255, 255, 255, 0.8)';
    context.font = '14px Arial';
    context.fillText(projectData.technologies.slice(0, 2).join(', '), 128, 50);
    
    const labelTexture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        side: THREE.DoubleSide
    });
    
    const labelGeometry = new THREE.PlaneGeometry(6, 1.5);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = -6;
    group.add(label);
    
    // Store project data
    group.userData = {
        projectData: projectData,
        type: 'projectPortal'
    };
    
    return group;
}
