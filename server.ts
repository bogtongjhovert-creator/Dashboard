/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import { z } from "zod";
import dotenv from "dotenv";
import { DEMO_REQUESTS } from "./src/demo-data";
import { RequestRow } from "./src/types";

// Load local environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Zod schema to validate and normalize a single Request row
const RowSchema = z.object({
  timestamp: z.string().default(() => new Date().toISOString()),
  office: z.string().min(1, "Office name cannot be empty"),
  requestType: z.string().min(1, "Request type cannot be empty"),
  dateNeeded: z.string().min(1, "Date Needed is required"),
  status: z.enum(["Pending", "Ongoing", "Completed"]).catch("Pending"),
  assigned: z.string().min(1, "Assigned name cannot be empty").catch("Unassigned"),
  completionDate: z.string().nullable().catch(null),
});

/**
 * Normalizes date values (which might come as MM/DD/YYYY or datetime in sheets) to simple YYYY-MM-DD
 */
function normalizeDate(rawVal: string | null | undefined): string | null {
  if (!rawVal || rawVal.trim() === "" || rawVal.toLowerCase() === "null" || rawVal === "-") {
    return null;
  }
  const str = rawVal.trim();
  // If already standard YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }
  // Try parsing to date
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    const d = new Date(parsed);
    const yr = d.getFullYear();
    const mo = String(d.getMonth() + 1).padStart(2, '0');
    const dy = String(d.getDate()).padStart(2, '0');
    return `${yr}-${mo}-${dy}`;
  }
  return str;
}

/**
 * Normalizes Timestamp values to standard ISO dates
 */
function normalizeTimestamp(rawVal: string | null | undefined): string {
  if (!rawVal || rawVal.trim() === "") {
    return new Date().toISOString();
  }
  const str = rawVal.trim();
  const parsed = Date.parse(str);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }
  return new Date().toISOString();
}

// API Route: Refresh/Sync with Google Sheets
app.get("/api/sync", async (req, res) => {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.SPREADSHEET_ID;
  const range = process.env.SPREADSHEET_RANGE || "Sheet1!A2:G1000";

  const isConfigured = !!(serviceAccountEmail && privateKey && spreadsheetId);

  if (!isConfigured) {
    // Return Demo database instantly with indicators
    console.log("[Sync API] Active Sheet configuration missing or incomplete. Serving premium Demo mode data.");
    return res.json({
      success: true,
      mode: "demo",
      spreadsheetId: null,
      sheetName: range.split("!")[0],
      data: DEMO_REQUESTS,
      message: "Syncing successful using Demo Mode. Please register Google Sheets Service Account to stream live operational data."
    });
  }

  try {
    // Normalizing newline chars in private key
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    // Attempt Google Sheets authorization
    const auth = new google.auth.JWT({
      email: serviceAccountEmail,
      key: privateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    console.log(`[Sync API] Contacting Google Sheets API for ID: ${spreadsheetId}, Range: ${range}`);
    
    // Fetch spreadsheet rows
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rawRows = response.data.values;
    if (!rawRows || rawRows.length === 0) {
      return res.json({
        success: true,
        mode: "live",
        spreadsheetId,
        sheetName: range.split("!")[0],
        data: [],
        message: "Connection established successfully, but the Google Sheet contains no request records or headers."
      });
    }

    // Map raw rows into typed objects and validate with Zod
    const parsedData: RequestRow[] = [];
    let validationCount = 0;

    for (let i = 0; i < rawRows.length; i++) {
      const row = rawRows[i];
      // columns maps: A=Timestamp, B=Office, C=Request Type, D=Date Needed, E=Status, F=Assigned, G=Completion Date
      const timestampRaw = row[0] || "";
      const officeRaw = row[1] || "";
      const requestTypeRaw = row[2] || "";
      const dateNeededRaw = row[3] || "";
      const statusRaw = row[4] || "Pending";
      const assignedRaw = row[5] || "Unassigned";
      const completionDateRaw = row[6] || null;

      // Handle raw normalization before running strict Zod check
      const normalizedRow = {
        timestamp: normalizeTimestamp(timestampRaw),
        office: String(officeRaw).trim(),
        requestType: String(requestTypeRaw).trim(),
        dateNeeded: normalizeDate(dateNeededRaw) || new Date().toISOString().split('T')[0],
        status: String(statusRaw).trim() as any, // Cast to any prior to validation
        assigned: String(assignedRaw).trim(),
        completionDate: normalizeDate(completionDateRaw),
      };

      const result = RowSchema.safeParse(normalizedRow);
      if (result.success) {
        parsedData.push(result.data as RequestRow);
      } else {
        validationCount++;
        // Gracefully keep best-effort parsing for user-facing smoothness
        parsedData.push({
          timestamp: normalizedRow.timestamp,
          office: normalizedRow.office || "Unknown Office",
          requestType: normalizedRow.requestType || "General Request",
          dateNeeded: normalizedRow.dateNeeded,
          status: ["Pending", "Ongoing", "Completed"].includes(normalizedRow.status) 
            ? (normalizedRow.status as any) 
            : "Pending",
          assigned: normalizedRow.assigned || "Staff",
          completionDate: normalizedRow.completionDate,
        });
      }
    }

    return res.json({
      success: true,
      mode: "live",
      spreadsheetId,
      sheetName: range.split("!")[0],
      data: parsedData,
      message: `Successfully sync'd ${parsedData.length} request lines from Google Sheets.${
        validationCount > 0 ? ` Resolved ${validationCount} irregular format headers/cells.` : ""
      }`
    });

  } catch (error: any) {
    console.error("[Sync API Error] Failed to fetch or process spreadsheet:", error.message);
    return res.status(500).json({
      success: false,
      mode: "demo",
      spreadsheetId: null,
      data: DEMO_REQUESTS,
      error: error.message,
      message: `Express API failed to pull Sheets directly: "${error.message}". Reverted safely to visual Demo Mode.`
    });
  }
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Express API and React Server] Booted successfully. Running on port ${PORT}`);
  });
}

startServer();
