import React, { useState, useRef, useEffect } from 'react';

// ============================================
// ENHANCED QATAR MANUFACTURING ADVISOR
// Features: Multi-agent display, smart follow-ups, voice input, deck generation
// ============================================

const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';
const DEMO_MODE = true;

// Mock responses with layers (simulating multi-agent chain)
const mockResponses = {
  default: {
    executive: `The biggest opportunity in Qatar manufacturing is the **combination of technology adoption and workforce upskilling**, which could add **QAR 11.3 billion to GDP over 5 years**.

Currently, Qatar's manufacturing productivity is 34% below GCC benchmarks, and Industry 4.0 adoption sits at just 18% compared to 45% in UAE. However, our analysis of 127 firms shows this gap can be closed rapidly with the right interventions.

The recommended approach: start with lean manufacturing basics in the top 50 firms (achievable in 12 months, $50-100K per firm), then scale digital transformation. This creates **QAR 400-750M in quick wins** while building the foundation for larger programs.

The key enabler is talent — you'll need 2,400 digital technicians by 2028. Would you like me to detail the talent pipeline or dive into specific sectors?`,
    
    analyst: `**Research Findings:**
• Manufacturing GDP: QAR 62.3B (9.2% of non-hydrocarbon GDP)
• QNV 2030 target: 15% of non-hydrocarbon GDP
• Current productivity: 34% below GCC, 52% below global best-in-class
• I4.0 adoption: 18% (UAE: 45%, Singapore: 67%)
• Lean manufacturing adoption: Only 23% of firms
• Skills gap: 89% of executives cite as critical barrier
• Potential impact of tech + skills: QAR 11.3B over 5 years

**Data Gaps:**
• Firm-level adoption readiness not fully assessed
• ROI data limited to 12 pilot implementations

**Confidence Level:** High (±10%) — based on direct Qatar survey data`,

    strategist: `**Strategic Insights:**
1. The productivity-technology gap represents the largest addressable opportunity
2. Quick wins are available through lean basics before digital transformation
3. Talent is the binding constraint — must be addressed in parallel

**Recommended Interventions:**
1. **Phase 1 (0-12 months):** Lean Manufacturing Acceleration
   - Target: Top 50 firms by revenue
   - Investment: $2.5-5M total
   - Expected outcome: +15-25pp OEE, +20-30% labor productivity
   
2. **Phase 2 (6-24 months):** Digital Foundation
   - ERP modernization, data infrastructure
   - Investment: $150-300M across sector
   
3. **Phase 3 (12-36 months):** I4.0 Scale-up
   - Predictive quality, digital twins, AI/ML
   - Investment: $400-600M

**GDP Impact Estimate:**
- Year 1: +QAR 0.4-0.75B
- Year 3: +QAR 3.5B cumulative
- Year 5: +QAR 11.3B cumulative

**Implementation Considerations:**
- Government co-investment critical (proposed 50/50 model)
- Talent pipeline must start immediately
- Risk: Fragmented adoption without coordination mechanism`
  },
  
  food: {
    executive: `**Food & Beverage is Qatar's highest-growth manufacturing opportunity**, with potential to add **QAR 9.3 billion to GDP and create 28,000 jobs** in the aggressive scenario.

The strategic logic is compelling: Qatar imports 90% of its food, making food security a national priority. Yet local F&B manufacturing operates at only 61% capacity utilization, and export penetration is 12% versus 34% GCC average.

Our recommended strategy is the **"Halal Hub"** — position Qatar as the premium halal processing center for GCC exports. This requires $2.1B investment over 5 years, primarily in cold chain infrastructure ($340M) and processing capacity expansion.

The economics work: competitive energy costs ($0.03/kWh), strategic location, and premium positioning offset higher labor costs. Want me to break down the investment requirements or discuss the regulatory enablers?`,
    
    analyst: `**Research Findings:**
• F&B establishments: 89 registered
• Current output: $2.8B annually
• Capacity utilization: 61%
• Export penetration: 12% (vs. 34% GCC average)
• Food import dependency: 90%
• Post-harvest loss: 18% (cold chain gap)
• Talent need: 2,400 food scientists/technicians by 2028
• Competitive advantage: $0.03/kWh energy cost

**Growth Scenarios:**
| Scenario | Investment | 5-Year GDP | Jobs |
|----------|------------|------------|------|
| Baseline | $0 | +QAR 1.2B | 3,200 |
| Moderate | $800M | +QAR 4.8B | 12,500 |
| Aggressive | $2.1B | +QAR 9.3B | 28,000 |

**Data Gaps:**
• Detailed competitive analysis vs. UAE food hubs
• Consumer preference data for halal premium products

**Confidence Level:** Medium (±25%) — based on GCC comparables`,

    strategist: `**Strategic Insights:**
1. Food security mandate creates natural demand pull
2. Halal certification provides differentiation vs. regional competitors
3. Current underutilization means quick capacity gains possible

**Recommended "Halal Hub" Strategy:**
1. **Cold Chain Infrastructure** ($340M)
   - Reduce 18% post-harvest loss
   - Enable premium product quality
   
2. **Processing Capacity** ($1.2B)
   - Focus: Dairy, protein, prepared foods
   - Target: Premium/organic segments
   
3. **Vertical Integration** ($400M)
   - Partner with Qatar farms
   - Reduce input cost volatility
   
4. **Regulatory Enablement** (Policy)
   - Reduce licensing from 14 months to 3 months
   - Establish halal certification center

**GDP Impact Estimate:**
- Conservative: +QAR 4.8B (5 years)
- Aggressive: +QAR 9.3B (5 years)
- Sector transformation: $2.8B → $12B+ by 2030

**Implementation Considerations:**
- Government must lead regulatory reform
- Private sector co-investment needed
- Risk: Regional competition (UAE, Saudi) accelerating`
  }
};

