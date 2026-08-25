// 1. Core Web Audio Variable Setup
let audioCtx = null;
let ripples = [];

function initContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// 2. Instrument Deck Tab Navigator
function switchInstrument(type) {
    document.querySelectorAll('.inst-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.instrument-deck').forEach(deck => deck.classList.remove('active-deck'));

    event.currentTarget.classList.add('active');
    document.getElementById(`${type}-deck`).classList.add('active-deck');
}

// 3. Audio Synthesis Matrix Engine
function playTone(frequency, type = 'triangle', duration = 1.2, volume = 0.3) {
    initContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Warm Natural Exponential Volume Fade-out
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + duration);
    
    triggerCanvasWave();
}

// Custom Percussion Wave Synthesis Modellers (No External Files Required)
function playDrumHit(kitType) {
    initContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (kitType === 'kick') {
        osc.frequency.setValueAtTime(120, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start(); osc.stop(audioCtx.currentTime + 0.3);
    } 
    else if (kitType === 'snare') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        osc.start(); osc.stop(audioCtx.currentTime + 0.2);
    } 
    else if (kitType === 'hihat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(8000, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
        osc.start(); osc.stop(audioCtx.currentTime + 0.08);
    } 
    else if (kitType === 'clap') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
        osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    }
    triggerCanvasWave();
}

// 4. Input Trigger Router Mapping System
document.querySelectorAll('.piano-key').forEach(key => {
    key.addEventListener('mousedown', () => playTone(parseFloat(key.dataset.note), 'sine', 1.5, 0.4));
});

document.querySelectorAll('.guitar-string-row').forEach(str => {
    str.addEventListener('mousedown', () => playTone(parseFloat(str.dataset.note), 'triangle', 1.8, 0.3));
});

document.querySelectorAll('.drum-pad').forEach(pad => {
    pad.addEventListener('mousedown', () => playDrumHit(pad.dataset.drum));
});

// 5. Hardware Keyboard Binding Maps Engine
window.addEventListener('keydown', (e) => {
    const pressedKeyChar = e.key.toUpperCase();
    
    // Scan Piano Targets
    const targetPianoKey = document.querySelector(`.piano-key[data-key="${pressedKeyChar}"]`);
    if (targetPianoKey) {
        playTone(parseFloat(targetPianoKey.dataset.note), 'sine', 1.5, 0.4);
        animateVisualFeedback(targetPianoKey);
    }

    // Scan Guitar Targets
    const targetGuitarStr = document.querySelector(`.guitar-string-row[data-key="${pressedKeyChar}"]`);
    if (targetGuitarStr) {
        playTone(parseFloat(targetGuitarStr.dataset.note), 'triangle', 1.8, 0.3);
        animateVisualFeedback(targetGuitarStr);
    }

    // Scan Drum Targets
    const targetDrumPad = document.querySelector(`.drum-pad[data-key="${pressedKeyChar}"]`);
    if (targetDrumPad) {
        playDrumHit(targetDrumPad.dataset.drum);
        animateVisualFeedback(targetDrumPad);
    }
});

function animateVisualFeedback(element) {
    element.classList.add('playing');
    setTimeout(() => element.classList.remove('playing'), 120);
}

// 6. High Performance Fluid Background Ripple Visualizer
const canvas = document.getElementById('studioCanvas');
const ctx = canvas.getContext('2d');

function syncCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', syncCanvasSize);
syncCanvasSize();

function triggerCanvasWave() {
    ripples.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1,
        alpha: 0.3
    });
}

function renderVisualizer() {
    ctx.fillStyle = 'rgba(244, 239, 230, 0.18)'; // Leaves clean visual audio trail echo
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < ripples.length; i++) {
        let rp = ripples[i];
        ctx.beginPath();
        ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(11, 30, 54, ${rp.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        rp.r += 4;
        rp.alpha -= 0.006;

        if (rp.alpha <= 0) {
            ripples.splice(i, 1);
            i--;
        }
    }
    requestAnimationFrame(renderVisualizer);
}
renderVisualizer();
