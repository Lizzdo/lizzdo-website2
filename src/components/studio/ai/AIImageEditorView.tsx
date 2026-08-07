import React, { useState } from "react";
import { AI_IMAGE_EDIT_OPTIONS } from "../../../data/aiData";
import { AIImageEditOption } from "../../../types/ai";
import { AIEngineService } from "../../../services/aiEngine";
import { useStudio } from "../../../context/StudioContext";
import {
  Wand2,
  Upload,
  RefreshCw,
  Send,
  Zap,
  Image as ImageIcon,
  Check,
  Download,
  Scissors,
  Eraser,
  Paintbrush,
  Maximize2,
  MoveHorizontal,
  UserCheck,
  Sun,
  Palette,
  Layers,
} from "lucide-react";

interface AIImageEditorViewProps {
  onSendToDesigner: (imageUrl: string) => void;
  onSendToImageEditor: (imageUrl: string) => void;
}

export function AIImageEditorView({
  onSendToDesigner,
  onSendToImageEditor,
}: AIImageEditorViewProps) {
  const { addNotification } = useStudio();

  const [selectedToolId, setSelectedToolId] = useState<string>("bg-remove");
  const [sourceImgUrl, setSourceImgUrl] = useState<string>(
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
  );
  const [editPrompt, setEditPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultImgUrl, setResultImgUrl] = useState<string>(
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
  );

  const selectedTool =
    AI_IMAGE_EDIT_OPTIONS.find((t) => t.id === selectedToolId) || AI_IMAGE_EDIT_OPTIONS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSourceImgUrl(url);
      setResultImgUrl(url);
      addNotification("Image Loaded", `Loaded "${file.name}" into AI Image Editor`, "info", "uploads");
    }
  };

  const handleProcessEdit = async () => {
    setIsProcessing(true);
    setProgress(10);

    try {
      const editedUrl = await AIEngineService.editImage({
        tool: selectedToolId,
        sourceImageUrl: sourceImgUrl,
        prompt: editPrompt,
        onProgress: (p) => setProgress(p),
      });

      setResultImgUrl(editedUrl);
      addNotification(
        "AI Edit Complete",
        `Applied ${selectedTool.label} successfully.`,
        "success",
        "ai"
      );
    } catch (err: any) {
      addNotification("Edit Error", err?.message || "Failed to edit image", "error", "errors");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full font-mono text-xs select-none">
      {/* LEFT TOOL SELECTION & CONFIG PANEL */}
      <div className="w-full lg:w-96 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar">
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Wand2 className="w-4 h-4 text-neon-cyan" />
            <h2 className="font-bold text-white uppercase text-xs">AI Image Editing Suite</h2>
          </div>

          {/* EDIT TOOL SELECTOR GRID */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px] block">
              Select AI Tool
            </label>

            <div className="grid grid-cols-2 gap-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {AI_IMAGE_EDIT_OPTIONS.map((tool) => {
                const isActive = selectedToolId === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedToolId(tool.id)}
                    className={`p-2 rounded-xl border text-left transition-all relative ${
                      isActive
                        ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                        : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <div className="text-[10px] truncate leading-tight">{tool.label}</div>
                    {tool.badge && (
                      <span className="text-[8px] bg-neon-purple/30 text-neon-purple px-1 rounded font-bold block mt-0.5 w-fit">
                        {tool.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* UPLOAD BASE IMAGE */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px] flex items-center justify-between">
              <span>Source Image</span>
              <label className="text-neon-cyan hover:underline cursor-pointer flex items-center gap-1 text-[10px]">
                <Upload className="w-3 h-3" /> Upload Custom
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </label>

            <div className="h-20 rounded-xl bg-neutral-900 border border-white/10 overflow-hidden relative group">
              <img
                src={sourceImgUrl}
                alt="Source"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] text-gray-300">
                Source Preview
              </div>
            </div>
          </div>

          {/* EDIT PROMPT INSTRUCTIONS */}
          <div className="space-y-1.5">
            <label className="text-gray-300 font-bold uppercase text-[11px]">
              Prompt / Specific Instructions
            </label>
            <textarea
              rows={3}
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder={`Instructions for ${selectedTool.label}...`}
              className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-cyan font-sans text-xs resize-none"
            />
          </div>
        </div>

        {/* PROCESS BUTTON */}
        <button
          onClick={handleProcessEdit}
          disabled={isProcessing}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-bold uppercase hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all flex items-center justify-center gap-2 mt-4"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Processing ({progress}%)...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Apply {selectedTool.label}</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT PREVIEW & WORKFLOW INTEGRATION CANVAS */}
      <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-bold">
              {selectedTool.label}
            </span>
            <span className="text-gray-400 text-[10px] hidden sm:inline">
              {selectedTool.description}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSendToImageEditor(resultImgUrl)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" /> Open in Image Editor
            </button>

            <button
              onClick={() => onSendToDesigner(resultImgUrl)}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan text-black font-bold hover:bg-neon-cyan/80 transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send to Designer V1
            </button>
          </div>
        </div>

        {/* IMAGE COMPARISON / CANVAS */}
        <div className="flex-1 my-4 flex items-center justify-center overflow-hidden relative">
          {isProcessing ? (
            <div className="text-center space-y-3">
              <Wand2 className="w-10 h-10 text-neon-cyan animate-spin mx-auto" />
              <p className="text-xs text-neon-cyan font-bold">
                Applying {selectedTool.label}... ({progress}%)
              </p>
            </div>
          ) : (
            <div className="relative max-h-[55vh] max-w-full flex items-center justify-center">
              <img
                src={resultImgUrl}
                alt="AI Result"
                className="max-h-[55vh] max-w-full object-contain rounded-xl border border-white/20 shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>

        {/* BOTTOM METRICS */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-gray-400 text-[10px]">
          <span>Format: PNG 24-bit • Lossless Render</span>
          <span className="text-emerald-400 font-bold">✓ Ready for Designer V1</span>
        </div>
      </div>
    </div>
  );
}