// Smart follow-up suggestions based on context
const getFollowUps = (topic) => {
  const followUps = {
    default: [
      "Break down the talent pipeline",
      "Compare to UAE and Saudi",
      "What's the implementation roadmap?",
      "Show me the F&B opportunity"
    ],
    food: [
      "What's the investment breakdown?",
      "How do we compete with UAE?",
      "Detail the cold chain requirements",
      "Show me the regulatory blockers"
    ],
    productivity: [
      "Which firms should we target first?",
      "What does the lean program look like?",
      "How do we measure success?",
      "Connect this to digital transformation"
    ],
    technology: [
      "Show me the ROI by use case",
      "What's the talent requirement?",
      "How do other GCC countries compare?",
      "What's the quick win?"
    ]
  };
  return followUps[topic] || followUps.default;
};

const getResponseData = (message) => {
  const lower = message.toLowerCase();
  if (lower.includes('food') || lower.includes('beverage') || lower.includes('f&b') || lower.includes('halal')) {
    return { data: mockResponses.food, topic: 'food' };
  }
  return { data: mockResponses.default, topic: 'default' };
};

// ============================================
// COMPONENTS
// ============================================

const VoiceInput = ({ onTranscript, isListening, setIsListening }) => {
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);
  
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null;
  }
  
  return (
    <button 
      onClick={toggleListening}
      className={`voice-btn ${isListening ? 'listening' : ''}`}
      title="Voice input"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    </button>
  );
};

const AgentThinking = ({ layers, isExpanded, onToggle }) => (
  <div className="agent-layers">
    <button onClick={onToggle} className="layers-toggle">
      <span className="toggle-icon">{isExpanded ? '▼' : '▶'}</span>
      <span>View AI reasoning process</span>
      <span className="agent-badges">
        <span className="badge analyst">Analyst</span>
        <span className="badge strategist">Strategist</span>
        <span className="badge executive">Executive</span>
      </span>
    </button>
    {isExpanded && (
      <div className="layers-content">
        <div className="layer">
          <div className="layer-header">
            <span className="layer-icon">🔍</span>
            <span className="layer-title">Research Analyst</span>
            <span className="layer-tag">Data & Evidence</span>
          </div>
          <div className="layer-body">{layers.analyst}</div>
        </div>
        <div className="layer">
          <div className="layer-header">
            <span className="layer-icon">💡</span>
            <span className="layer-title">Strategy Consultant</span>
            <span className="layer-tag">Synthesis & Recommendations</span>
          </div>
          <div className="layer-body">{layers.strategist}</div>
        </div>
      </div>
    )}
  </div>
);

