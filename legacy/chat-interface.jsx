import React, { useState, useRef, useEffect } from 'react';

// Configuration - Update this with your n8n webhook URL
const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';

// Mock responses for demo mode (when webhook isn't connected)
const DEMO_MODE = true; // Set to false when n8n is connected

const mockResponses = {
  default: `Based on our **Qatar Manufacturing Competitiveness Assessment 2024**, I can help you explore several high-impact areas.

The manufacturing sector currently contributes **QAR 62.3 billion** to Qatar's GDP (9.2% of non-hydrocarbon GDP), with a target to reach **15% by 2030** under the National Vision.

Our research has identified five key opportunity areas:

• **Labor productivity** — 78% of firms affected, QAR 8.2B potential impact
• **Technology adoption** — 71% of firms lag behind, QAR 6.8B potential  
• **Supply chain localization** — QAR 5.4B potential from import substitution
• **Skills & talent** — 89% cite as critical barrier, QAR 4.5B potential
• **Energy efficiency** — Quick wins available, QAR 3.1B potential

What specific challenge or sector would you like to explore? I can provide detailed diagnostics, intervention playbooks, and GDP impact projections.`,

  productivity: `**Productivity Gap Analysis**

Our assessment of 127 Qatar manufacturing firms reveals a significant opportunity. Current productivity levels are:
- **34% below GCC benchmarks**
- **52% below global best-in-class**

Despite $4.2B in capital investment over 5 years, labor productivity grew only 2.1% annually. Our diagnostic identified three root causes:

1. **Automation-skills mismatch** — Firms invested in equipment without corresponding workforce capabilities
2. **Fragmented systems** — Average firm uses 7+ disconnected digital platforms
3. **Limited lean adoption** — Only 23% of firms practice lean manufacturing

**Recommended Intervention: Lean Manufacturing Transformation**
- Timeline: 12 months
- Investment: $50-100K per firm
- Expected outcomes: +15-25pp OEE, +20-30% labor productivity
- **GDP impact: +QAR 8-15M per firm annually**

For the top 50 firms alone, this represents **QAR 400-750M in annual GDP contribution**.

Would you like me to detail the implementation roadmap, or explore how this connects to digital transformation?`,

  technology: `**Digital Transformation Opportunity**

Our Digital Manufacturing Maturity Index assessment of 84 Qatar manufacturers shows:

| Maturity Level | % of Firms |
|----------------|------------|
| Level 1: Basic (paper-based) | 42% |
| Level 2: Connected (ERP) | 31% |
| Level 3: Visible (IoT) | 18% |
| Level 4: Predictive (AI/ML) | 7% |
| Level 5: Autonomous | 2% |

For comparison: **UAE is at 45% I4.0 adoption, Singapore at 67%**.

**High-Impact Digital Use Cases:**

**1. Predictive Quality Control**
- Investment: $1.2M | Payback: 14 months
- Impact: 23-31% defect reduction, 15% material waste reduction
- Best for: Petrochemicals, building materials

**2. Energy Optimization**
- Investment: $650K | Payback: 18 months
- Impact: 8-15% energy cost reduction
- Best for: Cement, steel, aluminum

**3. Digital Twin**
- Investment: $2.4M | Payback: 26 months
- Impact: 12% throughput increase, 22% maintenance cost reduction

**Combined technology adoption could add QAR 6.8B to GDP** with a 2.2x economic multiplier.

Should I walk through the implementation roadmap or focus on a specific sector?`,

  food: `**Food & Beverage: Qatar's Hidden Growth Engine**

This sector represents the highest growth potential in Qatar manufacturing. The strategic context:
- Qatar imports **90% of food** — food security is a national priority
- 89 registered F&B establishments with only **61% capacity utilization**
- Export penetration at 12% vs. 34% GCC average

**Growth Scenarios:**

| Scenario | Investment | 5-Year GDP Impact | Jobs Created |
|----------|------------|-------------------|--------------|
| Baseline | $0 | +QAR 1.2B | 3,200 |
| Moderate | $800M | +QAR 4.8B | 12,500 |
| Aggressive | $2.1B | +QAR 9.3B | 28,000 |

**Our recommended strategy: "Halal Hub"**

Position Qatar as the premium halal processing center for GCC exports:

1. **Cold chain infrastructure** — $340M investment to reduce 18% post-harvest loss
2. **Vertical integration** — Partner with Qatar farms for integrated supply chains  
3. **Premium positioning** — Target organic, functional foods (higher margins)
4. **Regulatory streamlining** — Reduce licensing from 14 months to 3 months

**Key enablers needed:**
- 2,400 food scientists and technicians by 2028
- Leverage competitive energy costs ($0.03/kWh industrial rate)

This could transform F&B from a $2.8B sector to **$12B+ by 2030**.

Want me to detail the implementation phases or discuss the talent pipeline requirements?`,

  localization: `**Supply Chain Localization Opportunity**

Qatar currently imports **73% of intermediate manufacturing inputs**. Our analysis shows significant substitution potential:

**Key Finding:** 31% of current imports are "substitutable" with local production.

**Priority Categories for Localization:**
1. Packaging materials
2. Industrial gases
3. Precision components
4. Construction inputs

**Economic Impact:**
- Achieving 50% localization = **+QAR 5.4B GDP**
- Highest multiplier effect: **2.8x** (vs. 2.0-2.2x for other interventions)
- Lead time reduction: 45-60%

**Why the high multiplier?**
Localization creates cascading benefits:
- Direct production value
- Reduced import dependency (strategic resilience)
- Local supplier ecosystem development
- Wage income staying in Qatar

**Recommended Approach: Supplier Development Program**
- Phase 1: Spend analysis and opportunity mapping (3 months)
- Phase 2: Supplier identification and development (6 months)
- Phase 3: Qualification and onboarding (6 months)
- Phase 4: Performance management (ongoing)

**Investment per firm: $200-500K | GDP contribution: +QAR 2-8M annually**

Would you like to explore specific categories or discuss how government can enable this?`
};

