import React, { useState } from 'react';

const ChipReference: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const referenceData = [
    {
      category: "Header Format",
      items: [
        { notation: "1 2 6 0", description: "SB BB nPlayers buttonSeat" },
        { notation: "1 2 0.25 6 0", description: "SB BB ante nPlayers buttonSeat" },
        { notation: "buttonSeat", description: "1-indexed position" },
      ]
    },
    {
      category: "Actions",
      items: [
        { notation: "f", description: "Fold" },
        { notation: "x", description: "Check" },
        { notation: "c", description: "Call" },
        { notation: "150", description: "Bet/Raise to amount 150" },
        { notation: "_", description: "No stack change" },
      ]
    },
    {
      category: "Numbers",
      items: [
        { notation: "200k", description: "200 thousand" },
        { notation: "1.5m", description: "1.5 million" },
        { notation: "100", description: "Regular amount" },
      ]
    },
    {
      category: "Cards & Streets",
      items: [
        { notation: "7h 8s Td", description: "Flop: 3 cards" },
        { notation: "Kc", description: "Turn/River: 1 card per line" },
        { notation: "ad5h 9h9c", description: "Showdown: hole cards" },
      ]
    }
  ];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg mb-6 sticky top-0 z-10 shadow-sm">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-blue-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <h2 className="text-lg font-semibold text-blue-800">
          CHIP Notation Reference
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-blue-600">
            {isCollapsed ? 'Show' : 'Hide'} Cheat Sheet
          </span>
          <svg 
            className={`w-5 h-5 text-blue-600 transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {!isCollapsed && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {referenceData.map((section, index) => (
              <div key={index} className="bg-white rounded-md p-3 border border-blue-100">
                <h3 className="font-medium text-blue-700 mb-2 text-sm">
                  {section.category}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-2 text-xs">
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-blue-600 font-mono min-w-0 flex-shrink-0">
                        {item.notation}
                      </code>
                      <span className="text-gray-600 leading-tight">
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-blue-600 space-y-1">
            <p>💡 <strong>Tip:</strong> CHIP notation uses a structured format:</p>
            <p><strong>Line 1:</strong> Header (blinds, ante, players, button)</p>
            <p><strong>Line 2:</strong> Stacks (UTG → BB order)</p>
            <p><strong>Line 3+:</strong> Actions, cards, and hole cards</p>
            <p>Stacks persist across hands unless explicitly updated.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChipReference;
