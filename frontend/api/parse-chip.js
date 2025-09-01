const { parseChip } = require('chip-parser');

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
}
