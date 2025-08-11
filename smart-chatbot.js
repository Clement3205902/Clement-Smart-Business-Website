// Smart AI-Powered Chatbot System
// SECURITY NOTE: API key should be stored in environment variables, not in client-side code
// This implementation shows the structure - you'll need a backend server for production

class SmartChatbot {
    constructor(config) {
        this.apiKey = config.apiKey; // Should come from secure backend
        this.businessInfo = config.businessInfo;
        this.leadData = {};
        this.conversationHistory = [];
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    }

    // Initialize chatbot with business context
    initializeContext() {
        const systemPrompt = `You are an AI assistant for SmartGrowth, a company that builds automated websites for home service businesses (plumbers, electricians, HVAC, etc.). 

Your role:
- Help potential clients understand our services
- Qualify leads by asking about their business
- Schedule demos and collect contact information  
- Provide pricing information when asked
- Be professional, helpful, and concise

Our services:
- Starter Package: $1,997 setup + $297/month (basic automation)
- Pro Package: $2,997 setup + $497/month (advanced features)
- 7-day delivery guarantee
- 24/7 AI chatbot, online booking, email/SMS automation
- Designed specifically for home service businesses

Key benefits:
- 40% more bookings on average
- 24/7 lead response
- Automated follow-up sequences
- Customer retention systems

Always try to:
1. Identify their business type and current challenges
2. Explain how our automation helps their specific situation
3. Offer a free demo
4. Collect contact information
5. Create urgency (limited spots available)

Keep responses under 50 words unless providing detailed information.`;

        this.conversationHistory = [{
            role: 'system',
            content: systemPrompt
        }];
    }

    // Send message to OpenAI API
    async sendMessage(userMessage) {
        try {
            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage
            });

            // Call OpenAI API (Note: This should be done through your backend for security)
            const response = await this.callOpenAI();
            
