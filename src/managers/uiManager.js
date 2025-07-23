export class UIManager {
    constructor(portfolio) {
        this.portfolio = portfolio;
        this.currentSection = 'home';
        
        this.initUI();
    }
    
    initUI() {
        this.initNavigation();
        this.initControls();
        this.initInteractionHints();
    }
    
    initNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const contentPanels = document.querySelectorAll('.content-panel');
        
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                this.navigateToSection(section);
                
                // Play R2-D2 happy navigation sound
                this.portfolio.audioManager?.playR2D2Happy();
            });
            
            item.addEventListener('mouseenter', () => {
                this.portfolio.audioManager?.playR2D2Beep();
            });
        });
        
        // CTA Buttons
        const ctaButtons = document.querySelectorAll('.cta-btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleCTAAction(action);
                
                this.portfolio.audioManager?.playAstromechChirp();
            });
        });
        
        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectIndex = card.dataset.project;
                this.showProjectDetails(projectIndex);
            });
        });
    }
    
    initControls() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        audioToggle?.addEventListener('click', () => {
            const isMuted = this.portfolio.audioManager?.toggleMute();
            const icon = audioToggle.querySelector('.audio-icon');
            if (icon) {
                icon.textContent = isMuted ? '🔇' : '🔊';
            }
            
            // Play R2-D2 reaction based on mute state
            if (!isMuted) {
                setTimeout(() => {
                    this.portfolio.audioManager?.playR2D2Happy();
                }, 100);
            } else {
                this.portfolio.audioManager?.playR2D2Worried();
            }
        });
        
        // Start audio context on first user interaction
        const startAudio = async () => {
            if (this.portfolio.audioManager) {
                await this.portfolio.audioManager.startAudioContext();
                this.portfolio.audioManager.playR2D2Happy(); // Welcome R2-D2 sound
            }
        };
        
        // Add click listener to start audio
        document.addEventListener('click', startAudio, { once: true });
        document.addEventListener('keydown', startAudio, { once: true });
        
        // Fullscreen toggle
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        fullscreenToggle?.addEventListener('click', () => {
            this.toggleFullscreen();
        });
        
        // Spaceship trigger
        const spaceshipTrigger = document.getElementById('spaceship-trigger');
        spaceshipTrigger?.addEventListener('click', () => {
            this.triggerSpaceshipFlyby();
            // Play excited R2-D2 sound for manual spaceship trigger
            this.portfolio.audioManager?.playR2D2Happy();
        });
        
        // Form submission
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            const submitBtn = contactForm.querySelector('.cta-btn');
            submitBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleContactForm();
            });
        }
    }
    
    initInteractionHints() {
        // Hide hint after user interaction
        let hasInteracted = false;
        
        const hideHint = () => {
            if (!hasInteracted) {
                const hint = document.getElementById('interaction-hint');
                if (hint) {
                    hint.style.opacity = '0';
                    setTimeout(() => {
                        hint.style.display = 'none';
                    }, 1000);
                }
                hasInteracted = true;
            }
        };
        
        // Hide on any mouse or keyboard interaction
        document.addEventListener('mousemove', hideHint, { once: true });
        document.addEventListener('keydown', hideHint, { once: true });
        document.addEventListener('click', hideHint, { once: true });
        
        // Auto-hide after 10 seconds
        setTimeout(hideHint, 10000);
    }
    
    navigateToSection(section) {
        if (this.currentSection === section) return;
        
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.section === section);
        });
        
        // Update content panels
        document.querySelectorAll('.content-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${section}-panel`);
        });
        
        // Update portfolio camera
        this.portfolio.navigateToSection(section);
        
        // Make character react to navigation
        if (section === 'skills') {
            this.portfolio.animationManager?.makeCharacterReact('excited');
        } else if (section === 'projects') {
            this.portfolio.animationManager?.makeCharacterReact('curious');
        }
        
        this.currentSection = section;
    }
    
    handleCTAAction(action) {
        switch (action) {
            case 'explore':
                this.navigateToSection('skills');
                break;
            case 'resume':
                this.downloadResume();
                break;
            default:
                console.log(`Unhandled CTA action: ${action}`);
        }
    }
    
    downloadResume() {
        // Create a simple text resume
        const resumeContent = `
SOFTWARE DEVELOPER & GAME CREATOR
==================================

CONTACT INFORMATION
-------------------
Email: your.email@example.com
LinkedIn: linkedin.com/in/yourprofile
GitHub: github.com/yourusername

TECHNICAL SKILLS
---------------
Frontend: JavaScript, TypeScript, React, Vue.js, Three.js, WebGL
Backend: Node.js, Python, MongoDB, PostgreSQL, Express, FastAPI
Game Development: Unity, Unreal Engine, C#, C++, Blender, Godot

FEATURED PROJECTS
----------------
1. 3D Racing Game
   - WebGL-based racing game with physics simulation
   - Technologies: Three.js, WebGL, JavaScript

2. Social Media Platform
   - Full-stack application with real-time features
   - Technologies: React, Node.js, Socket.io

3. AI-Powered Chatbot
   - Machine learning chatbot with NLP capabilities
   - Technologies: Python, TensorFlow, FastAPI

EXPERIENCE
----------
3+ Years in Software Development
25+ Projects Completed
10+ Technologies Mastered
        `;
        
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'developer-resume.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showNotification('Resume downloaded!');
    }
    
    showProjectDetails(projectIndex) {
        const projects = [
            {
                name: '3D Racing Game',
                description: 'An immersive WebGL-based racing game featuring realistic physics simulation, multiple tracks, and competitive gameplay mechanics.',
                technologies: ['Three.js', 'WebGL', 'JavaScript', 'Cannon.js'],
                features: ['Real-time physics', 'Multiple vehicles', 'Track editor', 'Multiplayer support']
            },
            {
                name: 'Social Media Platform',
                description: 'A comprehensive social networking application with real-time messaging, content sharing, and community features.',
                technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
                features: ['Real-time chat', 'Content feeds', 'User profiles', 'Video calls']
            },
            {
                name: 'AI-Powered Chatbot',
                description: 'An intelligent conversational AI system capable of natural language processing and contextual responses.',
                technologies: ['Python', 'TensorFlow', 'FastAPI', 'NLTK'],
                features: ['NLP processing', 'Context awareness', 'Multi-language', 'Learning capability']
            }
        ];
        
        const project = projects[projectIndex];
        if (!project) return;
        
        // Create modal or detailed view
        this.showModal(`
            <div class="project-modal">
                <h2>${project.name}</h2>
                <p>${project.description}</p>
                <div class="project-features">
                    <h3>Key Features</h3>
                    <ul>
                        ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-tech">
                    <h3>Technologies Used</h3>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
            </div>
        `);
    }
    
    handleContactForm() {
        const nameInput = document.querySelector('.form-input[placeholder="Your Name"]');
        const emailInput = document.querySelector('.form-input[placeholder="Your Email"]');
        const messageInput = document.querySelector('.form-textarea');
        
        const name = nameInput?.value || '';
        const email = emailInput?.value || '';
        const message = messageInput?.value || '';
        
        if (!name || !email || !message) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate form submission
        this.showNotification('Message sent successfully!', 'success');
        
        // Make character celebrate
        this.portfolio.animationManager?.makeCharacterReact('celebrate');
        
        // Clear form
        if (nameInput) nameInput.value = '';
        if (emailInput) emailInput.value = '';
        if (messageInput) messageInput.value = '';
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: ${type === 'error' ? '#ff4444' : type === 'success' ? '#00ff88' : '#ffffff'};
            padding: 1rem 2rem;
            border-radius: 0.5rem;
            border: 1px solid ${type === 'error' ? '#ff4444' : type === 'success' ? '#00ff88' : '#ffffff'};
            z-index: 10000;
            backdrop-filter: blur(10px);
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideUp 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    showModal(content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: rgba(0, 0, 0, 0.9);
            border: 1px solid #00ff88;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            position: relative;
        `;
        
        modalContent.innerHTML = content + `
            <button class="modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: #00ff88;
                font-size: 1.5rem;
                cursor: pointer;
            ">&times;</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close modal events
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        modalContent.querySelector('.modal-close')?.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close on escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }
    
    triggerSpaceshipFlyby() {
        // Manually trigger a spaceship flyby
        if (this.portfolio.advancedSpaceship) {
            const spaceship = this.portfolio.advancedSpaceship;
            const userData = spaceship.userData;
            
            // Force start a flyby if not already active
            if (!userData.isActive) {
                // Random entry point and direction
                const entryPoints = [
                    { pos: { x: -50, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 }, dir: { x: 1, y: 0, z: 0 } },
                    { pos: { x: 50, y: Math.random() * 20 - 10, z: Math.random() * 20 - 10 }, dir: { x: -1, y: 0, z: 0 } },
                    { pos: { x: Math.random() * 20 - 10, y: -30, z: Math.random() * 20 - 10 }, dir: { x: 0, y: 1, z: 0 } },
                    { pos: { x: Math.random() * 20 - 10, y: 30, z: Math.random() * 20 - 10 }, dir: { x: 0, y: -1, z: 0 } }
                ];
                
                const entry = entryPoints[Math.floor(Math.random() * entryPoints.length)];
                
                userData.position = { ...entry.pos };
                userData.direction = { ...entry.dir };
                userData.speed = 0.2 + Math.random() * 0.1;
                userData.isActive = true;
                
                spaceship.position.copy(userData.position);
                
                // Play flyby sound
                if (this.portfolio.audioManager) {
                    this.portfolio.audioManager.playSpaceshipFlyby(1, userData.speed);
                }
                
                // Play warp sound for manual trigger
                setTimeout(() => {
                    this.portfolio.audioManager?.playWormholeSound();
                }, 500);
            }
        }
    }
}
