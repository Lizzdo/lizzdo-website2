import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { WorkspaceShell } from "../WorkspaceShell";
import { AIPromptLibraryView } from "../ai/AIPromptLibraryView";
import { AIImageEditorView } from "../ai/AIImageEditorView";
import { AIWritingAssistantView } from "../ai/AIWritingAssistantView";
import { AIQueueAndHistoryView } from "../ai/AIQueueAndHistoryView";
import { AISettingsView } from "../ai/AISettingsView";
import { AIEngineService } from "../../../services/aiEngine";
import { AIQueueManager } from "../../../services/aiQueueManager";
import {
  DEFAULT_AI_PROMPT_TEMPLATES,
  DEFAULT_AI_SETTINGS,
  INITIAL_AI_HISTORY,
} from "../../../data/aiData";
import {
  AIPromptTemplate,
  AISettings,
  AIHistoryEntry,
} from "../../../types/ai";
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Bookmark,
  History,
  Sliders,
  RefreshCw,
  Send,
  Download,
  Copy,
  Check,
  Upload,
  Plus,
  Trash2,
  Grid,
  Layers,
  RotateCcw,
  Sparkle,
} from "lucide-react";

type AIToolSubTab =
  | "image-gen"
  | "image-editor"
  | "writer"
  | "prompt-library"
  | "history-queue"
  | "settings";

const STYLES = [
  { id: "cyberpunk", name: "Cyberpunk Neon", desc: "Futuristic neon lighting & dark tones" },
  { id: "photorealistic", name: "Photorealistic 8K", desc: "Ultra-sharp camera photography" },
  { id: "vector", name: "Vector Art", desc: "Clean flat vector illustration" },
  { id: "3d-render", name: "3D Octane Render", desc: "Glossy 3D clay & glass textures" },
  { id: "anime", name: "Anime / Manga", desc: "Vibrant Japanese anime aesthetics" },
  { id: "oil-painting", name: "Oil Painting", desc: "Classic textured canvas brushwork" },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "Square (1:1)" },
  { id: "16:9", label: "Landscape (16:9)" },
  { id: "9:16", label: "Portrait (9:16)" },
  { id: "4:3", label: "Standard (4:3)" },
  { id: "3:2", label: "Photo (3:2)" },
  { id: "21:9", label: "Ultrawide (21:9)" },
];

