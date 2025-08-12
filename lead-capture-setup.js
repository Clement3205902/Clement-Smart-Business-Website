// Real Lead Capture System for SmartGrowth
// This file sets up actual lead capture that emails you directly

class LeadCaptureSystem {
    constructor(config) {
        this.ownerEmail = config.ownerEmail;
        this.formspreeEndpoint = config.formspreeEndpoint; // We'll set this up
        this.webhookEndpoint = config.webhookEndpoint; // For advanced tracking
    }

    // Capture lead from any source (forms, chatbot, etc.)
    async captureRealtimeLead(leadData, source = 'website') {
        const enrichedLead = {
            ...leadData,
            source: source,
            timestamp: new Date().toISOString(),
            urgencyScore: this.calculateUrgencyScore(leadData),
            followUpRecommendation: this.getFollowUpRecommendation(leadData),
            businessPotential: this.assessBusinessPotential(leadData),
            pageUrl: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100),
            sessionId: this.getSessionId()
        };

        // Send to multiple endpoints for reliability
        const results = await Promise.allSettled([
            this.sendToFormspree(enrichedLead),
            this.sendToWebhook(enrichedLead),
            this.sendToLocalStorage(enrichedLead)
        ]);

        // Notify user based on success
        const successful = results.filter(r => r.status === 'fulfilled').length;
        if (successful > 0) {
            this.showSuccessNotification(leadData, source);
            this.triggerFollowUp(enrichedLead);
        } else {
            this.showErrorNotification();
        }

