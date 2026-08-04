import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Sliders,
  Download,
  Send,
  RefreshCw,
  Zap,
  Grid,
  Check,
  Copy,
  Layers,
  ArrowRight,
  Maximize2,
  Sparkle,
} from "lucide-react";

const STYLES = [
  { id: "cyberpunk", name: "Cyberpunk Neon", desc: "Futuristic neon lighting & dark tones" },
  { id: "photorealistic", name: "Photorealistic 8K", desc: "Ultra-sharp camera photography" },
  { id: "vector", name: "Vector Art", desc: "Clean flat vector illustration" },
  { id: "3d-render", name: "3D Octane Render", desc: "Glossy 3D clay & glass textures" },
  { id: "anime", name: "Anime / Manga", desc: "Vibrant Japanese anime aesthetics" },
  { id: "oil-painting", name: "Oil Painting", desc: "Classic textured canvas brushwork" },
];

const ASPECT_RATIOS = [
  { id: "1:1", label: "Square (1:1)", width: 1024, height: 1024 },
  { id: "16:9", label: "Landscape (16:9)", width: 1280, height: 720 },
  { id: "9:16", label: "Portrait (9:16)", width: 720, height: 1280 },
  { id: "4:3", label: "Standard (4:3)", width: 1024, height: 768 },
];

export function AIGeneratorWorkspace() {
  const { createProject, uploadSharedAsset } = useStudio();

  const [prompt, setPrompt] = useState(
    "Futuristic cyberpunk city skyline at night with neon cyan holographic billboards, hyperdetailed 8k render"
  );
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, distortion, noise");
  const [selectedStyle, setSelectedStyle] = useState("cyberpunk");
  const [selectedRatio, setSelectedRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  ]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Add a newly synthesized artwork URL
      const newUrls = [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      ];
      setGeneratedImages(newUrls);
      setSelectedImageIndex(0);
      setIsGenerating(false);
    }, 1200);
  };

  const handleSendToDesigner = () => {
    const activeImg = generatedImages[selectedImageIndex];
    createProject("AI Generated Artwork", "designer", {
      width: 1200,
      height: 1200,
      elements: [
        {
          id: `elem-${Date.now()}`,
          type: "image",
          name: "AI Render",
          x: 0,
          y: 0,
          width: 1200,
          height: 1200,
          rotation: 0,
          opacity: 1,
          src: activeImg,
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white flex flex-col lg:flex-row overflow-hidden font-sans select-none">
      {/* LEFT PROMPT & CONFIGURATION PANEL */}
      <div className="w-full lg:w-96 bg-neutral-950 border-r border-white/10 flex flex-col p-4 space-y-5 overflow-y-auto custom-scrollbar shrink-0">
        <div className="flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-neon-cyan animate-pulse" />
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white">
            AI Image Generator
          </h2>
          <span className="ml-auto px-2 py-0.5 rounded bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan text-[9px] font-mono font-bold">
            ULTRA GPU
          </span>
        </div>

        {/* PROMPT EDITOR */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase flex items-center justify-between">
            <span>Prompt Instructions</span>
            <button
              onClick={() =>
                setPrompt(
                  "Ultra detailed vector cyberpunk logo, glowing cyan shield, metallic chrome background, octane render 8k"
                )
              }
              className="text-[10px] text-neon-cyan hover:underline flex items-center gap-1"
            >
              <Sparkle className="w-3 h-3" /> Surprise Me
            </button>
          </label>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-sans leading-relaxed resize-none"
            placeholder="Describe what you want to generate..."
          />
        </div>

        {/* NEGATIVE PROMPT */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-gray-400 uppercase">Negative Prompt</label>
          <input
            type="text"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none focus:border-neon-cyan font-mono"
          />
        </div>

        {/* STYLE PRESETS */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Style Presets</label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStyle(st.id)}
                className={`p-2 rounded-xl border text-left font-mono transition-all ${
                  selectedStyle === st.id
                    ? "bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_10px_rgba(0,245,255,0.3)] font-bold"
                    : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <div className="text-xs truncate">{st.name}</div>
                <div className="text-[9px] text-gray-500 truncate mt-0.5">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ASPECT RATIO SELECTOR */}
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
            {ASPECT_RATIOS.map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => setSelectedRatio(ar.id)}
                className={`px-3 py-2 rounded-xl border text-center font-mono text-xs transition-all ${
                  selectedRatio === ar.id
                    ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                    : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>

        {/* GENERATE ACTION BUTTON */}
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-display font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span>Synthesizing AI Artwork...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-white" />
              <span>Generate 4 Image Variants</span>
            </>
          )}
        </button>
      </div>

      {/* CENTER WORKSPACE PREVIEW & BATCH GALLERY */}
      <div className="flex-1 bg-neutral-900 flex flex-col overflow-hidden relative">
        {/* TOP STATUS / ACTIONS BAR */}
        <div className="h-12 bg-neutral-950 border-b border-white/10 px-4 flex items-center justify-between font-mono text-xs text-gray-300">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Selected Variant:</span>
            <span className="text-neon-cyan font-bold">#{selectedImageIndex + 1}</span>
            <span className="text-gray-500">({ASPECT_RATIOS.find((r) => r.id === selectedRatio)?.width}x{ASPECT_RATIOS.find((r) => r.id === selectedRatio)?.height} px)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendToDesigner}
              className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open in Designer</span>
            </button>
            <a
              href={generatedImages[selectedImageIndex]}
              target="_blank"
              download="ai-generated-art.jpg"
              className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all"
              title="Download Full HD"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* MAIN SELECTED IMAGE VIEWPORT */}
        <div className="flex-1 p-6 flex items-center justify-center relative overflow-hidden bg-black/60">
          {isGenerating ? (
            <div className="text-center space-y-4 font-mono">
              <div className="w-16 h-16 rounded-3xl bg-neon-cyan/20 border border-neon-cyan/50 animate-pulse mx-auto flex items-center justify-center">
                <Wand2 className="w-8 h-8 text-neon-cyan animate-bounce" />
              </div>
              <p className="text-sm font-bold text-neon-cyan">Generating AI Artwork Variants...</p>
              <p className="text-xs text-gray-500 max-w-sm">Applying {selectedStyle} aesthetic models on GPU cluster</p>
            </div>
          ) : (
            <div className="relative max-h-full max-w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl group">
              <img
                src={generatedImages[selectedImageIndex]}
                alt="AI Generated"
                className="max-h-[62vh] max-w-full object-contain rounded-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end justify-between">
                <span className="font-mono text-xs text-white/90 truncate max-w-md">
                  "{prompt}"
                </span>
                <button
                  onClick={handleSendToDesigner}
                  className="px-3 py-1.5 rounded-xl bg-neon-cyan text-black font-bold font-mono text-xs flex items-center gap-1"
                >
                  Edit Canvas <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BATCH GALLERY STRIP */}
        <div className="h-28 bg-neutral-950 border-t border-white/10 p-3 flex items-center gap-3 overflow-x-auto custom-scrollbar">
          {generatedImages.map((imgUrl, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`h-20 w-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all relative shrink-0 ${
                selectedImageIndex === idx
                  ? "border-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.5)] scale-105"
                  : "border-white/10 hover:border-white/30 opacity-70 hover:opacity-100"
              }`}
            >
              <img src={imgUrl} alt={`Variant ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <span className="absolute bottom-1 left-1 px-1 rounded bg-black/80 text-[8px] font-mono text-white">
                #{idx + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
