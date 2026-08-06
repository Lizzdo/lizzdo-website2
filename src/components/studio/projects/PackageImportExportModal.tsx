import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { X, Upload, Download, Archive, FileCode, HardDrive, Sparkles, Check, FileCheck } from "lucide-react";

interface PackageImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "import" | "export";
}

export function PackageImportExportModal({
  isOpen,
  onClose,
  initialMode = "import",
}: PackageImportExportModalProps) {
  const {
    projects,
    importProjectPackageZIP,
    exportProjectZIP,
    exportProjectJSON,
    exportFullStudioBackupZIP,
  } = useStudio();

  const [mode, setMode] = useState<"import" | "export">(initialMode);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [isDragging, setIsDragging] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    setImportStatus("Extracting package manifest & assets...");
    const imported = await importProjectPackageZIP(file);
    if (imported) {
      setImportStatus(`Successfully imported "${imported.title}"!`);
      setTimeout(() => {
        setImportStatus(null);
        onClose();
      }, 1200);
    } else {
      setImportStatus("Import failed. Please check the ZIP or JSON structure.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans text-white">
      <div className="w-full max-w-lg bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple">
              {mode === "import" ? <Upload className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">
                {mode === "import" ? "Import Project Package" : "Export & Backup Hub"}
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">ZIP, JSON & Studio Archives</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODE TOGGLE */}
        <div className="p-4 bg-neutral-950 border-b border-white/10 flex gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={() => setMode("import")}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === "import"
                ? "bg-neon-purple text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Import Package
          </button>

          <button
            type="button"
            onClick={() => setMode("export")}
            className={`flex-1 py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === "export"
                ? "bg-neon-purple text-white shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> Export & Backup
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 font-mono text-xs space-y-5">
          {mode === "import" ? (
            <div className="space-y-4">
              {/* DRAG AND DROP ZONE */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-neon-purple bg-neon-purple/20 scale-102"
                    : "border-white/20 bg-neutral-950 hover:border-white/40 hover:bg-neutral-900"
                }`}
              >
                <input
                  type="file"
                  accept=".zip,.json,.lizzdo"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />

                <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple mx-auto flex items-center justify-center mb-3">
                  <Archive className="w-6 h-6" />
                </div>

                <h4 className="font-bold text-sm text-white mb-1">
                  Drag & Drop Project Package
                </h4>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">
                  Supports <span className="text-neon-purple font-bold">.lizzdo.zip</span>, <span className="text-cyan-400 font-bold">.zip</span> archives, or raw <span className="text-amber-400 font-bold">.json</span> project files.
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all">
                  <Upload className="w-3.5 h-3.5 text-cyan-400" /> Browse Local File
                </div>
              </div>

              {importStatus && (
                <div className="p-3 bg-neon-purple/20 border border-neon-purple/40 rounded-xl text-center text-neon-purple font-bold text-xs flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" /> {importStatus}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* SELECT PROJECT TO EXPORT */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Select Target Project</label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.toolId})
                    </option>
                  ))}
                </select>
              </div>

              {/* EXPORT OPTIONS GRID */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Export Format</span>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      exportProjectZIP(selectedProjectId);
                      onClose();
                    }}
                    className="p-3.5 bg-neutral-950 hover:bg-neutral-900 border border-white/10 hover:border-neon-purple/50 rounded-2xl flex items-center justify-between text-left group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-neon-purple/20 text-neon-purple flex items-center justify-center font-bold">
                        <Archive className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white group-hover:text-neon-purple transition-colors">
                          Complete ZIP Package (.lizzdo.zip)
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          Includes project.json, layer structure, versions, assets, and brandkit.
                        </p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-neon-purple" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportProjectJSON(selectedProjectId);
                      onClose();
                    }}
                    className="p-3.5 bg-neutral-950 hover:bg-neutral-900 border border-white/10 hover:border-cyan-500/50 rounded-2xl flex items-center justify-between text-left group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs text-white group-hover:text-cyan-400 transition-colors">
                          Standalone JSON Spec
                        </h5>
                        <p className="text-[10px] text-gray-400">
                          Raw vector layer definition for fast re-importing.
                        </p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400 group-hover:text-cyan-400" />
                  </button>

                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        exportFullStudioBackupZIP();
                        onClose();
                      }}
                      className="w-full p-3.5 bg-gradient-to-r from-emerald-950 to-neutral-950 border border-emerald-500/40 hover:border-emerald-400 rounded-2xl flex items-center justify-between text-left group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <HardDrive className="w-5 h-5" />
                        </div>
                        <div>
                          <h5 className="font-bold text-xs text-emerald-300">
                            Full Studio Master Backup (ZIP)
                          </h5>
                          <p className="text-[10px] text-gray-400">
                            Archives all projects, folders, brandkits, and shared assets into one file.
                          </p>
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
