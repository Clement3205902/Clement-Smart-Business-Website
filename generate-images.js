// Generate visual images for hero slideshow using Canvas
function generateSlideImages() {
    const slides = [
        {
            id: 'service-professional',
            title: 'Service Professional',
            colors: ['#2563eb', '#3b82f6', '#60a5fa'],
            elements: 'professional'
        },
        {
            id: 'happy-customer',
            title: 'Happy Customer',
            colors: ['#10b981', '#059669', '#34d399'],
            elements: 'customer'
        },
        {
            id: 'modern-office',
            title: 'Modern Office',
            colors: ['#6366f1', '#7c3aed', '#8b5cf6'],
            elements: 'office'
        },
        {
            id: 'automation-dashboard',
            title: 'Dashboard',
            colors: ['#ef4444', '#dc2626', '#f87171'],
            elements: 'dashboard'
        },
        {
            id: 'phone-booking',
            title: 'Mobile Booking',
            colors: ['#a855f7', '#9333ea', '#c084fc'],
            elements: 'mobile'
        }
    ];

    slides.forEach((slide, index) => {
        createSlideImage(slide, index);
    });
}

function createSlideImage(slide, index) {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, slide.colors[0] + '88');
    gradient.addColorStop(0.5, slide.colors[1] + '66');
    gradient.addColorStop(1, slide.colors[2] + '88');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add visual elements based on theme
    switch(slide.elements) {
        case 'professional':
            drawProfessionalElements(ctx, slide.colors);
            break;
        case 'customer':
            drawCustomerElements(ctx, slide.colors);
            break;
        case 'office':
            drawOfficeElements(ctx, slide.colors);
            break;
        case 'dashboard':
            drawDashboardElements(ctx, slide.colors);
            break;
        case 'mobile':
            drawMobileElements(ctx, slide.colors);
            break;
    }

    // Convert canvas to data URL and apply to slide
    const imageUrl = canvas.toDataURL('image/png');
    const slideElement = document.querySelector(`[data-bg="${slide.id}"]`);
    if (slideElement) {
        slideElement.style.backgroundImage = `url(${imageUrl})`;
        slideElement.style.backgroundSize = 'cover';
        slideElement.style.backgroundPosition = 'center';
    }
}

function drawProfessionalElements(ctx, colors) {
    // Draw geometric shapes representing professionalism
    ctx.save();
    
    // Large circle
    ctx.beginPath();
    ctx.arc(200, 300, 120, 0, Math.PI * 2);
    ctx.fillStyle = colors[0] + '33';
    ctx.fill();
    
    // Rectangle
    ctx.fillStyle = colors[1] + '44';
    ctx.fillRect(800, 150, 300, 200);
    
    // Triangle
    ctx.beginPath();
    ctx.moveTo(600, 500);
    ctx.lineTo(750, 300);
    ctx.lineTo(900, 500);
    ctx.closePath();
    ctx.fillStyle = colors[2] + '33';
    ctx.fill();
    
    // Tech grid pattern
    ctx.strokeStyle = colors[0] + '22';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    ctx.restore();
}

function drawCustomerElements(ctx, colors) {
    ctx.save();
    
    // Happy face representation (abstract)
    ctx.beginPath();
    ctx.arc(300, 300, 80, 0, Math.PI * 2);
    ctx.fillStyle = colors[0] + '55';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(280, 280, 10, 0, Math.PI * 2);
    ctx.fillStyle = colors[1];
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(320, 280, 10, 0, Math.PI * 2);
    ctx.fillStyle = colors[1];
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(300, 320, 30, 0, Math.PI);
    ctx.strokeStyle = colors[1];
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Star ratings
    for (let i = 0; i < 5; i++) {
        drawStar(ctx, 800 + i * 60, 200, 20, colors[0]);
    }
    
    // Success indicators
    ctx.fillStyle = colors[1] + '44';
    ctx.fillRect(100, 600, 200, 100);
    ctx.fillRect(400, 550, 150, 150);
    ctx.fillRect(700, 580, 180, 120);
    
    ctx.restore();
}

