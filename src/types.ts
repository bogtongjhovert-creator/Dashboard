/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RequestRow {
  timestamp: string;      // Datetime
  office: string;         // Department/Office requesting
  requestType: string;    // e.g. "Service-Based", "Activity-Based" etc.
  dateNeeded: string;     // Date (YYYY-MM-DD)
  status: 'Pending' | 'Ongoing' | 'Completed';
  assigned: string;       // Staff name
  completionDate: string | null; // Date or Null
}

export interface Kpis {
  totalRequests: number;
  completionRate: number;      // percentage
  avgTurnaroundTime: number;   // average days from ticket creation (timestamp) to completion
  pendingCount: number;
  ongoingCount: number;
  completedCount: number;
}

export interface WorkspaceConfig {
  spreadsheetId: string | null;
  sheetName: string | null;
  mode: 'live' | 'demo';
}
