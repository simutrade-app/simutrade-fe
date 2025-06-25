import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Spin,
  Steps,
  Tag,
  Space,
  Button,
  Row,
  Col,
  Progress,
  Alert,
  Tooltip,
  Divider,
} from 'antd';
import {
  RobotOutlined,
  CompassOutlined,
  FileSearchOutlined,
  CloudOutlined,
  DollarOutlined,
  ThunderboltOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  TeamOutlined,
  BulbOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  TrophyOutlined,
  GlobalOutlined,
  SendOutlined,
  ClockCircleOutlined,
  CarOutlined,
  ContainerOutlined,
  AimOutlined,
  EnvironmentOutlined,
  DesktopOutlined,
  SkinOutlined,
  CoffeeOutlined,
  MedicineBoxOutlined,
  HomeOutlined,
  CrownOutlined,
  GiftOutlined,
  BarChartOutlined,
  SecurityScanOutlined,
  RocketOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

interface ThinkingNode {
  id: number;
  title: string;
  content: string;
  type: 'route' | 'regulation' | 'weather' | 'cost' | 'risk' | 'recommendation';
}

interface AIThinkingProcessProps {
  simulationData: Record<string, unknown>;
  simulationResults: Record<string, any> | null;
  isSimulating: boolean;
  authToken?: string;
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

// Typewriter effect component
const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  speed = 50, 
  onComplete 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
  }, [text]);

  return <span>{displayText}</span>;
};

const getTransportIcon = (mode: string) => {
  switch (mode?.toLowerCase()) {
    case 'air':
      return <SendOutlined style={{ color: '#1890ff' }} />;
    case 'sea':
      return <ContainerOutlined style={{ color: '#52c41a' }} />;
    case 'land':
      return <CarOutlined style={{ color: '#fa8c16' }} />;
    default:
      return <GlobalOutlined style={{ color: '#722ed1' }} />;
  }
};

const getNodeIcon = (type: string) => {
  switch (type) {
    case 'route':
      return <CompassOutlined style={{ color: '#1890ff' }} />;
    case 'regulation':
      return <FileSearchOutlined style={{ color: '#722ed1' }} />;
    case 'weather':
      return <CloudOutlined style={{ color: '#13c2c2' }} />;
    case 'cost':
      return <DollarOutlined style={{ color: '#52c41a' }} />;
    case 'risk':
      return <WarningOutlined style={{ color: '#fa8c16' }} />;
    case 'recommendation':
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    default:
      return <ThunderboltOutlined style={{ color: '#eb2f96' }} />;
  }
};

// Commodities data mapping
const commodities = [
  { id: 1, name: 'Electronics', icon: '🔌' },
  { id: 2, name: 'Textiles', icon: '🧵' },
  { id: 3, name: 'Coffee', icon: '☕' },
  { id: 4, name: 'Automotive Parts', icon: '🚗' },
  { id: 5, name: 'Pharmaceuticals', icon: '💊' },
  { id: 6, name: 'Furniture', icon: '🪑' },
  { id: 7, name: 'Jewelry', icon: '💎' },
  { id: 8, name: 'Toys', icon: '🧸' },
];

const transportModes = {
  sea: { name: 'Sea Freight', icon: '🚢' },
  air: { name: 'Air Freight', icon: '✈️' },
  land: { name: 'Land Transport', icon: '🚚' },
};

