const express = require('express');
const cors = require('cors');
const { parseChip } = require('chip-parser');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Parse CHIP notation endpoint
app.post('/api/parse-chip', (req, res) => {
  try {
    const { chipNotation } = req.body;
    
    if (!chipNotation || typeof chipNotation !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid input', 
        message: 'chipNotation is required and must be a string' 
      });
    }

    // Handle incomplete input gracefully
    try {
      const parsed = parseChip(chipNotation);
      res.json({ 
        success: true, 
        parsed,
        original: chipNotation 
      });
    } catch (parseError) {
      // Return partial success for incomplete input
      res.json({ 
        success: false, 
        error: parseError.message,
        original: chipNotation,
        parsed: null
      });
    }
  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: error.message 
    });
  }
});

// GPT interaction endpoint
app.post('/api/ask-gpt', async (req, res) => {
  try {
    const { apiKey, systemPrompt, parsedChip } = req.body;
    
    if (!apiKey || !systemPrompt || !parsedChip) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        message: 'apiKey, systemPrompt, and parsedChip are required' 
      });
    }

    // Initialize OpenAI with the provided API key
    const openai = new OpenAI({
      apiKey: apiKey
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: JSON.stringify(parsedChip, null, 2)
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    res.json({
      success: true,
      response: completion.choices[0].message.content,
      usage: completion.usage
    });

  } catch (error) {
    console.error('GPT API error:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(401).json({
        error: 'Invalid API Key',
        message: 'The provided OpenAI API key is invalid'
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'OpenAI API rate limit exceeded'
      });
    }

    res.status(500).json({
      error: 'GPT API error',
      message: error.message || 'Failed to get response from GPT'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CHIP Web Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
