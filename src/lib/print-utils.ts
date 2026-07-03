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
 * Render an HTML snippet in a hidden off-screen DOM node, rasterize it to
 * a PNG blob using `html-to-image`, and write that blob to the clipboard.
 *
 * Section 12 fix: the previous implementation used the SVG
 * `<foreignObject>` → `<img>` → `<canvas>` pipeline, which ALWAYS taints
 * the canvas per the HTML spec (foreignObject content is treated as
 * untrusted by the canvas security model, regardless of whether the HTML
 * inside contains external images). This caused
 * `canvas.toBlob()` to throw "Tainted canvases may not be exported".
 *
 * `html-to-image` avoids the taint by rendering real DOM nodes (not an
 * SVG-foreignObject) and supports `cacheBust` + `skipFonts` for reliability.
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

  // Build an off-screen host element with the exact target dimensions.
  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${width}px;height:${height}px;overflow:hidden;background:#0d1117;`;
  host.innerHTML = html;
  document.body.appendChild(host);

  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(host, {
      width,
      height,
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#0d1117",
    });
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    host.remove();
  }
}

/**
 * Render an HTML snippet in a hidden off-screen DOM node, rasterize it to
 * a PNG blob using `html-to-image`, and trigger a download of the PNG file.
 *
 * Section 12-13 fix: same root cause as `copyHtmlAsPng` above — replaced
 * the SVG-foreignObject pipeline (which always tainted the canvas) with
 * `html-to-image`'s real-DOM rasterization.
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

  const host = document.createElement("div");
  host.style.cssText = `position:fixed;left:-99999px;top:0;width:${width}px;height:${height}px;overflow:hidden;background:#0d1117;`;
  host.innerHTML = html;
  document.body.appendChild(host);

  try {
    const { toPng } = await import("html-to-image");
    const dataUrl = await toPng(host, {
      width,
      height,
      cacheBust: true,
      pixelRatio: 1,
      backgroundColor: "#0d1117",
    });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    host.remove();
  }
}
