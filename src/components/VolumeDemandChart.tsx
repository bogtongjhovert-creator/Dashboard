/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Layers, Building } from 'lucide-react';

interface VolumeData {
  name: string;
  count: number;
}

interface VolumeDemandChartProps {
  officeVolume: VolumeData[];
  typeVolume: VolumeData[];
}

export const VolumeDemandChart: React.FC<VolumeDemandChartProps> = ({
  officeVolume,
  typeVolume,
}) => {
  const [activeTab, setActiveTab] = useState<'type' | 'office'>('type');

  const currentData = activeTab === 'type' ? typeVolume : officeVolume;
  const activeColor = activeTab === 'type' ? '#6366f1' : '#06b6d4'; // Indigo vs Cyan

  // Custom tooltips
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-border-zinc bg-bg-deep/95 p-3 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
            {activeTab === 'type' ? 'Request Category' : 'Operating Office'}
          </p>
          <p className="text-sm font-bold text-white mt-0.5">{data.name}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeColor }} />
            <p className="font-mono text-xs text-zinc-300">
              <span className="font-bold text-white">{data.count}</span> request{data.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-zinc bg-card-base p-6">
      {/* Header with Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-sans text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Volume & Demand Dynamics
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Breakdown of tasks filtered by requesting departments or categories
          </p>
        </div>

        {/* Tab triggers */}
        <div className="inline-flex rounded-lg bg-bg-deep p-1 border border-border-zinc self-start">
          <button
            onClick={() => setActiveTab('type')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'type'
                ? 'bg-[#27272a]/60 text-indigo-300 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            By Request Type
          </button>
          <button
            onClick={() => setActiveTab('office')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'office'
                ? 'bg-[#27272a]/60 text-cyan-300 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Building className="h-3.5 w-3.5" />
            By Office
          </button>
        </div>
      </div>

      {/* Main Bar Chart */}
      <div className="mt-6 flex-1 min-h-[220px]">
        {currentData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500 font-mono">
            No record lines available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#52525b"
                fontSize={10}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
                dy={8}
              />
              <YAxis
                stroke="#52525b"
                fontSize={10}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
                dx={-4}
                allowDecimals={false}
              />
              <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }} content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={26}>
                {currentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeColor}
                    fillOpacity={0.8 - (index * 0.08 < 0.4 ? index * 0.08 : 0.4)}
                    stroke={activeColor}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
