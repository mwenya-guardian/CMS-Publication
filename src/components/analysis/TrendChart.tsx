import React from 'react';
import { TrendData } from '../../types/Analysis';

interface TrendChartProps {
  data: TrendData[];
  height?: number;
  className?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  height = 300, 
  className = '' 
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No trend data available</p>
      </div>
    );
  }

  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => Math.max(d.positive, d.neutral, d.negative)));
  if (maxValue === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <p className="text-gray-500">No sentiment data available</p>
      </div>
    );
  }

  // Calculate chart dimensions
  const chartWidth = 100; // percentage
  const chartHeight = height - 80; // leave space for labels and legend
  const padding = 40;

  // Generate SVG path for line
  const generatePath = (values: number[], color: string) => {
    if (values.length === 0) return '';
    
    const points = values.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');
    
    return points;
  };

  // Create data points for each sentiment
  const positiveValues = data.map(d => d.positive);
  const neutralValues = data.map(d => d.neutral);
  const negativeValues = data.map(d => d.negative);

  return (
    <div className={`${className}`} style={{ height }}>
      <div className="relative w-full" style={{ height: chartHeight }}>
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2 z-10">
          <span>{maxValue}</span>
          <span>{Math.floor(maxValue * 0.75)}</span>
          <span>{Math.floor(maxValue * 0.5)}</span>
          <span>{Math.floor(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative" style={{ width: 'calc(100% - 40px)' }}>
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
              <div
                key={ratio}
                className="absolute w-full border-t border-gray-200"
                style={{ bottom: `${ratio * 100}%` }}
              />
            ))}
          </div>

          {/* SVG for line chart */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Positive line */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth="0.3"
              points={generatePath(positiveValues, '#10b981')}
              className="drop-shadow-sm"
            />
            
            {/* Neutral line */}
            <polyline
              fill="none"
              stroke="#6b7280"
              strokeWidth="0.3"
              points={generatePath(neutralValues, '#6b7280')}
              className="drop-shadow-sm"
            />
            
            {/* Negative line */}
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="0.3"
              points={generatePath(negativeValues, '#ef4444')}
              className="drop-shadow-sm"
            />

            {/* Data points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * 100;
              const positiveY = 100 - (item.positive / maxValue) * 100;
              const neutralY = 100 - (item.neutral / maxValue) * 100;
              const negativeY = 100 - (item.negative / maxValue) * 100;

              return (
                <g key={index}>
                  {/* Positive point */}
                  <circle
                    cx={x}
                    cy={positiveY}
                    r="0.2"
                    fill="#10b981"
                    className="hover:r-1.5 cursor-pointer transition-all"
                  >
                    <title>{`${new Date(item.date).toLocaleDateString()}: Positive ${item.positive}`}</title>
                  </circle>
                  
                  {/* Neutral point */}
                  <circle
                    cx={x}
                    cy={neutralY}
                    r="0.2"
                    fill="#6b7280"
                    className="hover:r-1.5 cursor-pointer transition-all"
                  >
                    <title>{`${new Date(item.date).toLocaleDateString()}: Neutral ${item.neutral}`}</title>
                  </circle>
                  
                  {/* Negative point */}
                  <circle
                    cx={x}
                    cy={negativeY}
                    r="0.2"
                    fill="#ef4444"
                    className="hover:r-1.5 cursor-pointer transition-all"
                  >
                    <title>{`${new Date(item.date).toLocaleDateString()}: Negative ${item.negative}`}</title>
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Hover overlay for detailed tooltips */}
          <div className="absolute inset-0 flex">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex-1 relative group cursor-pointer"
                style={{ height: '100%' }}
              >
                {/* Invisible hover area */}
                <div className="w-full h-full" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  <div className="bg-black text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                    <div className="font-medium mb-1">{new Date(item.date).toLocaleDateString()}</div>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span>Positive: {item.positive}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                        <span>Neutral: {item.neutral}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                        <span>Negative: {item.negative}</span>
                      </div>
                      <div className="border-t border-gray-600 pt-1 mt-1">
                        <span>Total: {item.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="ml-10 mt-2 flex justify-between text-xs text-gray-500" style={{ width: 'calc(100% - 40px)' }}>
        {data.map((item, index) => {
          // Show every nth label to avoid crowding
          const showLabel = index === 0 || 
                           index === data.length - 1 || 
                           index % Math.ceil(data.length / 5) === 0;
          
          return (
            <span key={index} className={showLabel ? '' : 'invisible'}>
              {new Date(item.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center mt-4 space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-green-500 mr-2"></div>
          <span className="text-gray-600">Positive</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-gray-400 mr-2"></div>
          <span className="text-gray-600">Neutral</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
          <span className="text-gray-600">Negative</span>
        </div>
      </div>
    </div>
  );
};