            if (response) {
                // Add AI response to history
                this.conversationHistory.push({
                    role: 'assistant',
                    content: response
                });

                // Process the response for special actions
                await this.processAIResponse(response, userMessage);
                
                return response;
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            return this.getFallbackResponse(userMessage);
        }
    }

    // Call OpenAI API (SECURITY: This should be in your backend)
    async callOpenAI() {
        // WARNING: Never expose API keys in client-side code!
        // This is for demonstration only - implement in backend
        
        // Add current lead data to the conversation context
        const contextMessage = this.buildContextMessage();
        const recentMessages = this.conversationHistory.slice(-8);
        recentMessages.push(contextMessage);
        const messagesWithContext = recentMessages;
        
        const payload = {
            model: "gpt-3.5-turbo",
            messages: messagesWithContext,
            max_tokens: 150,
            temperature: 0.7,
            presence_penalty: 0.2,
            frequency_penalty: 0.2
        };

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI API error:', error);
            return null;
        }
    }

    // Build context message with current lead data
    buildContextMessage() {
        let context = "Current lead information I have collected: ";
        const leadInfo = [];
        
        if (this.leadData.name) leadInfo.push(`Name: ${this.leadData.name}`);
        if (this.leadData.phone) leadInfo.push(`Phone: ${this.leadData.phone}`);
        if (this.leadData.email) leadInfo.push(`Email: ${this.leadData.email}`);
        if (this.leadData.businessType) leadInfo.push(`Business: ${this.leadData.businessType}`);
        if (this.leadData.location) leadInfo.push(`Location: ${this.leadData.location}`);
        
        if (leadInfo.length > 0) {
            context += leadInfo.join(', ');
            context += ". IMPORTANT: Do not ask for information I already have. If I have their phone number, don't ask for it again. If I have their email, don't ask for it again.";
        } else {
            context += "None collected yet. I need to collect their contact information.";
        }
        
        return {
            role: 'system',
            content: context
        };
    }

    // Process AI response for special actions
    async processAIResponse(response, userMessage) {
        const lowerResponse = response.toLowerCase();
        const lowerMessage = userMessage.toLowerCase();

        // Extract lead information FIRST
        this.extractLeadInfo(userMessage);

        // Check for booking intent
        if (lowerResponse.includes('demo') || lowerResponse.includes('schedule') || lowerMessage.includes('book')) {
            this.triggerBookingFlow();
        }

        // Only trigger contact collection if we don't already have the info
        if (lowerResponse.includes('contact') || lowerResponse.includes('phone') || lowerResponse.includes('email')) {
            this.triggerContactCollection();
        }

        // Check for pricing discussion
        if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
            this.trackLeadInterest('pricing');
        }

        // Send data to CRM/automation systems
        if (Object.keys(this.leadData).length > 2) {
            await this.sendToAutomation();
        }
    }

    // Extract lead information from conversation
    extractLeadInfo(message) {
        const lowerMessage = message.toLowerCase();

        // Extract business type
        const businessTypes = {
            'plumb': 'plumbing',
            'electric': 'electrical', 
            'hvac': 'hvac',
            'heat': 'hvac',
            'cool': 'hvac',
            'handyman': 'handyman',
            'roof': 'roofing',
            'garage': 'garage door',
            'clean': 'cleaning',
            'pest': 'pest control',
            'landscape': 'landscaping'
        };

        for (const [key, value] of Object.entries(businessTypes)) {
            if (lowerMessage.includes(key)) {
                this.leadData.businessType = value;
                break;
            }
        }

        // Extract contact information using improved regex
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        // Improved phone regex to catch more formats
        const phoneRegex = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/;

        const emailMatch = message.match(emailRegex);
        const phoneMatch = message.match(phoneRegex);

        if (emailMatch && !this.leadData.email) {
            this.leadData.email = emailMatch[0];
            this.trackLeadInterest('contact_provided');
            console.log('Email captured:', this.leadData.email);
        }
        if (phoneMatch && !this.leadData.phone) {
            this.leadData.phone = phoneMatch[0];
            this.trackLeadInterest('contact_provided');
            console.log('Phone captured:', this.leadData.phone);
        }

        // Extract name (improved patterns)
        if (!this.leadData.name) {
            const namePatterns = [
                /(?:my name is|i'm|i am|this is|it's)\s+([a-zA-Z\s]{2,30})/i,
                /^([A-Z][a-z]+ [A-Z][a-z]+)/, // First Last format at start
                /^([A-Z][a-z]+)\s*(?:here|speaking)/, // "John here" format
            ];
            
            for (const pattern of namePatterns) {
                const nameMatch = message.match(pattern);
                if (nameMatch) {
                    const extractedName = nameMatch[1].trim();
                    // Filter out common non-names
                    if (!['help', 'good', 'great', 'fine', 'okay', 'yes', 'no'].includes(extractedName.toLowerCase())) {
                        this.leadData.name = extractedName;
                        this.trackLeadInterest('contact_provided');
                        console.log('Name captured:', this.leadData.name);
                        break;
                    }
                }
            }
        }

        // Extract location
        const locationKeywords = ['in ', 'from ', 'located ', 'area'];
        for (const keyword of locationKeywords) {
            if (lowerMessage.includes(keyword)) {
                const locationMatch = message.match(new RegExp(keyword + '([a-zA-Z\\s,]+)', 'i'));
                if (locationMatch) {
                    this.leadData.location = locationMatch[1].trim().split(',')[0];
                    break;
                }
            }
        }
    }

    // Trigger booking flow
    triggerBookingFlow() {
        console.log('🎯 Booking flow triggered!');
        console.log('📊 Current lead data:', this.leadData);
        
        // Check what contact info we already have
        if (this.leadData.phone && this.leadData.email) {
            console.log('✅ Have both phone and email - confirming booking');
            setTimeout(() => {
                this.addMessage(`Perfect! I have your phone (${this.leadData.phone}) and email. I'll have someone call you within 30 minutes to schedule your demo!`, true);
            }, 1000);
        } else if (this.leadData.phone) {
            console.log('📞 Have phone, asking for email');
            setTimeout(() => {
                this.addMessage(`Great! I'll have someone call you at ${this.leadData.phone} within 30 minutes to schedule your demo. What's your email so I can send you the details?`, true);
            }, 1000);
        } else if (this.leadData.email) {
            console.log('📧 Have email, asking for phone');
            setTimeout(() => {
                this.addMessage(`Excellent! I'll send details to ${this.leadData.email}. What's the best phone number to call you for the demo?`, true);
            }, 1000);
        } else {
            console.log('❌ No contact info - asking for phone');
            setTimeout(() => {
                this.addMessage("Great! I'd love to schedule your free demo. What's the best phone number to reach you?", true);
            }, 1000);
        }
        
        // Track booking intent
        this.trackLeadInterest('demo_request');
    }

    // Trigger contact collection
    triggerContactCollection() {
        // Only ask if we're missing both phone AND email
        if (!this.leadData.phone && !this.leadData.email) {
            setTimeout(() => {
                this.addMessage("Perfect! What's the best way to reach you - phone or email?", true);
            }, 1000);
        } else if (!this.leadData.phone && this.leadData.email) {
            // We have email but need phone
            setTimeout(() => {
                this.addMessage(`I have your email (${this.leadData.email}). What's a good phone number to reach you?`, true);
            }, 1000);
        } else if (this.leadData.phone && !this.leadData.email) {
            // We have phone but need email
            setTimeout(() => {
                this.addMessage(`Great, I have your phone number (${this.leadData.phone}). What's your email so I can send you information?`, true);
            }, 1000);
        }
        // If we have both, don't ask for anything
    }

    // Track lead interest and behavior
    trackLeadInterest(action) {
        if (!this.leadData.interests) {
            this.leadData.interests = [];
        }
        
        if (!this.leadData.interests.includes(action)) {
            this.leadData.interests.push(action);
        }

        // Update lead score based on actions
        this.updateLeadScore(action);
    }

    // Update lead scoring
    updateLeadScore(action) {
        if (!this.leadData.score) this.leadData.score = 0;

        const scoreMap = {
            'pricing': 20,
            'demo_request': 40,
            'contact_provided': 30,
            'business_type': 10,
            'urgency': 25
        };

        this.leadData.score += scoreMap[action] || 5;
    }

    // Send lead data to automation systems
    async sendToAutomation() {
        // This would integrate with your automation system
        console.log('Sending lead to automation:', this.leadData);

        // Example: Send to webhook or API
        try {
            // await fetch('/api/leads', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(this.leadData)
            // });

            // Trigger email/SMS sequences
            if (this.leadData.email) {
                this.scheduleEmailReminder();
            }
            if (this.leadData.phone) {
                this.scheduleSMSReminder();
            }
        } catch (error) {
            console.error('Failed to send to automation:', error);
        }
    }

    // Schedule email reminders
    scheduleEmailReminder() {
        const reminders = [
            {
                delay: 3600000, // 1 hour
                subject: "Thanks for chatting with us!",
                template: "followup_1"
            },
            {
                delay: 86400000, // 24 hours  
                subject: "Your free demo is waiting",
                template: "demo_reminder"
            },
            {
                delay: 259200000, // 3 days
                subject: "Don't miss out - limited spots available",
                template: "urgency_reminder"
            }
        ];

        reminders.forEach(reminder => {
            setTimeout(() => {
                this.sendEmail(reminder);
            }, reminder.delay);
        });
    }

    // Schedule SMS reminders
    scheduleSMSReminder() {
        const smsReminders = [
            {
                delay: 1800000, // 30 minutes
                message: `Hi ${this.leadData.name || 'there'}! Thanks for your interest in our automation services. Ready to schedule your free demo? Reply YES to book now.`
            },
            {
                delay: 86400000, // 24 hours
                message: `${this.leadData.name || 'Hi'}, we have limited demo spots available this week. Don't miss your chance to see how we can automate your ${this.leadData.businessType || 'business'}!`
            }
        ];

        smsReminders.forEach(reminder => {
            setTimeout(() => {
                this.sendSMS(reminder);
            }, reminder.delay);
        });
    }

    // Send email (integrate with email service)
    async sendEmail(emailData) {
        console.log('Sending email:', emailData);
        
        // Example: Integrate with email service API
        // const emailService = new EmailService(config.emailApiKey);
        // await emailService.send({
        //     to: this.leadData.email,
        //     subject: emailData.subject,
        //     template: emailData.template,
        //     data: this.leadData
        // });
    }

    // Send SMS (integrate with SMS service)
    async sendSMS(smsData) {
        console.log('Sending SMS:', smsData);
        
        // Example: Integrate with Twilio or similar
        // const smsService = new SMSService(config.twilioSid, config.twilioToken);
        // await smsService.send({
        //     to: this.leadData.phone,
        //     message: smsData.message
        // });
    }

    // Fallback responses when AI is unavailable
    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        const fallbacks = {
            price: "Our packages start at $1,997 setup + $297/month. This includes everything you need to automate your lead generation. Would you like to see a free demo?",
            demo: "I'd love to show you how our system works! What's the best phone number to reach you for a quick 15-minute demo?",
            service: "We specialize in home service businesses - plumbing, electrical, HVAC, handyman services, and more. What type of business do you run?",
            help: "I'm here to show you how our automation system can get you more jobs automatically. What's your biggest challenge with lead generation right now?"
        };

        for (const [key, response] of Object.entries(fallbacks)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return "That's a great question! I'd love to discuss this with you on a quick call. What's the best number to reach you?";
    }

    // Add message to chat interface
    addMessage(message, isBot = true) {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = isBot ? 'bot-message' : 'user-message';
        messageDiv.innerHTML = `<p>${message}</p>`;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Debug: Log current lead data when new message is added
        if (Object.keys(this.leadData).length > 0) {
            console.log('Current lead data:', this.leadData);
        }
    }

    // Debug function to check lead data
    checkLeadData() {
        console.log('=== LEAD DATA SUMMARY ===');
        console.log('Name:', this.leadData.name || 'Not collected');
        console.log('Phone:', this.leadData.phone || 'Not collected');
        console.log('Email:', this.leadData.email || 'Not collected');
        console.log('Business:', this.leadData.businessType || 'Not collected');
        console.log('Location:', this.leadData.location || 'Not collected');
        console.log('Score:', this.leadData.score || 0);
        console.log('Interests:', this.leadData.interests || []);
        console.log('========================');
        return this.leadData;
    }

    // Generate lead report
    generateLeadReport() {
        return {
            leadData: this.leadData,
            conversationLength: this.conversationHistory.length,
            interests: this.leadData.interests || [],
            score: this.leadData.score || 0,
            timestamp: new Date().toISOString()
        };
    }
}

