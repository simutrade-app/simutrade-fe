import React from 'react';

interface TradingPartnerData {
  name: string;
  value: number;
  flag: string;
}

interface TopTradingPartnersListProps {
  data: TradingPartnerData[];
}

const TopTradingPartnersList: React.FC<TopTradingPartnersListProps> = ({
  data,
}) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Trading Partners</h3>
      </div>
      
      <div className="space-y-4 mb-6">
        {data.map((partner, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg">{partner.flag}</span>
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {partner.name}
                </div>
                <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${partner.value}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-600">
                {partner.value}%
              </span>
              <div className="text-xs text-gray-400">
                ${(Math.random() * 100 + 50).toFixed(1)}M
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional statistics */}
      <div className="border-t border-gray-100 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">24</div>
            <div className="text-xs text-gray-500">Total Partners</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-emerald-600">+12%</div>
            <div className="text-xs text-gray-500">Growth Rate</div>
          </div>
        </div>
        <div className="mt-3 text-center">
          <div className="text-sm text-gray-600">$425.3M total trade volume</div>
        </div>
      </div>
    </div>
  );
};

export default TopTradingPartnersList;
