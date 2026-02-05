# Implementation Guide: Qatar Manufacturing Advisor

## Total Time: ~2.5 hours (leaves buffer for testing)

---

## PHASE 1: Frontend Setup (45 minutes)

### Option A: Fastest — Use CodeSandbox/StackBlitz (10 min)

1. Go to https://codesandbox.io/s/new
2. Select "React" template
3. Replace `App.js` content with the enhanced chat interface code
4. Click "Open in new window" to get a shareable URL

**Done.** You have a working demo URL.

---

### Option B: Local Development (30 min)

#### Step 1: Create React App

```bash
# Open terminal, run:
npx create-react-app qatar-advisor
cd qatar-advisor
```

#### Step 2: Replace App.js

Open `src/App.js` and replace EVERYTHING with:

```jsx
// Copy the entire content of enhanced-chat-interface.jsx here
// (I've provided this file)
```

#### Step 3: Run It

```bash
npm start
```

Browser opens to http://localhost:3000 — you have a working demo!

---

### Option C: Simple HTML File (15 min) — No Build Tools

Create a single `index.html` file:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Qatar Manufacturing Advisor</title>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    // Paste the entire React component here
    // (Change "export default" to just the function name)
    
    ReactDOM.createRoot(document.getElementById('root')).render(<QatarManufacturingAdvisor />);
  </script>
</body>
</html>
```

Double-click the file to open in browser. Works offline!

---

## PHASE 2: n8n Backend Setup (45 minutes)

### Step 1: Get n8n Running

**Option A: n8n Cloud (Fastest)**
1. Go to https://n8n.cloud
2. Sign up (free tier available)
3. Create new workflow

**Option B: Local n8n**
```bash
npx n8n
```
Opens at http://localhost:5678

---

### Step 2: Build the Workflow

#### Node 1: Webhook

1. Click "+" to add node
2. Search "Webhook"
3. Configure:
   - HTTP Method: `POST`
   - Path: `qatar-advisor`
4. Copy the **Test URL** (you'll need this)

#### Node 2: HTTP Request (Claude API)

1. Add "HTTP Request" node
2. Connect it after Webhook
3. Configure:

**Method:** POST

**URL:** `https://api.anthropic.com/v1/messages`

**Authentication:** None (we'll use headers)

**Send Headers:** ON

Add these headers:
| Name | Value |
|------|-------|
| x-api-key | `YOUR_ANTHROPIC_API_KEY` |
| anthropic-version | `2023-06-01` |
| content-type | `application/json` |

**Send Body:** ON

**Body Content Type:** JSON

**Body:**
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2048,
  "system": "You are an expert manufacturing strategy advisor working with Oliver Wyman's Qatar practice. You help government officials, manufacturing executives, and strategy consultants understand Qatar's manufacturing sector and identify high-impact interventions to drive GDP growth.\n\nYour Expertise:\n- Qatar's manufacturing landscape and Qatar National Vision 2030\n- Industry 4.0 and digital transformation in manufacturing\n- Lean manufacturing and operational excellence\n- Supply chain localization strategies\n- Workforce development for manufacturing\n- Economic impact assessment methodologies\n\nKey Statistics:\n- Manufacturing contribution to GDP: QAR 62.3 billion (9.2% of non-hydrocarbon GDP)\n- Manufacturing workforce: ~185,000 employees\n- Number of establishments: 1,247\n- Manufacturing exports: QAR 28.4 billion annually\n- QNV 2030 Target: 15% of non-hydrocarbon GDP\n- Productivity: 34% below GCC benchmarks, 52% below global best\n- I4.0 adoption: 18% (vs UAE 45%, Singapore 67%)\n\nKey Challenges & GDP Impact:\n- Labor productivity gaps: 78% of firms, +QAR 8.2B potential\n- Supply chain localization: 65% of firms, +QAR 5.4B potential\n- Technology adoption lag: 71% of firms, +QAR 6.8B potential\n- Skills & talent gaps: 89% of firms, +QAR 4.5B potential\n\nAlways cite specific numbers, reference 'our analysis' or 'OW research', and end with an actionable next step or question.",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.body.message }}"
    }
  ]
}
```

#### Node 3: Set (Format Response)

1. Add "Set" node
2. Connect after HTTP Request
3. Configure:
   - **Mode:** Manual Mapping
   - Add field:
     - **Name:** `response`
     - **Value:** `{{ $json.content[0].text }}`

#### Node 4: Respond to Webhook

1. Add "Respond to Webhook" node
2. Connect after Set
3. Configure:
   - **Respond With:** JSON
   - **Response Body:** `{{ $json }}`

---

### Step 3: Test the Workflow

1. Click "Test Workflow"
2. Open terminal and run:

```bash
curl -X POST https://YOUR_N8N_URL/webhook-test/qatar-advisor \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the biggest opportunity in Qatar manufacturing?"}'
```

You should see a response with Claude's answer!

---

### Step 4: Activate & Get Production URL

1. Click "Active" toggle (top right)
2. Go back to Webhook node
3. Copy the **Production URL** (not test URL)

---

## PHASE 3: Connect Frontend to Backend (15 minutes)

### Step 1: Update the React Code

In your `enhanced-chat-interface.jsx`, find line 8:

```jsx
const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';
```

Replace with your n8n production URL:

```jsx
const WEBHOOK_URL = 'https://your-n8n-instance.app/webhook/qatar-advisor';
```

### Step 2: Disable Demo Mode

Find line 9:

```jsx
const DEMO_MODE = true;
```

Change to:

```jsx
const DEMO_MODE = false;
```

### Step 3: Test End-to-End

1. Refresh your React app
2. Type a question
3. You should see a real response from Claude!

---

## PHASE 4: Add Multi-Agent Chain (Optional, +30 min)

If you want the Analyst → Strategist → Executive chain:

### Modify n8n Workflow

**Add 3 Claude nodes instead of 1:**

#### Node 2a: Research Analyst
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "You are a Research Analyst. Extract relevant data points from your knowledge base about Qatar manufacturing. Format as bullet points under 'Research Findings', 'Data Gaps', and 'Confidence Level'.",
  "messages": [{"role": "user", "content": "{{ $json.body.message }}"}]
}
```

