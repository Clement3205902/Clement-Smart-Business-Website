// Advanced visual image generator for hero slideshow
function generateAdvancedSlideImages() {
    const slides = [
        {
            id: 'service-professional',
            theme: 'Professional service technician with tools and technology',
            primaryColor: '#2563eb',
            secondaryColor: '#3b82f6',
            accentColor: '#60a5fa'
        },
        {
            id: 'happy-customer',
            theme: 'Satisfied customer with positive experience indicators',
            primaryColor: '#10b981',
            secondaryColor: '#059669',
            accentColor: '#34d399'
        },
        {
            id: 'modern-office',
            theme: 'Modern office space with technology and automation',
            primaryColor: '#6366f1',
            secondaryColor: '#7c3aed',
            accentColor: '#8b5cf6'
        },
        {
            id: 'automation-dashboard',
            theme: 'Analytics dashboard with charts and metrics',
            primaryColor: '#ef4444',
            secondaryColor: '#dc2626',
            accentColor: '#f87171'
        },
        {
            id: 'phone-booking',
            theme: 'Mobile phone with booking app interface',
            primaryColor: '#a855f7',
            secondaryColor: '#9333ea',
            accentColor: '#c084fc'
        }
    ];

    slides.forEach(slide => {
        createAdvancedSlideImage(slide);
    });
}

function createAdvancedSlideImage(slide) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    // Create base gradient
    const baseGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    baseGradient.addColorStop(0, slide.primaryColor + '40');
    baseGradient.addColorStop(0.5, slide.secondaryColor + '30');
    baseGradient.addColorStop(1, slide.accentColor + '40');
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add overlay pattern
    drawOverlayPattern(ctx, slide.primaryColor);

    // Draw theme-specific content
    switch(slide.id) {
        case 'service-professional':
            drawServiceProfessional(ctx, slide);
            break;
        case 'happy-customer':
            drawHappyCustomer(ctx, slide);
            break;
        case 'modern-office':
            drawModernOffice(ctx, slide);
            break;
        case 'automation-dashboard':
            drawAutomationDashboard(ctx, slide);
            break;
        case 'phone-booking':
            drawPhoneBooking(ctx, slide);
            break;
    }

    // Apply image to slide
    const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
    const slideElement = document.querySelector(`[data-bg="${slide.id}"]`);
    if (slideElement) {
        slideElement.style.backgroundImage = `url(${imageUrl})`;
        slideElement.style.backgroundSize = 'cover';
        slideElement.style.backgroundPosition = 'center';
    }
}

function drawOverlayPattern(ctx, color) {
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    // Subtle grid pattern
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    ctx.restore();
}

function drawServiceProfessional(ctx, slide) {
    ctx.save();
    
    // Draw professional figure silhouette
    drawPersonSilhouette(ctx, 150, 200, slide.primaryColor + '80');
    
    // Tool belt and tools
    ctx.fillStyle = slide.secondaryColor + '90';
    ctx.fillRect(120, 420, 60, 20);
    
    // Tools
    ctx.fillStyle = slide.primaryColor;
    ctx.fillRect(140, 400, 4, 25);  // Screwdriver
    ctx.fillRect(155, 405, 4, 20);  // Smaller tool
    ctx.fillRect(170, 398, 4, 27);  // Wrench
    
    // Technology elements
    drawTablet(ctx, 300, 150, slide.accentColor);
    drawWifiSignal(ctx, 450, 100, slide.primaryColor);
    
    // Service vehicle silhouette
    ctx.fillStyle = slide.primaryColor + '60';
    ctx.fillRect(600, 300, 200, 80);
    ctx.fillRect(620, 280, 40, 30);  // Cab
    ctx.fillRect(720, 280, 60, 30);  // Back section
    
    // Circles for wheels
    ctx.beginPath();
    ctx.arc(640, 380, 25, 0, Math.PI * 2);
    ctx.arc(760, 380, 25, 0, Math.PI * 2);
    ctx.fillStyle = slide.secondaryColor + '80';
    ctx.fill();
    
    // Professional certification badges
    for (let i = 0; i < 3; i++) {
        drawBadge(ctx, 900 + i * 80, 500, slide.accentColor);
    }
    
    ctx.restore();
}

