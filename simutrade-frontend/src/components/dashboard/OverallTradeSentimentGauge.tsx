import React from 'react';

interface SentimentData {
  score: number;
  status: string;
}

interface OverallTradeSentimentGaugeProps {
  data: SentimentData;
}

const OverallTradeSentimentGauge: React.FC<OverallTradeSentimentGaugeProps> = ({
  data,
}) => {
  const getSentimentColor = (score: number) => {
    if (score > 3.5) return '#10b981'; // green-500
    if (score > 2) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  };

  const color = getSentimentColor(data.score);

  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900">Trade Sentiment</h3>
      </div>
      
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="flex flex-col items-center">
          <div 
            className="text-5xl font-bold"
            style={{ color }}
          >
            {data.score.toFixed(1)}
          </div>
          <div 
            className="text-xl font-medium mt-1 mb-4"
            style={{ color }}
          >
            {data.status}
          </div>
          
          <div className="w-40">
            <div className="bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(data.score / 5) * 100}%`,
                  backgroundColor: color 
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>0</span>
              <span>5</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Information */}
      <div className="border-t border-gray-200/60 pt-4 mt-auto">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>
            <span className="font-semibold text-gray-700">156</span> Responses
          </div>
          <div className="font-semibold text-emerald-600">+8.3%</div>
        </div>
        <div className="text-xs text-gray-400 text-center mt-3">
          Updated 2 hours ago
        </div>
      </div>
    </div>
  );
};

export default OverallTradeSentimentGauge;
