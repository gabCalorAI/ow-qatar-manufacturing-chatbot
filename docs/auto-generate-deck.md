# Auto-Generate PowerPoint from Chat

## The Feature

User asks a question, gets a response, then clicks **"Generate Deck"** → 
AI creates a structured PowerPoint presentation based on the conversation.

**This is incredibly powerful for consultants** — instant presentation drafts.

---

## Architecture

```
[Chat Response] 
      ↓
[User clicks "Generate Deck"]
      ↓
[n8n Webhook: /generate-deck]
      ↓
[Claude: Generate slide structure as JSON]
      ↓
[n8n: Use PptxGenJS or Python-pptx to create actual .pptx]
      ↓
[Return download link]
```

---

## n8n Workflow

### Node 1: Webhook
```
POST /generate-deck
Body: { 
  "topic": "string",
  "context": "string (previous chat response)",
  "style": "executive | detailed | workshop"
}
```

### Node 2: Claude - Generate Slide Structure

**System Prompt:**
```
You are a presentation architect at Oliver Wyman. Given a topic and context, create a structured outline for a PowerPoint presentation.

Output ONLY valid JSON in this exact format:
{
  "title": "Main presentation title",
  "subtitle": "Subtitle or date",
  "slides": [
    {
      "type": "title",
      "title": "Slide title",
      "subtitle": "Optional subtitle"
    },
    {
      "type": "content",
      "title": "Slide title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "notes": "Speaker notes"
    },
    {
      "type": "data",
      "title": "Slide title",
      "tableData": {
        "headers": ["Col1", "Col2", "Col3"],
        "rows": [["a", "b", "c"], ["d", "e", "f"]]
      }
    },
    {
      "type": "insight",
      "title": "Key Insight",
      "mainPoint": "The big takeaway",
      "supporting": "Supporting explanation"
    },
    {
      "type": "recommendation",
      "title": "Recommendations",
      "items": [
        {"action": "Do this", "impact": "Result", "timeline": "When"},
        {"action": "Do that", "impact": "Result", "timeline": "When"}
      ]
    },
    {
      "type": "closing",
      "title": "Next Steps",
      "items": ["Action 1", "Action 2", "Action 3"]
    }
  ]
}

Guidelines:
- 6-10 slides maximum
- Each bullet under 15 words
- Include at least one data slide with a table
- End with clear next steps
- Use specific numbers from the context provided
```

**User Message:**
```
Topic: {{ $json.topic }}

Context from analysis:
{{ $json.context }}

Style: {{ $json.style }}

Generate the slide structure.
```

### Node 3: Parse JSON Response

```javascript
// Code node to extract and validate JSON
const responseText = $json.content[0].text;

// Extract JSON from response (handle markdown code blocks)
let jsonStr = responseText;
if (responseText.includes('```json')) {
  jsonStr = responseText.split('```json')[1].split('```')[0];
} else if (responseText.includes('```')) {
  jsonStr = responseText.split('```')[1].split('```')[0];
}

const slideData = JSON.parse(jsonStr.trim());
return { slideData };
```

### Node 4: Generate PPTX (HTTP Request to microservice or Code node)

**Option A: Use a PPTX microservice**

You can deploy a simple Node.js service that generates PPTX:

```javascript
// pptx-service.js (deploy separately)
const PptxGenJS = require('pptxgenjs');
const express = require('express');
const app = express();
app.use(express.json());

