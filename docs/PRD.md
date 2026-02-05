# Product Requirements Document
## Qatar Manufacturing Sector Advisor — AI Demo Platform

**Version:** 1.0  
**Date:** February 5, 2025  
**Author:** Strategy & AI Team  
**Client:** Oliver Wyman — Qatar Practice  
**Build Partner:** Antigravity  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Context](#2-project-context)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [System Architecture](#5-system-architecture)
6. [Files Already Built](#6-files-already-built)
7. [Feature Specifications](#7-feature-specifications)
8. [Data & Content](#8-data--content)
9. [Implementation Guide](#9-implementation-guide)
10. [Demo Script](#10-demo-script)
11. [Future Enhancements](#11-future-enhancements)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### What We're Building

An AI-powered manufacturing strategy advisor that demonstrates how artificial intelligence can augment consulting work. The platform allows users to ask natural language questions about Qatar's manufacturing sector and receive instant, data-backed strategic analysis.

### The Demo Story

> "Imagine having instant access to all our sector research. Ask any question about Qatar's manufacturing sector — the AI synthesizes our research, provides GDP impact projections, and recommends strategic interventions. In seconds, not hours."

### Key Differentiators

| Feature | Why It Matters |
|---------|----------------|
| **Multi-Agent Reasoning** | Shows AI "thinking process" (Analyst → Strategist → Executive) — builds trust through transparency |
| **Scenario Simulator** | Interactive GDP impact modeling with real-time calculations — demonstrates quantitative rigor |
| **Source Citations** | References mock OW reports — mimics real research-backed consulting |
| **Smart Follow-ups** | Context-aware suggested questions — guides conversation naturally |

### Timeline

- **Target completion:** 4 hours from start
- **Demo date:** TBD
- **Audience:** Oliver Wyman managers tasked with implementing AI in Qatar strategy work

---

## 2. Project Context

### Business Context

Oliver Wyman is exploring how AI can enhance their strategy consulting practice. The Qatar team has been asked by executives to demonstrate practical AI applications for their manufacturing sector work.

### Why Manufacturing in Qatar?

1. **Qatar National Vision 2030** — Government priority to diversify from hydrocarbons
2. **Clear metrics** — GDP impact, job creation, productivity gains are quantifiable
3. **Real consulting use case** — OW has actual engagements in this space
4. **Data availability** — Sufficient public/semi-public data to create realistic mock content

### What Success Looks Like

The demo should leave OW managers thinking:
- "This could make our consultants 10x faster at research synthesis"
- "Clients would pay for access to sector-specific AI advisors"
- "We should pilot this on a real engagement"

---

## 3. Goals & Success Metrics

### Primary Goals

| Goal | Measurement |
|------|-------------|
| Demonstrate AI value for consulting | Qualitative feedback from demo audience |
| Show feasibility of rapid AI deployment | Working demo built in <4 hours |
| Inspire follow-on investment | Request for pilot/POC after demo |

### Demo Success Criteria

- [ ] User can ask free-form questions and receive relevant, specific responses
- [ ] Responses include Qatar-specific statistics (QAR figures, percentages)
- [ ] Source citations visible and clickable
- [ ] Multi-agent reasoning expandable and coherent
- [ ] Scenario simulator produces believable GDP projections
- [ ] System feels responsive (<3 second perceived latency)
- [ ] Professional, polished visual design

---

## 4. User Personas

### Primary: OW Manager (Demo Audience)

**Profile:**
- Senior consultant or manager at Oliver Wyman
- Responsible for delivering Qatar manufacturing strategy work
- Skeptical but curious about AI
- Wants to see practical applications, not hype

**Needs:**
- Evidence that AI can handle nuanced strategy questions
- Confidence that AI won't hallucinate or embarrass them
- Clear path from demo to production use

**Objections to Address:**
- "Is this just a chatbot wrapper?"
- "Will it replace consultants?"
- "How accurate is it really?"

### Secondary: Qatar Government/Client (Future User)

**Profile:**
- Ministry of Commerce and Industry official
- Economic development authority executive
- Interested in data-driven policy recommendations

**Needs:**
- Instant access to sector intelligence
- Scenario modeling for policy decisions
- Credible, well-sourced analysis

---

## 5. System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Single HTML File (qatar-advisor-complete.html)          │    │
│  │  - React 18 (loaded from CDN)                            │    │
│  │  - Babel for JSX transformation                          │    │
│  │  - All styles inline                                     │    │
│  │  - Mock data embedded for demo mode                      │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  CONFIG Object (lines 14-18)                             │    │
│  │  - WEBHOOK_URL: n8n endpoint                             │    │
│  │  - DEMO_MODE: true/false                                 │    │
│  │  - SHOW_SIMULATOR: true/false                            │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ (if DEMO_MODE = false)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND (n8n)                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Webhook Node                                            │    │
│  │  - POST /qatar-advisor                                   │    │
│  │  - Receives: { message: string }                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  HTTP Request Node (Claude API)                          │    │
│  │  - Model: claude-sonnet-4-20250514                             │    │
│  │  - System prompt with Qatar manufacturing context        │    │
│  │  - Returns structured response                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Response Formatter                                      │    │
│  │  - Extracts content[0].text                              │    │
│  │  - Returns: { response: string, layers?: object }        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ANTHROPIC API                               │
│  - Claude claude-sonnet-4-20250514 model                                  │
│  - ~2000 token responses                                         │
│  - System prompt defines persona and knowledge base             │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Why |
|-------|------------|-----|
| Frontend | React 18 + Babel (CDN) | Zero build step, single HTML file |
| Styling | Inline CSS | No external dependencies |
| Fonts | Google Fonts (DM Sans, DM Serif Display) | Professional, distinctive typography |
| Backend | n8n | Low-code, fast to configure |
| AI | Claude claude-sonnet-4-20250514 | Best balance of quality/speed/cost |
| Hosting | Local file / Vercel / Netlify | Flexible deployment options |

### Data Flow

```
User types question
        │
        ▼
[Frontend validates input]
        │
        ▼
[Check DEMO_MODE]
        │
        ├── true ──► [Match keywords to mock response]
        │                       │
        │                       ▼
        │            [Return mock data with 1.5s delay]
        │
        └── false ─► [POST to n8n webhook]
                            │
                            ▼
                    [n8n calls Claude API]
                            │
                            ▼
                    [Claude generates response]
                            │
                            ▼
                    [n8n formats and returns]
                            │
                            ▼
                    [Frontend displays with typing effect]
```

---

## 6. Files Already Built

### Complete File Inventory

```
qatar-manufacturing-demo/
│
├── qatar-advisor-complete.html    # ⭐ MAIN FILE - Complete working app
├── IMPLEMENTATION_GUIDE.md        # Step-by-step setup instructions
├── README.md                      # Project overview and quick start
│
├── Core Components/
│   ├── chat-interface.jsx         # Basic chat interface (React)
│   ├── enhanced-chat-interface.jsx # Full-featured chat (React)
│   └── scenario-simulator.jsx     # GDP impact simulator (React)
│
├── Backend/
│   ├── system-prompt.md           # Claude system prompt (copy to n8n)
│   ├── n8n-setup-guide.md         # n8n workflow configuration
│   └── multi-agent-workflow.md    # Advanced 3-agent chain setup
│
├── Content/
│   ├── mock-data.md               # All Qatar manufacturing data
│   └── auto-generate-deck.md      # PowerPoint generation feature
│
└── Documentation/
    └── PRD.md                     # This document
```

---

### File Details

#### 1. `qatar-advisor-complete.html` ⭐ PRIMARY DELIVERABLE

**Purpose:** Single-file, zero-dependency working application

**What It Contains:**
- Complete React application (~700 lines)
- All CSS styles inline
- Mock response data embedded
- Scenario simulator component
- Multi-agent reasoning display
- Configuration object for easy customization

**Key Sections:**

| Lines | Content |
|-------|---------|
| 1-13 | HTML head, CDN imports |
| 14-18 | **CONFIG object** — Edit these values |
| 20-120 | Mock response data (4 topic areas) |
| 122-140 | Follow-up suggestions logic |
| 142-270 | Scenario Simulator component |
| 272-320 | Agent Layers component (reasoning display) |
| 322-380 | Message component (chat bubbles) |
| 382-500 | Main App component |
| 502-530 | CSS keyframes and utilities |

**Configuration Options (lines 14-18):**
```javascript
const CONFIG = {
  WEBHOOK_URL: 'YOUR_N8N_WEBHOOK_URL_HERE', // n8n production URL
  DEMO_MODE: true,  // true = mock data, false = real API
  SHOW_SIMULATOR: true, // Show/hide simulator tab
};
```

**How to Use:**
1. Download the file
2. Double-click to open in browser
3. Works immediately in demo mode
4. Edit CONFIG to connect to real backend

---

#### 2. `enhanced-chat-interface.jsx`

**Purpose:** Standalone React component for use in existing React projects

**Features:**
- Multi-agent reasoning display (Analyst → Strategist → Executive)
- Voice input support (Web Speech API)
- Smart follow-up suggestions
- Generate PowerPoint button
- Source citation cards
- Loading animations

**Dependencies:**
- React 18+
- No other external dependencies

**Usage:**
```jsx
import QatarAdvisor from './enhanced-chat-interface';

function App() {
  return <QatarAdvisor />;
}
```

**Customization Points:**
- Line 4: `WEBHOOK_URL` — Your n8n endpoint
- Line 7: `DEMO_MODE` — Toggle mock/real responses
- Lines 10-145: `mockResponses` — Edit mock content
- Lines 147-165: `getFollowUps()` — Customize suggestions

---

#### 3. `scenario-simulator.jsx`

**Purpose:** Interactive GDP impact modeling tool

**Features:**
- 4 intervention sliders:
  - Lean Manufacturing Adoption (% of firms)
  - Industry 4.0 Investment (USD millions)
  - Import Substitution Target (%)
  - Workforce Training (# workers)
- Time horizon selector (3/5/7/10 years)
- Real-time GDP impact calculation
- Progress bar to QNV 2030 target
- Calculation methodology disclosure

**Calculation Logic (lines 17-50):**
```javascript
// GDP Impact Formula
const impacts = useMemo(() => {
  // Lean: firms × avg revenue × productivity gain × multiplier
  const leanImpact = leanFirms * 0.05 * 0.23 * 2.0;
  
  // Tech: investment × ROI × multiplier × years
  const techImpact = techInvestmentQAR * 0.15 * 2.2 * timeHorizon;
  
  // Localization: imports × target % × value capture × multiplier
  const localizationImpact = 45 * (target / 100) * 0.4 * 2.8;
  
  // Workforce: workers × productivity/worker × multiplier × years
  const workforceImpact = workers * 0.00005 * 2.0 * timeHorizon;
  
  return { lean, tech, localization, workforce, total };
}, [scenarios, timeHorizon]);
```

**GDP Multipliers Used:**
| Intervention | Multiplier | Source |
|--------------|------------|--------|
| Technology adoption | 2.2x | OW benchmarks |
| Lean transformation | 2.0x | OW benchmarks |
| Supply chain localization | 2.8x | OW benchmarks |
| Workforce development | 2.0x | OW benchmarks |

---

#### 4. `system-prompt.md`

**Purpose:** Complete system prompt for Claude API

**Contents:**
- AI persona definition (OW manufacturing expert)
- Complete Qatar manufacturing knowledge base
- Response formatting guidelines
- Citation instructions
- Example interaction

**Key Statistics Embedded:**
- Manufacturing GDP: QAR 62.3B (9.2% of non-hydrocarbon)
- Workforce: 185,000 employees
- Establishments: 1,247
- Productivity gap: 34% below GCC, 52% below global
- I4.0 adoption: 18% (vs UAE 45%, Singapore 67%)

**How to Use:**
1. Open `system-prompt.md`
2. Copy the entire content
3. Paste into n8n's Claude node "System" field

---

#### 5. `mock-data.md`

**Purpose:** Comprehensive reference document with all mock research data

**Sections:**
1. Qatar Manufacturing Landscape (statistics)
2. Mock OW Report 1: "Competitiveness Assessment 2024"
3. Mock OW Report 2: "F&B Manufacturing Growth Engine"
4. Mock OW Report 3: "Digital Transformation Playbook"
5. Intervention Playbooks (Lean, Localization, Workforce)
6. GDP Impact Calculator Methodology
7. FAQ Reference

**Use Cases:**
- Reference when customizing mock responses
- Source for additional data points
- Basis for expanding the knowledge base

---

#### 6. `n8n-setup-guide.md`

**Purpose:** Step-by-step instructions for building the n8n workflow

**Contents:**
- Webhook configuration
- Claude API HTTP request setup
- Response formatting
- Testing instructions
- Troubleshooting guide
- Importable workflow JSON

**Key Configuration:**

```json
// HTTP Request Node Body
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2048,
  "system": "[PASTE SYSTEM PROMPT HERE]",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.body.message }}"
    }
  ]
}
```

---

#### 7. `multi-agent-workflow.md`

**Purpose:** Advanced n8n setup for 3-agent reasoning chain

**Architecture:**
```
User Question
      ↓
[Agent 1: Research Analyst]
- Extracts relevant data
- Notes confidence levels
- Identifies gaps
      ↓
[Agent 2: Strategy Consultant]
- Interprets findings
- Recommends interventions
- Estimates GDP impact
      ↓
[Agent 3: Executive Summarizer]
- Synthesizes for leadership
- Leads with bottom line
- Clear next steps
      ↓
Combined Response (all layers visible)
```

**Benefits:**
- Transparency builds trust
- Mimics real consulting team structure
- Each layer can be inspected independently

---

#### 8. `auto-generate-deck.md`

**Purpose:** Specification for PowerPoint auto-generation feature

**Status:** Documented, not fully implemented (stretch goal)

**Concept:**
1. User gets chat response
2. Clicks "Generate Deck" button
3. AI creates slide structure as JSON
4. Service converts to .pptx file
5. User downloads ready-to-edit presentation

**Requires:**
- Additional microservice (Node.js + PptxGenJS)
- Or integration with Google Slides API

---

#### 9. `IMPLEMENTATION_GUIDE.md`

**Purpose:** Detailed setup instructions for developers

**Contents:**
- Phase 1: Frontend setup (3 options)
- Phase 2: n8n backend configuration
- Phase 3: Connecting frontend to backend
- Phase 4: Multi-agent chain (optional)
- Phase 5: Deployment options
- Troubleshooting guide
- Pre-demo checklist

---

#### 10. `README.md`

**Purpose:** Quick-start guide and project overview

**Contents:**
- What you're building
- File inventory
- Execution plan (3-hour breakdown)
- Demo script
- Talking points
- Customization options

---

## 7. Feature Specifications

### Feature 1: Chat Interface

**Description:** Natural language conversation with AI manufacturing expert

**User Flow:**
1. User sees welcome screen with suggested questions
2. User clicks suggestion or types custom question
3. Loading animation displays (3 dots bouncing)
4. AI response appears with:
   - Formatted text (bold highlights, paragraphs)
   - Source citations
   - Follow-up suggestions
5. User can continue conversation

**Technical Requirements:**
- Input field with placeholder text
- Send button (disabled when empty/loading)
- Message history display
- Auto-scroll to latest message
- Markdown-like formatting (bold, lists)

**Acceptance Criteria:**
- [ ] Can send message via button or Enter key
- [ ] Loading state prevents duplicate submissions
- [ ] Messages display with correct styling (user vs assistant)
- [ ] Sources show as clickable cards
- [ ] Follow-ups are contextually relevant

---

### Feature 2: Multi-Agent Reasoning Display

**Description:** Expandable view showing AI's reasoning process

**User Flow:**
1. AI response displays normally
2. User sees "View AI reasoning process" button
3. User clicks to expand
4. Two panels appear:
   - Research Analyst (data extraction)
   - Strategy Consultant (interpretation)
5. User can collapse to hide

**Technical Requirements:**
- Toggle button with expand/collapse state
- Smooth expand animation
- Distinct visual styling for each agent
- Preserve state across messages

**Acceptance Criteria:**
- [ ] Toggle works correctly (expand/collapse)
- [ ] Analyst and Strategist content displays
- [ ] Visual distinction between agents clear
- [ ] Can be globally disabled via header toggle

---

### Feature 3: Scenario Simulator

**Description:** Interactive tool for modeling GDP impact of interventions

**User Flow:**
1. User clicks "Simulator" tab in header
2. Simulator view replaces chat
3. User adjusts sliders:
   - Lean Manufacturing Adoption (0-80%)
   - Industry 4.0 Investment ($0-2000M)
   - Import Substitution (0-60%)
   - Workforce Training (0-20,000 workers)
4. User selects time horizon (3/5/7/10 years)
5. Right panel updates in real-time:
   - Total GDP impact
   - Jobs created
   - Impact breakdown by intervention
   - Progress to QNV 2030 target

**Technical Requirements:**
- Slider inputs with real-time value display
- Calculated values update on every change
- Progress bars for visual representation
- Methodology disclosure option

**Acceptance Criteria:**
- [ ] All 4 sliders functional
- [ ] Time horizon buttons work
- [ ] Calculations update immediately
- [ ] Numbers are formatted (commas, decimals)
- [ ] Progress bar reflects actual calculation

---

### Feature 4: Smart Follow-ups

**Description:** Context-aware suggested questions after each response

**User Flow:**
1. AI responds to user question
2. Below response, 4 follow-up suggestions appear
3. Suggestions are relevant to the topic discussed
4. User clicks a suggestion
5. That question is sent as next message

**Technical Requirements:**
- Topic detection from user message
- Mapping of topics to relevant follow-ups
- Clickable chip-style buttons
- Same behavior as typing the question

**Acceptance Criteria:**
- [ ] Follow-ups appear after assistant messages
- [ ] Suggestions change based on topic
- [ ] Clicking sends the question
- [ ] Visual styling matches design

---

### Feature 5: Demo Mode

**Description:** Fully functional offline mode using mock data

**User Flow:**
1. Application loads with `DEMO_MODE: true`
2. User interacts normally
3. Responses come from embedded mock data
4. Simulated 1.5s delay for realism

**Technical Requirements:**
- Keyword matching for response selection
- Comprehensive mock responses for 4+ topics
- Realistic delay simulation
- Fallback to default response if no match

**Acceptance Criteria:**
- [ ] Works without any backend/internet
- [ ] Responses feel natural and comprehensive
- [ ] Delay makes interaction feel realistic
- [ ] All features work (sources, follow-ups, layers)

---

## 8. Data & Content

### Mock Response Topics

| Topic | Trigger Keywords | Key Points |
|-------|-----------------|------------|
| **Default/Overview** | General questions, "opportunity", "biggest" | Tech + skills = QAR 11.3B, productivity gap, quick wins |
| **Food & Beverage** | "food", "beverage", "f&b", "halal" | Halal Hub strategy, QAR 9.3B potential, 28K jobs |
| **Productivity** | "productivity", "lean", "efficiency" | 34% below GCC, lean transformation, QAR 8.2B potential |
| **Technology** | "technology", "digital", "i4.0", "industry 4" | 18% vs 45% UAE, use cases, QAR 6.8B potential |

### Key Statistics Reference

```
Manufacturing Sector:
- GDP Contribution: QAR 62.3 billion
- % of non-hydrocarbon GDP: 9.2%
- QNV 2030 Target: 15%
- Workforce: 185,000
- Establishments: 1,247
- Exports: QAR 28.4 billion

Productivity:
- vs GCC benchmark: -34%
- vs Global best: -52%
- Lean adoption: 23% of firms
- I4.0 adoption: 18%

Challenges (% of firms affected):
- Skills & talent: 89%
- Labor productivity: 78%
- Technology adoption: 71%
- Supply chain: 65%
- Energy efficiency: 82%

GDP Impact Potential:
- Labor productivity: +QAR 8.2B
- Technology adoption: +QAR 6.8B
- Supply chain localization: +QAR 5.4B
- Skills development: +QAR 4.5B
- Energy efficiency: +QAR 3.1B

Food & Beverage:
- Establishments: 89
- Current output: $2.8B
- Capacity utilization: 61%
- Food import dependency: 90%
- Growth potential: up to QAR 9.3B (aggressive scenario)
```

### Source Citations

All responses should reference these mock reports:
1. "Qatar Manufacturing Competitiveness Assessment 2024"
2. "Food & Beverage Manufacturing: Qatar's Hidden Growth Engine"
3. "Digital Transformation Playbook for Qatar Manufacturing"

---

## 9. Implementation Guide

### Quick Start (5 minutes)

```bash
# 1. Download qatar-advisor-complete.html
# 2. Double-click to open in browser
# 3. Done! Demo mode works immediately
```

### Full Implementation (2-3 hours)

#### Hour 1: Backend Setup

**Step 1: Start n8n**
```bash
# Option A: Cloud
# Go to https://n8n.cloud, sign up

# Option B: Local
npx n8n
# Opens at http://localhost:5678
```

**Step 2: Create Workflow**

1. Add Webhook node
   - Method: POST
   - Path: `qatar-advisor`
   
2. Add HTTP Request node
   - Method: POST
   - URL: `https://api.anthropic.com/v1/messages`
   - Headers:
     - `x-api-key`: [Your Anthropic key]
     - `anthropic-version`: `2023-06-01`
     - `content-type`: `application/json`
   - Body: See `n8n-setup-guide.md`

3. Add Set node
   - Field: `response`
   - Value: `{{ $json.content[0].text }}`

4. Add Respond to Webhook node

5. Activate workflow

6. Copy Production URL

#### Hour 2: Connect Frontend

**Step 1: Edit HTML file**
```javascript
const CONFIG = {
  WEBHOOK_URL: 'https://your-n8n.app/webhook/qatar-advisor',
  DEMO_MODE: false,  // ← Change this
  SHOW_SIMULATOR: true,
};
```

**Step 2: Test**
- Refresh browser
- Send a message
- Verify real AI response

#### Hour 3: Polish & Test

- Test all suggested questions
- Verify simulator calculations
- Test agent reasoning toggle
- Practice demo flow
- Prepare backup (keep demo mode ready)

---

### Deployment Options

| Option | Effort | URL Type | Best For |
|--------|--------|----------|----------|
| Local file | None | `file://` | Demo on your laptop |
| CodeSandbox | 5 min | `csb.app/...` | Quick sharing |
| Vercel | 10 min | `project.vercel.app` | Production-ready |
| Netlify | 10 min | `project.netlify.app` | Production-ready |
| Client's infra | Varies | Custom | Long-term deployment |

---

## 10. Demo Script

### Recommended Flow (6-7 minutes)

#### Opening (30 seconds)

> "Imagine having instant access to all our sector research. Let me show you what that looks like."

*[Open the application, showing welcome screen]*

---

#### Scene 1: The Expert (2 minutes)

> "Watch what happens when I ask about opportunities in Qatar manufacturing..."

*[Click: "What's the biggest GDP opportunity?"]*

*[Wait for response]*

> "In seconds, we get a comprehensive analysis with specific numbers — QAR 11.3 billion in potential GDP impact, specific recommendations, and it's asking intelligent follow-up questions."

*[Point out: QAR figures, percentage gaps, recommended approach]*

---

#### Scene 2: The Transparency (1.5 minutes)

> "But here's what makes this different from a typical chatbot. Click here..."

*[Click: "View AI reasoning process"]*

> "We can see exactly how the AI reached its conclusion. First, a Research Analyst extracted the relevant data — productivity gaps, adoption rates, specific statistics. Then a Strategy Consultant synthesized this into recommendations with GDP impact estimates."

> "Full transparency. You can audit every step of the reasoning."

*[Collapse the layers]*

---

#### Scene 3: The Simulator (2 minutes)

> "Now let's say a client wants to model different scenarios. What if we increased lean adoption? What if we invested more in technology?"

*[Click: "Simulator" tab]*

> "This is an interactive scenario planner. Watch what happens when I drag lean manufacturing adoption from 30% to 60%..."

*[Drag slider, show GDP impact changing]*

> "We just added another 2 billion in projected GDP impact. And here — we can see progress toward the QNV 2030 target."

*[Point to progress bar]*

> "This kind of scenario modeling would normally take a team hours to build. Here, it's instant."

---

#### Scene 4: Deep Dive (1 minute)

*[Click back to Chat tab]*

> "Let me show you how it handles follow-up questions..."

*[Click: "Tell me about F&B potential"]*

*[Wait for response]*

> "Now we're getting sector-specific analysis — the Halal Hub strategy, investment requirements, job creation estimates. All grounded in our research."

---

#### Closing (30 seconds)

> "This is what AI-augmented consulting looks like. Your consultants get instant synthesis of research that would normally take hours. Every answer is specific, quantified, and traceable to sources."

> "The question isn't whether AI will transform strategy consulting — it's whether we lead that transformation or follow it."

---

### Handling Questions

| Question | Response |
|----------|----------|
| "Is this replacing consultants?" | "No — it's augmenting them. AI handles information retrieval; consultants do judgment, relationships, and execution. This makes good consultants great." |
| "How accurate is it?" | "It's as accurate as the research we put in. The AI doesn't hallucinate — it references our specific data and cites sources. For production, we'd connect it to our actual research repository." |
| "Can clients use this directly?" | "That's the opportunity. Imagine licensed access to sector-specific advisors as a new revenue stream. Or embedded in client portals for self-service insights." |
| "How long did this take to build?" | "This demo? About 4 hours. A production version with real data integration would take 2-4 weeks." |

---

## 11. Future Enhancements

### Phase 2: Production Pilot (2-4 weeks)

| Enhancement | Value | Effort |
|-------------|-------|--------|
| Real OW research integration | Actual data, not mock | High |
| RAG (retrieval augmented generation) | Dynamic document search | High |
| User authentication | Track usage, personalization | Medium |
| Conversation history | Resume previous chats | Medium |
| Export to PowerPoint | Auto-generate decks | Medium |

### Phase 3: Platform Scale (1-3 months)

| Enhancement | Value | Effort |
|-------------|-------|--------|
| Multi-sector support | Energy, Finance, Healthcare | High |
| Multi-language | Arabic support | Medium |
| Analytics dashboard | Usage metrics, popular topics | Medium |
| Client portal | White-label for clients | High |
| API access | Integration with other tools | Medium |

### Technical Debt to Address

- [ ] Move from single HTML to proper React build
- [ ] Add unit tests for calculations
- [ ] Implement proper error handling
- [ ] Add rate limiting
- [ ] Set up monitoring/logging
- [ ] CORS configuration for production
- [ ] Security audit

---

## 12. Appendix

### A. Glossary

| Term | Definition |
|------|------------|
| QNV 2030 | Qatar National Vision 2030 — government strategic plan |
| I4.0 | Industry 4.0 — fourth industrial revolution technologies |
| OEE | Overall Equipment Effectiveness — manufacturing efficiency metric |
| GCC | Gulf Cooperation Council — regional economic bloc |
| RAG | Retrieval Augmented Generation — AI pattern for document search |
| n8n | Low-code workflow automation platform |

### B. API Reference

**Anthropic Claude API**
```
POST https://api.anthropic.com/v1/messages
Headers:
  x-api-key: [API_KEY]
  anthropic-version: 2023-06-01
  content-type: application/json

Body:
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2048,
  "system": "[System prompt]",
  "messages": [
    {"role": "user", "content": "[User message]"}
  ]
}

Response:
{
  "content": [
    {"type": "text", "text": "[Response text]"}
  ],
  "model": "claude-sonnet-4-20250514",
  "usage": {"input_tokens": N, "output_tokens": N}
}
```

### C. Color Palette

```css
/* Primary */
--cyan-500: #00b4d8;
--cyan-600: #0077b6;

/* Background */
--bg-dark: #0a0f1c;
--bg-medium: #1a1f35;
--bg-card: rgba(255, 255, 255, 0.05);

/* Text */
--text-primary: #e8eaed;
--text-secondary: rgba(255, 255, 255, 0.6);
--text-muted: rgba(255, 255, 255, 0.4);

/* Accents */
--green: #10b981;
--purple: #818cf8;
--yellow: #fbbf24;
--pink: #f472b6;
--gold: #ffd700;
```

### D. Typography

```css
/* Headings */
font-family: 'DM Serif Display', serif;

/* Body */
font-family: 'DM Sans', -apple-system, sans-serif;

/* Sizes */
--text-xs: 10px;
--text-sm: 12px;
--text-base: 14px;
--text-lg: 16px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 32px;
```

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-05 | Strategy & AI Team | Initial release |

---

## Contacts

| Role | Responsibility |
|------|----------------|
| Product Owner | Requirements, priorities, stakeholder management |
| Build Partner (Antigravity) | Implementation, testing, deployment |
| OW Qatar Team | Domain expertise, demo presentation |

---

*End of Document*
