// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Chat Widget Functionality
let chatOpen = false;
const chatButton = document.querySelector('.chat-button');
const chatWindow = document.querySelector('.chat-window');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');

function toggleChat() {
    chatOpen = !chatOpen;
    if (chatOpen) {
        chatWindow.classList.add('active');
        document.querySelector('.chat-notification').style.display = 'none';
    } else {
        chatWindow.classList.remove('active');
    }
}

function addMessage(message, isBot = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isBot ? 'bot-message' : 'user-message';
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function sendMessage() {
    // Check if smart chatbot is active, if so, don't use old system
    if (window.smartChatbot && window.chatInterface) {
        console.log('Using smart AI chatbot instead of basic responses');
        return; // Let smart chatbot handle it
    }
    
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, false);
        chatInput.value = '';
        
        // Simulate bot response with realistic delay
        setTimeout(() => {
            handleBotResponse(message);
        }, 1000 + Math.random() * 1000);
    }
}

function handleBotResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('pricing')) {
        addMessage("Our packages start at $1,997 setup + $297/month. This includes your smart website, AI chatbot, and automation system. Would you like me to schedule a free demo to show you exactly how it works for your business?");
        setTimeout(() => {
            addMessage("What type of service business do you run? (plumbing, electrical, HVAC, etc.)");
        }, 2000);
    } else if (lowerMessage.includes('demo') || lowerMessage.includes('schedule')) {
        addMessage("Perfect! I can schedule your free demo right now. What's the best phone number to reach you?");
    } else if (lowerMessage.includes('plumb') || lowerMessage.includes('electric') || lowerMessage.includes('hvac') || lowerMessage.includes('handyman')) {
        addMessage(`Great! We work with many ${lowerMessage.includes('plumb') ? 'plumbing' : lowerMessage.includes('electric') ? 'electrical' : lowerMessage.includes('hvac') ? 'HVAC' : 'handyman'} businesses. Our system typically helps service companies get 40% more bookings by responding to leads instantly and following up automatically.`);
        setTimeout(() => {
            addMessage("How many leads do you typically get per week that don't book appointments?");
        }, 2000);
    } else if (lowerMessage.includes('lead') || lowerMessage.includes('customer') || lowerMessage.includes('book')) {
        addMessage("That's exactly what our system solves! Our AI chatbot responds to every inquiry in under 30 seconds, books appointments 24/7, and follows up with leads until they convert. Want to see a quick demo?");
    } else {
        // Default responses for general inquiries
        const responses = [
            "I'd love to help you get more jobs automatically! What's your biggest challenge with lead generation right now?",
            "Our smart website system answers leads instantly and books appointments 24/7. What type of service business do you run?",
            "Great question! Let me connect you with one of our specialists who can give you a personalized demo. What's your phone number?"
        ];
        addMessage(responses[Math.floor(Math.random() * responses.length)]);
    }
}

// Allow Enter key to send messages
if (chatInput) {
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Lead Form Submission
const leadForm = document.getElementById('leadForm');
if (leadForm) {
    leadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(leadForm);
        const data = {
            name: formData.get('name'),
            business: formData.get('business'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            service: formData.get('service'),
            message: formData.get('message')
        };
        
        // Show success message
        showNotification('Thank you! We\'ll contact you within 30 minutes to schedule your free demo.', 'success');
        
        // Reset form
        leadForm.reset();
        
        // Here you would typically send the data to your backend
        console.log('Lead form submitted:', data);
        
        // Simulate booking calendar opening
        setTimeout(() => {
            openBookingWidget();
        }, 2000);
    });
}

