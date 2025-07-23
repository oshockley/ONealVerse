# 3D Developer Portfolio

An interactive 3D video game-style portfolio built with Three.js that showcases software development skills through an immersive gaming experience.

## Features

🎮 **Game-Like Experience**
- Interactive 3D environment with floating islands
- Spaceship navigation and exploration
- Particle effects and dynamic lighting

🚀 **Technical Showcase**
- Skill orbs representing different technologies
- Project portals with swirling shader effects
- Real-time 3D graphics and animations

🎵 **Audio Experience**
- Synthetic sound effects for interactions
- Ambient space soundtrack
- Mute/unmute toggle

📱 **Responsive Design**
- Works on desktop and mobile devices
- Touch controls for mobile navigation
- Adaptive UI layout

## Technologies Used

- **Three.js** - 3D graphics and WebGL
- **GSAP** - Advanced animations
- **Vite** - Build tool and development server
- **Vanilla JavaScript** - Core functionality
- **CSS3** - Styling and effects

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   cd osportfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - The portfolio will load with a futuristic loading screen

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Usage

### Navigation
- **Mouse**: Click and drag to rotate camera around the scene
- **Mouse Wheel**: Zoom in/out
- **Keyboard**: WASD keys for movement
- **UI Menu**: Click navigation items to explore different sections

### Sections
1. **Home** - Welcome and introduction
2. **About** - Personal information and statistics
3. **Skills** - Interactive skill orbs showing technologies
4. **Projects** - Project portals with detailed information
5. **Contact** - Contact form and social links

### Interactive Elements
- **Skill Orbs** - Hover to see technology names
- **Project Portals** - Click to view project details
- **Spaceship** - Central focal point with animations
- **Particles** - Dynamic background effects

## Customization

### Personal Information
Edit the content in `index.html` to add your own:
- Name and title
- About section
- Skills and technologies
- Project information
- Contact details

### Projects
Modify the projects data in `src/objects/projectPortals.js`:
```javascript
const projectsData = [
    {
        name: 'Your Project Name',
        color: 0xff4444,
        description: 'Project description',
        technologies: ['Tech1', 'Tech2', 'Tech3']
    }
    // Add more projects...
];
```

### Skills
Update skills in `src/objects/skillOrbs.js`:
```javascript
const skillData = [
    { name: 'Technology', color: 0xf7df1e, icon: 'T' }
    // Add more skills...
];
```

### Styling
- Colors and themes in `src/style.css`
- 3D object materials in respective object files
- Animations in `src/managers/animationManager.js`

## Browser Support

- **Chrome** (recommended) - Full support
- **Firefox** - Full support
- **Safari** - Full support
- **Edge** - Full support
- **Mobile browsers** - Touch controls supported

## Performance Tips

- The portfolio is optimized for modern devices
- Reduce particle count in `src/effects/particles.js` for lower-end devices
- Disable post-processing for better performance
- Use `?debug` in URL for debugging tools

## Development

### Project Structure
```
osportfolio/
├── src/
│   ├── scene/          # Three.js scene setup
│   ├── objects/        # 3D objects and models
│   ├── effects/        # Visual effects
│   ├── managers/       # Game logic managers
│   ├── main.js         # Entry point
│   └── style.css       # Styles
├── index.html          # Main HTML file
├── package.json        # Dependencies
└── vite.config.js      # Build configuration
```

### Adding New Features
1. Create new objects in `src/objects/`
2. Add managers for complex logic in `src/managers/`
3. Include effects in `src/effects/`
4. Update main.js to integrate new features

## Troubleshooting

### Common Issues
- **Black screen**: Check browser console for WebGL support
- **Poor performance**: Reduce particle count or disable effects
- **Audio not working**: Click anywhere to start audio context
- **Mobile controls**: Ensure touch events are properly registered

### Debug Mode
Add `?debug` to the URL to enable:
- Performance stats
- GUI controls for camera and lighting
- Console debugging information

## License

This project is open source and available under the MIT License.

## Credits

- Three.js community for excellent documentation
- GSAP for powerful animation library
- Various online tutorials and resources

---

**Made with ❤️ for showcasing developer skills in an interactive way**