const SmartFollowUps = ({ suggestions, onSelect }) => (
  <div className="smart-followups">
    <span className="followups-label">Suggested follow-ups:</span>
    <div className="followups-list">
      {suggestions.map((s, i) => (
        <button key={i} onClick={() => onSelect(s)} className="followup-chip">
          {s}
        </button>
      ))}
    </div>
  </div>
);

const GenerateDeckButton = ({ topic, context, isDemo }) => {
  const [status, setStatus] = useState('idle'); // idle, generating, done
  
  const handleGenerate = async () => {
    setStatus('generating');
    
    // In demo mode, just simulate
    if (isDemo) {
      await new Promise(r => setTimeout(r, 2000));
      setStatus('done');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }
    
    // Real implementation would call n8n
    try {
      const response = await fetch(`${WEBHOOK_URL}/generate-deck`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, context, style: 'executive' })
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic.replace(/[^a-z0-9]/gi, '_')}_Analysis.pptx`;
      a.click();
      setStatus('done');
    } catch (e) {
      console.error(e);
      setStatus('idle');
    }
  };
  
  return (
    <button onClick={handleGenerate} disabled={status === 'generating'} className="generate-deck-btn">
      {status === 'generating' ? (
        <>
          <span className="spinner"></span>
          Generating deck...
        </>
      ) : status === 'done' ? (
        <>✓ Deck ready!</>
      ) : (
        <>📊 Generate PowerPoint</>
      )}
    </button>
  );
};

const SourceCard = ({ title }) => (
  <div className="source-card">
    <span className="source-icon">📊</span>
    <div className="source-info">
      <span className="source-title">{title}</span>
      <span className="source-type">Oliver Wyman Research</span>
    </div>
  </div>
);

const Message = ({ role, content, layers, sources, followUps, onFollowUp, showLayers }) => {
  const [layersExpanded, setLayersExpanded] = useState(false);
  
  const formatContent = (text) => {
    let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/\n\n/g, '</p><p>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return `<p>${formatted}</p>`;
  };

  return (
    <div className={`message ${role}`}>
      {role === 'assistant' && (
        <div className="avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      )}
      <div className="message-content">
        <div className="message-text" dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
        
        {role === 'assistant' && layers && showLayers && (
          <AgentThinking 
            layers={layers} 
            isExpanded={layersExpanded} 
            onToggle={() => setLayersExpanded(!layersExpanded)} 
          />
        )}
        
        {role === 'assistant' && sources && (
          <div className="sources">
            <span className="sources-label">Sources referenced:</span>
            {sources.map((s, i) => <SourceCard key={i} title={s.title} />)}
          </div>
        )}
        
        {role === 'assistant' && (
          <GenerateDeckButton 
            topic="Qatar Manufacturing Analysis" 
            context={content} 
            isDemo={DEMO_MODE}
          />
        )}
        
        {role === 'assistant' && followUps && (
          <SmartFollowUps suggestions={followUps} onSelect={onFollowUp} />
        )}
      </div>
    </div>
  );
};

// ============================================
// MAIN APP
// ============================================

export default function EnhancedQatarAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showAgentLayers, setShowAgentLayers] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setShowWelcome(false);
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsLoading(true);

    await new Promise(r => setTimeout(r, 2000));
    
    const { data, topic } = getResponseData(text);
    const sources = [
      { title: 'Qatar Manufacturing Competitiveness Assessment 2024' },
      { title: 'Digital Transformation Playbook' }
    ];
    
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: data.executive,
      layers: { analyst: data.analyst, strategist: data.strategist, executive: data.executive },
      sources,
      followUps: getFollowUps(topic)
    }]);
    
    setIsLoading(false);
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1c 0%, #1a1f35 50%, #0d1321 100%);
          font-family: 'DM Sans', sans-serif;
          color: #e8eaed;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          padding: 16px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10, 15, 28, 0.9);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo-section { display: flex; align-items: center; gap: 12px; }
        
        .logo {
          width: 38px; height: 38px;
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 16px; color: white;
        }
        
        .header-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: #fff; }
        .header-subtitle { font-size: 11px; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 1px; }
        
        .header-controls { display: flex; align-items: center; gap: 12px; }
        
        .toggle-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          color: #e8eaed;
          font-size: 12px;
          cursor: pointer;
        }
        
        .toggle-btn.active { background: rgba(0, 180, 216, 0.15); border-color: rgba(0, 180, 216, 0.3); color: #00b4d8; }
        
        .main-content { flex: 1; display: flex; flex-direction: column; max-width: 900px; width: 100%; margin: 0 auto; padding: 0 20px; }
        
        .welcome-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 40px 20px; }
        .welcome-icon { width: 70px; height: 70px; background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 119, 182, 0.2)); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; border: 1px solid rgba(0, 180, 216, 0.3); }
        .welcome-icon svg { width: 35px; height: 35px; color: #00b4d8; }
        .welcome-title { font-family: 'DM Serif Display', serif; font-size: 32px; color: #fff; margin-bottom: 12px; }
        .welcome-subtitle { font-size: 16px; color: rgba(255,255,255,0.6); max-width: 450px; line-height: 1.5; margin-bottom: 32px; }
        
        .suggested-questions { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; max-width: 550px; }
        .suggestion-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 10px 16px;
          border-radius: 20px;
          color: #e8eaed;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .suggestion-chip:hover { background: rgba(0, 180, 216, 0.15); border-color: rgba(0, 180, 216, 0.4); color: #00b4d8; }
        
        .messages-container { flex: 1; overflow-y: auto; padding: 24px 0; }
        
        .message { display: flex; gap: 12px; margin-bottom: 24px; animation: fadeIn 0.3s ease; }
        .message.user { justify-content: flex-end; }
        .message.user .message-content { background: linear-gradient(135deg, #0077b6, #00b4d8); border-radius: 16px 16px 4px 16px; max-width: 70%; }
        .message.assistant .message-content { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px 16px 16px 16px; max-width: 90%; }
        
        .avatar { width: 36px; height: 36px; background: linear-gradient(135deg, #00b4d8, #0077b6); border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .avatar svg { width: 18px; height: 18px; color: white; }
        
        .message-content { padding: 14px 18px; }
        .message-text { line-height: 1.65; font-size: 14px; }
        .message-text p { margin-bottom: 10px; }
        .message-text strong { color: #00b4d8; }
        
        .agent-layers { margin-top: 16px; }
        .layers-toggle {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 10px 14px;
          background: rgba(0,0,0,0.2);
          border: 1px dashed rgba(255,255,255,0.15);
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .layers-toggle:hover { border-color: rgba(0, 180, 216, 0.4); color: #00b4d8; }
        .toggle-icon { font-size: 10px; }
        .agent-badges { margin-left: auto; display: flex; gap: 6px; }
        .badge { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 500; }
        .badge.analyst { background: rgba(16, 185, 129, 0.2); color: #10b981; }
        .badge.strategist { background: rgba(99, 102, 241, 0.2); color: #818cf8; }
        .badge.executive { background: rgba(0, 180, 216, 0.2); color: #00b4d8; }
        
        .layers-content { margin-top: 12px; }
        .layer { background: rgba(0,0,0,0.15); border-radius: 10px; padding: 14px; margin-bottom: 10px; border-left: 3px solid rgba(255,255,255,0.2); }
        .layer-header { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
        .layer-icon { font-size: 16px; }
        .layer-title { font-weight: 600; font-size: 13px; }
        .layer-tag { margin-left: auto; font-size: 10px; color: rgba(255,255,255,0.4); background: rgba(255,255,255,0.05); padding: 2px 8px; border-radius: 8px; }
        .layer-body { font-size: 12px; color: rgba(255,255,255,0.7); line-height: 1.6; white-space: pre-wrap; }
        
        .sources { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); }
        .sources-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); display: block; margin-bottom: 10px; }
        .source-card { display: flex; align-items: center; gap: 10px; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 8px; margin-bottom: 6px; }
        .source-icon { font-size: 16px; }
        .source-title { font-size: 12px; font-weight: 500; color: #e8eaed; }
        .source-type { font-size: 10px; color: rgba(255,255,255,0.4); }
        
        .generate-deck-btn {
          display: flex; align-items: center; gap: 8px;
          margin-top: 14px; padding: 10px 16px;
          background: rgba(0, 180, 216, 0.1);
          border: 1px solid rgba(0, 180, 216, 0.25);
          border-radius: 10px;
          color: #00b4d8;
          font-size: 13px; font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .generate-deck-btn:hover { background: rgba(0, 180, 216, 0.2); }
        .generate-deck-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .spinner { width: 14px; height: 14px; border: 2px solid rgba(0, 180, 216, 0.3); border-top-color: #00b4d8; border-radius: 50%; animation: spin 0.8s linear infinite; }
        
        .smart-followups { margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.08); }
        .followups-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.4); display: block; margin-bottom: 10px; }
        .followups-list { display: flex; flex-wrap: wrap; gap: 8px; }
        .followup-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 14px;
          border-radius: 16px;
          color: rgba(255,255,255,0.8);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .followup-chip:hover { background: rgba(0, 180, 216, 0.15); border-color: rgba(0, 180, 216, 0.3); color: #00b4d8; }
        
        .input-container { padding: 16px 0 24px; position: sticky; bottom: 0; background: linear-gradient(to top, rgba(10, 15, 28, 1) 50%, transparent 100%); }
        .input-wrapper { display: flex; gap: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 6px 6px 6px 16px; }
        .input-wrapper:focus-within { border-color: rgba(0, 180, 216, 0.5); }
        .input-wrapper input { flex: 1; background: transparent; border: none; color: #e8eaed; font-size: 14px; outline: none; }
        .input-wrapper input::placeholder { color: rgba(255,255,255,0.3); }
        
        .voice-btn { width: 40px; height: 40px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .voice-btn svg { width: 18px; height: 18px; color: rgba(255,255,255,0.5); }
        .voice-btn:hover { border-color: rgba(0, 180, 216, 0.4); }
        .voice-btn:hover svg { color: #00b4d8; }
        .voice-btn.listening { background: rgba(239, 68, 68, 0.2); border-color: #ef4444; animation: pulse 1.5s infinite; }
        .voice-btn.listening svg { color: #ef4444; }
        
        .send-button { width: 40px; height: 40px; background: linear-gradient(135deg, #00b4d8, #0077b6); border: none; border-radius: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .send-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .send-button svg { width: 18px; height: 18px; color: white; }
        
        .loading-indicator { display: flex; gap: 6px; padding: 16px; }
        .loading-dot { width: 8px; height: 8px; background: #00b4d8; border-radius: 50%; animation: bounce 1.4s ease-in-out infinite; }
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-8px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
      `}</style>
      
      <header className="header">
        <div className="logo-section">
          <div className="logo">OW</div>
          <div>
            <div className="header-title">Manufacturing Sector Advisor</div>
            <div className="header-subtitle">Qatar Strategic Initiative • Enhanced</div>
          </div>
        </div>
        <div className="header-controls">
          <button 
            className={`toggle-btn ${showAgentLayers ? 'active' : ''}`}
            onClick={() => setShowAgentLayers(!showAgentLayers)}
          >
            🧠 {showAgentLayers ? 'Hide' : 'Show'} AI Reasoning
          </button>
        </div>
      </header>
      
      <div className="main-content">
        {showWelcome && messages.length === 0 ? (
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h1 className="welcome-title">Qatar Manufacturing Intelligence</h1>
            <p className="welcome-subtitle">
              Multi-agent AI analysis with transparent reasoning. Ask about productivity, technology, sectors, or GDP impact.
            </p>
            <div className="suggested-questions">
              {["What's the biggest GDP opportunity?", "Tell me about F&B potential", "How can we improve productivity?", "What's blocking digital adoption?"].map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="suggestion-chip">{q}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((msg, i) => (
              <Message 
                key={i} 
                {...msg} 
                showLayers={showAgentLayers}
                onFollowUp={sendMessage}
              />
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="avatar">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="loading-indicator">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        <div className="input-container">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Qatar's manufacturing sector..."
              disabled={isLoading}
            />
            <VoiceInput 
              onTranscript={setInput} 
              isListening={isListening} 
              setIsListening={setIsListening} 
            />
            <button type="submit" className="send-button" disabled={isLoading || !input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