const originCountries = [
  { id: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
  { id: 'MYS', name: 'Malaysia', flag: '🇲🇾' },
  { id: 'SGP', name: 'Singapore', flag: '🇸🇬' },
  { id: 'THA', name: 'Thailand', flag: '🇹🇭' },
  { id: 'VNM', name: 'Vietnam', flag: '🇻🇳' },
  { id: 'PHL', name: 'Philippines', flag: '🇵🇭' },
  { id: 'CURRENT', name: 'Current Location', flag: '📍' },
];

const AIThinkingProcess: React.FC<AIThinkingProcessProps> = ({
  simulationData,
  simulationResults,
  isSimulating,
}) => {
  const [loading, setLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Generate AI analysis using mock data with skeleton effect
  const generateAIAnalysis = async () => {
    if (!simulationResults) return;

    setLoading(true);
    setApiError(null);
    setAiAnalysis('');
    setTypewriterComplete(false);
    setAnalysisProgress(0);

    try {
      // Extract simulation info for mock response generation
      // Priority: simulationData (form data) > simulationResults (calculation results)
      const commodityIdForQuery = (simulationData as any)?.commodity ?? simulationResults.commodity;
      const commodityNameForQuery = commodities.find(c => String(c.id) === String(commodityIdForQuery))?.name || 'General Cargo';
      const transport = transportModes[(simulationData as any)?.transportMode as keyof typeof transportModes]?.name || 
                       transportModes[simulationResults.transportMode as keyof typeof transportModes]?.name || 'Sea Freight';
      // Handle origin extraction with current location support
      const originCountryId = (simulationData as any)?.originCountry || simulationResults.originCountry;
      let origin = 'Current Location';
      
      if (originCountryId === 'CURRENT') {
        // Check if there's current location data with detailed fallback
        const currentLocationName = (simulationData as any)?.currentLocation?.name || 
                                   simulationResults.currentLocation?.name ||
                                   // Try to extract from any other possible location data
                                   (simulationData as any)?.originLocation?.name ||
                                   simulationResults.originLocation?.name ||
                                   'Current Location';
        
        // Further enhance the location name if it's still generic
        if (currentLocationName === 'Current Location' || !currentLocationName) {
          // Try to get more specific location from geolocation data if available
          const lat = (simulationData as any)?.currentLocation?.lat || simulationResults.currentLocation?.lat;
          const lng = (simulationData as any)?.currentLocation?.lng || simulationResults.currentLocation?.lng;
          
          if (lat && lng) {
            // Provide a more specific name based on approximate location
            const approximateLocation = getLocationFromCoordinates(lat, lng);
            origin = approximateLocation || 'Current Location';
          } else {
            origin = 'Current Location';
          }
        } else {
          origin = currentLocationName;
        }
      } else {
        // Regular country lookup
        const originCountry = originCountries.find(c => c.id === originCountryId);
        origin = originCountry?.name || 'Current Location';
      }
      
      // Extract destination - prioritize simulationData (form input) over simulationResults
      const destination = (simulationData as any)?.destination?.name ||
                         (simulationData as any)?.destinationName ||
                         simulationResults.destination?.name ||
                         simulationResults.destinationName ||
                         'Selected Destination';

      // Debug logging for development
      console.log('🔍 Data extraction debug:', {
        simulationData: simulationData,
        simulationResults: simulationResults,
        originCountryId: originCountryId,
        currentLocationData: {
          fromSimulationData: (simulationData as any)?.currentLocation,
          fromSimulationResults: simulationResults.currentLocation
        },
        extracted: {
          commodity: commodityNameForQuery,
          transport: transport,
          origin: origin,
          destination: destination
        }
      });

      // Simulate realistic loading with progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 300);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Generate mock analysis based on parameters
      const mockAnalysis = generateMockAnalysis(commodityNameForQuery, transport, origin, destination);
      
      setAiAnalysis(mockAnalysis);
      setLoading(false);

    } catch (error) {
      console.error('Error generating AI analysis:', error);
      setApiError('Failed to generate AI analysis. Please try again.');
      setLoading(false);
      setAnalysisProgress(0);
    }
  };

  // Mock analysis generator with varied responses
  const generateMockAnalysis = (commodity: string, transport: string, origin: string, destination: string) => {
    // Extract more detailed simulation data
    const volume = simulationResults?.volume || '20 containers';
    const urgency = simulationResults?.urgency || 'standard';
    const budget = simulationResults?.budget || 'medium';
    const costEstimate = simulationResults?.costEstimate || 0;
    const timeEstimate = simulationResults?.timeEstimate || 0;
    
    const analysisTemplates = [
      {
        intro: `# 🔍 Strategic Trade Analysis\n## ${commodity} Shipment via ${transport}\n\n**Route:** ${origin} → ${destination}  \n**Volume:** ${volume}  \n**Priority:** ${urgency.charAt(0).toUpperCase() + urgency.slice(1)}  \n**Budget Tier:** ${budget.charAt(0).toUpperCase() + budget.slice(1)}\n\n---\n\n`,
        sections: [
          `## 🚢 Route Optimization\n\n${transport} from **${origin}** to **${destination}** offers ${getRouteInsight(transport)} advantages. Current market conditions favor this corridor with:\n\n- ✅ **Reduced congestion** (15% below average)\n- 💰 **Competitive pricing** (8% cost savings available)\n- ⚡ **Optimal scheduling** for ${urgency} priority shipments\n\n> **Expert Tip:** This route shows ${getSeasonalAdvantage()} during current season.`,
          
          `## 💰 Comprehensive Cost Analysis\n\n### Primary Costs\n| Component | Estimate | Notes |\n|-----------|----------|-------|\n| Transportation | ${getCostEstimate(transport)} | Base freight cost |\n| Documentation | $250-500 | Digital processing available |\n| Insurance | $${Math.round(costEstimate * 0.004)}-${Math.round(costEstimate * 0.005)} | 0.4-0.5% of cargo value |\n| Customs Clearance | $300-800 | Express clearance: +$200 |\n\n### 📊 **Total Estimated Cost: $${costEstimate.toLocaleString()}**\n\n**💡 Optimization Opportunities:**\n- Bulk shipping discount: **15-20% savings**\n- Off-peak timing: **10-15% reduction**\n- Digital documentation: **$150-300 savings**`,
          
          `## ⚠️ Risk Assessment Matrix\n\n${getRiskAnalysisDetailed(transport, origin, destination, urgency)}`,
          
          `## 📈 Market Intelligence\n\n### ${commodity} Market Dynamics\n${getMarketInsights(commodity)} \n\n**Current Market Indicators:**\n- 📊 Demand in ${destination}: **${getDemandTrend()}**\n- 💹 Price trends: **${getPricingTrend()}**\n- 🏭 Supply capacity: **${getCapacityUtilization()}%** utilized\n- ⏱️ Lead times: **${getProcessingTime()}**\n\n**Competitive Advantage:** ${getCompetitiveAdvantage(commodity, transport)}`,
          
          `## 🎯 Strategic Recommendations\n\n### Immediate Actions (Next 7 days)\n${getImmediateActions(transport, commodity, urgency)}\n\n### Short-term Optimizations (1-4 weeks)\n${getShortTermActions(transport, commodity, budget)}\n\n### Long-term Strategy (3-12 months)\n${getLongTermStrategy(origin, destination, commodity)}`
        ]
      },
      {
        intro: `# 📊 Comprehensive Trade Intelligence Report\n## ${commodity} Logistics Analysis\n\n**🛣️ Selected Route:** ${origin} ➜ ${destination}  \n**🚛 Transport Mode:** ${transport}  \n**📦 Shipment Volume:** ${volume}  \n**⏰ Transit Time:** ${timeEstimate} days  \n**💰 Total Investment:** $${costEstimate.toLocaleString()}\n\n---\n\n`,
        sections: [
          `## 🏆 Logistics Excellence Score\n\n### Performance Metrics\n- **Efficiency Rating:** ${getEfficiencyRating(transport)}/10\n- **Reliability Score:** ${getReliabilityScore(transport)}\n- **Cost Effectiveness:** ${getCostEffectiveness(transport, budget)}/10\n- **Speed Index:** ${getSpeedIndex(transport)}/10\n\n**Overall Grade:** ${getOverallGrade(transport, urgency)} ⭐\n\n> **Why this route works:** Your selected ${transport.toLowerCase()} demonstrates optimal efficiency for ${commodity} transport with ${getReliabilityScore(transport)} on-time delivery rate.`,
          
          `## 💰 Financial Intelligence\n\n### ROI Projection\n- **Expected ROI:** ${getROIPotential(commodity)}%\n- **Break-even timeline:** ${getBreakevenTime(commodity)} months\n- **Market appreciation:** ${getMarketAppreciation(commodity)}% annually\n\n### Cost Optimization Matrix\n| Strategy | Savings | Implementation |\n|----------|---------|----------------|\n| **Seasonal timing** | 15-20% | Schedule during Q2/Q3 |\n| **Volume consolidation** | 12-18% | Combine with other shipments |\n| **Digital workflow** | 5-8% | Electronic documentation |\n| **Insurance optimization** | 3-5% | Risk-based premium calculation |\n\n**🎯 Target Savings:** $${Math.round(costEstimate * 0.15).toLocaleString()} - $${Math.round(costEstimate * 0.25).toLocaleString()}`,
          
          `## 🌍 Regulatory Intelligence\n\n### Compliance Overview\n${getRegulatoryInsights(origin, destination)} \n\n**Documentation Requirements:**\n- ✅ Export permits: ${getPermitRequirement(commodity)}\n- ✅ Quality certificates: ${getQualityRequirement(commodity)}\n- ✅ Insurance documentation: Standard coverage\n- ✅ Customs declarations: ${getCustomsComplexity(origin, destination)}\n\n**Processing Timeline:** ${getProcessingTime()}  \n**Compliance Confidence:** ${getComplianceConfidence()}%`,
          
          `## 🔗 Supply Chain Optimization\n\n### Performance Indicators\n${getSupplyChainInsights(commodity, transport)}\n\n**Current Capacity Analysis:**\n- **Utilization Rate:** ${getCapacityUtilization()}%\n- **Booking Recommendation:** ${getBookingAdvice()}\n- **Peak Season Impact:** ${getPeakSeasonImpact(transport)}\n\n**🚀 Efficiency Boosters:**\n1. **Pre-clearance setup** → 30% faster customs\n2. **Preferred carrier status** → 10% cost reduction\n3. **Real-time tracking** → 95% visibility improvement`,
          
          `## 🎯 Action Plan & Next Steps\n\n### Phase 1: Immediate (1-7 days)\n${getPhase1Actions(transport, commodity, urgency)}\n\n### Phase 2: Execution (1-4 weeks)\n${getPhase2Actions(transport, commodity)}\n\n### Phase 3: Optimization (1-6 months)\n${getPhase3Actions(origin, destination, commodity)}\n\n**🏁 Success Metrics:**\n- On-time delivery: **${getOntimeTarget()}%**\n- Cost variance: **<5%**\n- Documentation accuracy: **100%**\n- Customer satisfaction: **>95%**`
        ]
      }
    ];

    const template = analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
    return template.intro + template.sections.join('\n\n---\n\n');
  };

  // Enhanced helper functions for more dynamic content
  const getSeasonalAdvantage = () => {
    const advantages = [
      'optimal weather conditions and reduced seasonal delays',
      'favorable monsoon patterns with minimal disruption',
      'peak efficiency window with 20% faster processing',
      'off-peak pricing advantages with reduced competition'
    ];
    return advantages[Math.floor(Math.random() * advantages.length)];
  };

  const getRiskAnalysisDetailed = (transport: string, origin: string, destination: string, urgency: string) => {
    const urgencyFactor = urgency === 'urgent' ? 'heightened' : urgency === 'low' ? 'minimal' : 'standard';
    
    return `### 🌦️ Weather & Environmental
**Risk Level:** ${getWeatherRisk(transport)}  
**Mitigation:** ${getWeatherMitigation(transport)}

### 🏛️ Political & Regulatory
**Stability Index:** ${getPoliticalStability(origin, destination)}/10  
**Trade Relations:** Stable corridor with established protocols

### 💱 Economic Factors
**Currency Volatility:** Monitor USD/${getCurrencyCode(origin)} (±3-5% monthly)  
**Fuel Surcharges:** ${getFuelSurcharge(transport)} potential impact

### ⚡ Operational Risks
**Priority Level:** ${urgencyFactor} monitoring required  
**Contingency Plans:** ${getContingencyPlan(transport)} backup options available`;
  };

  const getCompetitiveAdvantage = (commodity: string, transport: string) => {
    const advantages = {
      'Electronics': `Fast-track customs clearance for tech goods via ${transport.toLowerCase()}`,
      'Textiles': `Specialized handling for fabric preservation during ${transport.toLowerCase()} transport`,
      'Coffee': `Temperature-controlled ${transport.toLowerCase()} maintains premium quality`,
      'Automotive Parts': `Just-in-time delivery capability with ${transport.toLowerCase()} reliability`,
      'Pharmaceuticals': `Regulatory-compliant cold chain via certified ${transport.toLowerCase()} carriers`,
      'Furniture': `Damage-prevention protocols optimized for ${transport.toLowerCase()} handling`,
      'Jewelry': `High-security ${transport.toLowerCase()} routing with insurance coverage`,
      'Toys': `Safety compliance verification during ${transport.toLowerCase()} transit`
    };
    return advantages[commodity as keyof typeof advantages] || `Optimized ${transport.toLowerCase()} handling protocols`;
  };

  const getImmediateActions = (transport: string, commodity: string, urgency: string) => {
    const urgencyActions = urgency === 'urgent' 
      ? '🔥 **Priority booking** with expedited processing\n🚨 **24/7 monitoring** setup\n⚡ **Express documentation** preparation'
      : urgency === 'low'
      ? '📅 **Flexible scheduling** for cost optimization\n💰 **Budget carrier** evaluation\n📋 **Standard processing** timeline'
      : '🎯 **Preferred carrier** booking\n📊 **Real-time tracking** activation\n📄 **Digital documentation** preparation';
    
    return `1. **Secure ${transport.toLowerCase()} capacity** with preferred carrier\n2. ${urgencyActions}\n3. **Prepare ${commodity} documentation** package\n4. **Activate insurance** coverage (0.4% of cargo value)`;
  };

  const getShortTermActions = (transport: string, commodity: string, budget: string) => {
    const budgetActions = budget === 'high'
      ? '💎 **Premium service** tier selection\n🏆 **VIP handling** protocols\n🛡️ **Comprehensive insurance** coverage'
      : budget === 'low'
      ? '💰 **Economy options** evaluation\n📦 **Consolidation opportunities** exploration\n⏰ **Flexible timing** for discounts'
      : '⚖️ **Balanced service** level selection\n📊 **Cost-benefit** optimization\n🔄 **Service upgrade** options';
    
    return `1. ${budgetActions}\n2. **Establish ${commodity} handling** protocols\n3. **Set up customs** pre-clearance\n4. **Monitor ${transport.toLowerCase()} market** rates`;
  };

  const getLongTermStrategy = (origin: string, destination: string, commodity: string) => {
    return `1. **Build ${origin}-${destination}** trade partnership for volume discounts\n2. **Develop ${commodity} supply chain** optimization program\n3. **Establish preferred carrier** agreements (15-20% savings)\n4. **Create seasonal booking** strategy for peak efficiency\n5. **Implement technology** solutions for supply chain visibility`;
  };

  // Additional helper functions
  const getEfficiencyRating = (transport: string) => {
    const ratings = { 'Sea Freight': 8.5, 'Air Freight': 9.2, 'Land Transport': 7.8 };
    return ratings[transport as keyof typeof ratings] || 8.0;
  };

  const getCostEffectiveness = (transport: string, budget: string) => {
    const base = { 'Sea Freight': 9, 'Air Freight': 6, 'Land Transport': 8 };
    const budgetModifier = budget === 'high' ? 0 : budget === 'low' ? 1 : 0.5;
    return Math.min(10, (base[transport as keyof typeof base] || 7) + budgetModifier);
  };

  const getSpeedIndex = (transport: string) => {
    const speeds = { 'Sea Freight': 5, 'Air Freight': 10, 'Land Transport': 7 };
    return speeds[transport as keyof typeof speeds] || 6;
  };

  const getOverallGrade = (transport: string, urgency: string) => {
    if (transport === 'Air Freight' && urgency === 'urgent') return 'A+';
    if (transport === 'Sea Freight' && urgency === 'low') return 'A';
    return 'A-';
  };

  const getBreakevenTime = (commodity: string) => {
    const times = {
      'Electronics': '3-4', 'Textiles': '4-6', 'Coffee': '2-3', 'Automotive Parts': '5-7',
      'Pharmaceuticals': '1-2', 'Furniture': '6-8', 'Jewelry': '1-2', 'Toys': '4-5'
    };
    return times[commodity as keyof typeof times] || '4-6';
  };

  const getMarketAppreciation = (commodity: string) => {
    const rates = {
      'Electronics': '8-12', 'Textiles': '5-8', 'Coffee': '15-25', 'Automotive Parts': '6-10',
      'Pharmaceuticals': '20-30', 'Furniture': '10-15', 'Jewelry': '25-40', 'Toys': '12-18'
    };
    return rates[commodity as keyof typeof rates] || '10-15';
  };

  const getWeatherRisk = (transport: string) => {
    return transport === 'Sea Freight' ? 'Medium (monsoon awareness)' : 
           transport === 'Air Freight' ? 'Low (minimal impact)' : 'Low-Medium (seasonal)';
  };

  const getWeatherMitigation = (transport: string) => {
    return transport === 'Sea Freight' ? 'Alternative routing during storm season' :
           transport === 'Air Freight' ? 'Priority rebooking protocols' : 'Flexible scheduling options';
  };

  const getPoliticalStability = (origin: string, destination: string) => {
    return Math.floor(Math.random() * 2 + 8); // 8-9 for stable corridors
  };

  const getFuelSurcharge = (transport: string) => {
    const surcharges = { 'Sea Freight': '5-8%', 'Air Freight': '8-12%', 'Land Transport': '3-6%' };
    return surcharges[transport as keyof typeof surcharges] || '5-8%';
  };

  const getContingencyPlan = (transport: string) => {
    return transport === 'Sea Freight' ? '2-3 alternative carrier' :
           transport === 'Air Freight' ? '24-48hr alternative flight' : 'Multi-modal backup route';
  };

  const getPermitRequirement = (commodity: string) => {
    const requirements = {
      'Electronics': 'CE certification required',
      'Pharmaceuticals': 'FDA/regulatory approval needed',
      'Jewelry': 'Hallmark certification required'
    };
    return requirements[commodity as keyof typeof requirements] || 'Standard export permits';
  };

  const getQualityRequirement = (commodity: string) => {
    const requirements = {
      'Coffee': 'Quality grade certification',
      'Pharmaceuticals': 'GMP compliance certificate',
      'Electronics': 'Safety standard compliance'
    };
    return requirements[commodity as keyof typeof requirements] || 'Quality assurance documentation';
  };

  const getCustomsComplexity = (origin: string, destination: string) => {
    return Math.random() > 0.5 ? 'Standard complexity' : 'Moderate complexity';
  };

  const getComplianceConfidence = () => {
    return Math.floor(Math.random() * 5 + 95); // 95-99%
  };

  const getPeakSeasonImpact = (transport: string) => {
    return transport === 'Sea Freight' ? 'Q4 congestion (+15% time)' :
           transport === 'Air Freight' ? 'Holiday surcharge (+20% cost)' : 'Minimal seasonal impact';
  };

  const getOntimeTarget = () => {
    return Math.floor(Math.random() * 5 + 95); // 95-99%
  };

  const getPhase1Actions = (transport: string, commodity: string, urgency: string) => {
    return `• **Book ${transport.toLowerCase()} capacity** (${urgency === 'urgent' ? 'immediate' : '1-3 days'})\n• **Prepare ${commodity} documentation**\n• **Activate tracking systems**\n• **Confirm insurance coverage**`;
  };

  const getPhase2Actions = (transport: string, commodity: string) => {
    return `• **Execute ${transport.toLowerCase()} booking**\n• **Complete ${commodity} packaging**\n• **Submit customs documentation**\n• **Monitor transit progress**`;
  };

  const getPhase3Actions = (origin: string, destination: string, commodity: string) => {
    return `• **Analyze performance metrics**\n• **Optimize ${origin}-${destination} route**\n• **Build carrier relationships**\n• **Plan future ${commodity} shipments**`;
  };

  // ======= Newly added helper functions to avoid runtime errors =======

  const getRouteInsight = (transport: string) => {
    const insights = {
      'Sea Freight': 'high volume capacity and cost-efficiency',
      'Air Freight': 'speed and reliability',
      'Land Transport': 'flexible door-to-door coverage',
    } as Record<string, string>;
    return insights[transport] || 'balanced performance';
  };

  const getCostEstimate = (transport: string) => {
    const ranges = {
      'Sea Freight': '$18,000 – $26,000',
      'Air Freight': '$32,000 – $45,000',
      'Land Transport': '$12,000 – $20,000',
    } as Record<string, string>;
    return ranges[transport] || '$20,000 – $30,000';
  };

  const getDemandTrend = () => {
    const trends = ['strong upward', 'steady', 'slightly downward', 'volatile'];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getPricingTrend = () => {
    const trends = ['increasing', 'stable', 'decreasing', 'mixed'];
    return trends[Math.floor(Math.random() * trends.length)];
  };

  const getProcessingTime = () => {
    const times = ['2-4 days', '3-5 days', '5-7 days'];
    return times[Math.floor(Math.random() * times.length)];
  };

  const getMarketInsights = (commodity: string) => {
    const defaultInsight = `Global demand for ${commodity.toLowerCase()} is exhibiting moderate growth with regional variations.`;
    const insights: Record<string, string> = {
      Electronics: 'Semiconductor shortages are easing, boosting production capacity.',
      Coffee: 'Specialty coffee premiums remain high in North America and Europe.',
      Textiles: 'Sustainable fabric demand is driving new sourcing opportunities.',
      'Automotive Parts': 'EV component demand is accelerating, especially in EU markets.',
      Pharmaceuticals: 'Cold-chain capacity expansions are reducing spoilage risks.',
    };
    return insights[commodity] || defaultInsight;
  };

  const getReliabilityScore = (transport: string) => {
    const scores = { 'Sea Freight': '85%', 'Air Freight': '96%', 'Land Transport': '88%' } as Record<string, string>;
    return scores[transport] || '90%';
  };

  const getROIPotential = (commodity: string) => {
    const potentials: Record<string, string> = {
      Electronics: '22',
      Coffee: '35',
      Textiles: '15',
      Pharmaceuticals: '28',
      Furniture: '18',
    };
    return potentials[commodity] || '20';
  };

  const getRegulatoryInsights = (origin: string, destination: string) => {
    return `Bilateral trade agreements between ${origin} and ${destination} streamline customs procedures with preferential tariffs for certified goods.`;
  };

  const getSupplyChainInsights = (commodity: string, transport: string) => {
    return `Current ${transport.toLowerCase()} capacity for ${commodity.toLowerCase()} stands at **${getCapacityUtilization()}%**, with booking windows averaging **${getProcessingTime()}**.`;
  };

  const getBookingAdvice = () => {
    const advices = [
      'Book 3-4 weeks in advance to secure peak-season slots.',
      'Utilize flexible dates for better rates.',
      'Consolidate shipments to reach volume discounts.',
    ];
    return advices[Math.floor(Math.random() * advices.length)];
  };

  const getCapacityUtilization = () => {
    // Return a random utilization between 60 and 95 percent
    return Math.floor(Math.random() * 35 + 60); // 60-94
  };

  const getCurrencyCode = (countryCode: string) => {
    const codes: Record<string, string> = {
      IDN: 'IDR',
      MYS: 'MYR',
      SGP: 'SGD',
      THA: 'THB',
      VNM: 'VND',
      PHL: 'PHP',
    };
    return codes[countryCode] || 'USD';
  };

  // Helper function to get approximate location name from coordinates
  const getLocationFromCoordinates = (lat: number, lng: number): string => {
    // Southeast Asia region approximations - Order matters! More specific checks first
    if (lat >= -10 && lat <= 20 && lng >= 95 && lng <= 140) {
      // Singapore (very specific coordinates first)
      if (lat >= 1.2 && lat <= 1.5 && lng >= 103.6 && lng <= 104.2) return 'Singapore';
      
      // Malaysia (specific cities first)
      if (lat >= 2.8 && lat <= 3.4 && lng >= 101.3 && lng <= 102.0) return 'Kuala Lumpur, Malaysia';
      if (lat >= 1 && lat <= 7 && lng >= 100 && lng <= 119.5) return 'Malaysia';
      
      // Thailand
      if (lat >= 13.5 && lat <= 14.0 && lng >= 100.3 && lng <= 100.8) return 'Bangkok, Thailand';
      if (lat >= 5 && lat <= 20 && lng >= 97 && lng <= 106) return 'Thailand';
      
      // Vietnam
      if (lat >= 20.8 && lat <= 21.2 && lng >= 105.6 && lng <= 106.0) return 'Hanoi, Vietnam';
      if (lat >= 10.6 && lat <= 11.0 && lng >= 106.6 && lng <= 107.0) return 'Ho Chi Minh City, Vietnam';
      if (lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110) return 'Vietnam';
      
      // Philippines
      if (lat >= 14.4 && lat <= 14.8 && lng >= 120.8 && lng <= 121.2) return 'Manila, Philippines';
      if (lat >= 4 && lat <= 20 && lng >= 116 && lng <= 127) return 'Philippines';
      
      // Indonesia (last, as it has largest range)
      if (lat >= -6.5 && lat <= -5.5 && lng >= 106.5 && lng <= 107.0) return 'Jakarta, Indonesia';
      if (lat >= -8.0 && lat <= -7.5 && lng >= 110.0 && lng <= 111.0) return 'Semarang, Indonesia';
      if (lat >= -7.5 && lat <= -7.0 && lng >= 112.0 && lng <= 113.0) return 'Surabaya, Indonesia';
      if (lat >= 3.0 && lat <= 4.0 && lng >= 98.0 && lng <= 99.0) return 'Medan, Indonesia';
      if (lat >= -10 && lat <= 6 && lng >= 95 && lng <= 141) return 'Indonesia';
    }
    
    // Other major regions
    if (lat >= 35 && lat <= 50 && lng >= -125 && lng <= -70) return 'North America';
    if (lat >= 35 && lat <= 70 && lng >= -15 && lng <= 40) return 'Europe';
    if (lat >= -40 && lat <= 35 && lng >= -20 && lng <= 55) return 'Africa';
    if (lat >= -45 && lat <= 15 && lng >= -85 && lng <= -35) return 'South America';
    if (lat >= 25 && lat <= 45 && lng >= 25 && lng <= 70) return 'Middle East';
    if (lat >= 10 && lat <= 55 && lng >= 70 && lng <= 150) return 'Asia';
    if (lat >= -50 && lat <= -10 && lng >= 110 && lng <= 180) return 'Australia/Oceania';
    
    return 'Current Location';
  };
  // ======= End helper additions =======

  // Auto-generate analysis when simulation results are available
  useEffect(() => {
    if (simulationResults && !loading && !aiAnalysis) {
      generateAIAnalysis();
    }
  }, [simulationResults]);

  const renderSimulationResults = () => {
    if (!simulationResults) return null;

    const commodityId = simulationResults.commodity ?? (simulationData as any)?.commodity;
    const commodity = commodities.find(c => String(c.id) === String(commodityId));
    const transport = transportModes[simulationResults.transportMode as keyof typeof transportModes];
    const origin = originCountries.find(c => c.id === simulationResults.originCountry);

    return (
      <Card
        title={
          <Space>
            <TrophyOutlined style={{ color: '#52c41a' }} />
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
              Simulation Results
            </Title>
          </Space>
        }
        style={{
          background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
          border: '2px solid #b7eb8f',
          borderRadius: '16px',
          marginBottom: '24px',
        }}
        extra={<Tag color="green">Success</Tag>}
      >
        <Row gutter={[24, 16]}>
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {commodity?.icon || '📦'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Commodity
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {commodity?.name || 'Unknown'}
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {transport?.icon || '🚚'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Transport
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {transport?.name || 'Unknown'}
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {origin?.flag || '📍'}
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Origin
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {simulationResults.originCountry === 'CURRENT' && simulationResults.currentLocation
                  ? simulationResults.currentLocation.name
                  : origin?.name || 'Unknown'
                }
              </Text>
            </div>
          </Col>
          
          <Col xs={24} sm={12} md={6}>
            <div style={{ textAlign: 'center', padding: '16px' }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                🎯
              </div>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                Destination
              </Text>
              <Text strong style={{ fontSize: '14px' }}>
                {simulationResults.destination?.name || 'N/A'}
              </Text>
            </div>
          </Col>
        </Row>
        
        {(simulationResults.costEstimate || simulationResults.timeEstimate) && (
          <>
            <div style={{ height: '1px', background: '#d9f7be', margin: '16px 0' }} />
            <Row gutter={[24, 16]}>
              {simulationResults.costEstimate && (
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <DollarOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        Estimated Cost
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>
                        ${simulationResults.costEstimate?.toLocaleString()}
                      </Text>
                    </div>
                  </div>
                </Col>
              )}
              
              {simulationResults.timeEstimate && (
                <Col xs={24} sm={12}>
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        Estimated Time
                      </Text>
                      <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                        {simulationResults.timeEstimate} days
                      </Text>
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </>
        )}
      </Card>
    );
  };

  const renderAIAnalysis = () => {
    return (
      <Card
        title={
          <Space>
            <RobotOutlined style={{ color: '#722ed1' }} />
            <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
              AI Trade Analysis
            </Title>
          </Space>
        }
        style={{
          background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
          border: '2px solid #d3adf7',
          borderRadius: '16px',
        }}
        extra={
          <Space>
            <Tag color="purple">AI-Powered</Tag>
            {!loading && aiAnalysis && (
              <Tooltip title="Regenerate Analysis">
                <Button
                  icon={<ReloadOutlined />}
                  size="small"
                  onClick={generateAIAnalysis}
                  style={{ border: 'none', background: 'transparent' }}
                />
              </Tooltip>
            )}
          </Space>
        }
      >
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin 
              size="large" 
              indicator={<LoadingOutlined style={{ fontSize: 24, color: '#722ed1' }} spin />}
            />
            <div style={{ marginTop: '16px' }}>
              <Paragraph style={{ color: '#722ed1', marginBottom: '8px' }}>
                AI analyzing your trade scenario...
              </Paragraph>
              <Progress 
                percent={analysisProgress} 
                strokeColor="#722ed1"
                trailColor="#efdbff"
                size="small"
                style={{ maxWidth: '300px', margin: '0 auto' }}
              />
            </div>
          </div>
        )}

        {apiError && (
          <Alert
            message="Analysis Error"
            description={apiError}
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
            action={
              <Button size="small" onClick={generateAIAnalysis}>
                Retry
              </Button>
            }
          />
        )}

        {!loading && !apiError && aiAnalysis && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.9)', 
            padding: '20px', 
            borderRadius: '12px',
            border: '1px solid #d3adf7'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <Space>
                <BulbOutlined style={{ color: '#722ed1' }} />
                <Text strong style={{ color: '#722ed1' }}>AI Strategic Insights</Text>
                {typewriterComplete && (
                  <Tag color="green" style={{ fontSize: '11px' }}>
                    ✓ Analysis Complete
                  </Tag>
                )}
              </Space>
            </div>
            
            <div>
              {typewriterComplete ? (
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  {aiAnalysis.split('\n\n---\n\n').map((section, index) => {
                    const lines = section.split('\n');
                    const sectionTitle = lines.find(line => line.startsWith('##'))?.substring(3).replace(/[🔍📊🚢💰⚠️📈🌍🔗🎯🏆]/g, '').trim();
                    
                    if (!sectionTitle) {
                      return (
                        <div key={index} style={{ marginBottom: '16px' }}>
                          <div style={{ whiteSpace: 'pre-wrap', color: '#1f1f1f' }}>
                            {section}
                          </div>
                        </div>
                      );
                    }

                    const getSectionIcon = (title: string) => {
                      if (title.includes('Route') || title.includes('Logistics')) return <CompassOutlined style={{ color: '#1890ff' }} />;
                      if (title.includes('Cost') || title.includes('Financial')) return <DollarOutlined style={{ color: '#52c41a' }} />;
                      if (title.includes('Risk') || title.includes('Assessment')) return <WarningOutlined style={{ color: '#fa8c16' }} />;
                      if (title.includes('Market') || title.includes('Intelligence')) return <BarChartOutlined style={{ color: '#722ed1' }} />;
                      if (title.includes('Regulatory') || title.includes('Compliance')) return <SecurityScanOutlined style={{ color: '#13c2c2' }} />;
                      if (title.includes('Strategy') || title.includes('Action')) return <RocketOutlined style={{ color: '#eb2f96' }} />;
                      if (title.includes('Excellence') || title.includes('Performance')) return <TrophyOutlined style={{ color: '#faad14' }} />;
                      return <BulbOutlined style={{ color: '#722ed1' }} />;
                    };

                    const processContent = (content: string) => {
                      return content.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('##')) return null;
                        if (line.trim() === '') return <br key={lineIndex} />;
                        
                        // Handle bold text
                        if (line.includes('**')) {
                          const parts = line.split(/(\*\*[^*]+\*\*)/);
                          return (
                            <Text key={lineIndex} style={{ display: 'block', marginBottom: '4px' }}>
                              {parts.map((part, partIndex) => 
                                part.startsWith('**') && part.endsWith('**') ? 
                                  <Text key={partIndex} strong>{part.slice(2, -2)}</Text> : 
                                  part
                              )}
                            </Text>
                          );
                        }
                        
                        // Handle bullet points
                        if (line.startsWith('- ') || line.startsWith('• ')) {
                          return (
                            <div key={lineIndex} style={{ marginLeft: '16px', marginBottom: '4px' }}>
                              <Text style={{ color: '#666' }}>•</Text>
                              <Text style={{ marginLeft: '8px' }}>{line.substring(2)}</Text>
                            </div>
                          );
                        }
                        
                        // Handle tables (improved markdown table rendering)
                        if (line.includes('|') && !line.includes('---')) {
                          const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                          if (cells.length > 1) {
                            const isHeaderRow = lineIndex === 0 || content.split('\n')[lineIndex - 1]?.includes('|') === false;
                            return (
                              <div key={lineIndex} style={{ 
                                marginBottom: '8px', 
                                backgroundColor: isHeaderRow ? '#f0f0f0' : '#fafafa', 
                                borderRadius: '6px',
                                border: '1px solid #e6e6e6',
                                overflow: 'hidden'
                              }}>
                                <Row style={{ margin: 0 }}>
                                  {cells.map((cell, cellIndex) => (
                                    <Col 
                                      key={cellIndex} 
                                      span={24 / cells.length}
                                      style={{
                                        padding: '8px 12px',
                                        borderRight: cellIndex < cells.length - 1 ? '1px solid #e6e6e6' : 'none',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                    >
                                      <Text style={{ 
                                        fontSize: '13px', 
                                        fontWeight: isHeaderRow ? 'bold' : 'normal',
                                        color: isHeaderRow ? '#1f1f1f' : '#555',
                                        width: '100%'
                                      }}>
                                        {cell.replace(/\*\*/g, '')}
                                      </Text>
                                    </Col>
                                  ))}
                                </Row>
                              </div>
                            );
                          }
                        }
                        
                        // Handle quotes
                        if (line.startsWith('>')) {
                          return (
                            <div key={lineIndex} style={{
                              borderLeft: '4px solid #722ed1',
                              paddingLeft: '12px',
                              marginBottom: '8px',
                              fontStyle: 'italic',
                              color: '#666',
                              backgroundColor: '#f9f0ff',
                              padding: '8px 12px',
                              borderRadius: '6px'
                            }}>
                              {line.substring(1).trim()}
                            </div>
                          );
                        }
                        
                        return (
                          <Text key={lineIndex} style={{ display: 'block', marginBottom: '4px' }}>
                            {line}
                          </Text>
                        );
                      }).filter(Boolean);
                    };

                    return (
                      <Card
                        key={index}
                        size="small"
                        style={{
                          marginBottom: '16px',
                          borderRadius: '12px',
                          border: '1px solid #f0f0f0',
                          background: 'rgba(255, 255, 255, 0.8)',
                        }}
                        title={
                          <Space>
                            {getSectionIcon(sectionTitle)}
                            <Text strong style={{ color: '#1f1f1f' }}>{sectionTitle}</Text>
                          </Space>
                        }
                      >
                        <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
                          {processContent(section)}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#1f1f1f' }}>
                  <TypewriterText 
                    text={aiAnalysis} 
                    speed={20}
                    onComplete={() => setTypewriterComplete(true)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !apiError && !aiAnalysis && simulationResults && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={generateAIAnalysis}
              style={{
                background: 'linear-gradient(135deg, #722ed1 0%, #531dab 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                padding: '0 24px',
                fontSize: '16px',
              }}
            >
              Generate AI Analysis
            </Button>
          </div>
        )}

        {!simulationResults && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <BulbOutlined style={{ fontSize: '48px', color: '#d3adf7' }} />
            <Paragraph style={{ marginTop: '16px', color: '#722ed1' }}>
              Run a trade simulation to get AI-powered insights and analysis.
            </Paragraph>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div>
      {renderSimulationResults()}
      {renderAIAnalysis()}
    </div>
  );
};

export default AIThinkingProcess;

