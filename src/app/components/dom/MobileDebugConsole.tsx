"use client";

import { useEffect, useState, useRef } from "react";

// ---------------------------------------------------------------------------
// MobileDebugConsole — on-screen error/log viewer for mobile debugging.
//
// Captures console.error, console.warn, unhandled errors, and unhandled
// promise rejections. Renders them as a scrollable overlay toggled by a
// small floating button in the top-right corner.
//
// Remove this component once debugging is complete.
// ---------------------------------------------------------------------------

interface LogEntry {
  type: "error" | "warn" | "info";
  message: string;
  time: string;
}

export function MobileDebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const addLog = (type: LogEntry["type"], msg: string) => {
      const time = new Date().toLocaleTimeString("en-US", { hour12: false });
      setLogs((prev) => [...prev.slice(-80), { type, message: msg, time }]);
    };

    // Intercept console.error
    const origError = console.error;
    console.error = (...args: unknown[]) => {
      addLog("error", args.map(String).join(" "));
      origError.apply(console, args);
    };

    // Intercept console.warn
    const origWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      addLog("warn", args.map(String).join(" "));
      origWarn.apply(console, args);
    };

    // Global error handler
    const handleError = (e: ErrorEvent) => {
      addLog("error", `${e.message} (${e.filename}:${e.lineno})`);
    };

    // Unhandled promise rejection
    const handleRejection = (e: PromiseRejectionEvent) => {
      addLog("error", `Unhandled rejection: ${String(e.reason)}`);
    };

    // WebGL context loss detection
    const handleContextLost = () => {
      addLog("error", "WebGL context lost — GPU memory exhausted");
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);
    window.addEventListener("webglcontextlost", handleContextLost, true);

    // Log initial memory info if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const perf = performance as any;
    if (perf.memory) {
      addLog("info", `JS Heap: ${Math.round(perf.memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(perf.memory.jsHeapSizeLimit / 1024 / 1024)}MB`);
    }

    addLog("info", `UA: ${navigator.userAgent.slice(0, 80)}`);
    addLog("info", `Screen: ${screen.width}x${screen.height} @ ${devicePixelRatio}x`);

    return () => {
      console.error = origError;
      console.warn = origWarn;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      window.removeEventListener("webglcontextlost", handleContextLost, true);
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, open]);

  const colorMap = { error: "text-red-400", warn: "text-yellow-400", info: "text-blue-300" };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="fixed top-2 right-2 z-[9999] bg-red-600/80 text-white text-[10px] px-2 py-1 rounded-full backdrop-blur-sm"
      >
        {open ? "Close" : `Debug (${logs.filter((l) => l.type === "error").length})`}
      </button>

      {/* Log panel */}
      {open && (
        <div
          ref={scrollRef}
          className="fixed top-10 right-2 left-2 bottom-20 z-[9998] bg-black/95 border border-white/10 rounded overflow-y-auto p-3"
          style={{ fontSize: "10px", fontFamily: "monospace" }}
        >
          {logs.length === 0 && (
            <p className="text-white/30">No logs yet. Interact with the page.</p>
          )}
          {logs.map((log, i) => (
            <div key={i} className={`mb-1 ${colorMap[log.type]}`}>
              <span className="text-white/30">[{log.time}]</span>{" "}
              <span className="text-white/50">[{log.type.toUpperCase()}]</span>{" "}
              {log.message}
            </div>
          ))}
          <button
            onClick={() => setLogs([])}
            className="mt-2 text-white/30 border border-white/10 px-2 py-1 rounded text-[9px]"
          >
            Clear
          </button>
        </div>
      )}
    </>
  );
}

export default MobileDebugConsole;