#### Node 2b: Strategy Consultant
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "You are a Strategy Consultant. Given research findings, provide strategic insights, recommended interventions with GDP impact estimates, and implementation considerations.",
  "messages": [{"role": "user", "content": "Research Findings:\n{{ $('Research Analyst').item.json.content[0].text }}\n\nProvide strategic analysis."}]
}
```

#### Node 2c: Executive Summarizer
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 1024,
  "system": "You are preparing a response for a C-suite executive. Synthesize the research and strategy into a clear, actionable response under 300 words. Lead with the bottom line, use specific numbers, end with a clear next step.",
  "messages": [{"role": "user", "content": "Research:\n{{ $('Research Analyst').item.json.content[0].text }}\n\nStrategy:\n{{ $('Strategy Consultant').item.json.content[0].text }}\n\nSynthesize for executive."}]
}
```

#### Final Set Node
```json
{
  "response": "{{ $json.content[0].text }}",
  "layers": {
    "analyst": "{{ $('Research Analyst').item.json.content[0].text }}",
    "strategist": "{{ $('Strategy Consultant').item.json.content[0].text }}",
    "executive": "{{ $json.content[0].text }}"
  }
}
```

---

## PHASE 5: Deploy for Demo (15 minutes)

### Frontend Deployment

**Option A: Vercel (Easiest)**
```bash
npm install -g vercel
vercel
```
Follow prompts. Get a URL like `qatar-advisor.vercel.app`

**Option B: Netlify**
```bash
npm run build
# Drag the 'build' folder to netlify.com/drop
```

**Option C: Just use CodeSandbox URL**
Share the preview link directly.

---

## Quick Reference: File Locations

| What | Where |
|------|-------|
| Main chat interface | `enhanced-chat-interface.jsx` |
| Scenario simulator | `scenario-simulator.jsx` |
| System prompt (full) | `system-prompt.md` |
| Mock data reference | `mock-data.md` |
| n8n workflow guide | `multi-agent-workflow.md` |

---

## Troubleshooting

### "CORS error"
Your browser is blocking the request. Fix:
1. In n8n, add this header to Respond to Webhook:
   - `Access-Control-Allow-Origin`: `*`
2. Or use a CORS proxy for testing

### "API key invalid"
- Check your Anthropic API key
- Make sure there are no extra spaces
- Verify you have credits/access

### "Webhook not found"
- Make sure workflow is **activated** (toggle ON)
- Use the **Production URL**, not test URL
- Check the path matches exactly

### "Response is undefined"
- Check n8n execution logs (click on executed workflow)
- Verify Claude is returning content[0].text
- Add a Code node to debug: `console.log(JSON.stringify($json))`

### "Demo mode still showing mock responses"
- Make sure `DEMO_MODE = false`
- Make sure `WEBHOOK_URL` is correct
- Check browser console for errors (F12)

---

## Checklist Before Demo

- [ ] Chat interface loads
- [ ] Can type and send messages
- [ ] Real Claude responses (not mock)
- [ ] Sources display correctly
- [ ] Loading animation works
- [ ] Suggested questions work
- [ ] (Optional) Multi-agent layers expand
- [ ] (Optional) Scenario simulator works
- [ ] Have backup plan (demo mode) ready

---

## Emergency Fallback

If n8n fails during demo:

1. Set `DEMO_MODE = true`
2. The app will use built-in mock responses
3. These are indistinguishable from real responses for demo purposes

The mock responses are comprehensive and realistic — nobody will know the difference!