// Booking Widget Function
function openBookingWidget() {
    // In a real implementation, this would open your actual booking system (Calendly, Acuity, etc.)
    showNotification('Opening booking calendar...', 'info');
    
    // Simulate opening external booking widget
    setTimeout(() => {
        // Replace with your actual booking URL
        window.open('https://calendly.com/your-booking-page', '_blank');
    }, 1000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Add notification styles dynamically
const notificationStyles = `
    .notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 350px;
        animation: slideIn 0.3s ease;
    }
    
    .notification-info {
        background: #2563eb;
    }
    
    .notification-success {
        background: #10b981;
    }
    
    .notification-warning {
        background: #f59e0b;
    }
    
    .notification-error {
        background: #ef4444;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
        opacity: 0.8;
    }
    
    .notification button:hover {
        opacity: 1;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.problem-card, .solution-card, .testimonial-card, .pricing-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.problem-card, .solution-card, .testimonial-card, .pricing-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Trigger initial check
    animateOnScroll();
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Phone number click tracking
document.querySelectorAll('a[href^="tel:"]').forEach(phoneLink => {
    phoneLink.addEventListener('click', function() {
        // Track phone clicks for analytics
        console.log('Phone number clicked:', this.href);
        // Add your analytics tracking here
    });
});

// Simulate chatbot notification
setTimeout(() => {
    if (!chatOpen) {
        document.querySelector('.chat-notification').style.display = 'flex';
        
        // Show notification after 10 seconds
        setTimeout(() => {
            showNotification('👋 Need help? Our AI assistant is ready to answer questions!', 'info');
        }, 10000);
    }
}, 3000);

// Track scroll depth for analytics
let maxScroll = 0;
window.addEventListener('scroll', function() {
    const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        // Track significant scroll milestones
        if (maxScroll >= 25 && !window.scrollTracked25) {
            console.log('User scrolled 25%');
            window.scrollTracked25 = true;
        }
        if (maxScroll >= 50 && !window.scrollTracked50) {
            console.log('User scrolled 50%');
            window.scrollTracked50 = true;
        }
        if (maxScroll >= 75 && !window.scrollTracked75) {
            console.log('User scrolled 75%');
            window.scrollTracked75 = true;
        }
    }
});

// Exit intent detection
document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0 && !sessionStorage.getItem('exitIntentShown')) {
        // Show exit intent popup/notification
        showNotification('Wait! Get your free demo before you go - limited spots available!', 'warning');
        sessionStorage.setItem('exitIntentShown', 'true');
    }
});

// Dynamic pricing based on service type
function updatePricingForService(serviceType) {
    // This could adjust pricing display based on the selected service type
    // For now, just log the selection
    console.log('Service type selected:', serviceType);
}

// Add service type change listener to forms
document.querySelectorAll('select[name="service"]').forEach(select => {
    select.addEventListener('change', function() {
        updatePricingForService(this.value);
    });
});

// Hero Slideshow Management
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.slide');
    if (!slides.length) return;
    
    let currentSlide = 0;
    
    function showNextSlide() {
        // Hide current slide
        slides[currentSlide].classList.remove('active');
        
        // Move to next slide
        currentSlide = (currentSlide + 1) % slides.length;
        
        // Show next slide
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 6 seconds
    setInterval(showNextSlide, 6000);
}

// Hero Chat Animation Management
function initHeroAnimation() {
    const chatDemo = document.querySelector('.chat-demo');
    if (!chatDemo) return;
    
    // Restart animation every 15 seconds (to sync better with slideshow)
    setInterval(() => {
        // Reset all animations
        const messages = document.querySelectorAll('.chat-message');
        const typingIndicator = document.querySelector('.typing-indicator');
        
        messages.forEach(msg => {
            msg.style.animation = 'none';
            msg.style.opacity = '0';
            msg.style.transform = 'translateY(20px)';
        });
        
        if (typingIndicator) {
            typingIndicator.style.animation = 'none';
            typingIndicator.style.opacity = '0';
        }
        
        // Restart animations after a brief delay
        setTimeout(() => {
            messages.forEach((msg, index) => {
                msg.style.animation = `messageSlideIn 0.8s ease-out forwards`;
                msg.style.animationDelay = `${(index + 1) * 2}s`;
            });
            
            if (typingIndicator) {
                typingIndicator.style.animation = 'typingSlideIn 0.8s ease-out 7s forwards';
            }
        }, 100);
    }, 15000); // Restart every 15 seconds
}

// Initialize hero animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Existing DOMContentLoaded code...
    const elements = document.querySelectorAll('.problem-card, .solution-card, .testimonial-card, .pricing-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
    
    // Trigger initial check
    animateOnScroll();
    
    // Initialize hero slideshow and animation
    initHeroSlideshow();
    initHeroAnimation();
});

// Add click handler to hero demo to show engagement
document.addEventListener('click', function(e) {
    if (e.target.closest('.chat-demo')) {
        // Add a pulse effect when clicked
        const chatDemo = e.target.closest('.chat-demo');
        chatDemo.style.transform = 'scale(1.05)';
        chatDemo.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            chatDemo.style.transform = 'scale(1)';
        }, 200);
        
        // Show notification about the demo
        showNotification('Like what you see? Book a free demo to see it in action for your business!', 'info');
    }
});