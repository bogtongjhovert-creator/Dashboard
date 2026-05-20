/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RequestRow } from './types';

export const DEMO_REQUESTS: RequestRow[] = [
  {
    timestamp: "2026-05-01T08:30:00Z",
    office: "Admissions",
    requestType: "Service-Based",
    dateNeeded: "2026-05-08",
    status: "Completed",
    assigned: "Alice Smith",
    completionDate: "2026-05-07"
  },
  {
    timestamp: "2026-05-02T10:15:00Z",
    office: "Marketing",
    requestType: "Activity-Based",
    dateNeeded: "2026-05-12",
    status: "Completed",
    assigned: "Bob Jones",
    completionDate: "2026-05-11"
  },
  {
    timestamp: "2026-05-03T14:45:00Z",
    office: "Student Services",
    requestType: "Service-Based",
    dateNeeded: "2026-05-10",
    status: "Completed",
    assigned: "Charlie Brown",
    completionDate: "2026-05-10"
  },
  {
    timestamp: "2026-05-05T09:00:00Z",
    office: "Admissions",
    requestType: "Design-Based",
    dateNeeded: "2026-05-15",
    status: "Completed",
    assigned: "Alice Smith",
    completionDate: "2026-05-14"
  },
  {
    timestamp: "2026-05-06T11:20:00Z",
    office: "HR",
    requestType: "Service-Based",
    dateNeeded: "2026-05-20",
    status: "Ongoing",
    assigned: "Charlie Brown",
    completionDate: null
  },
  {
    timestamp: "2026-05-08T16:00:00Z",
    office: "Marketing",
    requestType: "Activity-Based",
    dateNeeded: "2026-05-18",
    status: "Completed",
    assigned: "Bob Jones",
    completionDate: "2026-05-19" // delayed by 1 day
  },
  {
    timestamp: "2026-05-09T13:10:00Z",
    office: "Registrar",
    requestType: "Print-Based",
    dateNeeded: "2026-05-14",
    status: "Completed",
    assigned: "Alice Smith",
    completionDate: "2026-05-13"
  },
  {
    timestamp: "2026-05-10T15:30:00Z",
    office: "IT Services",
    requestType: "Service-Based",
    dateNeeded: "2026-05-18",
    status: "Completed",
    assigned: "Charlie Brown",
    completionDate: "2026-05-17"
  },
  {
    timestamp: "2026-05-12T09:45:00Z",
    office: "Marketing",
    requestType: "Digital-Campaign",
    dateNeeded: "2026-05-22",
    status: "Ongoing",
    assigned: "Bob Jones",
    completionDate: null
  },
  {
    timestamp: "2026-05-13T10:00:00Z",
    office: "Student Services",
    requestType: "Design-Based",
    dateNeeded: "2026-05-25",
    status: "Ongoing",
    assigned: "Alice Smith",
    completionDate: null
  },
  {
    timestamp: "2026-05-14T11:00:00Z",
    office: "Registrar",
    requestType: "Service-Based",
    dateNeeded: "2026-05-22",
    status: "Ongoing",
    assigned: "Charlie Brown",
    completionDate: null
  },
  {
    timestamp: "2026-05-15T14:20:00Z",
    office: "Admissions",
    requestType: "Activity-Based",
    dateNeeded: "2026-05-26",
    status: "Pending",
    assigned: "Alice Smith",
    completionDate: null
  },
  {
    timestamp: "2026-05-16T16:40:00Z",
    office: "Student Services",
    requestType: "Print-Based",
    dateNeeded: "2026-05-24",
    status: "Completed",
    assigned: "Bob Jones",
    completionDate: "2026-05-22"
  },
  {
    timestamp: "2026-05-17T09:12:00Z",
    office: "HR",
    requestType: "Design-Based",
    dateNeeded: "2026-05-28",
    status: "Pending",
    assigned: "Charlie Brown",
    completionDate: null
  },
  {
    timestamp: "2026-05-18T10:30:00Z",
    office: "Marketing",
    requestType: "Digital-Campaign",
    dateNeeded: "2026-05-27",
    status: "Ongoing",
    assigned: "Bob Jones",
    completionDate: null
  },
  {
    timestamp: "2026-05-18T13:00:00Z",
    office: "IT Services",
    requestType: "Service-Based",
    dateNeeded: "2026-05-20",
    status: "Completed",
    assigned: "Charlie Brown",
    completionDate: "2026-05-20"
  },
  {
    timestamp: "2026-05-19T11:00:00Z",
    office: "Admissions",
    requestType: "Digital-Campaign",
    dateNeeded: "2026-05-30",
    status: "Pending",
    assigned: "Alice Smith",
    completionDate: null
  },
  {
    timestamp: "2026-05-19T15:50:00Z",
    office: "Marketing",
    requestType: "Print-Based",
    dateNeeded: "2026-05-28",
    status: "Pending",
    assigned: "Bob Jones",
    completionDate: null
  },
  {
    timestamp: "2026-05-20T08:00:00Z",
    office: "Student Services",
    requestType: "Service-Based",
    dateNeeded: "2026-05-29",
    status: "Pending",
    assigned: "Charlie Brown",
    completionDate: null
  },
  {
    timestamp: "2025-11-10T10:00:00Z",
    office: "Marketing",
    requestType: "Service-Based",
    dateNeeded: "2025-11-15",
    status: "Completed",
    assigned: "Alice Smith",
    completionDate: "2025-11-14"
  },
  {
    timestamp: "2025-11-12T11:30:00Z",
    office: "HR",
    requestType: "Activity-Based",
    dateNeeded: "2025-11-20",
    status: "Completed",
    assigned: "Bob Jones",
    completionDate: "2025-11-19"
  }
];
