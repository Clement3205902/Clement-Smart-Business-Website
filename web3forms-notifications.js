// Web3Forms Integration - Sends emails directly to your inbox
// Free service, no account setup needed, just need access key

class Web3FormsNotifications {
    constructor(config) {
        this.ownerEmail = config.ownerEmail;
        this.ownerPhone = config.ownerPhone;
        this.accessKey = config.accessKey; // You'll get this from web3forms.com
    }

    // Send email directly to your inbox via Web3Forms
    async sendEmailToInbox(leadData, source) {
        const formData = new FormData();
        
        // Web3Forms required fields
        formData.append('access_key', this.accessKey);
        formData.append('from_name', leadData.name || 'Website Lead');
        formData.append('email', leadData.email || 'noreply@smartgrowth.com');
        formData.append('subject', `🚀 NEW LEAD: ${leadData.name || 'Anonymous'} - ${leadData.businessType || 'Business Inquiry'}`);
        
        // Custom message with all lead details
        const message = this.formatLeadEmail(leadData, source);
        formData.append('message', message);

        // Additional hidden fields for better organization
        formData.append('lead_name', leadData.name || 'Not provided');
        formData.append('lead_phone', leadData.phone || 'Not provided'); 
        formData.append('lead_business', leadData.businessName || leadData.business || 'Not provided');
        formData.append('urgency_score', leadData.urgencyScore?.toString() || '0');
        formData.append('source', source);
        formData.append('redirect', 'false'); // Don't redirect after submit

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Email sent to your inbox successfully!');
                return { success: true, message: 'Email sent to your inbox!' };
            } else {
                console.error('❌ Web3Forms error:', result);
                return { success: false, error: result.message };
            }
        } catch (error) {
            console.error('❌ Failed to send email:', error);
            return { success: false, error: error.message };
        }
    }

    // Format comprehensive email for your inbox
    formatLeadEmail(lead, source) {
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
User Agent: ${navigator.userAgent.substring(0, 100)}...

═══════════════════════════════════

🚀 NEXT STEPS:
${lead.phone ? `📱 Call: ${lead.phone}` : ''}
${lead.email ? `📧 Email: ${lead.email}` : ''}

${lead.urgencyScore > 70 ? '🔥 HIGH PRIORITY LEAD - Act fast!' : ''}

This lead was captured by your SmartGrowth website.
Visit your dashboard at: ${window.location.href}
        `.trim();
    }

    // Send SMS notification for high-priority leads
    async sendSMSNotification(leadData) {
        const smsMessage = `🚀 HIGH PRIORITY LEAD: ${leadData.name || 'Anonymous'} from ${leadData.businessType || 'business'}. Phone: ${leadData.phone || 'none'}. Urgency: ${leadData.urgencyScore}/100. Check email for details!`;

        try {
            // Using Textbelt for SMS (free 1 SMS per day, or paid for more)
            const response = await fetch('https://textbelt.com/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: this.ownerPhone,
                    message: smsMessage,
                    key: 'textbelt' // Replace with paid key for unlimited SMS
                })
            });

            const result = await response.json();
            console.log('SMS result:', result);
            return result;
        } catch (error) {
            console.error('SMS error:', error);
            return { success: false, error };
        }
    }

    // Process complete notification flow
    async processCompleteNotification(leadData, source) {
        console.log('🚀 Processing notification for lead:', leadData.name || 'Anonymous');
        
        // Always send email
        const emailResult = await this.sendEmailToInbox(leadData, source);
        
        // Send SMS for high-priority leads
        let smsResult = { success: false };
        if (leadData.urgencyScore > 70) {
            console.log('🔥 High priority lead - sending SMS');
            smsResult = await this.sendSMSNotification(leadData);
        }

        // Show user feedback
        this.showUserFeedback(emailResult, smsResult, leadData);

        return {
            email: emailResult,
            sms: smsResult
        };
    }

    // Show appropriate user feedback
    showUserFeedback(emailResult, smsResult, leadData) {
        if (emailResult.success) {
            let message = '✅ Thank you! Your message has been sent to Clement.';
            
            if (leadData.urgencyScore > 70) {
                message += ' This is high priority - expect a call within 30 minutes!';
            } else {
                message += ' You\'ll hear back within 2 hours.';
            }
            
            if (typeof showNotification === 'function') {
                showNotification(message, 'success');
            }

            // Show SMS notification if successful
            if (smsResult.success) {
                setTimeout(() => {
                    if (typeof showNotification === 'function') {
                        showNotification('📱 Clement has been notified via SMS for immediate attention!', 'info');
                    }
                }, 2000);
            }

        } else {
            // Fallback message
            if (typeof showNotification === 'function') {
                showNotification('Having trouble? Call (571) 320-5902 directly for immediate help!', 'warning');
            }
        }

        // Always show phone number
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('📞 For immediate help: Call (571) 320-5902', 'info');
            }
        }, 4000);
    }
}

// You'll need to get a free access key from https://web3forms.com
const web3FormsNotifications = new Web3FormsNotifications({
    ownerEmail: 'ahorsuclement@gmail.com',
    ownerPhone: '5713205902',
    accessKey: 'YOUR_WEB3FORMS_ACCESS_KEY' // Replace with your actual key
});

// Make globally available
window.web3FormsNotifications = web3FormsNotifications;

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Web3FormsNotifications };
}