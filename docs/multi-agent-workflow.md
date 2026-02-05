# Advanced n8n Workflow: Multi-Agent Chain

## The Concept

Instead of one AI response, chain multiple "specialists":

```
[User Question]
       ↓
[Agent 1: Research Analyst] → Gathers facts, data, benchmarks
       ↓
[Agent 2: Strategy Consultant] → Synthesizes into recommendations
       ↓
[Agent 3: Executive Summarizer] → Creates crisp, actionable summary
       ↓
[Final Response with all layers visible]
```

**Why this is powerful for the demo:**
- Shows AI can replicate consulting team structure
- Each agent's output is visible (transparency)
- More thorough, structured responses
- Mimics real OW engagement model

---

## n8n Workflow Setup

### Node 1: Webhook (same as before)
```
POST /manufacturing-advisor-advanced
```

### Node 2: Research Analyst Agent

**System Prompt:**
```
You are a Research Analyst at Oliver Wyman specializing in Qatar's manufacturing sector. Your role is to:

1. Extract the core question from the user's query
2. Identify all relevant data points from your knowledge base
3. Note any gaps or uncertainties in the data
4. Provide raw findings without interpretation

Your knowledge base includes:
- Qatar manufacturing: QAR 62.3B GDP contribution (9.2% non-hydrocarbon)
- 1,247 establishments, 185,000 workers
- Productivity: 34% below GCC, 52% below global best
- I4.0 adoption: 18% (vs UAE 45%, Singapore 67%)
- Key challenges: Labor productivity (78%), Tech adoption (71%), Skills (89%)
- F&B: 89 firms, 61% utilization, 90% food imports
- Localization opportunity: 31% of imports substitutable

Format your response as:
## Research Findings
[Bullet points of relevant data]

## Data Gaps
[What we don't know or need to verify]

## Confidence Level
[High/Medium/Low with explanation]
```

**User Message:** `{{ $json.message }}`

### Node 3: Parse Analyst Response
```javascript
// Set node to extract the analyst output
{
  "analyst_response": "{{ $json.content[0].text }}",
  "original_question": "{{ $('Webhook').item.json.message }}"
}
```

### Node 4: Strategy Consultant Agent

**System Prompt:**
```
You are a Senior Strategy Consultant at Oliver Wyman. You receive research findings from an analyst and must:

1. Interpret the data in strategic context
2. Identify 2-3 key insights
3. Recommend specific interventions
4. Quantify GDP impact where possible
5. Highlight implementation considerations

Use these GDP multipliers:
- Technology adoption: 2.2x
- Lean transformation: 2.0x
- Localization: 2.8x
- Workforce development: 2.0x

Format your response as:
## Strategic Insights
[2-3 key takeaways]

## Recommended Interventions
[Specific actions with expected outcomes]

## GDP Impact Estimate
[Quantified projections]

## Implementation Considerations
[Risks, dependencies, timeline]
```

**User Message:**
```
Original Question: {{ $json.original_question }}

Research Analyst Findings:
{{ $json.analyst_response }}

Based on these findings, provide your strategic analysis.
```

### Node 5: Executive Summarizer Agent

**System Prompt:**
```
You are preparing a response for a C-suite executive. You receive both research findings and strategic analysis. Your job is to:

1. Synthesize into a clear, actionable response
2. Lead with the bottom line
3. Use specific numbers (QAR, percentages, timelines)
4. End with a clear next step or question

Keep your response under 300 words. Executives are busy.

Format:
- Opening: Direct answer to the question (1-2 sentences)
- Key insight: The most important thing they should know
- Recommendation: What to do about it
- Numbers: Specific impact projections
- Next step: One actionable follow-up

Do NOT use headers or bullets in your response. Write in natural paragraphs that feel like a senior consultant speaking.
```

**User Message:**
```
Original Question: {{ $json.original_question }}

Research Findings:
{{ $json.analyst_response }}

Strategic Analysis:
{{ $json.strategist_response }}

Synthesize this into an executive-ready response.
```

### Node 6: Combine All Outputs

```javascript
{
  "response": $json.content[0].text,
  "layers": {
    "analyst": $('Research Analyst').item.json.content[0].text,
    "strategist": $('Strategy Consultant').item.json.content[0].text,
    "executive": $json.content[0].text
  },
  "metadata": {
    "agents_used": 3,
    "processing_approach": "multi-agent-chain"
  }
}
```

---

## Frontend: Show the Agent Chain

Update your React component to display the "thinking process":

```jsx
// Add this component
const AgentThinking = ({ layers, isExpanded, onToggle }) => (
  <div className="agent-layers">
    <button onClick={onToggle} className="layers-toggle">
      {isExpanded ? '▼' : '▶'} View AI reasoning process
    </button>
    {isExpanded && (
      <div className="layers-content">
        <div className="layer">
          <div className="layer-header">
            <span className="layer-icon">🔍</span>
            <span className="layer-title">Research Analyst</span>
          </div>
          <div className="layer-body">{layers.analyst}</div>
        </div>
        <div className="layer">
          <div className="layer-header">
            <span className="layer-icon">💡</span>
            <span className="layer-title">Strategy Consultant</span>
          </div>
          <div className="layer-body">{layers.strategist}</div>
        </div>
        <div className="layer">
          <div className="layer-header">
            <span className="layer-icon">📋</span>
            <span className="layer-title">Executive Summary</span>
          </div>
          <div className="layer-body">{layers.executive}</div>
        </div>
      </div>
    )}
  </div>
);
```

---

## Demo Script Addition

> "Notice how the AI mirrors our consulting team structure. First, a research analyst gathers the relevant data. Then, a strategy consultant interprets and recommends. Finally, an executive summarizer distills it for leadership. You can expand to see each layer of thinking — full transparency into how the AI reached its conclusion."

This is a **major differentiator** — most AI demos are black boxes. Showing the chain builds trust.
