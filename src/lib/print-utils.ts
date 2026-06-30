"use client";

/**
 * Shared utilities for opening printable HTML in a new window/tab.
 *
 * Previously the codebase used `window.open("", "_blank") + document.write(html) +
 * window.onload = () => window.print()` — which had three problems:
 *
 *   1. **Auto-print dialog on load** — jarring UX, user has no control.
 *   2. **`document.write` is deprecated** and breaks with strict CSP.
 *   3. **`window.open` is blocked by popup blockers** in many browsers.
 *
 * This module replaces that pattern with a cleaner approach:
 *   - Open the HTML in a new tab via a Blob URL.
 *   - Show a fixed-position "Download Now / Print" button bar at the top
 *     of the new page (instead of auto-printing on load).
 *   - The button calls `window.print()` when clicked, OR the user can
 *     close the tab without printing.
 *
 * This preserves the print-to-PDF behavior (browser's native print dialog
 * lets users "Save as PDF") while removing the auto-print surprise.
 *
 * For PNG/copy-to-clipboard, see `copyHtmlAsPng` below — it renders the
 * HTML in a hidden iframe, rasterizes via an SVG `<foreignObject>` + canvas
 * pipeline (no external dependency), and writes the result to the clipboard.
 */

type PrintableOptions = {
  /** Filename to suggest for the downloaded HTML file (without extension). */
  filename?: string;
  /** Title for the new tab/window. */
  title?: string;
};

/**
 * Wrap an HTML document string with a "Download Now" button bar.
 * The bar appears at the top of the page, fixed-position. Clicking it
 * triggers `window.print()`. No auto-print on load.
 */
export function wrapHtmlWithDownloadBar(html: string, opts: PrintableOptions = {}): string {
  const { filename = "launchpad-document", title = "Launchpad" } = opts;
  // Inject the button bar right after <body> opening tag, OR prepend if no <body>.
  const buttonBar = `
<div id="lp-download-bar" style="position:fixed;top:0;left:0;right:0;z-index:9999;background:#0d1117;color:#fff;padding:10px 16px;display:flex;align-items:center;gap:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:13px;box-shadow:0 2px 8px rgba(0,0,0,0.2);">
  <span style="font-weight:600;">${escapeHtml(title)}</span>
  <span style="color:#9ca3af;font-size:12px;">· Ready to save</span>
  <div style="margin-left:auto;display:flex;gap:8px;">
    <button onclick="window.print()" style="background:linear-gradient(135deg,#2DD4BF,#E879F9,#FCD34D);color:#000;font-weight:600;padding:8px 16px;border:0;border-radius:6px;cursor:pointer;font-size:12px;">⬇ Download Now (Print to PDF)</button>
    <button onclick="window.close()" style="background:transparent;color:#9ca3af;padding:8px 12px;border:1px solid #374151;border-radius:6px;cursor:pointer;font-size:12px;">Close</button>
  </div>
</div>
<style>
  /* Push the printable content down below the bar when viewing on screen,
     but remove the offset when printing so the PDF is full-page. */
  body { padding-top: 56px !important; }
  @media print {
    body { padding-top: 0 !important; }
    #lp-download-bar { display: none !important; }
  }
  @page { margin: 0; }
</style>
<script>
  // Print the document title (used as the default filename by the browser's
  // "Save as PDF" dialog) — make it match the requested filename.
  document.title = ${JSON.stringify(filename)};
</script>
`;

  if (/<body[^>]*>/i.test(html)) {
    return html.replace(/<body[^>]*>/i, (match) => `${match}${buttonBar}`);
  }
  return `${buttonBar}${html}`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}

/**
 * Open an HTML document in a new browser tab using a Blob URL.
 * The page contains a "Download Now" button bar (no auto-print).
 * Falls back to a direct download if popups are blocked.
 *
 * Returns true on success, false if the popup was blocked.
 */
export function openPrintableHtml(html: string, opts: PrintableOptions = {}): boolean {
  if (typeof window === "undefined") return false;
  const { filename = "launchpad-document" } = opts;
  const wrapped = wrapHtmlWithDownloadBar(html, opts);

  const blob = new Blob([wrapped], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  // Try to open in a new tab — most modern browsers allow this when called
  // from a user-initiated click handler.
  const w = window.open(url, "_blank");
  if (!w) {
    // Popup blocked — fall back to a direct download of the HTML file.
    // The user can then open it locally and use the in-page button bar.
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Revoke the URL after the download starts (give it a moment).
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
    return false;
  }
  // Revoke the URL after 60s (the new tab has loaded by then).
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

/**
 * Render an HTML snippet in a hidden iframe, rasterize it to a PNG blob,
 * and write that blob to the clipboard.
 *
 * Uses the SVG <foreignObject> → <canvas> trick (no external dep like
 * html2canvas). Limitations:
 *  - External images / cross-origin resources may taint the canvas.
 *  - Web fonts must be embedded or the canvas will use fallbacks.
 *  - Older Safari (<14) doesn't support ClipboardItem.
 *
 * Returns true on success, false if unsupported or failed.
 */
export async function copyHtmlAsPng(
  html: string,
  opts: { width?: number; height?: number } = {},
): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") {
    return { ok: false, error: "Not in browser" };
  }
  if (!navigator.clipboard || !window.ClipboardItem || !("write" in navigator.clipboard)) {
    return { ok: false, error: "Clipboard API not supported in this browser. Use Download instead." };
  }

  const { width = 1200, height = 675 } = opts;

  // Build a full HTML doc that fits in the target dimensions, then
  // render via SVG <foreignObject> → <img> → <canvas>.
  const wrappedHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
    body { transform-origin: top left; }
  </style></head><body>${html}</body></html>`;

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">${svgEscape(wrappedHtml)}</foreignObject>
  </svg>`;

  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to render SVG to image"));
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: false, error: "Canvas 2D context unavailable" };
    ctx.drawImage(img, 0, 0, width, height);

    const pngBlob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    });

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": pngBlob }),
    ]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

/**
 * Render an HTML snippet in a hidden iframe, rasterize it to a PNG blob,
 * and trigger a download of the PNG file.
 */
export async function downloadHtmlAsPng(
  html: string,
  filename: string,
  opts: { width?: number; height?: number } = {},
): Promise<{ ok: boolean; error?: string }> {
  if (typeof window === "undefined") {
    return { ok: false, error: "Not in browser" };
  }
  const { width = 1200, height = 675 } = opts;

  const wrappedHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    html, body { margin: 0; padding: 0; width: ${width}px; height: ${height}px; overflow: hidden; }
  </style></head><body>${html}</body></html>`;

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <foreignObject width="100%" height="100%">${svgEscape(wrappedHtml)}</foreignObject>
  </svg>`;

  const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to render SVG to image"));
      img.src = svgUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { ok: false, error: "Canvas 2D context unavailable" };
    ctx.drawImage(img, 0, 0, width, height);

    const pngBlob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png");
    });

    const pngUrl = URL.createObjectURL(pngBlob);
    const a = document.createElement("a");
    a.href = pngUrl;
    a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(pngUrl), 30_000);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

function svgEscape(s: string): string {
  // SVG foreignObject requires the HTML to be XML-escaped
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
