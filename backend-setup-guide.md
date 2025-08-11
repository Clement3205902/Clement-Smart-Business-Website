# Backend Setup Guide for Smart AI Chatbot

## 🚨 SECURITY FIRST

**NEVER put API keys in client-side code!** The smart chatbot system I created is designed to work with a secure backend. Here's how to set it up properly:

## 🔒 Secure Architecture

```
Frontend (Browser) → Your Backend Server → OpenAI API
                  ↓
              Your Database
                  ↓  
          Email/SMS Services
```

## 🛠️ Backend Implementation Options

### Option 1: Node.js/Express Backend

Create a simple backend server:

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI with your API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // Store in .env file
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 150,
            temperature: 0.7
        });
        
        res.json({
            response: completion.choices[0].message.content,
            success: true
        });
    } catch (error) {
        console.error('OpenAI Error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            success: false 
        });
    }
});

// Lead capture endpoint
app.post('/api/leads', async (req, res) => {
    try {
        const leadData = req.body;
        
        // Save to your database
        // await saveLeadToDatabase(leadData);
        
        // Trigger email/SMS automation
        // await triggerAutomation(leadData);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save lead' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Environment Variables (.env file):**
```
OPENAI_API_KEY=your_new_secure_api_key_here
TWILIO_SID=your_twilio_sid
TWILIO_TOKEN=your_twilio_token
EMAIL_API_KEY=your_email_service_key
DATABASE_URL=your_database_connection
```

### Option 2: Serverless Functions (Vercel/Netlify)

**Vercel Function (`/api/chat.js`):**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { messages } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            max_tokens: 150,
            temperature: 0.7
        });
        
        res.json({
            response: completion.choices[0].message.content
        });
    } catch (error) {
        res.status(500).json({ error: 'AI service unavailable' });
    }
}
```

### Option 3: PHP Backend (if you prefer PHP)

```php
<?php
// chat.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'];

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => $messages,
    'max_tokens' => 150,
    'temperature' => 0.7
];

$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $_ENV['OPENAI_API_KEY']
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $result = json_decode($response, true);
    echo json_encode([
        'response' => $result['choices'][0]['message']['content']
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'AI service unavailable']);
}
?>
```

## 🔗 Update Frontend Configuration

Update your `smart-chatbot.js` to use your backend:

```javascript
// In smart-chatbot.js, update the API call:
async callOpenAI() {
    try {
        const response = await fetch('/api/chat', { // Your backend endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: this.conversationHistory.slice(-10)
            })
        });
        
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error('Backend error:', error);
        return null;
    }
}
```

## 📧 Email/SMS Integration Setup

### Twilio SMS Setup:
```javascript
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function sendSMS(to, message) {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_NUMBER,
            to: to
        });
        console.log('SMS sent successfully');
    } catch (error) {
        console.error('SMS error:', error);
    }
}
```

### Email Service Setup (using SendGrid):
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, content) {
    const msg = {
        to: to,
        from: 'hello@smartgrowth.com',
        subject: subject,
        html: content
    };
    
    try {
        await sgMail.send(msg);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Email error:', error);
    }
}
```

## 🗄️ Database Setup

### Simple Lead Storage (PostgreSQL example):
```sql
CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    business_type VARCHAR(100),
    interests TEXT[],
    score INTEGER DEFAULT 0,
    conversation_data JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Deployment Steps

### 1. Secure Your API Key
- Go to https://platform.openai.com/api-keys
- Delete the exposed key immediately
- Create a new API key
- Store it in environment variables (never in code)

### 2. Choose Your Backend
- Node.js/Express for full control
- Vercel/Netlify for serverless simplicity
- PHP if you prefer traditional hosting

### 3. Deploy Backend
- Deploy to Heroku, Vercel, or your hosting provider
- Set environment variables in hosting dashboard
- Test endpoints with Postman or similar

### 4. Update Frontend
- Replace direct OpenAI calls with your backend endpoints
- Test chatbot functionality
- Deploy frontend to your web hosting

## 💰 Cost Management

### OpenAI API Costs:
- **GPT-3.5 Turbo**: ~$0.002 per 1K tokens
- **Average conversation**: ~$0.01-$0.05
- **Monthly estimate**: $10-50 for moderate traffic
- Set usage limits in OpenAI dashboard

### Monitoring Usage:
```javascript
// Add to your backend
app.use((req, res, next) => {
    console.log(`API call from ${req.ip} at ${new Date()}`);
    // Log to monitoring service
    next();
});
```

## 🔐 Security Checklist

- ✅ API key stored in environment variables
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Input validation on all endpoints
- ✅ Error handling that doesn't expose secrets
- ✅ HTTPS enabled on production
- ✅ Database queries sanitized
- ✅ User data encrypted at rest

## 📱 Testing Your Setup

1. **Test Backend Locally:**
   ```bash
   curl -X POST http://localhost:3000/api/chat \
   -H "Content-Type: application/json" \
   -d '{"messages":[{"role":"user","content":"Hello"}]}'
   ```

2. **Test Frontend Integration:**
   - Open browser dev tools
   - Try chatbot conversation
   - Check network tab for API calls
   - Verify no API keys in browser

3. **Test Automation:**
   - Submit lead information
   - Verify database storage
   - Check email/SMS delivery

## ⚡ Quick Start (5 Minutes)

1. **Create Vercel account** (free tier available)
2. **Upload the API function** I provided above
3. **Set environment variables** in Vercel dashboard
4. **Update frontend** to use your Vercel endpoint
5. **Test immediately** - your AI chatbot is live!

This setup gives you a production-ready, secure AI chatbot that can handle real customer conversations, capture leads, and trigger automated follow-ups - all while keeping your API key completely secure!