function drawHappyCustomer(ctx, slide) {
    ctx.save();
    
    // Happy customer silhouette
    drawPersonSilhouette(ctx, 100, 200, slide.primaryColor + '80');
    
    // Thumbs up gesture
    ctx.fillStyle = slide.primaryColor;
    ctx.fillRect(180, 280, 15, 30);  // Thumb
    ctx.fillRect(175, 275, 25, 15);  // Hand
    
    // House silhouette (representing home service)
    drawHouse(ctx, 400, 250, slide.secondaryColor);
    
    // 5-star rating
    for (let i = 0; i < 5; i++) {
        drawStar(ctx, 700 + i * 50, 150, 20, slide.accentColor);
    }
    
    // Speech bubble with positive indicators
    ctx.fillStyle = slide.accentColor + '80';
    ctx.beginPath();
    ctx.roundRect(200, 180, 120, 60, 15);
    ctx.fill();
    
    // Exclamation marks (representing satisfaction)
    ctx.fillStyle = slide.primaryColor;
    ctx.font = 'bold 24px Arial';
    ctx.fillText('!', 240, 210);
    ctx.fillText('!', 260, 215);
    ctx.fillText('!', 280, 210);
    
    // Money saved indicator
    ctx.fillStyle = slide.secondaryColor + '70';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('$', 800, 400);
    ctx.fillText('$', 850, 420);
    ctx.fillText('$', 900, 400);
    
    ctx.restore();
}

function drawModernOffice(ctx, slide) {
    ctx.save();
    
    // Office desks
    drawDesk(ctx, 50, 400, 250, 100, slide.primaryColor);
    drawDesk(ctx, 350, 350, 200, 120, slide.secondaryColor);
    drawDesk(ctx, 700, 420, 280, 90, slide.accentColor);
    
    // Computer monitors
    drawMonitor(ctx, 80, 320, slide.primaryColor);
    drawMonitor(ctx, 380, 270, slide.secondaryColor);
    drawMonitor(ctx, 730, 340, slide.accentColor);
    
    // Office building silhouette in background
    ctx.fillStyle = slide.primaryColor + '20';
    ctx.fillRect(50, 50, 80, 200);
    ctx.fillRect(150, 80, 70, 170);
    ctx.fillRect(240, 60, 85, 190);
    ctx.fillRect(350, 40, 75, 210);
    
    // Windows in building
    ctx.fillStyle = slide.accentColor + '40';
    for (let floor = 0; floor < 8; floor++) {
        for (let window = 0; window < 15; window++) {
            const x = 60 + window * 25;
            const y = 70 + floor * 20;
            ctx.fillRect(x, y, 15, 12);
        }
    }
    
    // Modern furniture elements
    drawModernChair(ctx, 150, 450, slide.secondaryColor);
    drawModernChair(ctx, 450, 400, slide.primaryColor);
    drawModernChair(ctx, 800, 470, slide.accentColor);
    
    ctx.restore();
}

function drawAutomationDashboard(ctx, slide) {
    ctx.save();
    
    // Large dashboard screen
    ctx.fillStyle = slide.primaryColor + '90';
    ctx.fillRect(100, 100, 1000, 600);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(120, 120, 960, 560);
    
    // Dashboard panels
    const panels = [
        {x: 140, y: 140, w: 280, h: 160, type: 'chart'},
        {x: 440, y: 140, w: 280, h: 160, type: 'metrics'},
        {x: 740, y: 140, w: 320, h: 160, type: 'graph'},
        {x: 140, y: 320, w: 460, h: 180, type: 'table'},
        {x: 620, y: 320, w: 440, h: 180, type: 'analytics'}
    ];
    
    panels.forEach(panel => {
        drawDashboardPanel(ctx, panel, slide);
    });
    
    // Status indicators
    for (let i = 0; i < 6; i++) {
        const x = 150 + i * 150;
        const y = 550;
        
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = i < 4 ? slide.secondaryColor : slide.accentColor;
        ctx.fill();
        
        // Status numbers
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText((95 + i * 2) + '%', x, y + 5);
    }
    
    // Floating data points
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 1200;
        const y = Math.random() * 800;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = slide.primaryColor + '60';
        ctx.fill();
    }
    
    ctx.restore();
}

