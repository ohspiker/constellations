const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

const dots = [];
const numDots = 120;
const dotRadius = 3;

for (let i = 0; i < numDots; i++) {
    dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,  // Slower movement
        dy: (Math.random() - 0.5) * 0.5  // Slower movement
    });
}

function updateDots() {
    dots.forEach(dot => {
        dot.x += dot.dx;
        dot.y += dot.dy;

        if (dot.x < 0 || dot.x > canvas.width) dot.dx = -dot.dx;
        if (dot.y < 0 || dot.y > canvas.height) dot.dy = -dot.dy;
    });
}

function drawDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2, false);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();
    });
}

function drawMouseDot() {
    ctx.beginPath();
    ctx.arc(mouse.x, mouse.y, dotRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
}

function drawLines() {
    const allDots = [...dots, mouse];
    const maxDistance = 150;

    allDots.forEach(dot => {
        const nearestDots = [];
        allDots.forEach(otherDot => {
            if (dot !== otherDot) {
                const dotDistance = Math.hypot(otherDot.x - dot.x, otherDot.y - dot.y);
                if (dotDistance < maxDistance) {
                    nearestDots.push({ dot: otherDot, distance: dotDistance });
                }
            }
        });

        nearestDots.sort((a, b) => a.distance - b.distance);
        nearestDots.slice(0, 5).forEach(connection => {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(connection.dot.x, connection.dot.y);
            const opacity = 1 - connection.distance / maxDistance;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.stroke();
            ctx.closePath();
        });
    });
}

function animate() {
    updateDots();
    drawDots();
    drawMouseDot();
    drawLines();
    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();
