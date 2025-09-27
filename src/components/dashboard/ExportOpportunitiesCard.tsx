import React from 'react';

interface ExportOpportunity {
  id: number;
  country: string;
  product: string;
  potentialValue: string;
  growthRate: number;
}

interface ExportOpportunitiesCardProps {
  opportunities?: ExportOpportunity[];
}

const defaultOpportunities: ExportOpportunity[] = [
  {
    id: 1,
    country: 'Germany',
    product: 'Electric Vehicles',
    potentialValue: '$2.4M',
    growthRate: 24,
  },
  {
    id: 2,
    country: 'Canada',
    product: 'Organic Food',
    potentialValue: '$1.8M',
    growthRate: 18,
  },
  {
    id: 3,
    country: 'Singapore',
    product: 'Medical Devices',
    potentialValue: '$3.2M',
    growthRate: 15,
  },
];

const ExportOpportunitiesCard: React.FC<ExportOpportunitiesCardProps> = ({
  opportunities = defaultOpportunities,
}) => {
  return (
    <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-lg font-medium text-gray-900">Export Opportunities</h3>
        <button className="text-sm text-primary hover:text-secondary-dark">
          View all →
        </button>
      </div>
      
      <div className="space-y-4">
        {opportunities.slice(0, 3).map((opportunity) => (
          <div key={opportunity.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-900">
                  {opportunity.product}
                </div>
                <div className="text-sm text-gray-500">
                  to {opportunity.country}
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {opportunity.potentialValue}
                </div>
                <div className="text-sm text-emerald-600">
                  +{opportunity.growthRate}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportOpportunitiesCard;
