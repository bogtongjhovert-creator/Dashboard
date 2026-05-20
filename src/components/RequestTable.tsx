/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { RequestRow } from '../types';
import { Search, SlidersHorizontal, CheckCircle2, PlayCircle, Clock, ArrowUpDown } from 'lucide-react';

interface RequestTableProps {
  data: RequestRow[];
}

export const RequestTable: React.FC<RequestTableProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof RequestRow>('timestamp');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const itemsPerPage = 8;

  // Status mapping colors and icons
  const statusStyles: Record<string, { badge: string; icon: any }> = {
    Completed: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    Ongoing: {
      badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      icon: <PlayCircle className="h-3.5 w-3.5" />,
    },
    Pending: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: <Clock className="h-3.5 w-3.5" />,
    },
  };

  const handleSort = (field: keyof RequestRow) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const query = searchQuery.toLowerCase();
      // Search matches Office, Request Type, or Assigned staff
      const matchesSearch =
        row.office.toLowerCase().includes(query) ||
        row.requestType.toLowerCase().includes(query) ||
        row.assigned.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || row.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  // Sorting logic
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      let valA = a[sortField] || '';
      let valB = b[sortField] || '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return 0;
    });
    return list;
  }, [filteredData, sortField, sortDirection]);

  // Pagination bounds
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage) || 1;

  // Watch filter shifts to reset page numbers safely
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Convert raw ISO string to localized human format
  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border-zinc bg-card-base p-6">
      {/* Title block */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-sans text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Ticket Ledger & Operations Ledger
          </h4>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time audit view of all incoming marketing, design and service request lines
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-bg-deep px-3 py-1.5 rounded-lg border border-border-zinc">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>Listing {filteredData.length} records</span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col gap-3 py-3 border-y border-border-zinc sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search departments, staff, type..."
            value={searchQuery}
            onChange={handleQueryChange}
            className="w-full rounded-xl border border-border-zinc bg-bg-deep pb-2.5 pl-10 pr-4 pt-2.5 font-mono text-xs text-white placeholder-zinc-500 transition-all focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Status quick select pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <SlidersHorizontal className="h-4 w-4 text-zinc-500 mr-1 hidden sm:inline" />
          {['All', 'Completed', 'Ongoing', 'Pending'].map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => handleStatusFilterChange(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 border border-indigo-550 text-white shadow-md'
                    : 'bg-bg-deep border border-border-zinc text-zinc-400 hover:border-zinc-700 hover:text-white'
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* Ledger Table Grid */}
      <div className="overflow-x-auto -mx-6 sm:mx-0">
        <table className="w-full text-left border-collapse min-w-[650px] px-6 sm:px-0">
          <thead>
            <tr className="border-b border-border-zinc text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('timestamp')}>
                <span className="flex items-center gap-1">
                  Submitted <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('office')}>
                <span className="flex items-center gap-1">
                  Office <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('requestType')}>
                <span className="flex items-center gap-1">
                  Request Type <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('dateNeeded')}>
                <span className="flex items-center gap-1">
                  Target Date <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('status')}>
                <span className="flex items-center gap-1">
                  Status <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('assigned')}>
                <span className="flex items-center gap-1">
                  Staff <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('completionDate')}>
                <span className="flex items-center gap-1">
                  Completed <ArrowUpDown className="h-3 w-3" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-zinc/40">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-xs text-zinc-500 font-mono">
                  No request line items match the filtering criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const style = statusStyles[row.status] || { badge: 'bg-zinc-800 text-zinc-400', icon: null };
                const formattedCompletion = row.completionDate ? formatTimestamp(row.completionDate) : '-';
                
                return (
                  <tr
                    key={row.timestamp + index}
                    className="hover:bg-zinc-800/20 transition-all font-mono text-xs text-zinc-300"
                  >
                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-zinc-450 text-[11px]">
                      {formatTimestamp(row.timestamp)}
                    </td>
                    {/* Office */}
                    <td className="py-3.5 px-4 font-sans font-medium text-white text-sm">
                      {row.office}
                    </td>
                    {/* Request Type */}
                    <td className="py-3.5 px-4 text-zinc-400">
                      {row.requestType}
                    </td>
                    {/* Date Needed */}
                    <td className="py-3.5 px-4 text-cyan-400/90 text-xs font-semibold">
                      {row.dateNeeded}
                    </td>
                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${style.badge}`}>
                        {style.icon}
                        <span>{row.status}</span>
                      </span>
                    </td>
                    {/* Assigned */}
                    <td className="py-3.5 px-4 font-sans text-sm font-semibold text-zinc-350">
                      {row.assigned}
                    </td>
                    {/* Completion Date */}
                    <td className={`py-3.5 px-4 text-xs font-semibold ${row.status === 'Completed' ? 'text-emerald-400/95' : 'text-zinc-550'}`}>
                      {formattedCompletion}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination control footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border-zinc pt-4 mt-2">
          <p className="text-[10px] font-mono text-zinc-500">
            Page {currentPage} of {totalPages} ({filteredData.length} records filtered)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-border-zinc bg-bg-deep px-3 py-1.5 text-xs text-zinc-400 transition-all hover:bg-[#27272a]/40 disabled:opacity-40 font-semibold cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-border-zinc bg-bg-deep px-3 py-1.5 text-xs text-zinc-400 transition-all hover:bg-[#27272a]/40 disabled:opacity-40 font-semibold cursor-pointer"
            >
               Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
