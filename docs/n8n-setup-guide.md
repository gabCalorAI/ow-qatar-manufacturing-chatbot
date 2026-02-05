# n8n Workflow Setup Guide

## Quick Overview

Your n8n workflow will be simple:
```
[Webhook] → [Claude API] → [Response]
```

Total setup time: ~15 minutes

---

## Step 1: Create New Workflow

1. Open n8n
2. Create new workflow
3. Name it: "Qatar Manufacturing Advisor"

---

## Step 2: Add Webhook Node

1. Add a **Webhook** node
2. Configure:
   - **HTTP Method**: POST
   - **Path**: `manufacturing-advisor` (or whatever you prefer)
   - **Response Mode**: "Last Node"
   
3. Copy the **Production URL** - you'll need this for the React app

The webhook URL will look like:
```
https://your-n8n-instance.com/webhook/manufacturing-advisor
```

---

## Step 3: Add Claude (Anthropic) Node

1. Add an **Anthropic** node (or HTTP Request if Anthropic isn't available)
2. Connect it after the Webhook

### If using Anthropic Node:
- **Model**: claude-sonnet-4-20250514 (or claude-3-opus if available)
- **System Message**: Copy the ENTIRE content from `system-prompt.md`
- **User Message**: `{{ $json.message }}`

### If using HTTP Request Node:
Configure as follows:

**Method**: POST

**URL**: `https://api.anthropic.com/v1/messages`

**Headers**:
```
x-api-key: YOUR_ANTHROPIC_API_KEY
anthropic-version: 2023-06-01
content-type: application/json
```

**Body (JSON)**:
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2048,
  "system": "PASTE_YOUR_SYSTEM_PROMPT_HERE",
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.message }}"
    }
  ]
}
```

---

## Step 4: Format Response

Add a **Set** node to format the response:

**Fields to set**:
- **response**: `{{ $json.content[0].text }}`

Or if you want to pass through more data:
```json
{
  "response": "{{ $json.content[0].text }}",
  "model": "{{ $json.model }}",
  "usage": "{{ $json.usage }}"
}
```

---

## Step 5: Test the Workflow

1. Activate the workflow
2. Test with curl:

```bash
curl -X POST https://your-n8n-instance.com/webhook/manufacturing-advisor \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the biggest opportunity in Qatar manufacturing?"}'
```

You should get a JSON response with the assistant's answer.

---

## Step 6: Connect to React App

1. Open `chat-interface.jsx`
2. Find line 4: `const WEBHOOK_URL = 'YOUR_N8N_WEBHOOK_URL_HERE';`
3. Replace with your actual webhook URL
4. Set `DEMO_MODE = false` on line 7

---

## Advanced: Add Conversation History

To maintain context across messages, modify your n8n workflow:

### In the HTTP Request body:
```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 2048,
  "system": "YOUR_SYSTEM_PROMPT",
  "messages": {{ $json.history ? JSON.stringify([...$json.history, {"role": "user", "content": $json.message}]) : JSON.stringify([{"role": "user", "content": $json.message}]) }}
}
```

The React app already sends `history` in the request body.

---

## Hosting Options (Quick & Free)

### Option A: n8n Cloud
- Sign up at n8n.cloud
- Free tier available
- Webhook URLs work immediately

### Option B: Railway.app
- Deploy n8n with one click
- Free tier: 500 hours/month
- Template: https://railway.app/template/n8n

### Option C: Local Only
- Run n8n locally: `npx n8n`
- Use ngrok for temporary public URL: `ngrok http 5678`

---

## Troubleshooting

**"CORS error" in browser**
- Add a **Respond to Webhook** node at the end
- Or add CORS headers in n8n settings

**"API key invalid"**
- Check your Anthropic API key
- Ensure it's set in n8n credentials

**"Webhook not found"**
- Make sure workflow is **activated**
- Check the exact URL path

**Response is empty**
- Check n8n execution logs
- Verify the Claude response is being parsed correctly

---

## Complete Workflow JSON (Import Ready)

You can import this directly into n8n:

```json
{
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "manufacturing-advisor",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "method": "POST",
        "url": "https://api.anthropic.com/v1/messages",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {"name": "x-api-key", "value": "YOUR_API_KEY"},
            {"name": "anthropic-version", "value": "2023-06-01"},
            {"name": "content-type", "value": "application/json"}
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "model", "value": "claude-sonnet-4-20250514"},
            {"name": "max_tokens", "value": "2048"},
            {"name": "system", "value": "YOUR_SYSTEM_PROMPT_HERE"},
            {"name": "messages", "value": "={{[{\"role\": \"user\", \"content\": $json.message}]}}"}
          ]
        }
      },
      "name": "Claude API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [450, 300]
    },
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "response", "value": "={{$json.content[0].text}}"}
          ]
        }
      },
      "name": "Format Response",
      "type": "n8n-nodes-base.set",
      "position": [650, 300]
    }
  ],
  "connections": {
    "Webhook": {"main": [[{"node": "Claude API", "type": "main", "index": 0}]]},
    "Claude API": {"main": [[{"node": "Format Response", "type": "main", "index": 0}]]}
  }
}
```

Replace `YOUR_API_KEY` and `YOUR_SYSTEM_PROMPT_HERE` before importing.
