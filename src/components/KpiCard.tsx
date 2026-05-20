/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  accentColor: 'emerald' | 'indigo' | 'amber' | 'cyan';
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  accentColor,
}) => {
  const accentTheme = {
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'hover:border-emerald-500/30',
      glow: 'group-hover:shadow-emerald-500/5',
      badge: 'bg-emerald-500/20 text-emerald-300',
    },
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      border: 'hover:border-indigo-500/30',
      glow: 'group-hover:shadow-indigo-500/5',
      badge: 'bg-indigo-500/20 text-indigo-300',
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'hover:border-amber-500/30',
      glow: 'group-hover:shadow-amber-500/5',
      badge: 'bg-amber-500/20 text-amber-300',
    },
    cyan: {
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'hover:border-cyan-500/30',
      glow: 'group-hover:shadow-cyan-500/5',
      badge: 'bg-cyan-500/20 text-cyan-300',
    },
  }[accentColor];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`group relative overflow-hidden rounded-2xl border border-border-zinc bg-card-base p-6 transition-all duration-300 ${accentTheme.border} hover:shadow-2xl ${accentTheme.glow}`}
    >
      {/* Background soft glow */}
      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full blur-3xl opacity-20 transition-all duration-500 group-hover:scale-150 bg-current ${accentTheme.text}`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-zinc-400 transition-colors group-hover:text-zinc-350">
            {title}
          </p>
          <h3 className="font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${accentTheme.bg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`h-6 w-6 ${accentTheme.text}`} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${accentTheme.badge}`}>
          Active
        </span>
        <span className="text-xs text-zinc-500 font-mono">
          {subtext}
        </span>
      </div>
    </motion.div>
  );
};
