import { useState } from 'react';
import axios from 'axios';

interface GptInteractionProps {
  parsedChip: any;
}

const GptInteraction: React.FC<GptInteractionProps> = ({ parsedChip }) => {
  const [apiKey, setApiKey] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a poker assistant. You will provide a recommended action for the player to act given the hand history up to this point. Do not describe the hand history. Only provide the recommended action and a brief description.'
  );
  const [gptResponse, setGptResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskGpt = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!parsedChip) {
      setError('Please enter and parse CHIP notation first');
      return;
    }

    setIsLoading(true);
    setError('');
    setGptResponse('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.post(`${apiUrl}/ask-gpt`, {
        apiKey: apiKey.trim(),
        systemPrompt: systemPrompt.trim(),
        parsedChip
      });

      if (response.data.success) {
        setGptResponse(response.data.response);
      } else {
        setError(response.data.message || 'Failed to get response from GPT');
      }
    } catch (error: any) {
      console.error('GPT API error:', error);
      
      if (error.response?.status === 401) {
        setError('Invalid API key. Please check your OpenAI API key.');
      } else if (error.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to connect to GPT service. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isApiKeyValid = apiKey.startsWith('sk-') && apiKey.length > 20;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          OpenAI API Key
        </label>
        <div className="relative">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              apiKey && !isApiKeyValid ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {apiKey && isApiKeyValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Your API key is stored in memory only and never persisted.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
        </label>
        <textarea
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
          placeholder="Enter system prompt for GPT..."
        />
      </div>

      <div>
        <button
          onClick={handleAskGpt}
          disabled={isLoading || !parsedChip || !apiKey.trim()}
          className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors ${
            isLoading || !parsedChip || !apiKey.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Asking GPT...
            </div>
          ) : (
            'Ask GPT'
          )}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GPT Response
        </label>
        <div className="border border-gray-300 rounded-md bg-gray-50 min-h-[200px]">
          {error ? (
            <div className="p-4 text-red-600 text-sm bg-red-50 border border-red-200 rounded-md">
              <div className="font-medium mb-1">Error</div>
              {error}
            </div>
          ) : gptResponse ? (
            <div className="p-4 text-gray-800 text-sm whitespace-pre-wrap">
              {gptResponse}
            </div>
          ) : (
            <div className="p-4 text-gray-500 text-sm italic">
              {!parsedChip 
                ? 'Parse CHIP notation first, then ask GPT for recommendations...'
                : !apiKey.trim()
                ? 'Enter your API key and click "Ask GPT" to get poker advice...'
                : 'Click "Ask GPT" to get poker advice...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GptInteraction;
