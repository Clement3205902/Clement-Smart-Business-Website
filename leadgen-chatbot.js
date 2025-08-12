// Enhanced LeadGen Chatbot - SmartGrowth Integration
(function(){
  // ====== SMARTGROWTH CONFIG ======
  const WEBHOOK_URL = "https://your-backend-endpoint.com/api/leads"; // Replace with your endpoint
  const DEMO_URL = "https://calendly.com/smartgrowth-demo"; // Replace with your booking link
  const BRAND = { 
    name: "SmartGrowth", 
    niche: "home service businesses",
    phone: "(571) 320-5902",
    email: "ahorsuclement@gmail.com"
  };

  // ====== STATE ======
  const state = {
    step: 0,
    data: {
      name: "",
      businessName: "",
      email: "",
      phone: "",
      businessType: "",
      leadVolume: "",
      challenge: "",
      currentWebsite: "",
      timeframe: "",
      source: document.referrer || "direct",
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 100),
      pageUrl: location.href
    },
    messageCount: 0
  }

  // ====== UTIL ======
  const $ = sel => document.querySelector(sel);
  const chat = $('#chat');
  const panel = $('#panel');
  const launcher = $('#launcher');
  const freeText = $('#freeText');
  const sendBtn = $('#sendBtn');

  function scrollToEnd(){ 
    setTimeout(() => chat.scrollTop = chat.scrollHeight + 200, 100);
  }
  
  function addBot(text, html){
    const el = document.createElement('div');
    el.className = 'msg bot';
    el.innerHTML = `<div class="bubble">${html || escapeHtml(text)}</div>`;
    chat.appendChild(el); 
    scrollToEnd();
    state.messageCount++;
  }
  
  function addUser(text){
    const el = document.createElement('div');
    el.className = 'msg user';
    el.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
    chat.appendChild(el); 
    scrollToEnd();
  }
  
  function addOptions(arr){
    const wrap = document.createElement('div'); wrap.className='options';
    arr.forEach(opt => {
      const b = document.createElement('button'); 
      b.className='opt'; 
      b.textContent=opt.label; 
      b.dataset.value=opt.value ?? opt.label;
      b.addEventListener('click', () => { 
        // Remove options after selection
        wrap.style.display = 'none';
        handleChoice(opt.value ?? opt.label); 
      });
      wrap.appendChild(b);
    });
    chat.appendChild(wrap); 
    scrollToEnd();
  }
  
  function escapeHtml(s){ 
    return String(s).replace(/[&<>"']/g, m => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[m])); 
  }

  function emailValid(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function phoneClean(v){ return v.replace(/[^\d+()-\s]/g,''); }

  // ====== ENHANCED OPTION POOLS FOR HOME SERVICES ======
  const BUSINESS_TYPES = [
    "Plumbing", "HVAC/Heating", "Electrical", "Roofing", "Handyman Services",
    "Cleaning Services", "Landscaping", "Pest Control", "Garage Door", 
    "Auto Repair", "Pool Services", "Other"
  ];
  
  const LEAD_VOLUMES = [
    "0–10 leads/month", "11–30 leads/month", "31–60 leads/month", 
    "60+ leads/month", "Not sure/varies"
  ];
  
  const CHALLENGES = [
    "Missing calls/slow response", "Website looks outdated", "Not enough leads", 
    "Leads don't convert", "No follow-up system", "Too busy to handle leads", "Other"
  ];
  
  const TIMEFRAMES = [
    "ASAP (this week)", "Within 2-4 weeks", "Next 1-2 months", "Just exploring"
  ];

  // ====== ENHANCED CONVERSATION FLOW ======
  function start(){
    addBot(`👋 Hi! I'm your SmartGrowth assistant.`);
    
    setTimeout(() => {
      addBot(`I help ${BRAND.niche} get 40% more jobs by automating lead response and booking.`);
    }, 1500);
    
    setTimeout(() => {
      const statsHtml = `<div class="stats-preview">
        <strong>📊 Our clients typically see:</strong><br>
        • 24/7 lead response (even at 2 AM)<br>  
        • 40% more bookings within 30 days<br>
        • Automated follow-up until they convert
      </div>`;
      addBot("", statsHtml);
    }, 3000);
    
    setTimeout(() => {
      addBot("What brings you here today?");
      addOptions([
        {label:"I need more jobs/leads"},
        {label:"My website needs help"},
        {label:"I'm losing leads to competitors"},
        {label:"Just exploring options"}
      ]);
      state.step = 1;
    }, 4500);
  }

  async function handleChoice(value){
    addUser(value);

    switch(state.step){
      case 1:
        state.data.initialIntent = value;
        addBot("Perfect! Let me ask a few quick questions so I can show you exactly how this works for your business.");
        setTimeout(() => {
          addBot("What type of service business do you run?");
          addOptions(BUSINESS_TYPES.map(t=>({label:t})));
        }, 1500);
        state.step = 2; 
        break;

      case 2:
        state.data.businessType = value;
        addBot(`Great! ${value} businesses do really well with our system.`);
        setTimeout(() => {
          addBot("How many leads do you typically get per month?");
          addOptions(LEAD_VOLUMES.map(l=>({label:l})));
        }, 1500);
        state.step = 3; 
        break;

      case 3:
        state.data.leadVolume = value;
        let responseText = "Got it. ";
        if(value.includes("0–10")) {
          responseText += "We can definitely help you get more leads AND convert them better.";
        } else if(value.includes("60+")) {
          responseText += "Nice volume! The key is making sure you don't lose any of those leads.";
        } else {
          responseText += "That's a good foundation to build on.";
        }
        addBot(responseText);
        
        setTimeout(() => {
          addBot("What's your biggest challenge right now?");
          addOptions(CHALLENGES.map(c=>({label:c})));
        }, 2000);
        state.step = 4; 
        break;

      case 4:
        state.data.challenge = value;
        let solutionText = "That's exactly what we solve! ";
        if(value.includes("Missing calls")) {
          solutionText += "Our AI chatbot answers every lead in under 30 seconds, 24/7.";
        } else if(value.includes("outdated")) {
          solutionText += "We build modern websites that work automatically while you focus on the work.";
        } else if(value.includes("don't convert")) {
          solutionText += "Our automated follow-up sequences convert 3x more leads than manual follow-up.";
        } else {
          solutionText += "Our complete automation system handles this seamlessly.";
        }
        addBot(solutionText);
        
        setTimeout(() => {
          addBot("Do you have a website currently?");
          addOptions([
            {label:"Yes, but it's basic/old"},
            {label:"Yes, but it's not working well"},
            {label:"No website yet"},
            {label:"Yes, but no online booking"}
          ]);
        }, 2500);
        state.step = 5; 
        break;

      case 5:
        state.data.currentWebsite = value;
        addBot("Perfect. I can show you exactly how we'll transform that into a lead-generating machine.");
        
        setTimeout(() => {
          const guaranteeHtml = `<div class="guarantee">
            <strong>🛡️ 7-Day Delivery Guarantee</strong><br>
            Your new automated system will be live and booking appointments within 7 days — or you don't pay!
          </div>`;
          addBot("", guaranteeHtml);
        }, 2000);
        
        setTimeout(() => {
          addBot("How soon are you looking to get this set up?");
          addOptions(TIMEFRAMES.map(t=>({label:t})));
        }, 3500);
        state.step = 6; 
        break;

      case 6:
        state.data.timeframe = value;
        let urgencyText = "";
        if(value.includes("ASAP")) {
          urgencyText = "Perfect timing! We have an opening this week and can get you live by Friday.";
        } else if(value.includes("2-4 weeks")) {
          urgencyText = "Great! That gives us time to build something really impressive for you.";
        } else {
          urgencyText = "No problem! I'll make sure you have all the info you need.";
        }
        addBot(urgencyText);
        
        setTimeout(() => {
          addBot("Let me get your details so I can send you a personalized demo showing exactly how this works for your business.");
          addBot("What's your first name?");
        }, 2000);
        state.step = 7; 
        break;

      case 7:
        state.data.name = value;
        addBot(`Nice to meet you, ${value}! What's your business name?`);
        state.step = 8; 
        break;

      case 8:
        state.data.businessName = value;
        addBot(`Perfect! What's the best email to send your personalized demo to?`);
        state.step = 9; 
        break;

      case 9:
        if(!emailValid(value)){
          addBot("Hmm, that email doesn't look quite right. Can you double-check it for me?"); 
          return;
        }
        state.data.email = value;
        addBot("Great! What's the best phone number to reach you?");
        addBot(`<div class="tiny">We'll call within 30 minutes if you're interested in moving forward.</div>`);
        addOptions([{label:"I'll skip this for now", value:"skip"}]);
        state.step = 10; 
        break;

      case 10:
        if(value !== "skip") {
          state.data.phone = phoneClean(value);
          addBot(`Perfect! I have everything I need.`);
        } else {
          addBot(`No problem! I have your email.`);
        }
        await finalize();
        break;

      case 99: // Restart or question
        if(value.includes("Start over")){
          chat.innerHTML = "";
          state.step = 0;
          state.data = {
            name: "", businessName: "", email: "", phone: "", businessType: "", 
            leadVolume: "", challenge: "", currentWebsite: "", timeframe: "",
            source: document.referrer || "direct", timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent.substring(0, 100), pageUrl: location.href
          };
          start();
        } else {
          addBot("What would you like to know? I'm here to help!");
        }
        break;

      default:
        addBot("Thanks for that! Is there anything else you'd like to know about how we can help your business?");
    }
  }

  async function finalize(){
    addBot("🎯 Generating your personalized demo...");

    const businessSummary = `
      <div class="tag">${state.data.businessType}</div>
      <div class="tag">${state.data.leadVolume}</div>
      <div class="tag">${state.data.challenge}</div>
    `;
    
    setTimeout(() => {
      addBot("Here's what we'll focus on for your business:", businessSummary);
    }, 1500);

    // Enhanced payload for better lead tracking
    const payload = { 
      ...state.data, 
      platform: "leadgen-widget",
      conversationLength: state.messageCount,
      leadScore: calculateLeadScore(),
      priority: getPriority()
    };

    // Integrate with existing SmartGrowth automation system
    if(window.smartChatbot) {
      // Merge data with existing smart chatbot system
      window.smartChatbot.leadData = {...window.smartChatbot.leadData, ...state.data};
      await window.smartChatbot.sendToAutomation();
    }

    try{
      if(WEBHOOK_URL && WEBHOOK_URL.startsWith('http')){
        await fetch(WEBHOOK_URL, { 
          method:'POST', 
          headers:{'Content-Type':'application/json'}, 
          body: JSON.stringify(payload) 
        });
        addBot("✅ Demo sent! Check your email in the next few minutes.");
      } else {
        console.log('Lead captured (no webhook configured):', payload);
        addBot("✅ Your info is saved! We'll follow up shortly.");
      }
    } catch(err){
      console.error('Webhook error:', err);
      addBot("I couldn't send the demo right now, but I saved your info. We'll reach out within the hour!");
    }

    setTimeout(() => {
      if(state.data.phone && state.data.phone !== "skip") {
        addBot(`📞 Since you provided your phone (${state.data.phone}), someone from our team will call you within 30 minutes to schedule your live demo.`);
      }
    }, 2000);

    setTimeout(() => {
      const ctaHtml = `
        <a class="cta" href="${DEMO_URL}" target="_blank" rel="noopener">
          📅 Book Demo Now - Limited Spots Available
        </a>
      `;
      addBot("Or book a time that works for you:", ctaHtml);
    }, 3000);

    setTimeout(() => {
      addOptions([
        {label:"Start over for another business", value:"Start over"},
        {label:"Ask a question", value:"question"}
      ]);
      state.step = 99;
    }, 4000);
  }

  // Lead scoring for prioritization
  function calculateLeadScore(){
    let score = 0;
    if(state.data.phone && state.data.phone !== "skip") score += 25;
    if(state.data.timeframe.includes("ASAP")) score += 30;
    if(state.data.timeframe.includes("2-4 weeks")) score += 20;
    if(state.data.leadVolume.includes("30+")) score += 15;
    if(state.data.challenge.includes("Missing calls")) score += 20;
    if(state.data.businessType && !state.data.businessType.includes("Other")) score += 10;
    return Math.min(score, 100);
  }

  function getPriority(){
    const score = calculateLeadScore();
    if(score >= 70) return "HIGH";
    if(score >= 40) return "MEDIUM";
    return "LOW";
  }

  // Free text support
  function handleFreeText(){
    const v = freeText.value.trim(); 
    if(!v) return; 
    freeText.value='';
    handleChoice(v);
  }

  // ====== EVENT WIRES ======
  if(launcher) {
    launcher.addEventListener('click', ()=>{
      const isOpen = panel.style.display === 'flex';
      panel.style.display = isOpen ? 'none' : 'flex';
      
      if(!isOpen && chat.childElementCount === 0) {
        setTimeout(start, 500); // Small delay for smooth animation
      }
    });
  }

  if(sendBtn) {
    sendBtn.addEventListener('click', handleFreeText);
  }
  
  if(freeText) {
    freeText.addEventListener('keydown', (e)=>{ 
      if(e.key === 'Enter'){ 
        e.preventDefault(); 
        handleFreeText(); 
      } 
    });
  }

  // Enhanced auto-open logic
  if(!sessionStorage.getItem('sg_chatbot_seen')){
    setTimeout(()=>{ 
      // Add a subtle shake animation to draw attention
      if(launcher) {
        launcher.style.animation = 'pulse 1s ease-in-out 3';
        
        setTimeout(() => {
          launcher.click(); 
          sessionStorage.setItem('sg_chatbot_seen', Date.now());
        }, 1000);
      }
    }, 6000); // Wait 6 seconds before auto-opening
  }

  // Track engagement for analytics
  function trackEvent(eventName, data = {}){
    if(typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'SmartGrowth_ChatWidget',
        ...data
      });
    }
    console.log(`Analytics: ${eventName}`, data);
  }

  // Track widget interactions
  if(launcher) {
    launcher.addEventListener('click', () => trackEvent('widget_opened'));
  }
  
  // Track when user completes flow
  window.addEventListener('beforeunload', () => {
    if(state.data.email) {
      trackEvent('lead_qualified', {
        business_type: state.data.businessType,
        lead_score: calculateLeadScore(),
        priority: getPriority()
      });
    }
  });

})();