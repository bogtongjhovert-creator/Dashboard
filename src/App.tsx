/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RefreshCw,
  Database,
  HelpCircle,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  ListFilter,
  Check,
  ChevronRight,
} from 'lucide-react';

import { RequestRow, Kpis, WorkspaceConfig } from './types';
import {
  computeKpis,
  computeVolumeByOffice,
  computeVolumeByType,
  computeStatusDistribution,
  computeStaffWorkloads,
  computeTimelineAnalytics,
} from './utils/analytics';

// Component imports
import { KpiCard } from './components/KpiCard';
import { VolumeDemandChart } from './components/VolumeDemandChart';
import { StatusDonutChart } from './components/StatusDonutChart';
import { WorkloadChart } from './components/WorkloadChart';
import { TimelineChart } from './components/TimelineChart';
import { RequestTable } from './components/RequestTable';

export default function App() {
  const [requests, setRequests] = useState<RequestRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string>('');
  
  const [config, setConfig] = useState<WorkspaceConfig>({
    spreadsheetId: null,
    sheetName: null,
    mode: 'demo',
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Sync / Fetch Function
  const fetchSheetData = async (isRef = false) => {
    if (isRef) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const res = await fetch('/api/sync');
      const payload = await res.json();
      
      if (payload.success) {
        setRequests(payload.data || []);
        setConfig({
          spreadsheetId: payload.spreadsheetId,
          sheetName: payload.sheetName || 'Sheet1',
          mode: payload.mode,
        });
        setSyncMessage(payload.message || '');
      } else {
        setSyncMessage(payload.message || 'Unable to sync with Sheets. Sandbox fallback activated.');
      }
    } catch (e: any) {
      console.error("Fetch failure:", e);
      setSyncMessage(`Critical connection error. Served secure fallback database.`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSheetData();
  }, []);

  // Compute metrics
  const kpis = computeKpis(requests);
  const officeVolume = computeVolumeByOffice(requests);
  const typeVolume = computeVolumeByType(requests);
  const statusDist = computeStatusDistribution(requests);
  const staffWorkloads = computeStaffWorkloads(requests);
  const timelinePoints = computeTimelineAnalytics(requests);

  return (
    <div className="min-h-screen bg-bg-deep text-zinc-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient background radial blobs */}
      <div className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] rounded-full bg-indigo-900/10 opacity-30 blur-[130px] pointer-events-none" />
      <div className="absolute left-1/3 top-1/2 -z-10 h-[450px] w-[450px] rounded-full bg-cyan-900/10 opacity-20 blur-[110px] pointer-events-none" />

      {/* Modern High-End Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border-zinc bg-bg-deep/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Title Brand */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/5">
                <FileSpreadsheet className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-indigo-400 font-bold leading-none block">
                  Operations Suite
                </span>
                <h1 className="font-sans text-lg font-extrabold text-white tracking-tight leading-normal">
                  OpsRequest Dashboard
                </h1>
              </div>
            </div>

            {/* Quick Actions & Indicators */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Sync Status Badge */}
              <div className={`hidden md:flex items-center gap-2 rounded-xl px-3.5 py-1.5 border font-mono text-xs ${
                config.mode === 'live'
                  ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15'
                  : 'bg-amber-500/5 text-amber-400 border-amber-500/15'
              }`}>
                <span className={`h-2.5 w-2.5 rounded-full ${
                  config.mode === 'live' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`} />
                <span>
                  {config.mode === 'live' ? 'Google Sheet Connected' : 'Demo Sandbox Mode'}
                </span>
              </div>

              {/* Help Button */}
              <button
                onClick={() => setIsHelpOpen(true)}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-border-zinc bg-bg-deep p-2.5 sm:px-4 sm:py-2 text-xs font-semibold text-zinc-400 hover:border-zinc-700 hover:text-white transition-all cursor-pointer"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Setup Instructions</span>
              </button>

              {/* Refresh Sync Button */}
              <button
                onClick={() => fetchSheetData(true)}
                disabled={isRefreshing || isLoading}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync Sheets</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        
        {/* Banner Informational Box for Sandbox / Errors */}
        {config.mode === 'demo' && (
          <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 backdrop-blur-md">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-amber-300">
                  Currently running in Offline Demo Sandbox
                </h5>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
                  {syncMessage ? `${syncMessage} ` : ""}
                  To stream live operational lines directly from your team's central Google Sheet, configure your Google Service Account Credentials in the application secrets. Click the "Setup Instructions" button for a detailed schema setup guide.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Skeleton Screen Loader */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            {/* KPI Cards Row Skeleton */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((val) => (
                <div key={val} className="h-32 rounded-2xl border border-border-zinc bg-card-base" />
              ))}
            </div>
            {/* Grid Row 1 Skeleton */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 h-[350px] rounded-2xl border border-border-zinc bg-card-base" />
              <div className="h-[350px] rounded-2xl border border-border-zinc bg-card-base" />
            </div>
            {/* Grid Row 2 Skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-[350px] rounded-2xl border border-border-zinc bg-card-base" />
              <div className="h-[350px] rounded-2xl border border-border-zinc bg-card-base" />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Bento Grid Layer 1: Hero KPI Row */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <KpiCard
                title="Total Request Volume"
                value={kpis.totalRequests}
                subtext="Cumulative ticket counts sync'd"
                icon={Database}
                accentColor="indigo"
              />
              <KpiCard
                title="Completion Delivery Rate"
                value={`${kpis.completionRate}%`}
                subtext={`Resolved: ${kpis.completedCount} / ${kpis.totalRequests} lines`}
                icon={CheckCircle2}
                accentColor="emerald"
              />
              <KpiCard
                title="Avg Turnaround Duration"
                value={kpis.completedCount > 0 ? `${kpis.avgTurnaroundTime} Days` : "N/A"}
                subtext="Speed from submission to deliverable"
                icon={Clock}
                accentColor="cyan"
              />
            </section>

            {/* Bento Grid Layer 2: Main Operational Breakdown Charts */}
            <section className="grid gap-6 lg:grid-cols-3">
              {/* Volume and Demand (Counts by Office & Type) */}
              <div className="lg:col-span-2">
                <VolumeDemandChart officeVolume={officeVolume} typeVolume={typeVolume} />
              </div>
              {/* Status Distribution ring */}
              <div>
                <StatusDonutChart data={statusDist} total={kpis.totalRequests} />
              </div>
            </section>

            {/* Bento Grid Layer 3: Secondary Operational Charts */}
            <section className="grid gap-6 lg:grid-cols-2">
              {/* Staff workloads */}
              <div>
                <WorkloadChart data={staffWorkloads} />
              </div>
              {/* Timeline analytic bottleneck line/area */}
              <div>
                <TimelineChart data={timelinePoints} />
              </div>
            </section>

            {/* Bottom Row / Section: Ticket Ledger Ledger */}
            <section className="pt-2">
              <RequestTable data={requests} />
            </section>

          </div>
        )}
      </main>

      {/* Floating Setup & Column Schema Help Drawer Panel */}
      <AnimatePresence>
        {isHelpOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHelpOpen(false)}
              className="fixed inset-0 z-50 bg-[#000]/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Sidebar Slider Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border-zinc bg-card-base p-6 shadow-2xl overflow-y-auto"
            >
              {/* Slider Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border-zinc">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-sans text-[16px] font-bold text-white uppercase tracking-wider">
                    Google Sheets Sync Guide
                  </h3>
                </div>
                <button
                  onClick={() => setIsHelpOpen(false)}
                  className="rounded-lg p-1.5 hover:bg-[#27272a]/45 border border-transparent hover:border-border-zinc text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Slider Content */}
              <div className="mt-6 flex-1 space-y-6 font-sans">
                
                {/* Expected Column Schema list */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white font-mono flex items-center gap-1.5 uppercase text-indigo-300">
                    <ListFilter className="h-4 w-4" />
                    Strict Column Header Setup
                  </h4>
                  <p className="text-xs text-zinc-400 leading-normal">
                    For sheets parsing to occur safely, configure your target Google Sheet with these exact headers in the <strong className="text-zinc-200">first row (A1:G1)</strong>:
                  </p>
                  
                  {/* Ledger column definitions */}
                  <div className="rounded-xl border border-border-zinc bg-bg-deep p-3.5 space-y-2.5 font-mono text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col A:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Timestamp</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Submitted Date & Time (e.g. MM/DD/YYYY HH:MM:ss)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col B:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Office</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Requesting Department (e.g. Marketing, Admissions)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col C:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Request Type</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Service format (e.g. Service-Based, Activity-Based)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col D:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Date Needed</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Target delivery date (e.g. YYYY-MM-DD)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col E:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Status</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Options: "Pending", "Ongoing", or "Completed"</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col F:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Assigned</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Name of the operator staff/owner</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-500 font-bold">Col G:</span>
                      <div>
                        <span className="text-cyan-400 font-bold">Completion Date</span>
                        <p className="text-[10px] text-zinc-550 mt-0.5">Date completed or empty if pending/ongoing</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Steps to authorized service manager */}
                <div className="space-y-3 pt-3 border-t border-border-zinc">
                  <h4 className="text-sm font-bold text-indigo-300 uppercase font-mono">
                    How to Authorized & Connecting:
                  </h4>
                  
                  <div className="space-y-4 text-xs text-zinc-400">
                    <div className="flex gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-bg-deep border border-border-zinc font-bold text-white font-mono shrink-0">1</span>
                      <p className="leading-relaxed">
                        Create a <strong className="text-zinc-200">Google Service Account</strong> in your GCP console and download the JSON credentials file.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-bg-deep border border-border-zinc font-bold text-white font-mono shrink-0">2</span>
                      <p className="leading-relaxed">
                        Copy the <strong className="text-zinc-200">client_email</strong> address from your Google credentials file. Open your target Google Sheet and <strong className="text-zinc-200">Share</strong> list access with this email as a viewer.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-bg-deep border border-border-zinc font-bold text-white font-mono shrink-0">3</span>
                      <p className="leading-relaxed">
                        Open your application's <strong className="text-zinc-200">Secrets panel</strong> in your AI Studio editor environment and register:
                      </p>
                    </div>

                    <ul className="pl-7 list-disc space-y-1.5 text-[11px] font-mono text-zinc-500">
                      <li><span className="text-indigo-400 font-bold font-mono">GOOGLE_SERVICE_ACCOUNT_EMAIL</span>: Service email copy</li>
                      <li><span className="text-indigo-400 font-bold font-mono">GOOGLE_PRIVATE_KEY</span>: Entire private key string</li>
                      <li><span className="text-indigo-400 font-bold font-mono">SPREADSHEET_ID</span>: Long id found within your sheet url</li>
                    </ul>

                    <div className="flex gap-2 pt-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-bg-deep border border-border-zinc font-semi font-mono shrink-0 text-emerald-400">✔</span>
                      <p className="leading-relaxed text-zinc-350">
                        Once saved, click the <strong className="text-white">"Sync Sheets"</strong> button in top header to witness your live operations data flow instantly!
                      </p>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Drawer footer */}
              <div className="mt-auto border-t border-border-zinc pt-4 flex justify-between items-center text-[10px] font-mono text-zinc-500">
                <span>API Version: v4</span>
                <span>Active Region: Global</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
