// Scene sequence with precise timing for fast-paced cuts
const sceneSequence = [
    { scene: 1, duration: 1200 },  // Running through forest
    { scene: 2, duration: 600 },   // Close-up face
    { scene: 3, duration: 800 },   // Danger behind
    { scene: 1, duration: 400 },   // Quick cut back to running
    { scene: 4, duration: 500 },   // Speed blur
    { scene: 5, duration: 700 },   // Extreme close-up eyes
    { scene: 3, duration: 500 },   // Danger (quick)
    { scene: 6, duration: 900 },   // Stumble
    { scene: 7, duration: 800 },   // Hand reaching
    { scene: 4, duration: 400 },   // Speed blur (quick)
    { scene: 8, duration: 1000 },  // Shadow closing in
    { scene: 5, duration: 300 },   // Eyes (flash)
    { scene: 9, duration: 1200 },  // Chaos
    { scene: 3, duration: 400 },   // Danger (flash)
    { scene: 9, duration: 600 },   // Chaos continues
    { scene: 10, duration: 5000 }  // Title card (longer)
];

let currentSceneIndex = 0;
let isPlaying = false;

// Flash effect element
const flashEffect = document.querySelector('.flash-effect');

// Function to trigger flash effect
function triggerFlash() {
    flashEffect.classList.add('flash');
    setTimeout(() => {
        flashEffect.classList.remove('flash');
    }, 100);
}

// Function to change scene
function changeScene(sceneNumber) {
    const scenes = document.querySelectorAll('.scene');

    scenes.forEach(scene => {
        scene.classList.remove('active');
    });

    const targetScene = document.querySelector(`.scene[data-scene="${sceneNumber}"]`);
    if (targetScene) {
        targetScene.classList.add('active');
    }

    // Trigger flash on specific scene transitions
    if ([3, 5, 8].includes(sceneNumber)) {
        triggerFlash();
    }
}

// Function to play the sequence
function playSequence() {
    if (isPlaying) return;
    isPlaying = true;

    function nextScene() {
        if (currentSceneIndex >= sceneSequence.length) {
            // Loop back to start after a pause
            setTimeout(() => {
                currentSceneIndex = 0;
                isPlaying = false;
                playSequence();
            }, 2000);
            return;
        }

        const currentItem = sceneSequence[currentSceneIndex];
        changeScene(currentItem.scene);

        currentSceneIndex++;

        setTimeout(nextScene, currentItem.duration);
    }

    nextScene();
}

// Camera shake effect for intense scenes
function addCameraShake() {
    const container = document.querySelector('.scene-container');
    let shakeInterval;

    document.addEventListener('scenechange', (e) => {
        clearInterval(shakeInterval);

        if ([9].includes(e.detail.scene)) {
            let shakeCount = 0;
            shakeInterval = setInterval(() => {
                if (shakeCount >= 20) {
                    clearInterval(shakeInterval);
                    container.style.transform = 'translate(0, 0)';
                    return;
                }
                const x = (Math.random() - 0.5) * 6;
                const y = (Math.random() - 0.5) * 6;
                container.style.transform = `translate(${x}px, ${y}px)`;
                shakeCount++;
            }, 50);
        } else {
            container.style.transform = 'translate(0, 0)';
        }
    });
}

// Enhanced scene change with events
function changeSceneWithEvent(sceneNumber) {
    changeScene(sceneNumber);

    const event = new CustomEvent('scenechange', {
        detail: { scene: sceneNumber }
    });
    document.dispatchEvent(event);
}

// Update playSequence to use event-based scene changes
function playSequenceEnhanced() {
    if (isPlaying) return;
    isPlaying = true;

    function nextScene() {
        if (currentSceneIndex >= sceneSequence.length) {
            setTimeout(() => {
                currentSceneIndex = 0;
                isPlaying = false;
                playSequenceEnhanced();
            }, 2000);
            return;
        }

        const currentItem = sceneSequence[currentSceneIndex];
        changeSceneWithEvent(currentItem.scene);

        currentSceneIndex++;

        setTimeout(nextScene, currentItem.duration);
    }

    nextScene();
}

// Sound effects simulation (heartbeat rhythm)
function createAudioContext() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let heartbeatInterval;

    function playHeartbeat(tempo = 500) {
        clearInterval(heartbeatInterval);

        heartbeatInterval = setInterval(() => {
            // First beat
            const oscillator1 = audioContext.createOscillator();
            const gainNode1 = audioContext.createGain();

            oscillator1.connect(gainNode1);
            gainNode1.connect(audioContext.destination);

            oscillator1.frequency.value = 60;
            gainNode1.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator1.start(audioContext.currentTime);
            oscillator1.stop(audioContext.currentTime + 0.1);

            // Second beat (slightly delayed)
            setTimeout(() => {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();

                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);

                oscillator2.frequency.value = 55;
                gainNode2.gain.setValueAtTime(0.08, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.1);
            }, 150);
        }, tempo);
    }

    // Adjust heartbeat based on scene intensity
    document.addEventListener('scenechange', (e) => {
        const intensityMap = {
            1: 600,
            2: 500,
            3: 400,
            4: 350,
            5: 300,
            6: 450,
            7: 400,
            8: 350,
            9: 250,
            10: 800
        };

        playHeartbeat(intensityMap[e.detail.scene] || 500);
    });

    return { playHeartbeat };
}

// Dramatic lighting pulses
function addLightingEffects() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes dramatic-pulse {
            0%, 100% { filter: brightness(1) contrast(1.2); }
            50% { filter: brightness(0.7) contrast(1.5); }
        }

        .scene-content {
            animation: dramatic-pulse 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
}

// Initialize on click to respect browser autoplay policies
let initialized = false;

function initialize() {
    if (initialized) return;
    initialized = true;

    addCameraShake();
    addLightingEffects();

    try {
        const audio = createAudioContext();
        audio.playHeartbeat(600);
    } catch (e) {
        console.log('Audio context not available');
    }

    playSequenceEnhanced();
}

// Auto-start after a brief delay
window.addEventListener('load', () => {
    setTimeout(() => {
        initialize();
    }, 500);
});

// Also allow click/tap to start if autoplay is blocked
document.addEventListener('click', initialize, { once: true });
document.addEventListener('touchstart', initialize, { once: true });

// Keyboard controls for testing
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        e.preventDefault();
        initialize();
    }
});
