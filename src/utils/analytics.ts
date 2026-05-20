/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequestRow, Kpis } from '../types';

/**
 * Parses a date or timestamp string into a Date object representing the midnight of that day in UTC
 */
function getLocalDate(dateString: string | null): Date | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d;
}

export function computeKpis(data: RequestRow[]): Kpis {
  const total = data.length;
  if (total === 0) {
    return {
      totalRequests: 0,
      completionRate: 0,
      avgTurnaroundTime: 0,
      pendingCount: 0,
      ongoingCount: 0,
      completedCount: 0,
    };
  }

  let completed = 0;
  let pending = 0;
  let ongoing = 0;
  let totalTurnaroundMs = 0;
  let completedWithTimeCount = 0;

  data.forEach((row) => {
    if (row.status === 'Completed') {
      completed++;
      const createdDate = getLocalDate(row.timestamp);
      const compDate = getLocalDate(row.completionDate);
      if (createdDate && compDate) {
        const diffMs = compDate.getTime() - createdDate.getTime();
        // Limit minimum diff to 0
        const diffMsClamped = Math.max(0, diffMs);
        totalTurnaroundMs += diffMsClamped;
        completedWithTimeCount++;
      }
    } else if (row.status === 'Ongoing') {
      ongoing++;
    } else if (row.status === 'Pending') {
      pending++;
    }
  });

  const completionRate = Math.round((completed / total) * 100);
  
  // Calculate turnaround in days
  const avgTurnaroundMs = completedWithTimeCount > 0 ? totalTurnaroundMs / completedWithTimeCount : 0;
  const avgTurnaroundTime = Number((avgTurnaroundMs / (1000 * 60 * 60 * 24)).toFixed(1));

  return {
    totalRequests: total,
    completionRate,
    avgTurnaroundTime,
    pendingCount: pending,
    ongoingCount: ongoing,
    completedCount: completed,
  };
}

// Volume by office: returns { office: string, count: number }[]
export function computeVolumeByOffice(data: RequestRow[]): { name: string; count: number }[] {
  const map: Record<string, number> = {};
  data.forEach((row) => {
    const o = row.office || "Unknown";
    map[o] = (map[o] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Volume by Request Type: returns { type: string, count: number }[]
export function computeVolumeByType(data: RequestRow[]): { name: string; count: number }[] {
  const map: Record<string, number> = {};
  data.forEach((row) => {
    const t = row.requestType || "General";
    map[t] = (map[t] || 0) + 1;
  });
  return Object.entries(map)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Status breakdown: returns { name: string, value: number, color: string }[]
export function computeStatusDistribution(data: RequestRow[]): { name: string; value: number; color: string }[] {
  const kpis = computeKpis(data);
  return [
    { name: 'Completed', value: kpis.completedCount, color: '#10b981' }, // emerald
    { name: 'Ongoing', value: kpis.ongoingCount, color: '#6366f1' },     // indigo
    { name: 'Pending', value: kpis.pendingCount, color: '#f59e0b' },     // amber
  ];
}

// Workload per staff (only counts active Pending & Ongoing tasks)
export interface StaffWorkload {
  name: string;
  Pending: number;
  Ongoing: number;
  Completed: number;
  totalActive: number;
}
export function computeStaffWorkloads(data: RequestRow[]): StaffWorkload[] {
  const map: Record<string, { Pending: number; Ongoing: number; Completed: number }> = {};
  
  data.forEach((row) => {
    const s = row.assigned || "Unassigned";
    if (!map[s]) {
      map[s] = { Pending: 0, Ongoing: 0, Completed: 0 };
    }
    if (row.status === 'Pending') map[s].Pending++;
    if (row.status === 'Ongoing') map[s].Ongoing++;
    if (row.status === 'Completed') map[s].Completed++;
  });

  return Object.entries(map)
    .map(([name, counts]) => ({
      name,
      Pending: counts.Pending,
      Ongoing: counts.Ongoing,
      Completed: counts.Completed,
      totalActive: counts.Pending + counts.Ongoing,
    }))
    .sort((a, b) => b.totalActive - a.totalActive);
}

// Timeline Bottlenecks: groups by needed dates and computes delays
export interface TimelinePoint {
  date: string;          // YYYY-MM-DD
  dueCount: number;      // how many needed on this day
  resolvedCount: number; // how many completed on this day
}
export function computeTimelineAnalytics(data: RequestRow[]): TimelinePoint[] {
  const map: Record<string, { due: number; resolved: number }> = {};

  // Find range of dates needed or completed
  data.forEach((row) => {
    const dueStr = row.dateNeeded;
    if (dueStr) {
      if (!map[dueStr]) map[dueStr] = { due: 0, resolved: 0 };
      map[dueStr].due++;
    }

    const compStr = row.completionDate;
    if (compStr) {
      if (!map[compStr]) map[compStr] = { due: 0, resolved: 0 };
      map[compStr].resolved++;
    }
  });

  return Object.entries(map)
    .map(([date, counts]) => ({
      date,
      dueCount: counts.due,
      resolvedCount: counts.resolved,
    }))
    // Sort chronological
    .sort((a, b) => a.date.localeCompare(b.date))
    // Filter down to the last 15 data points for a punchy, clean graph outline
    .slice(-15);
}