function getResponse(message) {
  const lower = message.toLowerCase();
  if (lower.includes('productivity') || lower.includes('efficiency') || lower.includes('lean')) {
    return mockResponses.productivity;
  }
  if (lower.includes('technology') || lower.includes('digital') || lower.includes('industry 4.0') || lower.includes('ai') || lower.includes('iot')) {
    return mockResponses.technology;
  }
  if (lower.includes('food') || lower.includes('beverage') || lower.includes('f&b') || lower.includes('halal')) {
    return mockResponses.food;
  }
  if (lower.includes('supply chain') || lower.includes('localization') || lower.includes('import') || lower.includes('local')) {
    return mockResponses.localization;
  }
  return mockResponses.default;
}

const SourceCard = ({ title, type }) => (
  <div className="source-card">
    <div className="source-icon">
      {type === 'report' ? '📊' : '📈'}
    </div>
    <div className="source-info">
      <span className="source-title">{title}</span>
      <span className="source-type">Oliver Wyman Research</span>
    </div>
  </div>
);

const Message = ({ role, content, sources }) => {
  const formatContent = (text) => {
    // Convert markdown-style bold to spans
    let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Convert markdown tables to HTML
    if (formatted.includes('|')) {
      const lines = formatted.split('\n');
      let inTable = false;
      let tableHtml = '';
      let result = [];
      
      lines.forEach((line, i) => {
        if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableHtml = '<table class="data-table">';
          }
          if (line.includes('---')) return; // Skip separator row
          const cells = line.split('|').filter(c => c.trim());
          const isHeader = i === 0 || (i > 0 && lines[i-1] && !lines[i-1].includes('|'));
          const tag = tableHtml.includes('<tr>') ? 'td' : 'th';
          tableHtml += '<tr>' + cells.map(c => `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
        } else {
          if (inTable) {
            tableHtml += '</table>';
            result.push(tableHtml);
            tableHtml = '';
            inTable = false;
          }
          result.push(line);
        }
      });
      if (inTable) {
        tableHtml += '</table>';
        result.push(tableHtml);
      }
      formatted = result.join('\n');
    }
    // Convert bullet points
    formatted = formatted.replace(/^• (.+)$/gm, '<li>$1</li>');
    formatted = formatted.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
    // Convert line breaks
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
        <div 
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
        {sources && sources.length > 0 && (
          <div className="sources">
            <span className="sources-label">Sources referenced:</span>
            {sources.map((source, i) => (
              <SourceCard key={i} {...source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestedQuestions = ({ onSelect }) => {
  const questions = [
    "What's the biggest GDP opportunity?",
    "How can we improve productivity?",
    "Tell me about F&B potential",
    "What's blocking digital adoption?"
  ];
  
  return (
    <div className="suggested-questions">
      {questions.map((q, i) => (
        <button key={i} onClick={() => onSelect(q)} className="suggestion-chip">
          {q}
        </button>
      ))}
    </div>
  );
};

export default function QatarManufacturingAdvisor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    
    setShowWelcome(false);
    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText;
      
      if (DEMO_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        responseText = getResponse(text);
      } else {
        // Real API call to n8n
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: text,
            history: messages 
          })
        });
        const data = await response.json();
        responseText = data.response || data.message || data;
      }

      const sources = [
        { title: 'Qatar Manufacturing Competitiveness Assessment 2024', type: 'report' },
        { title: 'Digital Transformation Playbook', type: 'report' }
      ];

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseText,
        sources 
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I apologize, but I encountered an error processing your request. Please try again.' 
      }]);
    }
    
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0f1c 0%, #1a1f35 50%, #0d1321 100%);
          font-family: 'DM Sans', -apple-system, sans-serif;
          color: #e8eaed;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          padding: 20px 32px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10, 15, 28, 0.8);
          backdrop-filter: blur(20px);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .logo {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
          color: white;
        }
        
        .header-title {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #fff;
          letter-spacing: -0.5px;
        }
        
        .header-subtitle {
          font-size: 12px;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 2px;
        }
        
        .header-badge {
          background: rgba(0, 180, 216, 0.15);
          border: 1px solid rgba(0, 180, 216, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          color: #00b4d8;
          font-weight: 500;
        }
        
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          max-width: 900px;
          width: 100%;
          margin: 0 auto;
          padding: 0 24px;
        }
        
        .welcome-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 60px 20px;
        }
        
        .welcome-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(0, 180, 216, 0.2), rgba(0, 119, 182, 0.2));
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 32px;
          border: 1px solid rgba(0, 180, 216, 0.3);
        }
        
        .welcome-icon svg {
          width: 40px;
          height: 40px;
          color: #00b4d8;
        }
        
        .welcome-title {
          font-family: 'DM Serif Display', serif;
          font-size: 36px;
          color: #fff;
          margin-bottom: 16px;
          letter-spacing: -1px;
        }
        
        .welcome-subtitle {
          font-size: 17px;
          color: rgba(255,255,255,0.6);
          max-width: 500px;
          line-height: 1.6;
          margin-bottom: 40px;
        }
        
        .suggested-questions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          max-width: 600px;
        }
        
        .suggestion-chip {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 12px 20px;
          border-radius: 24px;
          color: #e8eaed;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }
        
        .suggestion-chip:hover {
          background: rgba(0, 180, 216, 0.15);
          border-color: rgba(0, 180, 216, 0.4);
          color: #00b4d8;
          transform: translateY(-2px);
        }
        
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 32px 0;
        }
        
        .message {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .message.user {
          justify-content: flex-end;
        }
        
        .message.user .message-content {
          background: linear-gradient(135deg, #0077b6, #00b4d8);
          border-radius: 20px 20px 4px 20px;
          max-width: 70%;
        }
        
        .message.assistant .message-content {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px 20px 20px 20px;
          max-width: 85%;
        }
        
        .avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .avatar svg {
          width: 20px;
          height: 20px;
          color: white;
        }
        
        .message-content {
          padding: 16px 20px;
        }
        
        .message-text {
          line-height: 1.7;
          font-size: 15px;
        }
        
        .message-text p {
          margin-bottom: 12px;
        }
        
        .message-text p:last-child {
          margin-bottom: 0;
        }
        
        .message-text strong {
          color: #00b4d8;
          font-weight: 600;
        }
        
        .message-text ul {
          margin: 12px 0;
          padding-left: 0;
          list-style: none;
        }
        
        .message-text li {
          padding: 6px 0 6px 24px;
          position: relative;
        }
        
        .message-text li:before {
          content: '→';
          position: absolute;
          left: 0;
          color: #00b4d8;
        }
        
        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 13px;
        }
        
        .data-table th {
          background: rgba(0, 180, 216, 0.15);
          padding: 10px 12px;
          text-align: left;
          font-weight: 600;
          color: #00b4d8;
          border-bottom: 1px solid rgba(0, 180, 216, 0.3);
        }
        
        .data-table td {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        
        .data-table tr:last-child td {
          border-bottom: none;
        }
        
        .sources {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        
        .sources-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.4);
          display: block;
          margin-bottom: 12px;
        }
        
        .source-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0,0,0,0.2);
          padding: 10px 14px;
          border-radius: 10px;
          margin-bottom: 8px;
          border: 1px solid rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .source-card:hover {
          background: rgba(0, 180, 216, 0.1);
          border-color: rgba(0, 180, 216, 0.2);
        }
        
        .source-icon {
          font-size: 20px;
        }
        
        .source-info {
          display: flex;
          flex-direction: column;
        }
        
        .source-title {
          font-size: 13px;
          font-weight: 500;
          color: #e8eaed;
        }
        
        .source-type {
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .input-container {
          padding: 20px 0 32px;
          background: linear-gradient(to top, rgba(10, 15, 28, 1) 0%, transparent 100%);
          position: sticky;
          bottom: 0;
        }
        
        .input-wrapper {
          display: flex;
          gap: 12px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 8px 8px 8px 20px;
          transition: all 0.2s ease;
        }
        
        .input-wrapper:focus-within {
          border-color: rgba(0, 180, 216, 0.5);
          background: rgba(255,255,255,0.08);
        }
        
        .input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: #e8eaed;
          font-size: 15px;
          font-family: inherit;
          outline: none;
        }
        
        .input-wrapper input::placeholder {
          color: rgba(255,255,255,0.3);
        }
        
        .send-button {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }
        
        .send-button:hover:not(:disabled) {
          transform: scale(1.05);
        }
        
        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .send-button svg {
          width: 20px;
          height: 20px;
          color: white;
        }
        
        .loading-indicator {
          display: flex;
          gap: 8px;
          padding: 20px;
        }
        
        .loading-dot {
          width: 8px;
          height: 8px;
          background: #00b4d8;
          border-radius: 50%;
          animation: bounce 1.4s ease-in-out infinite;
        }
        
        .loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .loading-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
      
      <header className="header">
        <div className="logo-section">
          <div className="logo">OW</div>
          <div>
            <div className="header-title">Manufacturing Sector Advisor</div>
            <div className="header-subtitle">Qatar Strategic Initiative</div>
          </div>
        </div>
        <div className="header-badge">AI-Powered Analysis</div>
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
              Explore strategic opportunities in Qatar's manufacturing sector. 
              Get instant analysis on productivity, technology adoption, and GDP impact potential.
            </p>
            <SuggestedQuestions onSelect={sendMessage} />
          </div>
        ) : (
          <div className="messages-container">
            {messages.map((msg, i) => (
              <Message key={i} {...msg} />
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
          <form onSubmit={handleSubmit} className="input-wrapper">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Qatar's manufacturing sector..."
              disabled={isLoading}
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