function drawOfficeElements(ctx, colors) {
    ctx.save();
    
    // Computer monitors
    ctx.fillStyle = colors[0] + '66';
    ctx.fillRect(100, 200, 250, 150);
    ctx.fillStyle = colors[1] + '88';
    ctx.fillRect(110, 210, 230, 130);
    
    ctx.fillStyle = colors[0] + '66';
    ctx.fillRect(400, 180, 200, 120);
    ctx.fillStyle = colors[1] + '88';
    ctx.fillRect(410, 190, 180, 100);
    
    ctx.fillStyle = colors[0] + '66';
    ctx.fillRect(650, 220, 220, 140);
    ctx.fillStyle = colors[1] + '88';
    ctx.fillRect(660, 230, 200, 120);
    
    // Office furniture silhouettes
    ctx.fillStyle = colors[2] + '33';
    ctx.fillRect(50, 500, 300, 100);
    ctx.fillRect(500, 480, 200, 120);
    ctx.fillRect(800, 520, 250, 80);
    
    // Modern patterns
    for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(900 + Math.sin(i) * 30, 100 + i * 40, 15, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % 3] + '44';
        ctx.fill();
    }
    
    ctx.restore();
}

function drawDashboardElements(ctx, colors) {
    ctx.save();
    
    // Dashboard panels
    const panels = [
        {x: 50, y: 50, w: 300, h: 180},
        {x: 400, y: 50, w: 300, h: 180},
        {x: 750, y: 50, w: 300, h: 180},
        {x: 50, y: 280, w: 500, h: 200},
        {x: 600, y: 280, w: 450, h: 200}
    ];
    
    panels.forEach((panel, i) => {
        ctx.fillStyle = colors[0] + '44';
        ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
        
        // Inner content
        ctx.fillStyle = colors[1] + '66';
        ctx.fillRect(panel.x + 10, panel.y + 10, panel.w - 20, panel.h - 20);
        
        // Chart/graph representation
        if (i < 3) {
            // Bar chart
            for (let j = 0; j < 5; j++) {
                const height = Math.random() * 80 + 20;
                ctx.fillStyle = colors[2];
                ctx.fillRect(panel.x + 30 + j * 40, panel.y + panel.h - 30 - height, 30, height);
            }
        } else {
            // Line chart
            ctx.strokeStyle = colors[2];
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(panel.x + 20, panel.y + panel.h - 40);
            for (let j = 1; j < 10; j++) {
                const x = panel.x + 20 + j * (panel.w - 40) / 9;
                const y = panel.y + 40 + Math.random() * (panel.h - 80);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
    });
    
    // Metrics indicators
    for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.arc(100 + i * 150, 600, 25, 0, Math.PI * 2);
        ctx.fillStyle = colors[i % 3];
        ctx.fill();
        
        // Numbers inside
        ctx.fillStyle = '#ffffff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((i + 1) * 15 + '%', 100 + i * 150, 605);
    }
    
    ctx.restore();
}

function drawMobileElements(ctx, colors) {
    ctx.save();
    
    // Phone outline
    ctx.fillStyle = colors[0] + '88';
    ctx.fillRect(400, 100, 400, 600);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(420, 120, 360, 560);
    
    // Screen content - booking interface
    ctx.fillStyle = colors[1] + '33';
    ctx.fillRect(440, 140, 320, 60);
    
    ctx.fillStyle = colors[2] + '55';
    ctx.fillRect(440, 220, 320, 40);
    ctx.fillRect(440, 280, 320, 40);
    ctx.fillRect(440, 340, 320, 40);
    
    // Calendar representation
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
            const x = 450 + col * 40;
            const y = 400 + row * 35;
            ctx.fillStyle = row === 2 && col === 3 ? colors[0] : colors[2] + '33';
            ctx.fillRect(x, y, 35, 30);
        }
    }
    
    // Floating app icons around phone
    const iconPositions = [
        {x: 200, y: 200}, {x: 900, y: 250}, {x: 150, y: 400},
        {x: 950, y: 450}, {x: 180, y: 600}, {x: 880, y: 580}
    ];
    
    iconPositions.forEach((pos, i) => {
        ctx.beginPath();
        ctx.roundRect(pos.x, pos.y, 60, 60, 15);
        ctx.fillStyle = colors[i % 3] + '77';
        ctx.fill();
        
        // App icon symbol
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(pos.x + 15, pos.y + 15, 30, 30);
    });
    
    ctx.restore();
}

function drawStar(ctx, x, y, size, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.moveTo(0, -size);
    for (let i = 0; i < 5; i++) {
        ctx.rotate(Math.PI / 5);
        ctx.lineTo(0, -size * 0.5);
        ctx.rotate(Math.PI / 5);
        ctx.lineTo(0, -size);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
}

// Add roundRect method if not supported
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius) {
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + width - radius, y);
        this.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.lineTo(x + width, y + height - radius);
        this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.lineTo(x + radius, y + height);
        this.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
    };
}

// Initialize images when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for slide elements to be available
    setTimeout(generateSlideImages, 1000);
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateSlideImages };
}