export class AudioManager {
    constructor() {
        this.context = null;
        this.sounds = {};
        this.isMuted = false;
        this.volume = 0.3;
        
        // Space audio tracking
        this.planetaryOscillators = [];
        this.cosmicDrones = [];
        this.stellarTones = [];
        this.ambientLoop = null;
        this.isAmbientPlaying = false;
        
        // Audio analysis
        this.analyser = null;
        this.dataArray = null;
        
        this.initAudio();
    }
    
    async initAudio() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser for reactive audio
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = 256;
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            
            await this.loadSounds();
            this.initSpaceAmbience();
        } catch (error) {
            console.log('Audio not supported:', error);
        }
    }
    
    async loadSounds() {
        // Create refined space-themed synthetic sounds
        this.sounds = {
            navigation: this.createSpaceNavigationSound(),
            hover: this.createStarHoverSound(),
            click: this.createWarpClickSound(),
            planetaryMovement: this.createPlanetaryMovementSound(),
            spaceshipFlyby: this.createSpaceshipFlybySound(),
            cosmicHum: this.createCosmicHumSound(),
            wormhole: this.createWormholeSound(),
            nebulaDrift: this.createNebulaDriftSound(),
            engineHum: this.createEngineHumSound(),
            doppler: this.createDopplerSound(),
            r2d2Happy: this.createR2D2HappySound(),
            r2d2Worried: this.createR2D2WorriedSound(),
            r2d2Beep: this.createR2D2BeepSound(),
            astromechChirp: this.createAstromechChirpSound()
        };
    }

    createSpaceNavigationSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Create harmonic navigation sound
            oscillator1.frequency.setValueAtTime(440, this.context.currentTime);
            oscillator2.frequency.setValueAtTime(660, this.context.currentTime);
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.context.currentTime);
            filter.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.3);
            
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            oscillator1.stop(this.context.currentTime + 0.3);
            oscillator2.stop(this.context.currentTime + 0.3);
        };
    }

    createStarHoverSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Twinkling star sound
            oscillator.frequency.setValueAtTime(800 + Math.random() * 400, this.context.currentTime);
            oscillator.type = 'sine';
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, this.context.currentTime);
            filter.Q.setValueAtTime(10, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.08, this.context.currentTime + 0.02);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.15);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.15);
        };
    }

    createWarpClickSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Warp drive engagement sound
            oscillator.frequency.setValueAtTime(200, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1500, this.context.currentTime + 0.1);
            oscillator.type = 'sawtooth';
            
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(100, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.context.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.15);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.15);
        };
    }

    createPlanetaryMovementSound() {
        return (frequency = 55, duration = 2) => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            const delay = this.context.createDelay();
            const feedback = this.context.createGain();
            
            // Connect audio graph
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(gainNode);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Planetary orbital frequencies
            oscillator1.frequency.setValueAtTime(frequency, this.context.currentTime);
            oscillator2.frequency.setValueAtTime(frequency * 1.5, this.context.currentTime);
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            // Add orbital modulation
            const lfo = this.context.createOscillator();
            const lfoGain = this.context.createGain();
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator1.frequency);
            lfo.frequency.setValueAtTime(0.1, this.context.currentTime);
            lfoGain.gain.setValueAtTime(frequency * 0.1, this.context.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, this.context.currentTime);
            
            delay.delayTime.setValueAtTime(0.3, this.context.currentTime);
            feedback.gain.setValueAtTime(0.3, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.context.currentTime + 0.5);
            gainNode.gain.setValueAtTime(this.volume * 0.1, this.context.currentTime + duration - 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            lfo.start(this.context.currentTime);
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            lfo.stop(this.context.currentTime + duration);
            oscillator1.stop(this.context.currentTime + duration);
            oscillator2.stop(this.context.currentTime + duration);
            
            return { oscillator1, oscillator2, lfo, gainNode };
        };
    }
    
    createSpaceshipFlybySound() {
        return (distance = 1, velocity = 1) => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            const panner = this.context.createStereoPanner();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(panner);
            panner.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Engine harmonics
            const baseFreq = 120;
            oscillator1.frequency.setValueAtTime(baseFreq, this.context.currentTime);
            oscillator2.frequency.setValueAtTime(baseFreq * 1.5, this.context.currentTime);
            oscillator1.type = 'triangle';
            oscillator2.type = 'sawtooth';
            
            // Doppler effect simulation
            const duration = 3;
            oscillator1.frequency.exponentialRampToValueAtTime(baseFreq * 0.7, this.context.currentTime + duration);
            oscillator2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5 * 0.7, this.context.currentTime + duration);
            
            // Spatial movement
            panner.pan.setValueAtTime(-1, this.context.currentTime);
            panner.pan.linearRampToValueAtTime(1, this.context.currentTime + duration);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.context.currentTime);
            filter.frequency.linearRampToValueAtTime(400, this.context.currentTime + duration);
            
            // Volume envelope
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.context.currentTime + 0.3);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.context.currentTime + duration * 0.4);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            oscillator1.stop(this.context.currentTime + duration);
            oscillator2.stop(this.context.currentTime + duration);
            
            return { oscillator1, oscillator2, gainNode };
        };
    }

    createEngineHumSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Subtle engine hum
            oscillator1.frequency.setValueAtTime(60, this.context.currentTime);
            oscillator2.frequency.setValueAtTime(90, this.context.currentTime);
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            // Add subtle modulation
            const lfo = this.context.createOscillator();
            const lfoGain = this.context.createGain();
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator1.frequency);
            lfo.frequency.setValueAtTime(0.3, this.context.currentTime);
            lfoGain.gain.setValueAtTime(5, this.context.currentTime);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(300, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.03, this.context.currentTime);
            
            lfo.start(this.context.currentTime);
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            
            return { oscillator1, oscillator2, lfo, gainNode };
        };
    }

    createDopplerSound() {
        return (startFreq = 440, endFreq = 330, duration = 2) => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            oscillator.frequency.setValueAtTime(startFreq, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(endFreq, this.context.currentTime + duration);
            oscillator.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.context.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + duration);
        };
    }

    createR2D2HappySound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Happy R2-D2 rising whistle
            oscillator1.frequency.setValueAtTime(400, this.context.currentTime);
            oscillator1.frequency.exponentialRampToValueAtTime(800, this.context.currentTime + 0.3);
            oscillator1.frequency.exponentialRampToValueAtTime(1200, this.context.currentTime + 0.6);
            
            oscillator2.frequency.setValueAtTime(600, this.context.currentTime + 0.1);
            oscillator2.frequency.exponentialRampToValueAtTime(900, this.context.currentTime + 0.4);
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1000, this.context.currentTime);
            filter.Q.setValueAtTime(5, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.15, this.context.currentTime + 0.05);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.context.currentTime + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.8);
            
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime + 0.1);
            oscillator1.stop(this.context.currentTime + 0.8);
            oscillator2.stop(this.context.currentTime + 0.7);
        };
    }

    createR2D2WorriedSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Worried R2-D2 descending warble
            oscillator.frequency.setValueAtTime(600, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(300, this.context.currentTime + 0.2);
            oscillator.frequency.exponentialRampToValueAtTime(500, this.context.currentTime + 0.4);
            oscillator.frequency.exponentialRampToValueAtTime(250, this.context.currentTime + 0.6);
            
            oscillator.type = 'sine';
            
            // Add vibrato
            const lfo = this.context.createOscillator();
            const lfoGain = this.context.createGain();
            lfo.connect(lfoGain);
            lfoGain.connect(oscillator.frequency);
            lfo.frequency.setValueAtTime(8, this.context.currentTime);
            lfoGain.gain.setValueAtTime(30, this.context.currentTime);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(800, this.context.currentTime);
            filter.Q.setValueAtTime(3, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.12, this.context.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.7);
            
            lfo.start(this.context.currentTime);
            oscillator.start(this.context.currentTime);
            lfo.stop(this.context.currentTime + 0.7);
            oscillator.stop(this.context.currentTime + 0.7);
        };
    }

    createR2D2BeepSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Classic R2-D2 beep
            const beepFreq = 800 + Math.random() * 400;
            oscillator.frequency.setValueAtTime(beepFreq, this.context.currentTime);
            oscillator.type = 'square';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.context.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 0.1);
        };
    }

    createAstromechChirpSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Astromech chirp sequence
            const frequencies = [600, 800, 1000, 750];
            let currentTime = this.context.currentTime;
            
            frequencies.forEach((freq, index) => {
                const startTime = currentTime + (index * 0.08);
                oscillator1.frequency.setValueAtTime(freq, startTime);
                oscillator2.frequency.setValueAtTime(freq * 1.2, startTime);
                
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(this.volume * 0.08, startTime + 0.01);
                gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);
            });
            
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(1200, this.context.currentTime);
            filter.Q.setValueAtTime(8, this.context.currentTime);
            
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            oscillator1.stop(this.context.currentTime + 0.4);
            oscillator2.stop(this.context.currentTime + 0.4);
        };
    }

    createCosmicHumSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Subtle cosmic harmonics
            oscillator1.frequency.setValueAtTime(55, this.context.currentTime); // Low A
            oscillator2.frequency.setValueAtTime(82.5, this.context.currentTime); // Perfect fifth
            
            oscillator1.type = 'sine';
            oscillator2.type = 'sine';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(200, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.04, this.context.currentTime);
            
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            
            return { oscillator1, oscillator2, gainNode };
        };
    }

    createWormholeSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            const delay = this.context.createDelay();
            const feedback = this.context.createGain();
            
            oscillator.connect(filter);
            filter.connect(delay);
            delay.connect(feedback);
            feedback.connect(delay);
            delay.connect(gainNode);
            filter.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Wormhole distortion effect
            oscillator.frequency.setValueAtTime(100, this.context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.context.currentTime + 2);
            oscillator.type = 'sawtooth';
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.context.currentTime);
            filter.frequency.exponentialRampToValueAtTime(200, this.context.currentTime + 2);
            
            delay.delayTime.setValueAtTime(0.1, this.context.currentTime);
            delay.delayTime.linearRampToValueAtTime(0.5, this.context.currentTime + 2);
            feedback.gain.setValueAtTime(0.6, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(0, this.context.currentTime);
            gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.context.currentTime + 0.5);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 2);
            
            oscillator.start(this.context.currentTime);
            oscillator.stop(this.context.currentTime + 2);
        };
    }

    createNebulaDriftSound() {
        return () => {
            if (!this.context || this.isMuted) return;
            
            const oscillator1 = this.context.createOscillator();
            const oscillator2 = this.context.createOscillator();
            const gainNode = this.context.createGain();
            const filter = this.context.createBiquadFilter();
            const reverb = this.createReverb();
            
            oscillator1.connect(filter);
            oscillator2.connect(filter);
            filter.connect(reverb);
            reverb.connect(gainNode);
            gainNode.connect(this.context.destination);
            
            // Nebula drift harmonics
            oscillator1.frequency.setValueAtTime(220, this.context.currentTime);
            oscillator2.frequency.setValueAtTime(330, this.context.currentTime);
            oscillator1.type = 'sine';
            oscillator2.type = 'triangle';
            
            // Add slow modulation
            const lfo = this.context.createOscillator();
            const lfoGain = this.context.createGain();
            lfo.connect(lfoGain);
            lfoGain.connect(filter.frequency);
            lfo.frequency.setValueAtTime(0.05, this.context.currentTime);
            lfoGain.gain.setValueAtTime(100, this.context.currentTime);
            
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(500, this.context.currentTime);
            filter.Q.setValueAtTime(2, this.context.currentTime);
            
            gainNode.gain.setValueAtTime(this.volume * 0.06, this.context.currentTime);
            
            lfo.start(this.context.currentTime);
            oscillator1.start(this.context.currentTime);
            oscillator2.start(this.context.currentTime);
            
            return { oscillator1, oscillator2, lfo, gainNode };
        };
    }

    createReverb() {
        const convolver = this.context.createConvolver();
        const length = this.context.sampleRate * 3;
        const impulse = this.context.createBuffer(2, length, this.context.sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const channelData = impulse.getChannelData(channel);
            for (let i = 0; i < length; i++) {
                channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
            }
        }
        
        convolver.buffer = impulse;
        return convolver;
    }

    initSpaceAmbience() {
        if (!this.context || this.isMuted) return;
        
        // Create subtle cosmic background
        this.cosmicDrones = this.sounds.cosmicHum();
        this.nebulaDrift = this.sounds.nebulaDrift();
        this.engineHum = this.sounds.engineHum();
        
        this.isAmbientPlaying = true;
    }

    // Spaceship sound sync methods
    playSpaceshipFlyby(distance = 1, velocity = 1) {
        if (this.sounds.spaceshipFlyby) {
            return this.sounds.spaceshipFlyby(distance, velocity);
        }
    }

    playDopplerEffect(startFreq = 440, endFreq = 330, duration = 2) {
        if (this.sounds.doppler) {
            this.sounds.doppler(startFreq, endFreq, duration);
        }
    }

    // Planetary movement sync methods
    syncPlanetaryMovement(planetData) {
        if (!this.context || this.isMuted || !planetData) return;
        
        const { position, velocity, mass } = planetData;
        
        // Calculate frequency based on orbital characteristics
        const baseFreq = 55; // Base frequency for largest orbit
        const frequency = baseFreq * (1 + (mass || 1) * 0.1);
        const duration = Math.max(2, Math.min(10, (velocity || 1) * 5));
        
        // Play planetary movement sound
        const planetSound = this.sounds.planetaryMovement(frequency, duration);
        
        return planetSound;
    }

    syncStarMovement(starCount, intensity) {
        if (!this.context || this.isMuted) return;
        
        // Play twinkling sounds based on star intensity
        if (Math.random() < intensity * 0.1) {
            this.sounds.hover();
        }
    }

    playNavigationSound() {
        if (this.sounds.navigation) {
            this.sounds.navigation();
        }
    }

    playHoverSound() {
        if (this.sounds.hover) {
            this.sounds.hover();
        }
    }

    playClickSound() {
        if (this.sounds.click) {
            this.sounds.click();
        }
    }

    playWormholeSound() {
        if (this.sounds.wormhole) {
            this.sounds.wormhole();
        }
    }
    
    // R2-D2 inspired sounds
    playR2D2Happy() {
        if (this.sounds.r2d2Happy) {
            this.sounds.r2d2Happy();
        }
    }
    
    playR2D2Worried() {
        if (this.sounds.r2d2Worried) {
            this.sounds.r2d2Worried();
        }
    }
    
    playR2D2Beep() {
        if (this.sounds.r2d2Beep) {
            this.sounds.r2d2Beep();
        }
    }
    
    playAstromechChirp() {
        if (this.sounds.astromechChirp) {
            this.sounds.astromechChirp();
        }
    }
    
    playAmbient() {
        if (!this.isAmbientPlaying && !this.isMuted) {
            this.initSpaceAmbience();
        }
    }
    
    stopAmbient() {
        if (this.cosmicDrones) {
            try {
                this.cosmicDrones.oscillator1?.stop?.();
                this.cosmicDrones.oscillator2?.stop?.();
            } catch (e) {}
        }
        
        if (this.engineHum) {
            try {
                this.engineHum.oscillator1?.stop?.();
                this.engineHum.oscillator2?.stop?.();
                this.engineHum.lfo?.stop?.();
            } catch (e) {}
        }
        
        if (this.nebulaDrift) {
            try {
                this.nebulaDrift.oscillator1?.stop?.();
                this.nebulaDrift.oscillator2?.stop?.();
                this.nebulaDrift.lfo?.stop?.();
            } catch (e) {}
        }
        
        this.isAmbientPlaying = false;
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopAmbient();
        } else {
            this.playAmbient();
        }
        
        return this.isMuted;
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Update existing ambient sounds volume
        if (this.cosmicDrones?.gainNode) {
            this.cosmicDrones.gainNode.gain.setValueAtTime(
                this.volume * 0.04, 
                this.context.currentTime
            );
        }
        
        if (this.engineHum?.gainNode) {
            this.engineHum.gainNode.gain.setValueAtTime(
                this.volume * 0.03, 
                this.context.currentTime
            );
        }
        
        if (this.nebulaDrift?.gainNode) {
            this.nebulaDrift.gainNode.gain.setValueAtTime(
                this.volume * 0.06, 
                this.context.currentTime
            );
        }
    }
    
    // Audio analysis for reactive effects
    getAudioData() {
        if (this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray);
            return this.dataArray;
        }
        return null;
    }
    
    // Start audio context (required for modern browsers)
    async startAudioContext() {
        if (this.context && this.context.state === 'suspended') {
            await this.context.resume();
        }
    }
    
    // Clean up audio resources
    destroy() {
        this.stopAmbient();
        
        if (this.context) {
            this.context.close();
        }
    }
}