// Enhanced chat interface integration
class ChatInterface {
    constructor(chatbot) {
        this.chatbot = chatbot;
        this.isTyping = false;
        this.initialize();
    }

    initialize() {
        this.chatbot.initializeContext();
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chatInput');
        const chatWindow = document.getElementById('chatWindow');

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleUserMessage();
                }
            });
        }

        // Override existing sendMessage function
        window.sendMessage = () => this.handleUserMessage();
        
        // Disable the old handleBotResponse function
        window.handleBotResponse = () => {
            console.log('Old bot response function disabled - using smart AI chatbot');
        };
    }

    addWelcomeMessage() {
        setTimeout(() => {
            this.chatbot.addMessage("Hi! I'm your Smart Growth assistant. I help home service businesses get more jobs automatically. What type of business do you run?", true);
        }, 1000);
    }

    async handleUserMessage() {
        const chatInput = document.getElementById('chatInput');
        const message = chatInput.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message
        this.chatbot.addMessage(message, false);
        chatInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.chatbot.sendMessage(message);
            
            // Remove typing indicator and add response
            this.hideTypingIndicator();
            
            if (response) {
                // Add slight delay for more natural feel
                setTimeout(() => {
                    this.chatbot.addMessage(response, true);
                    
                    // Check for follow-up actions
                    this.handleFollowupActions(response);
                }, 500);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.chatbot.addMessage("I'm having trouble connecting right now. Can I get your phone number so someone can call you back?", true);
        }
    }

    showTypingIndicator() {
        this.isTyping = true;
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bot-message typing-indicator-msg';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleFollowupActions(response) {
        const lowerResponse = response.toLowerCase();
        
        // If AI asks for contact info, highlight the input
        if (lowerResponse.includes('phone') || lowerResponse.includes('email')) {
            this.highlightInput();
        }
        
        // If AI mentions demo, show booking widget after delay
        if (lowerResponse.includes('demo') && lowerResponse.includes('schedule')) {
            setTimeout(() => {
                this.showBookingWidget();
            }, 3000);
        }
    }

    highlightInput() {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.style.border = '2px solid #2563eb';
            setTimeout(() => {
                chatInput.style.border = '';
            }, 3000);
        }
    }

    showBookingWidget() {
        showNotification('Ready to book your demo? Click here to schedule!', 'info');
        setTimeout(() => {
            if (typeof openBookingWidget === 'function') {
                openBookingWidget();
            }
        }, 2000);
    }
}

// Initialize smart chatbot (with secure backend endpoint)
let smartChatbot;
let chatInterface;

// Configuration should come from your backend
const chatbotConfig = {
    // DO NOT put real API key here - use backend endpoint instead
    apiKey: 'YOUR_SECURE_BACKEND_ENDPOINT', 
    businessInfo: {
        name: 'SmartGrowth',
        services: ['Website Development', 'AI Chatbot', 'Automation'],
        pricing: {
            starter: { setup: 1997, monthly: 297 },
            pro: { setup: 2997, monthly: 497 }
        }
    }
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if chat elements exist
    if (document.getElementById('chatMessages')) {
        smartChatbot = new SmartChatbot(chatbotConfig);
        chatInterface = new ChatInterface(smartChatbot);
        
        // Make them globally available
        window.smartChatbot = smartChatbot;
        window.chatInterface = chatInterface;
        
        // Add global debug function
        window.checkLeadData = function() {
            if (smartChatbot) {
                return smartChatbot.checkLeadData();
            } else {
                console.log('Chatbot not initialized yet');
                return null;
            }
        };
        
        console.log('✅ Smart AI Chatbot initialized and ready!');
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SmartChatbot, ChatInterface };
}