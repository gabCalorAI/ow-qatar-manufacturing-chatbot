# Qatar Manufacturing Advisor Demo

## Build Kit for Oliver Wyman

**Total build time: ~2-3 hours** (leaves buffer for polish)

---

## What You're Building

An AI-powered manufacturing strategy advisor that:
- Answers questions about Qatar's manufacturing sector
- Cites (mock) Oliver Wyman research
- Provides GDP impact projections
- Recommends strategic interventions

**Demo story**: "Ask our AI advisor any question about Qatar manufacturing — it has instant access to all our sector research and can provide on-the-spot strategic analysis."

---

## Files in This Kit

| File | Purpose | Action Needed |
|------|---------|---------------|
| `mock-data.md` | All the fake research & statistics | Review, customize if needed |
| `system-prompt.md` | The AI's "brain" — paste into n8n | Copy entire contents |
| `chat-interface.jsx` | React chat UI | Update webhook URL |
| `n8n-setup-guide.md` | Step-by-step backend setup | Follow instructions |

---

## Execution Plan

### Hour 1: Backend Setup (n8n)

1. **Create n8n account** (if needed)
   - Option A: n8n.cloud (easiest)
   - Option B: Local with ngrok
   
2. **Build the workflow**
   - Follow `n8n-setup-guide.md`
   - Import the provided JSON workflow
   - Add your Anthropic API key
   - Paste system prompt from `system-prompt.md`

3. **Test with curl**
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"message": "What is the GDP impact of technology adoption?"}'
   ```

### Hour 2: Frontend Setup

1. **Option A: Use the React component** (recommended)
   - The `chat-interface.jsx` is a complete React component
   - Works in any React app or can be rendered as an artifact
   
2. **Option B: Quick HTML version**
   - I can generate a standalone HTML file if preferred

3. **Connect to n8n**
   - Update `WEBHOOK_URL` in the code
   - Set `DEMO_MODE = false`

### Hour 3: Polish & Practice

1. **Test the full flow**
   - Try all suggested questions
   - Verify sources display correctly
   - Check loading states

2. **Prepare demo script**
   - Start with welcome screen
   - Click "What's the biggest GDP opportunity?"
   - Follow up with "Tell me about F&B potential"
   - End with specific numbers

3. **Backup plan**
   - Keep `DEMO_MODE = true` as fallback
   - Works fully offline with mock responses

---

## Demo Script (Suggested)

### Opening (30 seconds)
"Imagine having instant access to all our sector research. Let me show you what that looks like."

### Demo Flow (3-4 minutes)

**Question 1**: Click "What's the biggest GDP opportunity?"
- Shows comprehensive analysis
- Cites specific reports
- Provides QAR figures

**Question 2**: "Tell me more about the food and beverage sector"
- Deep dive on specific opportunity
- Three growth scenarios with investment & jobs
- Specific recommendations

**Question 3**: "What's blocking digital adoption?"
- Shows diagnostic capability
- Identifies barriers from executive survey
- Suggests interventions

### Closing (30 seconds)
"This is what AI-enabled strategy consulting looks like. Your team gets answers in seconds that would normally take hours of research."

---

## Key Talking Points

### For OW Managers

1. **Speed**: "Instant synthesis of research that normally takes hours"

2. **Consistency**: "Every consultant, same quality analysis"

3. **Scale**: "Deploy expertise across multiple client engagements simultaneously"

4. **Customization**: "The knowledge base can be updated with each new research piece"

### Addressing Concerns

- **"Is this replacing consultants?"** — No, it's augmenting them. The AI handles information retrieval; consultants do judgment, relationships, and execution.

- **"How accurate is it?"** — It's as accurate as the research you put in. The AI doesn't hallucinate new data — it references what we've provided.

- **"Can clients use this themselves?"** — That's the opportunity. Licensed access to sector-specific advisors could be a new revenue stream.

---

## Customization Options

### If you want different content:

1. Edit `mock-data.md` with your preferred statistics
2. Update `system-prompt.md` to reflect the changes
3. Re-paste into n8n

### If you want different styling:

The React component uses inline CSS. Key variables:
- Primary color: `#00b4d8` (cyan blue)
- Background: `#0a0f1c` (dark navy)
- Font: DM Sans

### If you want to add features:

Easy additions:
- **Export chat button** — Add download functionality
- **Multiple personas** — Switch between sector experts
- **Charts** — Embed Chart.js visualizations

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Enable CORS in n8n or use a proxy |
| Slow responses | Claude can take 3-5s; that's normal |
| Webhook not working | Ensure workflow is activated |
| Wrong answers | Check system prompt was pasted correctly |

---

## After the Demo

### Immediate Next Steps
1. Gather feedback from OW managers
2. Identify which use cases resonated
3. Propose pilot scope

### Potential Extensions
- Connect to real OW research repository
- Add RAG for dynamic document retrieval
- Build sector-specific variants (Energy, Finance, etc.)
- Client-facing portal with authentication

---

## Need Help?

The demo is designed to work in "demo mode" even without n8n connected. If backend setup becomes complicated, just use the mock responses — they're realistic and comprehensive.

Good luck! 🚀
