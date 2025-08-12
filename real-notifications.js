// Real Email & SMS Notifications - Sends TO you automatically
// Uses EmailJS (free) to send emails directly to your inbox

class RealNotifications {
    constructor(config) {
        this.ownerEmail = config.ownerEmail;
        this.ownerPhone = config.ownerPhone;
        this.emailServiceId = config.emailServiceId;
        this.emailTemplateId = config.emailTemplateId;
        this.emailPublicKey = config.emailPublicKey;
        this.smsServiceId = config.smsServiceId;
        
        // Initialize EmailJS
        this.initializeEmailJS();
    }

    // Initialize EmailJS service
    initializeEmailJS() {
        // Load EmailJS library if not already loaded
        if (typeof emailjs === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.emailPublicKey);
                console.log('✅ EmailJS initialized for real notifications');
            };
            document.head.appendChild(script);
        } else {
            emailjs.init(this.emailPublicKey);
        }
    }

    // Send real email notification TO your inbox
    async sendEmailNotification(leadData, source) {
        const emailParams = {
            to_email: this.ownerEmail,
            to_name: 'Clement',
            from_name: leadData.name || 'Website Lead',
            from_email: leadData.email || 'noreply@smartgrowth.com',
            subject: `🚀 NEW LEAD: ${leadData.name || 'Anonymous'} - ${leadData.businessType || 'Business Inquiry'}`,
            lead_name: leadData.name || 'Not provided',
            lead_business: leadData.businessName || leadData.business || 'Not provided',
            lead_email: leadData.email || 'Not provided',
            lead_phone: leadData.phone || 'Not provided',
            lead_type: leadData.businessType || leadData.service || 'Not specified',
            lead_challenge: leadData.challenge || leadData.message || 'Not specified',
            lead_timeline: leadData.timeframe || 'Not specified',
            lead_source: source,
            urgency_score: leadData.urgencyScore || 'Not calculated',
            business_potential: leadData.businessPotential || 'Not assessed',
            follow_up: leadData.followUpRecommendation || 'Standard follow-up recommended',
            capture_time: new Date().toLocaleString(),
            page_url: window.location.href,
            message_body: this.formatEmailBody(leadData, source)
        };

        try {
            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(
                    this.emailServiceId,
                    this.emailTemplateId,
                    emailParams
                );
                
                console.log('✅ Email notification sent successfully:', response);
                return { success: true, response };
            } else {
                throw new Error('EmailJS not loaded');
            }
        } catch (error) {
            console.error('❌ Failed to send email notification:', error);
            // Fallback: still show user success but log error
            return { success: false, error };
        }
    }

    // Format email body with all lead details
    formatEmailBody(lead, source) {
        const urgencyIcon = lead.urgencyScore > 70 ? '🔥' : lead.urgencyScore > 40 ? '⚡' : '📞';
        const priorityText = lead.urgencyScore > 70 ? 'HIGH PRIORITY - Call within 30 minutes!' : 
                            lead.urgencyScore > 40 ? 'MEDIUM PRIORITY - Call within 2 hours' : 
                            'Follow up within 24 hours';

        return `
🎯 NEW SMARTGROWTH LEAD ALERT!

═══════════════════════════════════

👤 CONTACT INFORMATION:
Name: ${lead.name || 'Not provided'}
Business: ${lead.businessName || lead.business || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}

🏢 BUSINESS DETAILS:
Type: ${lead.businessType || lead.service || 'Not specified'}
Challenge: ${lead.challenge || lead.message || 'Not specified'}
Timeline: ${lead.timeframe || 'Not specified'}
Lead Source: ${source}

${urgencyIcon} URGENCY & PRIORITY:
Urgency Score: ${lead.urgencyScore || 0}/100
Business Potential: ${lead.businessPotential || 'Not assessed'}
Action Required: ${priorityText}

💡 FOLLOW-UP RECOMMENDATION:
${lead.followUpRecommendation || 'Standard follow-up recommended'}

📊 TECHNICAL INFO:
Captured: ${new Date().toLocaleString()}
Page: ${window.location.href}

═══════════════════════════════════

🚀 NEXT STEPS:
${lead.phone ? `📱 Call: ${lead.phone}` : ''}
${lead.email ? `📧 Email: ${lead.email}` : ''}

This lead was captured by your SmartGrowth website.
        `.trim();
    }

    // Send SMS notification (using a simple SMS service)
    async sendSMSNotification(leadData, source) {
        const smsMessage = `🚀 NEW LEAD: ${leadData.name || 'Anonymous'} from ${leadData.businessType || 'business'} wants ${source}. Phone: ${leadData.phone || 'none'}, Email: ${leadData.email || 'none'}. Urgency: ${leadData.urgencyScore || 0}/100. Check your email for details!`;

        try {
            // Using a simple SMS API service (you can replace with your preferred service)
            const response = await fetch('https://api.textbelt.com/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: this.ownerPhone,
                    message: smsMessage,
                    key: 'textbelt' // Free tier - 1 SMS per day, or use paid key
                })
            });

            const result = await response.json();
            console.log('SMS notification result:', result);
            return { success: result.success, response: result };
        } catch (error) {
            console.error('❌ Failed to send SMS:', error);
            return { success: false, error };
        }
    }

    // Process new lead with real notifications
    async processLeadNotification(leadData, source) {
        const results = {
            email: { success: false },
            sms: { success: false }
        };

        // Send email notification
        try {
            results.email = await this.sendEmailNotification(leadData, source);
        } catch (error) {
            console.error('Email notification error:', error);
        }

        // Send SMS for high-priority leads
        if (leadData.urgencyScore > 70) {
            try {
                results.sms = await this.sendSMSNotification(leadData, source);
            } catch (error) {
                console.error('SMS notification error:', error);
            }
        }

        return results;
    }

    // Show user feedback based on notification success
    showUserFeedback(results, leadData) {
        let message = '✅ Thank you! Your message has been sent.';
        
        if (results.email.success) {
            message += ' We\'ll contact you within 30 minutes.';
        } else {
            message += ' We\'ll follow up as soon as possible.';
        }

        if (results.sms.success && leadData.urgencyScore > 70) {
            message += ' This is a high-priority inquiry!';
        }

        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }

        // Always show phone number for immediate contact
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('Need immediate help? Call (571) 320-5902 now!', 'info');
            }
        }, 3000);
    }
}

// Configuration - you'll need to set these up
const realNotifications = new RealNotifications({
    ownerEmail: 'ahorsuclement@gmail.com',
    ownerPhone: '5713205902',
    // EmailJS configuration (free service)
    emailServiceId: 'YOUR_SERVICE_ID',
    emailTemplateId: 'YOUR_TEMPLATE_ID', 
    emailPublicKey: 'YOUR_PUBLIC_KEY',
    // SMS service configuration
    smsServiceId: 'textbelt' // Free tier
});

// Make globally available
window.realNotifications = realNotifications;

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RealNotifications };
}