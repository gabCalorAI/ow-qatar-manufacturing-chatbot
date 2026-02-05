import React, { useState, useRef, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useToast } from './Toast';

// ============================================
// HELPERS & MOCK DATA
// ============================================

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
            type="button"
            onClick={toggleListening}
            className={`
        w-11 h-11 border rounded-2xl flex items-center justify-center transition-all duration-200
        ${isListening ? 'bg-red-500/20 border-red-500 animate-pulse text-red-500' : 'bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/10 hover:text-primary'}
      `}
            title="Voice input"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
        </button>
    );
};

const AgentThinking = ({ layers, isExpanded, onToggle }) => (
    <div className="mt-4">
        <button
            onClick={onToggle}
            className="group flex items-center gap-2 w-full p-2.5 bg-black/20 border border-dashed border-white/10 hover:border-primary/30 rounded-xl text-xs text-muted-foreground cursor-pointer transition-all hover:bg-black/30 hover:text-primary"
        >
            <span className="text-[10px] group-hover:scale-110 transition-transform">{isExpanded ? '▼' : '▶'}</span>
            <span className="font-medium">View AI reasoning process</span>
            <span className="ml-auto flex gap-1.5 opacity-75 group-hover:opacity-100 transition-opacity">
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Analyst</span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Strategist</span>
                <span className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-primary/10 text-primary border border-primary/20">Executive</span>
            </span>
        </button>
        {isExpanded && (
            <div className="mt-3 grid gap-3 animate-fadeIn">
                <div className="bg-black/20 rounded-xl p-4 border-l-2 border-primary/30 hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base p-1.5 bg-white/5 rounded-lg">🔍</span>
                        <span className="font-semibold text-sm text-white">Research Analyst</span>
                        <span className="ml-auto text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded-lg border border-white/5">Data & Evidence</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono opacity-90">{layers.analyst}</div>
                </div>
                <div className="bg-black/20 rounded-xl p-4 border-l-2 border-purple-500/30 hover:border-purple-500/50 transition-colors">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-base p-1.5 bg-white/5 rounded-lg">💡</span>
                        <span className="font-semibold text-sm text-white">Strategy Consultant</span>
                        <span className="ml-auto text-[10px] text-muted-foreground bg-white/5 px-2 py-1 rounded-lg border border-white/5">Synthesis & Recommendations</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap font-mono opacity-90">{layers.strategist}</div>
                </div>
            </div>
        )}
    </div>
);

const SmartFollowUps = ({ suggestions, onSelect }) => (
    <div className="mt-5 pt-4 border-t border-white/5">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 block mb-3 font-semibold">Suggested follow-ups:</span>
        <div className="flex flex-wrap gap-2.5">
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => onSelect(s)}
                    className="bg-white/5 border border-white/5 hover:border-primary/30 px-4 py-2.5 rounded-2xl text-muted-foreground text-xs cursor-pointer transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
                >
                    {s}
                </button>
            ))}
        </div>
    </div>
);

const GenerateDeckButton = ({ topic, context, isDemo, webhookUrl }) => {
    const [status, setStatus] = useState('idle'); // idle, generating, done
    const { addToast } = useToast();

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
            const response = await fetch(`${webhookUrl}/generate-deck`, {
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
            a.click();
            setStatus('done');
            addToast("Deck generated successfully!", "success");
        } catch (e) {
            console.error(e);
            console.error(e);
            setStatus('idle');
            addToast("Failed to generate deck. Please try again.", "error");
        }
    };

    return (
        <button
            onClick={handleGenerate}
            disabled={status === 'generating'}
            className="flex items-center gap-2 mt-4 px-4 py-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-[13px] font-medium cursor-pointer transition-all hover:bg-primary/15 hover:border-primary/30 disabled:opacity-60 disabled:cursor-not-allowed group w-full sm:w-auto justify-center"
        >
            {status === 'generating' ? (
                <>
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></span>
                    Generating deck...
                </>
            ) : status === 'done' ? (
                <>✓ Deck ready!</>
            ) : (
                <>
                    <span className="group-hover:-translate-y-0.5 transition-transform">📊</span>
                    Generate PowerPoint Presentation
                </>
            )}
        </button>
    );
};

