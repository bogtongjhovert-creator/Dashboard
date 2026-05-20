/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { CheckCircle2, Clock, PlayCircle } from 'lucide-react';

interface StatusDistribution {
  name: string;
  value: number;
  color: string;
}

interface StatusDonutChartProps {
  data: StatusDistribution[];
  total: number;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({ data, total }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const activePercent = activeItem && total > 0 ? Math.round((activeItem.value / total) * 100) : null;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const statusIcons: Record<string, any> = {
    Completed: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
    Ongoing: <PlayCircle className="h-4 w-4 text-indigo-400" />,
    Pending: <Clock className="h-4 w-4 text-amber-400" />,
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-zinc bg-card-base p-6">
      <div>
        <h4 className="font-sans text-lg font-bold text-white tracking-tight">
          Operational Efficiency
        </h4>
        <p className="text-xs text-zinc-400 mt-1">
          Real-time completion and workflow action ratios
        </p>
      </div>

      <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-4 sm:flex-row">
        {/* Ring Stage */}
        <div className="relative h-[160px] w-[160px] flex-shrink-0">
          {total === 0 ? (
            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 font-mono">
              Empty State
            </div>
          ) : (
            <>
              {/* Dynamic Overlay Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                {activeItem ? (
                  <>
                    <span className="text-2xl font-bold font-sans text-white leading-none">
                      {activeItem.value}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-450 uppercase mt-1 tracking-wider text-center">
                      {activeItem.name} ({activePercent}%)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-extrabold font-sans text-white leading-none">
                      {total}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-450 uppercase mt-1 tracking-wider leading-none text-center">
                      Total Tickets
                    </span>
                  </>
                )}
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeIndex ?? undefined}
                    activeShape={renderActiveShape}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={54}
                    outerRadius={68}
                    paddingAngle={2}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        style={{ cursor: 'pointer', outline: 'none' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Legend Grid */}
        <div className="flex-1 w-full space-y-2.5">
          {data.map((item, index) => {
            const isSelected = activeIndex === index;
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-center justify-between rounded-lg p-2 transition-all cursor-pointer ${
                  isSelected ? 'bg-[#27272a]/40 border border-[#27272a]' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {statusIcons[item.name] || <Clock className="h-4 w-4" />}
                  <span className="text-xs font-medium text-zinc-300">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-bold text-white">{item.value}</span>
                  <span className="text-[10px] text-zinc-500">({percentage}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
