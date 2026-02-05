import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import ScenarioSimulator from './components/ScenarioSimulator';

const CONFIG = {
    WEBHOOK_URL: 'https://ow-chatbot-demo.app.n8n.cloud/webhook/manufacturing-advisor',
    DEMO_MODE: false,
    SHOW_SIMULATOR: true,
};

function App() {
    const [activeTab, setActiveTab] = useState('chat');
    const [showAgentLayers, setShowAgentLayers] = useState(true);
    const [sessionId, setSessionId] = useState(() => crypto.randomUUID());

    const handleNewChat = () => {
        setSessionId(crypto.randomUUID());
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
        <header className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-black/20 backdrop-blur-xl sticky top-0 z-[100] supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-500" />
                    <div className="relative w-12 h-12 bg-black rounded-xl flex items-center justify-center border border-white/10 shadow-2xl overflow-hidden">
                        <img src="/dhow-mark.png" alt="Dhow" className="w-full h-full object-cover" />
                    </div>
                </div>
                <div>
                    <h1 className="font-display font-medium text-2xl tracking-tight text-white">Dhow</h1>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] uppercase tracking-widest font-bold text-primary/80">By Oliver Wyman</span>
                    </div>
                </div>
            </div>     <div className="flex items-center gap-4">
                    {activeTab === 'chat' && (
                        <button
                            onClick={handleNewChat}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/20 active:scale-95"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                            New Chat
                        </button>
                    )}

                    {CONFIG.SHOW_SIMULATOR && (
                        <div className="flex bg-black/20 rounded-xl p-1 border border-white/5">
                            {['chat', 'simulator'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                    px-5 py-2 rounded-lg text-[13px] font-medium transition-all duration-300 relative
                    ${activeTab === tab ? 'text-white' : 'text-muted-foreground hover:text-white'}
                  `}
                                >
                                    {activeTab === tab && (
                                        <div className="absolute inset-0 bg-white/10 rounded-lg shadow-sm backdrop-blur-sm" />
                                    )}
                                    <span className="relative z-10 flex items-center gap-2">
                                        {tab === 'chat' ? '💬 Chat' : '📊 Simulator'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'chat' && (
                        <button
                            onClick={() => setShowAgentLayers(!showAgentLayers)}
                            className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all border
                ${showAgentLayers
                                    ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                                    : 'bg-white/5 border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10'}
              `}
                        >
                            <span className="relative flex h-2 w-2">
                                {showAgentLayers && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />}
                                <span className={`relative inline-flex rounded-full h-2 w-2 ${showAgentLayers ? 'bg-primary' : 'bg-muted-foreground'}`} />
                            </span>
                            AI Reasoning
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative z-10">
                {activeTab === 'simulator' ? (
                    <ScenarioSimulator />
                ) : (
                    <ChatInterface
                        key={sessionId}
                        sessionId={sessionId}
                        config={CONFIG}
                        showAgentLayers={showAgentLayers}
                        onToggleLayers={() => setShowAgentLayers(!showAgentLayers)}
                    />
                )}
            </main>
        </div>
    );
}

export default App;