function drawPhoneBooking(ctx, slide) {
    ctx.save();
    
    // Large phone in center
    drawSmartphone(ctx, 400, 100, 400, 600, slide.primaryColor);
    
    // Booking interface on phone screen
    drawBookingInterface(ctx, 430, 150, 340, 500, slide);
    
    // Smaller phones floating around
    drawSmartphone(ctx, 100, 200, 120, 200, slide.secondaryColor + '80');
    drawSmartphone(ctx, 900, 300, 120, 200, slide.accentColor + '80');
    
    // Calendar elements floating
    drawCalendar(ctx, 200, 50, slide.accentColor);
    drawCalendar(ctx, 850, 150, slide.secondaryColor);
    
    // Clock showing 24/7 availability
    drawClock(ctx, 150, 500, slide.primaryColor);
    drawClock(ctx, 950, 450, slide.secondaryColor);
    
    // Notification bubbles
    drawNotification(ctx, 300, 100, 'New Booking!', slide.accentColor);
    drawNotification(ctx, 850, 350, 'Confirmed', slide.secondaryColor);
    
    ctx.restore();
}

// Helper functions for drawing complex shapes

function drawPersonSilhouette(ctx, x, y, color) {
    ctx.fillStyle = color;
    // Head
    ctx.beginPath();
    ctx.arc(x + 30, y, 25, 0, Math.PI * 2);
    ctx.fill();
    // Body
    ctx.fillRect(x + 10, y + 25, 40, 80);
    // Arms
    ctx.fillRect(x - 10, y + 35, 20, 50);
    ctx.fillRect(x + 50, y + 35, 20, 50);
    // Legs
    ctx.fillRect(x + 15, y + 105, 15, 60);
    ctx.fillRect(x + 35, y + 105, 15, 60);
}

function drawTablet(ctx, x, y, color) {
    ctx.fillStyle = color + '90';
    ctx.fillRect(x, y, 100, 70);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 5, 90, 60);
    // Screen content lines
    ctx.fillStyle = color + '60';
    for (let i = 0; i < 6; i++) {
        ctx.fillRect(x + 10, y + 10 + i * 8, 80, 3);
    }
}

function drawWifiSignal(ctx, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(x, y, i * 10, -Math.PI/4, -3*Math.PI/4, true);
        ctx.stroke();
    }
}

function drawBadge(ctx, x, y, color) {
    ctx.fillStyle = color + '80';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('✓', x, y + 5);
}

function drawHouse(ctx, x, y, color) {
    ctx.fillStyle = color + '70';
    // House base
    ctx.fillRect(x, y + 50, 120, 80);
    // Roof
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 50);
    ctx.lineTo(x + 60, y);
    ctx.lineTo(x + 130, y + 50);
    ctx.closePath();
    ctx.fill();
    // Door
    ctx.fillStyle = color;
    ctx.fillRect(x + 45, y + 80, 30, 50);
    // Windows
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 15, y + 70, 20, 20);
    ctx.fillRect(x + 85, y + 70, 20, 20);
}

function drawStar(ctx, x, y, size, color) {
    ctx.fillStyle = color;
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
    ctx.fill();
    ctx.restore();
}

function drawDesk(ctx, x, y, w, h, color) {
    ctx.fillStyle = color + '60';
    ctx.fillRect(x, y, w, h);
    // Desk legs
    ctx.fillStyle = color + '80';
    ctx.fillRect(x + 10, y + h, 15, 50);
    ctx.fillRect(x + w - 25, y + h, 15, 50);
}