const SourceCard = ({ title, author }) => (
    <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded-xl mb-2 hover:bg-black/30 transition-colors cursor-default border border-transparent hover:border-white/5">
        <span className="text-base p-1.5 bg-white/5 rounded-lg">📊</span>
        <div>
            <div className="text-xs font-medium text-foreground">{title}</div>
            {author && <div className="text-[10px] text-muted-foreground">{author}</div>}
        </div>
    </div>
);

const Message = ({ role, content, layers, sources, followUps, onFollowUp, showLayers, config }) => {
    const [layersExpanded, setLayersExpanded] = useState(false);

    const formatContent = (text) => {
        let formatted = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-primary font-semibold">$1</strong>');
        formatted = formatted.replace(/\n\n/g, '</p><p class="mb-3 last:mb-0">');
        formatted = formatted.replace(/\n/g, '<br/>');
        return DOMPurify.sanitize(`<p class="mb-3 last:mb-0">${formatted}</p>`, { 
            ADD_ATTR: ['class', 'target'], 
            ADD_TAGS: ['p', 'strong', 'br'] 
        });
    };

    return (
        <div className={`flex gap-4 mb-8 animate-fadeIn items-end ${role === 'user' ? 'justify-end' : ''}`}>
            {role === 'assistant' && (
                <div className="relative group flex-shrink-0">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition duration-500" />
                    <div className="relative w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
                        <img src={`${import.meta.env.BASE_URL}dhow-mark.png`} alt="Dhow" className="w-full h-full object-cover" />
                    </div>
                </div>
            )}
            <div className={`
        relative p-5 max-w-[90%] md:max-w-[85%] shadow-xl
        ${role === 'user'
                    ? 'bg-gradient-to-br from-primary to-blue-600 rounded-[24px_24px_4px_24px] text-white max-w-[70%]'
                    : 'glass-panel rounded-[4px_24px_24px_24px]'}
      `}>
                <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatContent(content) }}
                />

                {role === 'assistant' && layers && showLayers && (
                    <AgentThinking
                        layers={layers}
                        isExpanded={layersExpanded}
                        onToggle={() => setLayersExpanded(!layersExpanded)}
                    />
                )}

                {role === 'assistant' && sources && showLayers && (
                    <div className="mt-5 pt-4 border-t border-white/5">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 block mb-3 font-semibold">Sources referenced:</span>
                        {sources.map((s, i) => <SourceCard key={i} title={s.documentTitle || s.title} author={s.author} />)}
                    </div>
                )}

                {role === 'assistant' && (
                    <GenerateDeckButton
                        topic="Qatar Manufacturing Analysis"
                        context={content}
                        isDemo={config.DEMO_MODE}
                        webhookUrl={config.WEBHOOK_URL}
                    />
                )}

                {role === 'assistant' && followUps && (
                    <SmartFollowUps suggestions={followUps} onSelect={onFollowUp} />
                )}
            </div>
            {role === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/5 self-end">
                    <span className="text-sm font-medium text-white/80">You</span>
                </div>
            )}
        </div>
    );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function ChatInterface({ config, showAgentLayers = true, onToggleLayers, sessionId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef(null);
    const { addToast } = useToast();

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        setShowWelcome(false);
        setMessages(prev => [...prev, { role: 'user', content: text }]);
        setInput('');
        setIsLoading(true);

        let responseData;

        // Simulate API call for Demo Mode
        if (config.DEMO_MODE) {
            await new Promise(r => setTimeout(r, 2000));
            responseData = getResponseData(text);
        } else {
            // Real API Call
            try {
                const res = await fetch(config.WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        message: text,
                        sessionId: sessionId 
                    })
                });
                const data = await res.json();
                
                const responseItem = Array.isArray(data) ? data[0] : data;
                
                responseData = {
                    data: {
                        executive: responseItem.response || responseItem.message || responseItem[""] || "No response text found",
                        analyst: responseItem.layers?.analyst || "No analysis provided",
                        strategist: responseItem.layers?.strategist || "No strategy provided"
                    },
                    topic: 'default',
                    sources: responseItem.sources || [],
                    suggestedFollowUps: responseItem.suggestedFollowUps || []
                };
            } catch (e) {
                console.error("API Error", e);
                // Fallback
                responseData = getResponseData(text);
                responseData.data.executive = "Error connecting to backend. Showing fallback data.\n\n" + responseData.data.executive;
                addToast("Connection error. Using offline mode.", "error");
            }
        }

        const sources = responseData.sources || [];
        const followUps = responseData.suggestedFollowUps || getFollowUps(responseData.topic);

        setMessages(prev => [...prev, {
            role: 'assistant',
            content: responseData.data.executive,
            layers: { analyst: responseData.data.analyst, strategist: responseData.data.strategist, executive: responseData.data.executive },
            sources,
            followUps
        }]);

        setIsLoading(false);
    };

    return (
        <div className="flex flex-col flex-1 max-w-[900px] w-full mx-auto px-4 sm:px-6 relative z-10">
            {showWelcome && messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 animate-fadeIn">
                    <div className="relative group mb-10">
                         <div className="absolute -inset-1 bg-gradient-to-br from-primary via-purple-500 to-blue-600 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
                         <div className="w-[100px] h-[100px] bg-black rounded-[24px] flex items-center justify-center border border-white/10 shadow-2xl relative z-10 overflow-hidden">
                            <img src={`${import.meta.env.BASE_URL}dhow-mark.png`} alt="Dhow Logo" className="w-full h-full object-cover" />
                         </div>
                    </div>
                    <h1 className="font-display font-medium text-4xl text-white mb-3 tracking-tight">Dhow</h1>
                    <p className="text-xl text-primary font-light mb-8 italic">
                        Light the way
                    </p>
                    <p className="text-base text-muted-foreground max-w-[600px] leading-relaxed mb-10">
                        Your intelligent partner for manufacturing strategy in Qatar.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[650px] w-full">
                        {[
                            "What is the manufacturing skills gap in Qatar?",
                            "Tell me about Qatar's food security achievements after the blockade",
                            "What are the 9 strategic enablers in Qatar's manufacturing strategy?",
                            "How does Qatar's Industry 4.0 adoption compare to UAE?"
                        ].map((q, i) => (
                            <button
                                key={i}
                                onClick={() => sendMessage(q)}
                                className="bg-white/5 border border-white/5 px-6 py-4 rounded-2xl text-muted-foreground text-[13px] text-left cursor-pointer transition-all hover:bg-white/10 hover:border-white/10 hover:text-white hover:scale-[1.02] hover:shadow-lg active:scale-95"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto py-8 space-y-6">
                    {messages.map((msg, i) => (
                        <Message
                            key={i}
                            {...msg}
                            showLayers={showAgentLayers}
                            onFollowUp={sendMessage}
                            config={config}
                        />
                    ))}
                    {isLoading && (
                        <div className="flex gap-4 mb-6 animate-fadeIn items-end">
                            <div className="relative group flex-shrink-0">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-40 animate-pulse" />
                                <div className="relative w-10 h-10 bg-black rounded-xl flex items-center justify-center border border-white/10 shadow-lg overflow-hidden">
                                    <img src={`${import.meta.env.BASE_URL}dhow-mark.png`} alt="Dhow" className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 p-5 glass-panel rounded-[4px_24px_24px_24px]">
                                <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-2 h-2 bg-primary/80 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            <div className="py-6 pt-2 sticky bottom-0">
                <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-[28px] opacity-20 group-hover:opacity-40 transition-opacity blur"></div>
                    <div className="relative flex gap-3 bg-[#0a0f1c]/80 backdrop-blur-xl border border-white/10 rounded-[26px] p-2 pl-6 shadow-2xl transition-colors focus-within:border-primary/50">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about Qatar's manufacturing sector..."
                            disabled={isLoading}
                            className="flex-1 bg-transparent border-none text-white text-base outline-none placeholder:text-muted-foreground/50 py-2.5"
                        />
                        <div className="flex items-center gap-2 pr-2">
                             <VoiceInput
                                onTranscript={setInput}
                                isListening={isListening}
                                setIsListening={setIsListening}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !input.trim()}
                                className="w-11 h-11 bg-gradient-to-br from-primary to-blue-600 rounded-2xl cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 transition-all shadow-md active:scale-95"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5 ml-0.5">
                                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
