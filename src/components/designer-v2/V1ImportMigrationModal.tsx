import React, { useState } from "react";
import { RotateCcw, FileJson, Check, Upload } from "lucide-react";
import { DesignState } from "../../types/designer";
import { V2Project } from "../../types/designerV2";
import { migrateV1ProjectToV2 } from "../../utils/designerV2Migration";

interface V1ImportMigrationModalProps {
  onImportProject: (project: V2Project) => void;
  onClose: () => void;
}

export default function V1ImportMigrationModal({
  onImportProject,
  onClose,
}: V1ImportMigrationModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleJsonSubmit = () => {
    setErrorMsg("");
    try {
      const parsed = JSON.parse(jsonText);
      // Validate if it's V1 DesignState or V2 project
      if (parsed.artboards) {
        onImportProject(parsed as V2Project);
      } else {
        const migrated = migrateV1ProjectToV2(parsed as DesignState);
        onImportProject(migrated);
      }
      onClose();
    } catch (e: any) {
      setErrorMsg("Invalid JSON format. Please paste a valid Lizzdo DesignState object.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setJsonText(reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#0b0f19] border border-neon-cyan/40 rounded-2xl w-full max-w-lg p-6 text-white space-y-5 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 border border-neon-cyan flex items-center justify-center text-neon-cyan">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-white">V1 Project Import Engine</h2>
              <p className="text-xs font-mono text-gray-400">Migrate legacy V1 designs into V2 Pro multi-artboards</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-mono transition-colors"
          >
            Close
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500 text-xs font-mono text-red-400">
            {errorMsg}
          </div>
        )}

        <div className="space-y-3">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider block">
            Paste Design JSON or Upload File
          </label>

          <textarea
            rows={6}
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder='Paste {"id": "state-...", "title": "My Banner", "elements": [...]} here...'
            className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-white font-mono text-xs outline-none focus:border-neon-cyan resize-none"
          />

          <div className="flex items-center justify-between gap-3">
            <label className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white flex items-center gap-2 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-neon-cyan" />
              <span>Choose .json File</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={handleJsonSubmit}
              disabled={!jsonText.trim()}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/90 hover:to-neon-purple/90 disabled:opacity-40 text-black font-display font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(0,245,255,0.4)]"
            >
              Convert & Import Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
