"use strict";

/**
 * Stops whichever process is LISTENING on the given TCP port (default 3000).
 * Avoids "Another next dev server is already running" when restarting Next.js on Windows.
 */

const { execSync } = require("child_process");

const port = process.argv[2] || "3000";
const portPattern = new RegExp(`:${port}\\s`);

function killWindowsListeners() {
  let output = "";
  try {
    output = execSync("netstat -ano", { encoding: "utf8" });
  } catch {
    return;
  }
  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    if (!line.includes("LISTENING")) continue;
    if (!portPattern.test(line)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  for (const pid of pids) {
    try {
      execSync(`taskkill /PID ${pid} /F`, { stdio: "pipe" });
      // eslint-disable-next-line no-console -- CLI helper
      console.log(`[young_wears] Freed port ${port}: stopped PID ${pid}`);
    } catch {
      /* Process may already be gone — OK */
    }
  }
}

function killUnixListeners() {
  try {
    const out = execSync(`lsof -ti:${port}`, { encoding: "utf8" });
    const pids = out.split(/\s+/).filter(Boolean);
    for (const pid of pids) {
      try {
        process.kill(Number(pid), "SIGKILL");
        // eslint-disable-next-line no-console -- CLI helper
        console.log(`[young_wears] Freed port ${port}: stopped PID ${pid}`);
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* Nothing listening */
  }
}

if (process.platform === "win32") {
  killWindowsListeners();
} else {
  killUnixListeners();
}
