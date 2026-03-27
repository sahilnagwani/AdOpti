import React, { useEffect, useState } from 'react';
import { KPIData } from '../../types/dashboard';
import { LoadingSkeleton } from './LoadingSkeleton';

interface KPICardsProps {
  data: KPIData | null;
  isLoading: boolean;
}

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Animated Number Component
const AnimatedNumber: React.FC<{ value: number; format?: (v: number) => string }> = ({ value, format }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 1000;
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      setDisplayValue(progress * value);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <>{format ? format(displayValue) : displayValue.toLocaleString('en-IN')}</>;
};

export const KPICards: React.FC<KPICardsProps> = ({ data, isLoading }) => {
  const cards = [
    {
      label: 'Total Spend',
      value: data?.totalSpend || 0,
      format: formatINR,
      icon: '💸',
      trend: '+12%', // mockup, in reality computed or fetched separately
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: data?.totalRevenue || 0,
      format: formatINR,
      icon: '📈',
      trend: '+24%',
      trendUp: true,
    },
    {
      label: 'Total Conversions',
      value: data?.totalConversions || 0,
      icon: '🎯',
      trend: '-2%',
      trendUp: false,
    },
    {
      label: 'ROAS',
      value: data?.roas || 0,
      format: (val: number) => `${val.toFixed(2)}x`,
      icon: '🔄',
      trend: '+10%',
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <span className="text-gray-500 font-medium text-sm">{card.label}</span>
            <span className="text-xl">{card.icon}</span>
          </div>
          
          <div>
            {isLoading ? (
              <LoadingSkeleton height="32px" className="mb-2 w-2/3" />
            ) : (
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                <AnimatedNumber value={card.value} format={card.format} />
              </div>
            )}
            
            {isLoading ? (
              <LoadingSkeleton height="16px" className="w-1/3" />
            ) : (
              <div className={`flex items-center text-sm font-medium ${card.trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                {card.trendUp ? '↑' : '↓'} {card.trend}
                <span className="text-gray-400 ml-1 font-normal">vs last period</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
