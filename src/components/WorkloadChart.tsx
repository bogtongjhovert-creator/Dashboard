/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users } from 'lucide-react';
import { StaffWorkload } from '../utils/analytics';

interface WorkloadChartProps {
  data: StaffWorkload[];
}

export const WorkloadChart: React.FC<WorkloadChartProps> = ({ data }) => {
  // Custom styled Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const staff = payload[0].payload;
      return (
        <div className="rounded-xl border border-border-zinc bg-bg-deep/95 p-3.5 shadow-xl backdrop-blur-md">
          <p className="text-xs font-semibold text-zinc-400 font-mono uppercase tracking-wider">
            Staff Workload
          </p>
          <p className="text-sm font-bold text-white mt-0.5 mb-2">{staff.name}</p>
          
          <div className="space-y-1">
            <div className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-1 text-xs text-zinc-350">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Ongoing
              </span>
              <span className="font-mono text-xs text-white font-bold">{staff.Ongoing}</span>
            </div>
            
            <div className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-1 text-xs text-zinc-350">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Pending
              </span>
              <span className="font-mono text-xs text-white font-bold">{staff.Pending}</span>
            </div>

            <div className="flex items-center gap-4 justify-between">
              <span className="flex items-center gap-1 text-xs text-zinc-350">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Completed
              </span>
              <span className="font-mono text-xs text-white font-bold">{staff.Completed}</span>
            </div>

            <div className="pt-1.5 border-t border-border-zinc flex items-center gap-4 justify-between font-mono text-xs">
              <span className="text-indigo-300">Total Active</span>
              <span className="text-indigo-300 font-bold">{staff.totalActive}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border-zinc bg-card-base p-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-sans text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Workload Allocation
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Identifies active and pending requests allocated across staff
          </p>
        </div>
        <Users className="h-5 w-5 text-zinc-500 flex-shrink-0" />
      </div>

      <div className="mt-6 flex-1 min-h-[220px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500 font-mono">
            No active assignments found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 10, left: -10, bottom: 0 }}
            >
              <XAxis
                type="number"
                stroke="#52525b"
                fontSize={10}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#52525b"
                fontSize={10}
                fontFamily="JetBrains Mono"
                tickLine={false}
                axisLine={false}
                width={85}
              />
              <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} content={<CustomTooltip />} />
              
              {/* Stacked bars: Ongoing (Indigo) + Pending (Amber) */}
              <Bar dataKey="Ongoing" stackId="workload" fill="#6366f1" radius={[0, 0, 0, 0]} barSize={14} />
              <Bar dataKey="Pending" stackId="workload" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Indicator */}
      <div className="mt-4 flex items-center justify-end gap-4 text-[10px] font-mono border-t border-border-zinc pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-zinc-400">Ongoing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span className="text-zinc-400">Pending</span>
        </div>
      </div>
    </div>
  );
};
