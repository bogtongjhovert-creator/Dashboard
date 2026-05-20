/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar } from 'lucide-react';
import { TimelinePoint } from '../utils/analytics';

interface TimelineChartProps {
  data: TimelinePoint[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  // Format dates for display, e.g., "May 15"
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Custom rich HTML tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="rounded-xl border border-border-zinc bg-bg-deep/95 p-3.5 shadow-xl backdrop-blur-md font-sans">
          <p className="text-xs font-semibold text-zinc-400 font-mono">
            {formatDate(point.date)} ({point.date})
          </p>
          <div className="mt-2 space-y-1.5">
            <div className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-350">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Requests Needed
              </span>
              <span className="font-mono text-xs font-bold text-white">{point.dueCount}</span>
            </div>

            <div className="flex items-center gap-3 justify-between">
              <span className="flex items-center gap-1.5 text-xs text-zinc-350">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Tickets Completed
              </span>
              <span className="font-mono text-xs font-bold text-white">{point.resolvedCount}</span>
            </div>

            {/* Micro analytical comparison */}
            {point.dueCount > point.resolvedCount ? (
              <div className="pt-2 mt-1.5 border-t border-border-zinc text-[10px] text-amber-400/90 font-mono">
                ▲ Bottleneck: {point.dueCount - point.resolvedCount} unresolved
              </div>
            ) : point.resolvedCount > point.dueCount && point.dueCount > 0 ? (
              <div className="pt-2 mt-1.5 border-t border-border-zinc text-[10px] text-emerald-400/95 font-mono">
                ✔ Clearing Backlog (+{point.resolvedCount - point.dueCount})
              </div>
            ) : null}
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
            Timeline Bottlenecks & Velocity
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Plottings of dates requested (Target) vs actual completed deliveries
          </p>
        </div>
        <Calendar className="h-5 w-5 text-zinc-500 flex-shrink-0" />
      </div>

      <div className="mt-6 flex-1 min-h-[220px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-zinc-500 font-mono">
            No scheduling timeline found
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#52525b"
                fontSize={10}
                fontFamily="JetBrains Mono"
                tickFormatter={formatDate}
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
                allowDecimals={false}
                dx={-4}
              />
              <Tooltip cursor={{ stroke: '#3f3f46', strokeWidth: 1 }} content={<CustomTooltip />} />
              
              {/* Target Needs Area */}
              <Area
                type="monotone"
                dataKey="dueCount"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDue)"
              />
              
              {/* Completion Overlay Area */}
              <Area
                type="monotone"
                dataKey="resolvedCount"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResolved)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend Indicators */}
      <div className="mt-4 flex items-center gap-4 text-[10px] font-mono border-t border-border-zinc pt-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-cyan-500" />
          <span className="text-zinc-400">Date Needed (Target)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-400">Date Completed (Actual)</span>
        </div>
      </div>
    </div>
  );
};
