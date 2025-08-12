// Direct Email Lead Capture System - No Third-Party Services
// Sends leads directly via email client or creates downloadable lead files

class DirectLeadCapture {
    constructor(config) {
        this.ownerEmail = config.ownerEmail;
        this.ownerPhone = config.ownerPhone;
        this.businessName = config.businessName;
    }

    // Capture and process lead directly
    async captureDirectLead(leadData, source = 'website') {
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

        // Multiple delivery methods - no external services needed
        const results = await Promise.allSettled([
            this.sendViaMailto(enrichedLead),
            this.saveToLocalStorage(enrichedLead),
            this.createDownloadableReport(enrichedLead)
        ]);

        // Show success message
        this.showDirectSuccessNotification(leadData, source);
        
        // Store for your review
        this.trackLeadAnalytics(enrichedLead);

        return enrichedLead;
    }

    // Open email client with pre-filled lead information
    async sendViaMailto(leadData) {
        const subject = encodeURIComponent(`🚀 NEW LEAD: ${leadData.name || 'Anonymous'} - ${leadData.businessType || 'Business Inquiry'}`);
        const body = encodeURIComponent(this.formatDirectEmailBody(leadData));
        
        const mailtoLink = `mailto:${this.ownerEmail}?subject=${subject}&body=${body}`;
        
        // Open email client
        window.open(mailtoLink);
        
        return Promise.resolve({ method: 'mailto', success: true });
    }

    // Save to browser storage for your review
    saveToLocalStorage(leadData) {
        const leads = JSON.parse(localStorage.getItem('directLeads') || '[]');
        leads.unshift(leadData); // Add to beginning (most recent first)
        
        // Keep only last 100 leads to prevent storage issues
        if (leads.length > 100) {
            leads.splice(100);
        }
        
        localStorage.setItem('directLeads', JSON.stringify(leads));
        localStorage.setItem('lastLeadUpdate', new Date().toISOString());
        
        return Promise.resolve(leadData);
    }

