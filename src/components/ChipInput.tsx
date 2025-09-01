import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ParseResult {
  success: boolean;
  parsed: any;
  error?: string;
  original: string;
}

interface ChipInputProps {
  onParsedChange: (parsed: any) => void;
}

const ChipInput: React.FC<ChipInputProps> = ({ onParsedChange }) => {
  const [chipNotation, setChipNotation] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseChipNotation = useCallback(async (notation: string) => {
    if (!notation.trim()) {
      setParseResult(null);
      onParsedChange(null);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('/api/parse-chip', {
        chipNotation: notation
      });
      
      setParseResult(response.data);
      onParsedChange(response.data.success ? response.data.parsed : null);
    } catch (error) {
      console.error('Parse error:', error);
      const errorResult: ParseResult = {
        success: false,
        parsed: null,
        error: 'Failed to connect to parser service',
        original: notation
      };
      setParseResult(errorResult);
      onParsedChange(null);
    } finally {
      setIsLoading(false);
    }
  }, [onParsedChange]);

  // Debounced parsing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      parseChipNotation(chipNotation);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [chipNotation, parseChipNotation]);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Input CHIP Notation
          </label>
          <button
            onClick={() => setChipNotation("25 50 10 6 6\n12.5k 25k 10k 25k 25k 15k\nf f 150 f c c\n2c ad 6c\nx 50 f\nth tc")}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded px-1"
          >
            Load Example
          </button>
        </div>
        <textarea
          value={chipNotation}
          onChange={(e) => setChipNotation(e.target.value)}
          placeholder="Enter CHIP notation...&#10;&#10;Example:&#10;25 50 10 6 6&#10;12.5k 25k 10k 25k 25k 15k&#10;f f 150 f c c&#10;2c ad 6c&#10;x 50 f&#10;th tc"
          className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
          spellCheck={false}
        />
        {isLoading && (
          <div className="mt-2 flex items-center text-sm text-blue-600">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Parsing...
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parsed Output
        </label>
        <div className="border border-gray-300 rounded-md bg-gray-50 min-h-[200px]">
          {parseResult === null ? (
            <div className="p-4 text-gray-500 text-sm italic">
              Enter CHIP notation above to see parsed output...
            </div>
          ) : parseResult.success ? (
            <div className="p-4 text-sm text-gray-800 whitespace-pre-wrap overflow-auto max-h-64 font-mono leading-relaxed">
              {parseResult.parsed}
            </div>
          ) : (
            <div className="p-4 space-y-2">
              <div className="text-red-600 text-sm font-medium">
                Parse Error
              </div>
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
                {parseResult.error}
              </div>
              {chipNotation.trim() && (
                <div className="text-gray-600 text-xs">
                  💡 This might be incomplete notation. Continue typing to see if it parses successfully.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChipInput;
