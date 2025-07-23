import * as THREE from 'three';

export function createPostProcessing(scene, camera, renderer) {
    // Simple post-processing setup
    // In a real project, you'd use EffectComposer and passes
    
    const composer = {
        render: () => {
            renderer.render(scene, camera);
        },
        setSize: (width, height) => {
            // Handled by renderer
        }
    };
    
    return composer;
}