        return enrichedLead;
    }

    // Send to Formspree (free email service)
    async sendToFormspree(leadData) {
        // You'll replace this with your actual Formspree endpoint
        const endpoint = this.formspreeEndpoint || 'https://formspree.io/f/YOUR_FORM_ID';
        
        const formData = new FormData();
        
        // Format the email content
        const emailContent = this.formatLeadEmail(leadData);
        formData.append('subject', `🚀 NEW LEAD: ${leadData.name || 'Anonymous'} - ${leadData.businessType || 'Unknown Business'}`);
        formData.append('message', emailContent);
        formData.append('_replyto', leadData.email || '');
        formData.append('leadData', JSON.stringify(leadData, null, 2));

        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Formspree error: ${response.status}`);
        }

        return response.json();
    }

    // Send to custom webhook (if you set one up later)
    async sendToWebhook(leadData) {
        if (!this.webhookEndpoint) return;

        const response = await fetch(this.webhookEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        });

        return response.json();
    }

    // Store locally as backup
    sendToLocalStorage(leadData) {
        const leads = JSON.parse(localStorage.getItem('capturedLeads') || '[]');
        leads.push(leadData);
        localStorage.setItem('capturedLeads', JSON.stringify(leads));
        return Promise.resolve(leadData);
    }

    // Format professional email for you to receive
    formatLeadEmail(lead) {
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
Current Website: ${lead.currentWebsite || 'Not specified'}
Lead Volume: ${lead.leadVolume || 'Not specified'}
Main Challenge: ${lead.challenge || lead.message || 'Not specified'}

⚡ URGENCY & INTEREST:
Timeframe: ${lead.timeframe || 'Not specified'}
Urgency Score: ${lead.urgencyScore}/100
Business Potential: ${lead.businessPotential}
Source: ${lead.source}

📊 TECHNICAL INFO:
Captured: ${new Date(lead.timestamp).toLocaleString()}
Page: ${lead.pageUrl}
Session: ${lead.sessionId}

💡 FOLLOW-UP RECOMMENDATION:
${lead.followUpRecommendation}

═══════════════════════════════════

🚀 NEXT STEPS:
${lead.urgencyScore > 70 ? 
    '🔥 HIGH PRIORITY - Call within 30 minutes!' : 
    lead.urgencyScore > 40 ? 
    '⚡ MEDIUM PRIORITY - Call within 2 hours' : 
    '📞 Follow up within 24 hours'}

${lead.phone ? `📱 Call: ${lead.phone}` : ''}
${lead.email ? `📧 Email: ${lead.email}` : ''}

Raw Data:
${JSON.stringify(lead, null, 2)}
        `.trim();
    }

    // Calculate how urgent this lead is (0-100)
    calculateUrgencyScore(lead) {
        let score = 0;
        
        // Phone number provided = high intent
        if (lead.phone) score += 25;
        
        // Email provided = medium intent  
        if (lead.email) score += 15;
        
        // Timeframe urgency
        if (lead.timeframe?.includes('ASAP') || lead.timeframe?.includes('this week')) score += 30;
        if (lead.timeframe?.includes('2-4 weeks')) score += 20;
        
        // Business type specificity
        if (lead.businessType && !lead.businessType.includes('Other')) score += 10;
        
        // Lead volume (existing business)
        if (lead.leadVolume?.includes('30+') || lead.leadVolume?.includes('60+')) score += 15;
        
        // Specific challenges = higher intent
        if (lead.challenge?.includes('Missing calls') || lead.challenge?.includes('don\'t convert')) score += 20;
        
        // Message length (more detailed = higher intent)
        if (lead.message && lead.message.length > 50) score += 10;
        
        return Math.min(score, 100);
    }

    // Assess business revenue potential
    assessBusinessPotential(lead) {
        const indicators = [];
        
        if (lead.leadVolume?.includes('60+')) indicators.push('High volume business');
        if (lead.businessType?.includes('HVAC') || lead.businessType?.includes('Electrical')) indicators.push('High-value services');
        if (lead.timeframe?.includes('ASAP')) indicators.push('Ready to invest');
        if (lead.challenge?.includes('Missing calls')) indicators.push('Losing revenue now');
        
        if (indicators.length >= 3) return 'HIGH ($5K+ potential)';
        if (indicators.length >= 2) return 'MEDIUM ($2-5K potential)';
        return 'STANDARD ($1-2K potential)';
    }

    // Get specific follow-up recommendation
    getFollowUpRecommendation(lead) {
        if (lead.urgencyScore > 70) {
            return `IMMEDIATE ACTION: This is a hot lead! Call ${lead.phone || 'them'} within 30 minutes. They're ready to move fast.`;
        }
        
        if (lead.challenge?.includes('Missing calls')) {
            return 'Focus on pain point: They\'re losing money right now from missed calls. Lead with ROI and immediate results.';
        }
        
        if (lead.businessType?.includes('HVAC') || lead.businessType?.includes('Electrical')) {
            return 'High-value service business: Focus on premium features and advanced automation. They can afford higher packages.';
        }
        
        if (lead.leadVolume?.includes('0-10')) {
            return 'Focus on lead generation: They need more leads first, then conversion optimization. Start with marketing discussion.';
        }
        
        return 'Standard follow-up: Qualify their current situation and biggest pain points. Send case study for their industry.';
    }

    // Show success message to user
    showSuccessNotification(leadData, source) {
        const messages = {
            'chatbot': '🎯 Perfect! Clement will personally call you within 30 minutes to discuss your automation setup.',
            'contact-form': '📧 Message sent! Expect a call from Clement within 2 hours with a personalized strategy.',
            'demo-form': '🚀 Demo request received! Clement will call you shortly to schedule your personalized demo.',
            'pricing': '💰 Pricing request noted! Clement will call with a custom quote based on your specific needs.'
        };
        
        const message = messages[source] || '✅ Information received! Clement will contact you personally within 2 hours.';
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
        
        // Also show phone number for immediate contact
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('Need immediate help? Call (571) 320-5902 now!', 'info');
            }
        }, 3000);
    }

    showErrorNotification() {
        if (typeof showNotification === 'function') {
            showNotification('Having trouble submitting? Call (571) 320-5902 directly!', 'warning');
        }
    }

    // Trigger immediate follow-up actions
    triggerFollowUp(lead) {
        // Store for your dashboard/analytics
        this.trackLeadAnalytics(lead);
        
        // High-priority leads get immediate alerts
        if (lead.urgencyScore > 70) {
            // Could trigger SMS or push notification in the future
            console.log('🔥 HIGH PRIORITY LEAD ALERT:', lead);
        }
    }

    trackLeadAnalytics(lead) {
        const analytics = JSON.parse(localStorage.getItem('leadAnalytics') || '{}');
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = { count: 0, sources: {}, urgencyScores: [] };
        }
        
        analytics[today].count++;
        analytics[today].sources[lead.source] = (analytics[today].sources[lead.source] || 0) + 1;
        analytics[today].urgencyScores.push(lead.urgencyScore);
        
        localStorage.setItem('leadAnalytics', JSON.stringify(analytics));
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('leadSessionId');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('leadSessionId', sessionId);
        }
        return sessionId;
    }
}

// Initialize the lead capture system
const leadCapture = new LeadCaptureSystem({
    ownerEmail: 'ahorsuclement@gmail.com',
    // You'll need to sign up for Formspree and replace this
    formspreeEndpoint: 'https://formspree.io/f/YOUR_FORM_ID' // Replace with actual endpoint
});

// Make globally available
window.leadCapture = leadCapture;

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LeadCaptureSystem };
}