    // Create downloadable lead report
    createDownloadableReport(leadData) {
        const reportContent = this.formatLeadReport(leadData);
        const fileName = `lead_${leadData.name?.replace(/\s/g, '_') || 'anonymous'}_${new Date().toISOString().split('T')[0]}.txt`;
        
        // Create downloadable file
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        
        // Auto-download (optional - can be disabled)
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        
        // Show download option to user instead of auto-download
        setTimeout(() => {
            if (confirm('📄 Would you like to download a detailed lead report for your records?')) {
                a.click();
            }
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 2000);
        
        return Promise.resolve({ method: 'download', fileName, success: true });
    }

    // Format email body for direct email
    formatDirectEmailBody(lead) {
        return `NEW SMARTGROWTH LEAD ALERT!

CONTACT INFORMATION:
Name: ${lead.name || 'Not provided'}
Business: ${lead.businessName || lead.business || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}

BUSINESS DETAILS:
Type: ${lead.businessType || lead.service || 'Not specified'}
Current Website: ${lead.currentWebsite || 'Not specified'}
Lead Volume: ${lead.leadVolume || 'Not specified'}
Main Challenge: ${lead.challenge || lead.message || 'Not specified'}

URGENCY & INTEREST:
Timeframe: ${lead.timeframe || 'Not specified'}
Urgency Score: ${lead.urgencyScore}/100
Business Potential: ${lead.businessPotential}
Source: ${lead.source}

FOLLOW-UP RECOMMENDATION:
${lead.followUpRecommendation}

NEXT STEPS:
${lead.urgencyScore > 70 ? 
    'HIGH PRIORITY - Call within 30 minutes!' : 
    lead.urgencyScore > 40 ? 
    'MEDIUM PRIORITY - Call within 2 hours' : 
    'Follow up within 24 hours'}

Captured: ${new Date(lead.timestamp).toLocaleString()}
Page: ${lead.pageUrl}

---
This lead was captured by your SmartGrowth website.
No external services were used.`;
    }

    // Format detailed lead report
    formatLeadReport(lead) {
        return `SMARTGROWTH LEAD REPORT
Generated: ${new Date().toLocaleString()}
Lead ID: ${lead.sessionId}

===================================
CONTACT INFORMATION
===================================
Name: ${lead.name || 'Not provided'}
Business Name: ${lead.businessName || lead.business || 'Not provided'}
Email: ${lead.email || 'Not provided'}
Phone: ${lead.phone || 'Not provided'}

===================================
BUSINESS PROFILE
===================================
Business Type: ${lead.businessType || lead.service || 'Not specified'}
Current Website Status: ${lead.currentWebsite || 'Not specified'}
Monthly Lead Volume: ${lead.leadVolume || 'Not specified'}
Primary Challenge: ${lead.challenge || lead.message || 'Not specified'}
Initial Interest: ${lead.initialIntent || 'Not specified'}

===================================
QUALIFICATION DATA
===================================
Timeline: ${lead.timeframe || 'Not specified'}
Urgency Score: ${lead.urgencyScore}/100
Business Potential: ${lead.businessPotential}
Lead Source: ${lead.source}

===================================
FOLLOW-UP STRATEGY
===================================
Priority Level: ${lead.urgencyScore > 70 ? 'HIGH' : lead.urgencyScore > 40 ? 'MEDIUM' : 'STANDARD'}
Recommended Action: ${lead.followUpRecommendation}

Contact Method: ${lead.phone ? 'Phone (Primary): ' + lead.phone : 'Email: ' + (lead.email || 'Not provided')}

===================================
TECHNICAL DETAILS
===================================
Captured: ${new Date(lead.timestamp).toLocaleString()}
Page URL: ${lead.pageUrl}
Session ID: ${lead.sessionId}
User Agent: ${lead.userAgent}

===================================
CONVERSATION HISTORY
===================================
${lead.conversationHistory || 'Standard form submission'}

===================================
NOTES SECTION
===================================
[Add your follow-up notes here]

Call Date/Time: ________________
Result: _______________________
Next Action: __________________
`;
    }

    // Calculate urgency score (same as before)
    calculateUrgencyScore(lead) {
        let score = 0;
        
        if (lead.phone) score += 25;
        if (lead.email) score += 15;
        
        if (lead.timeframe?.includes('ASAP') || lead.timeframe?.includes('this week')) score += 30;
        if (lead.timeframe?.includes('2-4 weeks')) score += 20;
        
        if (lead.businessType && !lead.businessType.includes('Other')) score += 10;
        
        if (lead.leadVolume?.includes('30+') || lead.leadVolume?.includes('60+')) score += 15;
        
        if (lead.challenge?.includes('Missing calls') || lead.challenge?.includes('don\'t convert')) score += 20;
        
        if (lead.message && lead.message.length > 50) score += 10;
        
        return Math.min(score, 100);
    }

    // Assess business potential (same as before)
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

    // Get follow-up recommendation (same as before)
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

    // Show success notification
    showDirectSuccessNotification(leadData, source) {
        const messages = {
            'chatbot': '✅ Lead captured! Your email client will open with the details. Check your Leads Dashboard below.',
            'contact-form': '✅ Message received! Check your email client and leads dashboard for details.',
            'demo-form': '✅ Demo request captured! Your email client will open with prospect details.',
            'pricing': '✅ Pricing inquiry saved! Check your leads dashboard and email for follow-up details.'
        };
        
        const message = messages[source] || '✅ Lead captured successfully! Check your email client and leads dashboard.';
        
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
        }
        
        // Show contact info
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification(`📞 For immediate contact: Call ${this.ownerPhone}`, 'info');
            }
        }, 3000);

        // Show dashboard notification
        setTimeout(() => {
            if (typeof showNotification === 'function') {
                showNotification('📊 View all leads in your dashboard at the bottom of this page', 'info');
            }
        }, 5000);
    }

    // Track analytics
    trackLeadAnalytics(lead) {
        const analytics = JSON.parse(localStorage.getItem('directLeadAnalytics') || '{}');
        const today = new Date().toDateString();
        
        if (!analytics[today]) {
            analytics[today] = { count: 0, sources: {}, urgencyScores: [], totalRevenuePotential: 0 };
        }
        
        analytics[today].count++;
        analytics[today].sources[lead.source] = (analytics[today].sources[lead.source] || 0) + 1;
        analytics[today].urgencyScores.push(lead.urgencyScore);
        
        // Add revenue potential
        const potential = lead.businessPotential.includes('HIGH') ? 5000 : 
                         lead.businessPotential.includes('MEDIUM') ? 3000 : 1500;
        analytics[today].totalRevenuePotential += potential;
        
        localStorage.setItem('directLeadAnalytics', JSON.stringify(analytics));
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('directLeadSessionId');
        if (!sessionId) {
            sessionId = 'direct_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('directLeadSessionId', sessionId);
        }
        return sessionId;
    }

    // Get all stored leads
    getAllLeads() {
        return JSON.parse(localStorage.getItem('directLeads') || '[]');
    }

    // Get analytics
    getAnalytics() {
        return JSON.parse(localStorage.getItem('directLeadAnalytics') || '{}');
    }

    // Clear all data
    clearAllData() {
        localStorage.removeItem('directLeads');
        localStorage.removeItem('directLeadAnalytics');
        sessionStorage.removeItem('directLeadSessionId');
    }
}

// Initialize the direct lead capture system
const directLeadCapture = new DirectLeadCapture({
    ownerEmail: 'ahorsuclement@gmail.com',
    ownerPhone: '(571) 320-5902',
    businessName: 'SmartGrowth'
});

// Make globally available
window.directLeadCapture = directLeadCapture;

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DirectLeadCapture };
}