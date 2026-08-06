import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Download,
  Upload,
  Copy,
  Check,
  Code,
  FileJson,
  FileCode,
  Sparkles,
  X,
  CheckCircle2,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const BrandImportExportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    activeBrandKit,
    exportBrandKitJSON,
    exportBrandKitCSS,
    exportBrandKitDesignTokens,
    importBrandKitJSON,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<"export" | "import">("export");
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState("");

  if (!isOpen) return null;

  const cssVars = exportBrandKitCSS(activeBrandKit);
  const designTokens = exportBrandKitDesignTokens(activeBrandKit);

  const copyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJsonText.trim()) return;
    const res = importBrandKitJSON(importJsonText.trim());
    if (res) {
      setImportJsonText("");
      onClose();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setImportJsonText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-neutral-900 border border-white/20 p-6 space-y-6 shadow-2xl animate-fade-in font-mono text-xs">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveTab("export")}
              className={`px-4 py-2 rounded-xl border transition-all ${
                activeTab === "export"
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-black border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Export Brand Kit
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("import")}
              className={`px-4 py-2 rounded-xl border transition-all ${
                activeTab === "import"
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                  : "bg-black border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              Import Brand Kit
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TAB 1: EXPORT */}
        {activeTab === "export" ? (
          <div className="space-y-6">
            {/* JSON PACKAGE DOWNLOAD */}
            <div className="p-4 rounded-2xl bg-black border border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-neon-cyan" /> Complete JSON Brand Package
                </span>
                <p className="text-gray-400 text-[10px]">
                  Exports colors, typography specs, logo references, social links, and watermark rules.
                </p>
              </div>

              <button
                type="button"
                onClick={() => exportBrandKitJSON(activeBrandKit)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase flex items-center gap-2 shrink-0"
              >
                <Download className="w-3.5 h-3.5" /> Download JSON
              </button>
            </div>

            {/* CSS VARIABLES */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-300 uppercase flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-neon-purple" /> CSS Custom Properties (:root)
                </span>
                <button
                  type="button"
                  onClick={() => copyText(cssVars, "CSS")}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] flex items-center gap-1"
                >
                  {copiedType === "CSS" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neon-cyan" /> Copied CSS
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy CSS
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black border border-white/10 text-gray-300 text-[11px] overflow-x-auto max-h-40 custom-scrollbar">
                {cssVars}
              </pre>
            </div>

            {/* DESIGN TOKENS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-300 uppercase flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" /> W3C Standard Design Tokens
                </span>
                <button
                  type="button"
                  onClick={() => copyText(designTokens, "TOKENS")}
                  className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] flex items-center gap-1"
                >
                  {copiedType === "TOKENS" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-neon-cyan" /> Copied Tokens
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Tokens
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-black border border-white/10 text-gray-300 text-[11px] overflow-x-auto max-h-36 custom-scrollbar">
                {designTokens}
              </pre>
            </div>
          </div>
        ) : (
          /* TAB 2: IMPORT */
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-400 uppercase text-[10px] font-bold block">
                Upload Brand Kit JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full bg-black border border-white/15 rounded-xl p-3 text-gray-300 text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 uppercase text-[10px] font-bold block">
                Or Paste JSON Configuration
              </label>
              <textarea
                rows={8}
                placeholder='{"brandName": "My New Brand", "colors": {...}}'
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                className="w-full bg-black border border-white/15 rounded-xl p-3 text-gray-200 text-xs focus:border-neon-cyan focus:outline-none font-mono resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase flex items-center gap-2"
              >
                <Upload className="w-3.5 h-3.5" /> Import Brand Kit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