export function AIGeneratorWorkspace() {
  const { createProject, addNotification, setActiveToolId } = useStudio();

  const [activeSubTab, setActiveSubTab] = useState<AIToolSubTab>("image-gen");

  // Global AI state persistence
  const [promptTemplates, setPromptTemplates] = useState<AIPromptTemplate[]>(
    DEFAULT_AI_PROMPT_TEMPLATES
  );
  const [aiHistory, setAiHistory] = useState<AIHistoryEntry[]>(INITIAL_AI_HISTORY);
  const [aiSettings, setAiSettings] = useState<AISettings>(DEFAULT_AI_SETTINGS);

  // --- IMAGE GENERATOR PARAMETERS ---
  const [imgPrompt, setImgPrompt] = useState(
    "Futuristic cyberpunk city skyline at night with neon cyan holographic billboards, hyperdetailed 8k render"
  );
  const [imgNegativePrompt, setImgNegativePrompt] = useState("blurry, low quality, distortion, noise");
  const [imgStyle, setImgStyle] = useState("cyberpunk");
  const [imgRatio, setImgRatio] = useState("1:1");
  const [imgSeed, setImgSeed] = useState(4820931);
  const [isRandomSeed, setIsRandomSeed] = useState(true);
  const [promptWeight, setPromptWeight] = useState(1.2);
  const [guidanceStrength, setGuidanceStrength] = useState(7.5);
  const [qualityPreset, setQualityPreset] = useState("Ultra 8K");
  const [batchCount, setBatchCount] = useState<number>(4);

  // Multiple Reference Images (up to 3)
  const [referenceImages, setReferenceImages] = useState<string[]>([]);

  const [isImgGenerating, setIsImgGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  ]);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // --- 1-CLICK WORKFLOW INTEGRATION HANDLERS ---
  const handleSendToDesigner = (imageUrl: string) => {
    createProject("AI Generated Design", "designer", undefined, undefined, "AI Generated Design Layer");
    addNotification("Sent to Designer V1", "Opened image inside Designer V1 canvas.", "success", "ai");
  };

  const handleSendToImageEditor = (imageUrl: string) => {
    setActiveToolId("image-editor");
    addNotification("Sent to Image Editor", "Opened image in full Image Editor.", "info", "ai");
  };

  const handleSendToVideoEditor = (imageUrl: string) => {
    setActiveToolId("video-editor");
    addNotification("Sent to Video Editor", "Added asset to Video Timeline.", "info", "ai");
  };

  const handleSendToAssetLibrary = (imageUrl: string) => {
    addNotification("Saved to Asset Library", "Saved asset into global studio library.", "success", "uploads");
  };

  const handleSendToBlog = (url: string, text?: string) => {
    setActiveToolId("blog-designer");
    addNotification("Sent to Blog Designer", "Ready to publish in Blog Designer.", "info", "ai");
  };

  const handleSendToPortfolio = (url: string, text?: string) => {
    setActiveToolId("portfolio-builder");
    addNotification("Sent to Portfolio", "Pushed item to Portfolio Builder.", "info", "ai");
  };

  const handleSendToStore = (url: string, text?: string) => {
    setActiveToolId("store-designer");
    addNotification("Sent to Store Designer", "Added product asset to Store Designer.", "info", "ai");
  };

  // --- IMAGE GENERATION LOGIC ---
  const handleGenerateImages = async () => {
    if (!imgPrompt.trim()) return;

    const currentSeed = isRandomSeed ? Math.floor(Math.random() * 9000000) : imgSeed;
    if (isRandomSeed) setImgSeed(currentSeed);

    setIsImgGenerating(true);
    setProgress(10);

    // Queue Task
    AIQueueManager.addTask("image", imgPrompt, {
      negativePrompt: imgNegativePrompt,
      model: aiSettings.defaultModel,
      seed: currentSeed,
      aspectRatio: imgRatio,
      style: imgStyle,
      promptWeight,
      guidanceStrength,
      qualityPreset,
      referenceImages,
    });

    try {
      const results = await AIEngineService.generateImages({
        prompt: imgPrompt,
        negativePrompt: imgNegativePrompt,
        style: imgStyle,
        aspectRatio: imgRatio,
        seed: currentSeed,
        promptWeight,
        guidanceStrength,
        qualityPreset,
        batchCount,
        referenceImages,
        onProgress: (p) => setProgress(p),
      });

      setGeneratedImages(results);
      setSelectedImgIndex(0);

      // Save to History
      const newHistoryEntry: AIHistoryEntry = {
        id: `hist-${Date.now()}`,
        type: "Image",
        prompt: imgPrompt,
        negativePrompt: imgNegativePrompt,
        date: "Just now",
        timestamp: Date.now(),
        seed: currentSeed,
        model: aiSettings.defaultModel,
        previewUrls: results,
        favorite: false,
        settingsUsed: {
          aspectRatio: imgRatio,
          style: imgStyle,
          promptWeight,
          guidanceStrength,
          qualityPreset,
          batchCount,
          referenceImagesCount: referenceImages.length,
        },
      };

      setAiHistory([newHistoryEntry, ...aiHistory]);
      addNotification("AI Generation Complete", `Generated ${results.length} 8K variants.`, "success", "ai");
    } catch (err: any) {
      addNotification("Generation Error", err?.message || "Failed to generate images", "error", "errors");
    } finally {
      setIsImgGenerating(false);
    }
  };

  // Individual Variant Regeneration
  const handleRegenerateVariant = async (index: number) => {
    try {
      const newVariant = await AIEngineService.regenerateSingleVariant(index, {
        prompt: imgPrompt,
        seed: imgSeed + index * 99,
      });

      const updated = [...generatedImages];
      updated[index] = newVariant;
      setGeneratedImages(updated);
      addNotification("Variant Regenerated", `Regenerated result #${index + 1} with new seed.`, "info", "ai");
    } catch (err: any) {
      addNotification("Error", "Failed to regenerate variant", "error", "errors");
    }
  };

  // Handle uploading reference images
  const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newUrls: string[] = [];
      for (let i = 0; i < Math.min(files.length, 3 - referenceImages.length); i++) {
        newUrls.push(URL.createObjectURL(files[i]));
      }
      setReferenceImages([...referenceImages, ...newUrls]);
    }
  };

  return (
    <WorkspaceShell title="AI Generator & Creative Assistant" toolId="ai-generator">
      <div className="w-full h-full flex flex-col bg-black text-white p-4 lg:p-6 overflow-hidden select-none">
        {/* TOP NAVIGATION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-neon-cyan animate-pulse" />
              <h1 className="text-xl font-extrabold uppercase font-mono tracking-wider bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
                Lizzdo AI Creative Studio
              </h1>
            </div>
            <p className="text-gray-400 font-sans text-xs mt-1">
              Next-generation generative AI workspace with real-time vector canvas integration.
            </p>
          </div>

          {/* SUBTAB SELECTOR BUTTONS */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar p-1 rounded-2xl bg-neutral-900 border border-white/10 font-mono text-xs">
            <button
              onClick={() => setActiveSubTab("image-gen")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "image-gen"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>Image Generator</span>
            </button>

            <button
              onClick={() => setActiveSubTab("image-editor")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "image-editor"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>AI Image Editing</span>
            </button>

            <button
              onClick={() => setActiveSubTab("writer")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "writer"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>AI Writer</span>
            </button>

            <button
              onClick={() => setActiveSubTab("prompt-library")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "prompt-library"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Prompt Library</span>
            </button>

            <button
              onClick={() => setActiveSubTab("history-queue")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "history-queue"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Queue & History</span>
            </button>

            <button
              onClick={() => setActiveSubTab("settings")}
              className={`px-3.5 py-2 rounded-xl font-bold uppercase transition-all flex items-center gap-1.5 ${
                activeSubTab === "settings"
                  ? "bg-neon-cyan text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* ACTIVE WORKSPACE CONTENT AREA */}
        <div className="flex-1 overflow-hidden pt-4 flex flex-col">
          {/* 1. IMAGE GENERATOR TAB */}
          {activeSubTab === "image-gen" && (
            <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-hidden font-mono text-xs">
              {/* LEFT CONFIGURATION PANEL */}
              <div className="w-full lg:w-[420px] bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between shrink-0 overflow-y-auto custom-scrollbar space-y-4">
                <div className="space-y-4">
                  {/* PROMPT EDITOR */}
                  <div className="space-y-1.5">
                    <label className="text-gray-200 font-bold uppercase text-[11px] flex items-center justify-between">
                      <span>Positive Prompt</span>
                      <span className="text-neon-cyan text-[10px]">{imgPrompt.length} chars</span>
                    </label>
                    <textarea
                      rows={3}
                      value={imgPrompt}
                      onChange={(e) => setImgPrompt(e.target.value)}
                      placeholder="Describe what you want to generate in detail..."
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl p-2.5 text-white focus:outline-none focus:border-neon-cyan font-sans text-xs resize-none"
                    />
                  </div>

                  {/* NEGATIVE PROMPT */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">
                      Negative Prompt (Avoid Elements)
                    </label>
                    <input
                      type="text"
                      value={imgNegativePrompt}
                      onChange={(e) => setImgNegativePrompt(e.target.value)}
                      placeholder="blurry, distorted, ugly, low quality..."
                      className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2 text-gray-300 focus:outline-none focus:border-neon-cyan font-sans text-xs"
                    />
                  </div>

                  {/* STYLE & ASPECT RATIO */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-gray-300 font-bold uppercase text-[10px] block mb-1">
                        Art Style
                      </label>
                      <select
                        value={imgStyle}
                        onChange={(e) => setImgStyle(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2 text-white font-sans text-xs focus:outline-none focus:border-neon-cyan"
                      >
                        {STYLES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-300 font-bold uppercase text-[10px] block mb-1">
                        Aspect Ratio
                      </label>
                      <select
                        value={imgRatio}
                        onChange={(e) => setImgRatio(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-2 text-white font-sans text-xs focus:outline-none focus:border-neon-cyan"
                      >
                        {ASPECT_RATIOS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ADVANCED SLIDERS: PROMPT WEIGHT & GUIDANCE CFG */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-neutral-900 border border-white/5 font-sans">
                    <div>
                      <label className="text-[10px] text-gray-400 font-mono font-bold uppercase block mb-1">
                        Prompt Weight ({promptWeight})
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={promptWeight}
                        onChange={(e) => setPromptWeight(parseFloat(e.target.value))}
                        className="w-full accent-neon-cyan cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-gray-400 font-mono font-bold uppercase block mb-1">
                        CFG Scale ({guidanceStrength})
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={guidanceStrength}
                        onChange={(e) => setGuidanceStrength(parseFloat(e.target.value))}
                        className="w-full accent-neon-cyan cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* MULTIPLE IMAGE REFERENCES (Up to 3) */}
                  <div className="space-y-1.5">
                    <label className="text-gray-300 font-bold uppercase text-[10px] flex items-center justify-between">
                      <span>Image & Style References ({referenceImages.length}/3)</span>
                      {referenceImages.length < 3 && (
                        <label className="text-neon-cyan hover:underline cursor-pointer flex items-center gap-1 text-[9px]">
                          <Plus className="w-3 h-3" /> Add Image
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleRefUpload}
                            className="hidden"
                          />
                        </label>
                      )}
                    </label>

                    <div className="grid grid-cols-3 gap-2">
                      {referenceImages.map((refUrl, idx) => (
                        <div
                          key={idx}
                          className="h-16 rounded-xl bg-black border border-white/10 overflow-hidden relative group"
                        >
                          <img src={refUrl} alt="Reference" className="w-full h-full object-cover" />
                          <button
                            onClick={() =>
                              setReferenceImages(referenceImages.filter((_, i) => i !== idx))
                            }
                            className="absolute top-1 right-1 p-0.5 rounded bg-black/80 text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      {referenceImages.length === 0 && (
                        <div className="col-span-3 py-3 border border-dashed border-white/10 rounded-xl text-center text-gray-500 font-sans text-[10px]">
                          No reference images attached.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SEED & BATCH COUNT */}
                  <div className="grid grid-cols-2 gap-2 font-sans">
                    <div>
                      <label className="text-gray-400 text-[10px] uppercase block mb-1">
                        Seed ({isRandomSeed ? "Random" : imgSeed})
                      </label>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          disabled={isRandomSeed}
                          value={imgSeed}
                          onChange={(e) => setImgSeed(parseInt(e.target.value) || 12345)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-xl p-1.5 text-white text-xs disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setIsRandomSeed(!isRandomSeed)}
                          className={`px-2 py-1.5 rounded-xl border text-[10px] font-mono ${
                            isRandomSeed
                              ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan font-bold"
                              : "bg-neutral-900 border-white/10 text-gray-400"
                          }`}
                        >
                          RND
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-[10px] uppercase block mb-1">
                        Batch Variants
                      </label>
                      <select
                        value={batchCount}
                        onChange={(e) => setBatchCount(parseInt(e.target.value))}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl p-1.5 text-white text-xs font-mono"
                      >
                        <option value={1}>1 Image</option>
                        <option value={2}>2 Variants</option>
                        <option value={4}>4 Variants (Standard)</option>
                        <option value={8}>8 Variants (8K Studio)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* GENERATE BUTTON */}
                <button
                  onClick={handleGenerateImages}
                  disabled={isImgGenerating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-bold uppercase hover:shadow-[0_0_25px_rgba(0,245,255,0.6)] transition-all flex items-center justify-center gap-2 mt-4"
                >
                  {isImgGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing ({progress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate 8K Image Batch</span>
                    </>
                  )}
                </button>
              </div>

              {/* RIGHT PREVIEW & VARIANT GALLERY */}
              <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
                {/* PRIMARY IMAGE PREVIEW */}
                <div className="flex-1 relative flex items-center justify-center overflow-hidden rounded-xl bg-black border border-white/5">
                  {isImgGenerating ? (
                    <div className="text-center space-y-3">
                      <Wand2 className="w-10 h-10 text-neon-cyan animate-spin mx-auto" />
                      <p className="text-xs text-neon-cyan font-bold">
                        Synthesizing 8K Image Batch... ({progress}%)
                      </p>
                    </div>
                  ) : (
                    <div className="relative max-h-[55vh] max-w-full flex items-center justify-center">
                      <img
                        src={generatedImages[selectedImgIndex]}
                        alt="AI Generation"
                        className="max-h-[55vh] max-w-full object-contain rounded-xl border border-white/20 shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </div>

                {/* BATCH VARIANTS THUMBNAILS WITH INDIVIDUAL REGENERATION */}
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-[10px]">
                    <span>Batch Results ({generatedImages.length} variants)</span>
                    <span className="text-neon-cyan font-bold">Click variant to inspect & send</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {generatedImages.map((imgUrl, idx) => {
                      const isSelected = selectedImgIndex === idx;
                      return (
                        <div
                          key={idx}
                          className={`group relative h-16 rounded-xl bg-black border overflow-hidden cursor-pointer transition-all ${
                            isSelected
                              ? "border-neon-cyan ring-2 ring-neon-cyan/50"
                              : "border-white/10 hover:border-white/40"
                          }`}
                          onClick={() => setSelectedImgIndex(idx)}
                        >
                          <img src={imgUrl} alt="Variant" className="w-full h-full object-cover" />

                          {/* REGENERATE SINGLE VARIANT OVERLAY BUTTON */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegenerateVariant(idx);
                            }}
                            className="absolute top-1 right-1 p-1 rounded-md bg-black/80 text-neon-cyan opacity-0 group-hover:opacity-100 transition-all hover:bg-neon-cyan hover:text-black"
                            title="Regenerate This Variant"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* 1-CLICK WORKFLOW INTEGRATION SHORTCUTS */}
                  <div className="pt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 font-mono text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSendToDesigner(generatedImages[selectedImgIndex])}
                        className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-bold hover:bg-neon-cyan/80 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" /> Send to Designer V1
                      </button>

                      <button
                        onClick={() => handleSendToImageEditor(generatedImages[selectedImgIndex])}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Image Editor
                      </button>

                      <button
                        onClick={() => handleSendToVideoEditor(generatedImages[selectedImgIndex])}
                        className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all flex items-center gap-1"
                      >
                        Video Editor
                      </button>
                    </div>

                    <button
                      onClick={() => handleSendToAssetLibrary(generatedImages[selectedImgIndex])}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1.5"
                    >
                      Save to Asset Library
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. IMAGE EDITING TAB */}
          {activeSubTab === "image-editor" && (
            <AIImageEditorView
              onSendToDesigner={handleSendToDesigner}
              onSendToImageEditor={handleSendToImageEditor}
            />
          )}

          {/* 3. WRITER TAB */}
          {activeSubTab === "writer" && (
            <AIWritingAssistantView
              onSendToDesignerText={(txt) => {
                createProject("AI Written Design", "designer");
              }}
              onSendToBlog={handleSendToBlog}
              onSendToPortfolio={handleSendToPortfolio}
            />
          )}

          {/* 4. PROMPT LIBRARY TAB */}
          {activeSubTab === "prompt-library" && (
            <AIPromptLibraryView
              prompts={promptTemplates}
              onSelectPrompt={(p) => {
                setImgPrompt(p.prompt);
                if (p.negativePrompt) setImgNegativePrompt(p.negativePrompt);
                if (p.aspectRatio) setImgRatio(p.aspectRatio);
                setActiveSubTab("image-gen");
                addNotification("Prompt Loaded", `Loaded "${p.title}" into Image Generator.`, "info", "ai");
              }}
              onSaveCustomPrompt={(newP) => {
                const created: AIPromptTemplate = {
                  ...newP,
                  id: `custom-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                };
                setPromptTemplates([created, ...promptTemplates]);
                addNotification("Prompt Saved", `Saved "${newP.title}" to Prompt Library.`, "success", "ai");
              }}
              onToggleFavorite={(id) => {
                setPromptTemplates(
                  promptTemplates.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
                );
              }}
              onDeletePrompt={(id) => {
                setPromptTemplates(promptTemplates.filter((p) => p.id !== id));
              }}
              onDuplicatePrompt={(p) => {
                const dup: AIPromptTemplate = {
                  ...p,
                  id: `dup-${Date.now()}`,
                  title: `${p.title} (Copy)`,
                  isCustom: true,
                  createdAt: new Date().toISOString(),
                };
                setPromptTemplates([dup, ...promptTemplates]);
                addNotification("Prompt Duplicated", `Duplicated "${p.title}".`, "info", "ai");
              }}
            />
          )}

          {/* 5. HISTORY & QUEUE TAB */}
          {activeSubTab === "history-queue" && (
            <AIQueueAndHistoryView
              history={aiHistory}
              onToggleHistoryFavorite={(id) => {
                setAiHistory(
                  aiHistory.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h))
                );
              }}
              onSendToDesigner={handleSendToDesigner}
              onSendToImageEditor={handleSendToImageEditor}
              onSendToVideoEditor={handleSendToVideoEditor}
              onSendToAssetLibrary={handleSendToAssetLibrary}
              onSendToBlog={handleSendToBlog}
              onSendToPortfolio={handleSendToPortfolio}
              onSendToStore={handleSendToStore}
              onRegenerateHistoryItem={(item) => {
                setImgPrompt(item.prompt);
                if (item.negativePrompt) setImgNegativePrompt(item.negativePrompt);
                setActiveSubTab("image-gen");
              }}
            />
          )}

          {/* 6. SETTINGS TAB */}
          {activeSubTab === "settings" && (
            <AISettingsView
              settings={aiSettings}
              onUpdateSettings={(newSet) => setAiSettings({ ...aiSettings, ...newSet })}
            />
          )}
        </div>
      </div>
    </WorkspaceShell>
  );
}
