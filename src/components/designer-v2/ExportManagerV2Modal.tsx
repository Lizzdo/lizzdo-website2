import React, { useState } from "react";
import { Download, Sparkles, AlertCircle, CheckCircle, FileCode, FileImage, ShieldCheck } from "lucide-react";
import { DesignState, ExportFormat, ExportQuality, ProfessionalExportOptions } from "../../types/designer";
import { prepareDesignStateForExport, renderArtworkFormat, AssetDiagnostic } from "../../utils/exportEngine";

interface ExportManagerV2ModalProps {
  state: DesignState;
  onClose: () => void;
}

export default function ExportManagerV2Modal({ state, onClose }: ExportManagerV2ModalProps) {
  const [format, setFormat] = useState<ExportFormat>("png");
  const [quality, setQuality] = useState<ExportQuality>(2);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");
  const [diagnostics, setDiagnostics] = useState<AssetDiagnostic[]>([]);
  const [downloadReadyUrl, setDownloadReadyUrl] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress("Running CORS diagnostic & preparing artwork layers...");
    setDownloadReadyUrl(null);

    try {
      // 1. Prepare & sanitize asset URLs
      const { sanitizedState, diagnostics: diagList } = await prepareDesignStateForExport(state);
      setDiagnostics(diagList);

      // 2. Render target format artwork
      const profOptions: ProfessionalExportOptions = {
        format,
        quality,
        layerMode: "layered",
        textMode: "editable",
        imageMode: "embedded",
        colorMode: "rgb",
        transparentBg: state.allowTransparentBackground ?? false,
        dpi: quality === 1 ? 72 : quality === 2 ? 150 : quality === 3 ? 300 : 600,
        compression: "high_quality",
      };

      const dataUrl = await renderArtworkFormat(
        null,
        sanitizedState,
        format,
        quality,
        (msg) => setExportProgress(msg),
        profOptions
      );

      setDownloadReadyUrl(dataUrl);

      // Trigger automatic browser file download
      const link = document.createElement("a");
      const cleanTitle = (state.title || "lizzdo-artwork").toLowerCase().replace(/[^a-z0-9]/g, "-");
      link.download = `${cleanTitle}-${quality}x.${format}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportProgress("Export complete! File saved.");
    } catch (err: any) {
      setExportProgress(`Export error: ${err.message || "Unknown error"}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-neon-cyan/40 rounded-2xl w-full max-w-2xl p-6 text-white space-y-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">Professional Export Engine V2</h2>
              <p className="text-xs font-mono text-gray-400">Export pixel-perfect vector & bitmap artwork</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
          >
            Close
          </button>
        </div>

        {/* Format & Quality Selection */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Export Format</label>
            <div className="grid grid-cols-4 gap-2">
              {(["png", "jpg", "webp", "svg", "pdf", "psd", "ai", "eps"] as ExportFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className={`p-2.5 rounded-xl border text-xs font-mono font-bold uppercase transition-all ${
                    format === fmt
                      ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.3)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">Resolution Scale</label>
            <div className="grid grid-cols-4 gap-2">
              {([
                { scale: 1, label: "1x (72 DPI)", sub: "Web Preview" },
                { scale: 2, label: "2x (150 DPI)", sub: "Retina / HD" },
                { scale: 3, label: "3x (300 DPI)", sub: "Print Press" },
                { scale: 4, label: "4x (600 DPI)", sub: "Ultra Sharp" },
              ] as { scale: ExportQuality; label: string; sub: string }[]).map((q) => (
                <button
                  key={q.scale}
                  onClick={() => setQuality(q.scale)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    quality === q.scale
                      ? "bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <div className="font-mono font-bold text-xs">{q.label}</div>
                  <div className="text-[9px] text-gray-500 mt-0.5">{q.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Output & Status */}
        {exportProgress && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-neon-cyan flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neon-cyan shrink-0" />
            <span>{exportProgress}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 disabled:opacity-50 text-black font-display font-black text-sm uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(0,245,255,0.4)] flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-black" />
              <span>Processing Export Engine...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 fill-black" />
              <span>Generate & Download {format.toUpperCase()}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
