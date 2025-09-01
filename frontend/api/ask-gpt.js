const OpenAI = require('openai');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed', 
      message: 'Only POST requests are supported' 
    });
  }

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
}