app.post('/generate', async (req, res) => {
  const { slideData } = req.body;
  const pptx = new PptxGenJS();
  
  // Set theme
  pptx.defineSlideMaster({
    title: 'OW_MASTER',
    background: { color: '0A0F1C' },
    objects: [
      { text: { text: 'Oliver Wyman', options: { x: 0.5, y: 5.2, fontSize: 10, color: '666666' } } }
    ]
  });
  
  slideData.slides.forEach(slide => {
    const s = pptx.addSlide({ masterName: 'OW_MASTER' });
    
    switch(slide.type) {
      case 'title':
        s.addText(slide.title, { x: 0.5, y: 2, w: 9, fontSize: 36, color: 'FFFFFF', bold: true });
        if (slide.subtitle) {
          s.addText(slide.subtitle, { x: 0.5, y: 2.8, w: 9, fontSize: 18, color: '00B4D8' });
        }
        break;
        
      case 'content':
        s.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 24, color: 'FFFFFF', bold: true });
        slide.bullets.forEach((bullet, i) => {
          s.addText(`• ${bullet}`, { x: 0.7, y: 1.3 + (i * 0.5), w: 8.5, fontSize: 16, color: 'E8EAED' });
        });
        break;
        
      case 'data':
        s.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 24, color: 'FFFFFF', bold: true });
        s.addTable([slide.tableData.headers, ...slide.tableData.rows], {
          x: 0.5, y: 1.3, w: 9,
          color: 'FFFFFF',
          fill: { color: '1A1F35' },
          border: { color: '00B4D8' }
        });
        break;
        
      case 'insight':
        s.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 24, color: '00B4D8', bold: true });
        s.addText(slide.mainPoint, { x: 0.5, y: 1.5, w: 9, fontSize: 28, color: 'FFFFFF', bold: true });
        s.addText(slide.supporting, { x: 0.5, y: 2.5, w: 9, fontSize: 16, color: 'AAAAAA' });
        break;
        
      case 'recommendation':
        s.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 24, color: 'FFFFFF', bold: true });
        slide.items.forEach((item, i) => {
          const y = 1.3 + (i * 0.8);
          s.addText(item.action, { x: 0.7, y, w: 5, fontSize: 16, color: '00B4D8', bold: true });
          s.addText(item.impact, { x: 5.7, y, w: 2, fontSize: 14, color: 'E8EAED' });
          s.addText(item.timeline, { x: 7.7, y, w: 2, fontSize: 14, color: '888888' });
        });
        break;
        
      case 'closing':
        s.addText(slide.title, { x: 0.5, y: 0.5, w: 9, fontSize: 24, color: 'FFFFFF', bold: true });
        slide.items.forEach((item, i) => {
          s.addText(`${i + 1}. ${item}`, { x: 0.7, y: 1.3 + (i * 0.5), w: 8.5, fontSize: 18, color: 'E8EAED' });
        });
        break;
    }
  });
  
  const buffer = await pptx.write('nodebuffer');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
  res.setHeader('Content-Disposition', `attachment; filename="${slideData.title.replace(/[^a-z0-9]/gi, '_')}.pptx"`);
  res.send(buffer);
});

app.listen(3001);
```

**Option B: Use n8n's Code node with base64**

Simpler but less flexible — generate HTML/PDF instead.

---

## Frontend Integration

Add a "Generate Deck" button to your chat messages:

```jsx
const GenerateDeckButton = ({ topic, context }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('YOUR_N8N_WEBHOOK/generate-deck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic, 
          context,
          style: 'executive' 
        })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic.replace(/[^a-z0-9]/gi, '_')}_Analysis.pptx`;
      a.click();
    } catch (error) {
      console.error('Failed to generate deck:', error);
    }
    setIsGenerating(false);
  };
  
  return (
    <button 
      onClick={handleGenerate} 
      disabled={isGenerating}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 16px',
        background: 'rgba(0, 180, 216, 0.15)',
        border: '1px solid rgba(0, 180, 216, 0.3)',
        borderRadius: 10,
        color: '#00b4d8',
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 500,
        marginTop: 16,
        transition: 'all 0.2s ease'
      }}
    >
      {isGenerating ? (
        <>
          <span className="spinner"></span>
          Generating...
        </>
      ) : (
        <>
          📊 Generate PowerPoint
        </>
      )}
    </button>
  );
};
```

---

## Demo Script Addition

> "Now here's where it gets really powerful. See this 'Generate Deck' button? Watch what happens..."
> 
> *[Click button, wait 5-10 seconds]*
> 
> "The AI just created a full PowerPoint presentation based on our analysis. It has a title slide, key findings with our data, recommendations with timelines, and next steps. That's a 30-minute task done in seconds."
>
> "Your consultants can use this as a starting point — the AI handles the structure, they add the judgment and polish."

---

## Quick Deploy Option

If you don't have time to set up the PPTX service, you can:

1. Have Claude output **structured markdown** instead
2. Display it in a modal as a "presentation preview"
3. User can copy/paste into their own deck

This is faster to implement and still demonstrates the concept.