function drawMonitor(ctx, x, y, color) {
    ctx.fillStyle = color + '90';
    ctx.fillRect(x, y, 80, 50);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 5, 70, 40);
    // Stand
    ctx.fillStyle = color + '80';
    ctx.fillRect(x + 35, y + 50, 10, 15);
    ctx.fillRect(x + 25, y + 65, 30, 5);
}

function drawModernChair(ctx, x, y, color) {
    ctx.fillStyle = color + '70';
    // Seat
    ctx.fillRect(x, y, 40, 30);
    // Backrest
    ctx.fillRect(x + 35, y - 30, 10, 60);
    // Legs
    ctx.fillRect(x + 5, y + 30, 5, 25);
    ctx.fillRect(x + 30, y + 30, 5, 25);
}

function drawDashboardPanel(ctx, panel, slide) {
    ctx.fillStyle = slide.primaryColor + '20';
    ctx.fillRect(panel.x, panel.y, panel.w, panel.h);
    
    switch(panel.type) {
        case 'chart':
            // Bar chart
            for (let i = 0; i < 6; i++) {
                const barHeight = Math.random() * 80 + 20;
                ctx.fillStyle = slide.accentColor;
                ctx.fillRect(panel.x + 20 + i * 35, panel.y + panel.h - 20 - barHeight, 25, barHeight);
            }
            break;
        case 'metrics':
            // Large number
            ctx.fillStyle = slide.primaryColor;
            ctx.font = 'bold 36px Arial';
            ctx.fillText('247', panel.x + 50, panel.y + 80);
            ctx.font = '16px Arial';
            ctx.fillText('Active Leads', panel.x + 50, panel.y + 110);
            break;
        case 'graph':
            // Line graph
            ctx.strokeStyle = slide.secondaryColor;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(panel.x + 20, panel.y + panel.h - 30);
            for (let i = 1; i < 10; i++) {
                const x = panel.x + 20 + i * (panel.w - 40) / 9;
                const y = panel.y + 30 + Math.random() * (panel.h - 60);
                ctx.lineTo(x, y);
            }
            ctx.stroke();
            break;
    }
}

function drawSmartphone(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 10, y + 20, w - 20, h - 40);
}

function drawBookingInterface(ctx, x, y, w, h, slide) {
    // Header
    ctx.fillStyle = slide.primaryColor + '90';
    ctx.fillRect(x, y, w, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('Book Service', x + 20, y + 30);
    
    // Form fields
    ctx.fillStyle = slide.accentColor + '40';
    ctx.fillRect(x + 20, y + 70, w - 40, 30);
    ctx.fillRect(x + 20, y + 120, w - 40, 30);
    ctx.fillRect(x + 20, y + 170, w - 40, 30);
    
    // Calendar
    ctx.fillStyle = slide.secondaryColor + '60';
    const calY = y + 220;
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
            const cellX = x + 30 + col * 40;
            const cellY = calY + row * 35;
            ctx.fillStyle = (row === 2 && col === 3) ? slide.primaryColor : slide.secondaryColor + '30';
            ctx.fillRect(cellX, cellY, 35, 30);
        }
    }
    
    // Book button
    ctx.fillStyle = slide.primaryColor;
    ctx.fillRect(x + 50, y + h - 80, w - 100, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOOK NOW', x + w/2, y + h - 55);
    ctx.textAlign = 'left';
}

function drawCalendar(ctx, x, y, color) {
    ctx.fillStyle = color + '80';
    ctx.fillRect(x, y, 60, 70);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 5, y + 15, 50, 50);
    // Calendar grid
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            ctx.fillStyle = color + '40';
            ctx.fillRect(x + 8 + i * 7, y + 20 + j * 8, 6, 7);
        }
    }
}

function drawClock(ctx, x, y, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.stroke();
    // Clock hands
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 20);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 15, y);
    ctx.stroke();
}

function drawNotification(ctx, x, y, text, color) {
    ctx.fillStyle = color + '90';
    ctx.fillRect(x, y, 120, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(text, x + 10, y + 25);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(generateAdvancedSlideImages, 500);
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { generateAdvancedSlideImages };
}