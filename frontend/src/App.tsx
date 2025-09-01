import React, { useState } from 'react';
import ChipReference from './components/ChipReference';
import ChipInput from './components/ChipInput';
import GptInteraction from './components/GptInteraction';

function App() {
  const [parsedChip, setParsedChip] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CHIP → GPT Web App
          </h1>
          <p className="text-gray-600">
            Parse CHIP notation and get AI-powered poker advice
          </p>
        </div>

        {/* CHIP Notation Reference */}
        <ChipReference />

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - CHIP Input */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Input CHIP Notation
            </h2>
            <ChipInput onParsedChange={setParsedChip} />
          </div>

          {/* Right Column - GPT Interaction */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              GPT Interaction
            </h2>
            <GptInteraction parsedChip={parsedChip} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Built with React, Tailwind CSS, and powered by{' '}
            <code className="bg-gray-200 px-1 py-0.5 rounded">chip-parser</code> and OpenAI GPT
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
