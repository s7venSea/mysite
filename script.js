const config = {
    spacing: 30,
    baseRadius: 1,
    maxRadius: 3,
    glowDistance: 150
};

let width, height;
let mouse = { x: -1000, y: -1000 };
let colorBase = '';
let colorGlow = '';
let dotsEnabled = localStorage.getItem('dotsEnabled') !== 'false'; // Default to true
let animationFrameId;

const themeToggleBtn = document.getElementById('theme-toggle');
const dotToggleBtn = document.getElementById('dot-toggle');

const canvas = document.createElement('canvas');
canvas.id = 'dot-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function updateCanvasColors() {
    const rootStyles = getComputedStyle(document.documentElement);
    colorBase = rootStyles.getPropertyValue('--text-muted').trim() || '#636e72';
    colorGlow = rootStyles.getPropertyValue('--text-main').trim() || '#2d3436';
}

function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

function drawDots() {
    if (!dotsEnabled) return; 

    ctx.clearRect(0, 0, width, height);
    
    for (let x = 0; x < width; x += config.spacing) {
        for (let y = 0; y < height; y += config.spacing) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            let radius = config.baseRadius;
            let opacity = 0.2;
            let color = colorBase;

            if (distance < config.glowDistance) {
                const falloff = 1 - (distance / config.glowDistance); 
                radius = config.baseRadius + ((config.maxRadius - config.baseRadius) * falloff);
                opacity = 0.2 + (0.02 * falloff);
                color = colorGlow;
            }

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.globalAlpha = opacity;
            ctx.fill();
        }
    }
    animationFrameId = requestAnimationFrame(drawDots);
}
window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', resizeCanvas);
themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');

    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeToggleBtn.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    }
    setTimeout(updateCanvasColors, 10); 
});


dotToggleBtn.addEventListener('click', () => {
    dotsEnabled = !dotsEnabled;
    
    if (dotsEnabled) {
        canvas.style.display = 'block';
        dotToggleBtn.textContent = 'Disable Effect';
        localStorage.setItem('dotsEnabled', 'true');
        drawDots(); 
    } else {
        canvas.style.display = 'none';
        dotToggleBtn.textContent = 'Enable Effect';
        localStorage.setItem('dotsEnabled', 'false');
        cancelAnimationFrame(animationFrameId);
    }
});


function init() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggleBtn.textContent = 'Dark Mode';
    }
    if (!dotsEnabled) {
        canvas.style.display = 'none';
        dotToggleBtn.textContent = 'Enable Effect';
    } else {
        dotToggleBtn.textContent = 'Disable Effect';
    }
    updateCanvasColors();
    resizeCanvas();
    if (dotsEnabled) {
        drawDots();
    }
}
init();