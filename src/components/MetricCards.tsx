import React from 'react';
import { Users, Wallet, AlertTriangle, Fingerprint } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MetricCardsProps {
  connectedAccountsCount?: number;
  complaintsCount?: number;
  flaggedFlowFormatted?: string;
  signalsCount?: number;
  sharedDevicesCount?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  connectedAccountsCount = 6,
  complaintsCount = 3,
  flaggedFlowFormatted = '₹4.80L',
  signalsCount = 3,
  sharedDevicesCount = 1,
}) => {
  const { theme } = useTheme();

  const cards = [
    {
      title: 'Connected accounts',
      icon: Users,
      value: connectedAccountsCount.toString(),
      subtext: `Across ${complaintsCount} complaints`,
    },
    {
      title: 'Flagged fund flow',
      icon: Wallet,
      value: flaggedFlowFormatted,
      subtext: 'Requires verification',
    },
    {
      title: 'Investigation signals',
      icon: AlertTriangle,
      value: signalsCount.toString(),
      subtext: '2 priority • 1 contextual',
    },
    {
      title: 'Shared devices',
      icon: Fingerprint,
      value: sharedDevicesCount.toString(),
      subtext: 'Context, not a conclusion',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, i) => {
        const IconComponent = c.icon;
        return (
          <div
            key={i}
            className={`p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-[#111E1A] border-[#1A332B] hover:border-emerald-700/50 hover:shadow-lg'
                : 'bg-white border-slate-200/90 shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {c.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[#162B25] text-emerald-400'
                    : 'bg-[#EBF7EE] text-[#0A6436]'
                }`}
              >
                <IconComponent className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="mt-3">
              <span
                className={`text-2xl font-bold tracking-tight font-sans ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              >
                {c.value}
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>{c.subtext}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
