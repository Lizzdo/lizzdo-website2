import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { WorkspaceShell } from "../WorkspaceShell";
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  FileText,
  Palette,
  Layout,
  Package,
  History,
  Layers,
  Send,
  Download,
  Copy,
  Check,
  Zap,
  RefreshCw,
  Sparkle,
  Grid,
  Sliders,
  Type,
  Maximize2,
  Shield,
  Volume2,
  Video,
  Globe,
  Box,
  Music,
  Cpu,
  ArrowRight,
  Plus,
  Trash2,
  Bookmark,
  ExternalLink,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

type AIToolSubTab =
  | "image-gen"
  | "writer"
  | "bg-gen"
  | "template-gen"
  | "brand-assistant"
  | "asset-gen"
  | "history"
  | "future-labs";

interface AIHistoryItem {
  id: string;
  type: string;
  prompt: string;
  date: string;
  seed: number;
  previewUrl?: string;
  textResult?: string;
  favorite: boolean;
}

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

const WRITER_TYPES = [
  { id: "blog", label: "Blog Post" },
  { id: "portfolio", label: "Portfolio Desc" },
  { id: "service", label: "Service Page" },
  { id: "product", label: "Product Desc" },
  { id: "seo", label: "SEO Title & Meta" },
  { id: "social", label: "Social Captions" },
  { id: "ad", label: "Ad Copy & Headlines" },
  { id: "email", label: "Email Newsletter" },
];

const BG_STYLES = [
  "Mesh Gradients",
  "Cyberpunk Dark",
  "3D Clay Geometry",
  "Glassmorphism",
  "Blueprint Vector",
  "Minimal Luxury",
  "Corporate Abstract",
  "Wireframe Grid",
];

export function AIGeneratorWorkspace() {
  const { createProject, addNotification, updateBrandKit, setActiveToolId } = useStudio();

  const [activeSubTab, setActiveSubTab] = useState<AIToolSubTab>("image-gen");

  // --- 1. IMAGE GENERATOR STATE ---
  const [imgPrompt, setImgPrompt] = useState(
    "Futuristic cyberpunk city skyline at night with neon cyan holographic billboards, hyperdetailed 8k render"
  );
  const [imgNegativePrompt, setImgNegativePrompt] = useState("blurry, low quality, distortion, noise");
  const [imgStyle, setImgStyle] = useState("cyberpunk");
  const [imgRatio, setImgRatio] = useState("1:1");
  const [imgSeed, setImgSeed] = useState(4820931);
  const [brandConsistency, setBrandConsistency] = useState(true);
  const [isImgGenerating, setIsImgGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  ]);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  // --- 2. WRITER STATE ---
  const [writerType, setWriterType] = useState("blog");
  const [writerPrompt, setWriterPrompt] = useState("How AI Studio OS revolutionizes creative workflows in 2026");
  const [writerTone, setWriterTone] = useState("Professional & Visionary");
  const [isWriting, setIsWriting] = useState(false);
  const [writtenOutput, setWrittenOutput] = useState(
    `# How AI Studio OS Revolutionizes Creative Workflows in 2026\n\nThe creative industry is experiencing a seismic shift. Traditional multi-app workflows—where creators juggle design suites, video editors, and AI portals—are giving way to unified Creative Operating Systems.\n\n### 1. Zero Context Switching\nBy connecting vector design, AI generators, and brand kit repositories in a single workspace, creators save up to 14 hours per project.\n\n### 2. Live Brand Consistency\nAI models trained on native brand guidelines automatically apply brand palettes, typography, and logo placements across every generated artifact.`
  );
  const [copiedText, setCopiedText] = useState(false);

  // --- 3. BACKGROUND GENERATOR STATE ---
  const [bgStyle, setBgStyle] = useState("Mesh Gradients");
  const [bgPrompt, setBgPrompt] = useState("Dark cyan and purple glowing mesh gradient with subtle floating glass particles");
  const [isBgGenerating, setIsBgGenerating] = useState(false);
  const [generatedBgUrl, setGeneratedBgUrl] = useState(
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"
  );

  // --- 4. TEMPLATE GENERATOR STATE ---
  const [templatePrompt, setTemplatePrompt] = useState("Create a modern Fiverr Gig cover for Fullstack AI Web App Development");
  const [isTemplateGenerating, setIsTemplateGenerating] = useState(false);

  // --- 5. BRAND ASSISTANT STATE ---
  const [brandName, setBrandName] = useState("Aetherium AI");
  const [brandDesc, setBrandDesc] = useState("Next-generation cloud AI compute platform for visual artists");
  const [isBrandGenerating, setIsBrandGenerating] = useState(false);

  // --- 6. ASSET GENERATOR STATE ---
  const [assetCategory, setAssetCategory] = useState("3D Icons");
  const [assetPrompt, setAssetPrompt] = useState("Glossy neon cyan shield icon with chrome borders");
  const [isAssetGenerating, setIsAssetGenerating] = useState(false);

  // --- 7. HISTORY LOG ---
  const [history, setHistory] = useState<AIHistoryItem[]>([
    {
      id: "h-1",
      type: "Image",
      prompt: "Futuristic cyberpunk city skyline at night with neon cyan billboards",
      date: "10 mins ago",
      seed: 4820931,
      previewUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      favorite: true,
    },
    {
      id: "h-2",
      type: "Content",
      prompt: "Blog post on AI Studio OS 2026 workflows",
      date: "1 hour ago",
      seed: 9182301,
      textResult: "How AI Studio OS Revolutionizes Creative Workflows...",
      favorite: false,
    },
    {
      id: "h-3",
      type: "Background",
      prompt: "Dark mesh gradient with glowing purple spheres",
      date: "3 hours ago",
      seed: 3391820,
      previewUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      favorite: true,
    },
  ]);

  // --- HANDLERS ---
  const handleGenerateImages = () => {
    setIsImgGenerating(true);
    setTimeout(() => {
      const newUrls = [
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      ];
      setGeneratedImages(newUrls);
      setSelectedImgIndex(0);
      setIsImgGenerating(false);

      // Save to History
      const newHist: AIHistoryItem = {
        id: `h-${Date.now()}`,
        type: "Image",
        prompt: imgPrompt,
        date: "Just now",
        seed: imgSeed,
        previewUrl: newUrls[0],
        favorite: false,
      };
      setHistory((prev) => [newHist, ...prev]);
      addNotification("AI Generation Complete", "4 new image variants synthesized.", "success");
    }, 1200);
  };

  const handleSendToDesigner = (imgUrl: string) => {
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
          src: imgUrl,
        },
      ],
    });
  };

  const handleGenerateWrite = () => {
    setIsWriting(true);
    setTimeout(() => {
      setWrittenOutput(
        `# ${writerPrompt}\n\nGenerated for ${writerType.toUpperCase()} with tone: ${writerTone}.\n\n### Key Highlights\n1. Built with precision and clarity using Lizzdo AI Studio OS content engine.\n2. Fully optimized for high conversion and maximum audience engagement.\n3. Seamlessly customizable for social platforms, websites, and marketing collateral.`
      );
      setIsWriting(false);

      setHistory((prev) => [
        {
          id: `h-${Date.now()}`,
          type: "Content",
          prompt: writerPrompt,
          date: "Just now",
          seed: Math.floor(Math.random() * 9000000),
          textResult: writerPrompt,
          favorite: false,
        },
        ...prev,
      ]);
      addNotification("AI Copy Generated", `Created ${writerType} copy draft.`, "success");
    }, 1000);
  };

  const handleGenerateBg = () => {
    setIsBgGenerating(true);
    setTimeout(() => {
      const bg = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80";
      setGeneratedBgUrl(bg);
      setIsBgGenerating(false);
      addNotification("Background Synthesized", "New high-resolution background ready.", "success");
    }, 1000);
  };

  const handleGenerateTemplate = () => {
    setIsTemplateGenerating(true);
    setTimeout(() => {
      setIsTemplateGenerating(false);
      createProject(`AI Layout: ${templatePrompt.slice(0, 20)}`, "designer");
      addNotification("Template Generated", "Created interactive canvas template in Designer.", "success");
    }, 1200);
  };

  const handleGenerateBrand = () => {
    setIsBrandGenerating(true);
    setTimeout(() => {
      setIsBrandGenerating(false);
      updateBrandKit({
        brandName,
        tagline: brandDesc,
        primaryColor: "#00F5FF",
        secondaryColor: "#A855F7",
        accentColors: ["#FF007A", "#3B82F6"],
        headingFont: "Syne",
        bodyFont: "Plus Jakarta Sans",
      });
      addNotification("Brand Identity Generated", `Updated global Brand Kit for "${brandName}"`, "success");
    }, 1200);
  };

  // Sub-Tool Left Navigation Menu
  const navItems: { id: AIToolSubTab; label: string; icon: LucideIcon; badge?: string }[] = [
    { id: "image-gen", label: "Image Generator", icon: ImageIcon, badge: "8K GPU" },
    { id: "writer", label: "Content Writer", icon: FileText },
    { id: "bg-gen", label: "Background Generator", icon: Layers },
    { id: "template-gen", label: "Template Generator", icon: Layout },
    { id: "brand-assistant", label: "Brand Assistant", icon: Palette },
    { id: "asset-gen", label: "Asset Generator", icon: Package },
    { id: "history", label: "Generation History", icon: History },
    { id: "future-labs", label: "AI Labs & Expansion", icon: Cpu, badge: "NEW" },
  ];

  return (
    <WorkspaceShell
      title="AI Tools Hub & Creative Studio"
      subtitle="Unified AI engine for graphics, copy, backgrounds, brand kits & vectors"
      toolId="ai-generator"
      icon={Wand2}
      badgeText="LIZZDO AI V3"
      leftPanelTitle="AI Tool Modules"
      leftPanel={
        <div className="space-y-1">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider block mb-2 px-1">
            Available AI Generators
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSubTab(item.id)}
                className={`w-full p-2.5 rounded-xl border font-mono text-xs flex items-center justify-between transition-all ${
                  isActive
                    ? "bg-neon-cyan/15 border-neon-cyan text-white font-bold shadow-[0_0_12px_rgba(0,245,255,0.25)]"
                    : "bg-neutral-900/50 border-white/5 text-gray-400 hover:bg-neutral-800 hover:text-white hover:border-white/20"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-neon-cyan" : "text-gray-400"}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-neon-purple/20 border border-neon-purple/40 text-neon-purple text-[8px] font-bold shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      }
      rightPanelTitle="AI Model Parameters"
      rightPanel={
        <div className="space-y-4 font-mono text-xs">
          {/* Global GPU Status */}
          <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase">GPU Cluster</span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE (0.2s)
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              Antigravity AI Studio Engine • Multi-Modal V3
            </div>
          </div>

          {/* Contextual Settings for Image Gen */}
          {activeSubTab === "image-gen" && (
            <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-3">
              <span className="text-[10px] font-bold text-neon-cyan uppercase block">Seed Control</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={imgSeed}
                  onChange={(e) => setImgSeed(Number(e.target.value))}
                  className="flex-1 bg-black border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-neon-cyan font-mono"
                />
                <button
                  type="button"
                  onClick={() => setImgSeed(Math.floor(Math.random() * 9000000))}
                  className="p-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300"
                  title="Randomize Seed"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-300">Brand Consistency</span>
                <input
                  type="checkbox"
                  checked={brandConsistency}
                  onChange={(e) => setBrandConsistency(e.target.checked)}
                  className="accent-neon-cyan"
                />
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="p-3 rounded-2xl bg-neutral-900 border border-white/10 space-y-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase block">Shortcuts</span>
            <div className="space-y-1 text-[10px] text-gray-500">
              <p>• <strong className="text-gray-300">Cmd+Enter</strong> Generate</p>
              <p>• <strong className="text-gray-300">Esc</strong> Cancel process</p>
            </div>
          </div>
        </div>
      }
    >
      {/* --- CENTER SUB-TAB WORKSPACE AREA --- */}
      <div className="w-full h-full flex flex-col font-sans select-none overflow-y-auto custom-scrollbar p-2">
        {/* 1. IMAGE GENERATOR TAB */}
        {activeSubTab === "image-gen" && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full">
            {/* Prompt Form */}
            <div className="w-full lg:w-96 bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-4 shrink-0 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <ImageIcon className="w-4 h-4 text-neon-cyan" />
                <h2 className="font-bold text-white uppercase text-xs">AI Image Generator</h2>
              </div>

              <div className="space-y-2">
                <label className="text-gray-300 uppercase font-bold flex items-center justify-between">
                  <span>Prompt Instructions</span>
                  <button
                    onClick={() =>
                      setImgPrompt(
                        "3D glassmorphism isometric digital studio dashboard with glowing cyan neon light trails, octane render 8k"
                      )
                    }
                    className="text-neon-cyan hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <Sparkle className="w-3 h-3" /> Sample Prompt
                  </button>
                </label>
                <textarea
                  rows={4}
                  value={imgPrompt}
                  onChange={(e) => setImgPrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-cyan font-sans leading-relaxed resize-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase text-[11px]">Negative Prompt</label>
                <input
                  type="text"
                  value={imgNegativePrompt}
                  onChange={(e) => setImgNegativePrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-gray-300 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* Style Grid */}
              <div className="space-y-1.5">
                <label className="text-gray-300 uppercase font-bold text-xs">Style Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setImgStyle(s.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        imgStyle === s.id
                          ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                          : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-[11px] truncate">{s.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-gray-300 uppercase font-bold text-xs">Aspect Ratio</label>
                <div className="grid grid-cols-2 gap-2">
                  {ASPECT_RATIOS.map((ar) => (
                    <button
                      key={ar.id}
                      onClick={() => setImgRatio(ar.id)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        imgRatio === ar.id
                          ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                          : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {ar.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateImages}
                disabled={isImgGenerating || !imgPrompt.trim()}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-white font-bold uppercase hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {isImgGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Images...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate 4 Variants</span>
                  </>
                )}
              </button>
            </div>

            {/* Display & Variants Gallery */}
            <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-gray-300">
                <span>Variant #{selectedImgIndex + 1} ({imgRatio})</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSendToDesigner(generatedImages[selectedImgIndex])}
                    className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" /> Open in Designer
                  </button>
                </div>
              </div>

              <div className="flex-1 my-4 flex items-center justify-center overflow-hidden">
                {isImgGenerating ? (
                  <div className="text-center space-y-3 font-mono">
                    <Wand2 className="w-8 h-8 text-neon-cyan animate-bounce mx-auto" />
                    <p className="text-xs text-neon-cyan font-bold">Rendering High-Res Variants...</p>
                  </div>
                ) : (
                  <img
                    src={generatedImages[selectedImgIndex]}
                    alt="AI Result"
                    className="max-h-[50vh] max-w-full object-contain rounded-xl border border-white/20 shadow-2xl"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Strip */}
              <div className="flex items-center gap-3 overflow-x-auto pt-3 border-t border-white/10">
                {generatedImages.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImgIndex(idx)}
                    className={`h-16 w-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                      selectedImgIndex === idx ? "border-neon-cyan scale-105" : "border-white/10 opacity-60"
                    }`}
                  >
                    <img src={url} alt={`Var ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CONTENT WRITER TAB */}
        {activeSubTab === "writer" && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full">
            {/* Input Config */}
            <div className="w-full lg:w-96 bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-4 shrink-0 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <FileText className="w-4 h-4 text-neon-purple" />
                <h2 className="font-bold text-white uppercase text-xs">AI Content Writer</h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase">Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {WRITER_TYPES.map((wt) => (
                    <button
                      key={wt.id}
                      onClick={() => setWriterType(wt.id)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        writerType === wt.id
                          ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                          : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-[11px] truncate">{wt.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase">Topic or Brief</label>
                <textarea
                  rows={4}
                  value={writerPrompt}
                  onChange={(e) => setWriterPrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-purple font-sans text-xs resize-none"
                  placeholder="Describe topic, features, target audience..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-400 uppercase text-[11px]">Tone of Voice</label>
                <input
                  type="text"
                  value={writerTone}
                  onChange={(e) => setWriterTone(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3 py-2 text-gray-300 focus:outline-none focus:border-neon-purple font-sans"
                />
              </div>

              <button
                onClick={handleGenerateWrite}
                disabled={isWriting || !writerPrompt.trim()}
                className="w-full py-3 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-bold uppercase transition-all flex items-center justify-center gap-2"
              >
                {isWriting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Writing Draft...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Generate Copy
                  </>
                )}
              </button>
            </div>

            {/* Output Panel */}
            <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 flex flex-col overflow-hidden font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-neon-purple font-bold uppercase">Generated Copy ({writerType})</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(writtenOutput);
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2000);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all flex items-center gap-1.5"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedText ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>

              <div className="flex-1 my-4 p-4 rounded-xl bg-neutral-900 border border-white/5 overflow-y-auto custom-scrollbar font-sans text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {writtenOutput}
              </div>
            </div>
          </div>
        )}

        {/* 3. BACKGROUND GENERATOR TAB */}
        {activeSubTab === "bg-gen" && (
          <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full">
            <div className="w-full lg:w-96 bg-neutral-950 border border-white/10 rounded-2xl p-4 space-y-4 shrink-0 font-mono text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Layers className="w-4 h-4 text-neon-cyan" />
                <h2 className="font-bold text-white uppercase text-xs">AI Background Generator</h2>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase">Preset Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {BG_STYLES.map((style) => (
                    <button
                      key={style}
                      onClick={() => setBgStyle(style)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        bgStyle === style
                          ? "bg-neon-cyan/20 border-neon-cyan text-white font-bold"
                          : "bg-neutral-900 border-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <div className="text-[11px] truncate">{style}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-gray-300 font-bold uppercase">Background Prompt</label>
                <textarea
                  rows={4}
                  value={bgPrompt}
                  onChange={(e) => setBgPrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-cyan font-sans text-xs resize-none"
                />
              </div>

              <button
                onClick={handleGenerateBg}
                disabled={isBgGenerating}
                className="w-full py-3 rounded-xl bg-neon-cyan hover:bg-neon-cyan/80 text-black font-bold uppercase transition-all flex items-center justify-center gap-2"
              >
                {isBgGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Generate Background</span>
              </button>
            </div>

            <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-4 flex flex-col justify-between overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                <span className="text-gray-300">Generated Background Canvas</span>
                <button
                  onClick={() => handleSendToDesigner(generatedBgUrl)}
                  className="px-3 py-1.5 rounded-xl bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold hover:bg-neon-cyan hover:text-black transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Use as Canvas Background
                </button>
              </div>

              <div className="flex-1 my-4 flex items-center justify-center overflow-hidden">
                <img
                  src={generatedBgUrl}
                  alt="AI Background"
                  className="max-h-[50vh] max-w-full object-cover rounded-xl border border-white/20 shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. TEMPLATE GENERATOR TAB */}
        {activeSubTab === "template-gen" && (
          <div className="max-w-3xl mx-auto w-full bg-neutral-950 border border-white/10 rounded-3xl p-8 space-y-6 font-mono text-xs my-auto">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Layout className="w-6 h-6 text-neon-cyan" />
              <div>
                <h2 className="font-bold text-white text-sm uppercase">AI Template & Layout Generator</h2>
                <p className="text-gray-400 font-sans text-xs">
                  Describe the graphic template you need in plain English and AI Studio OS will construct the vector layers.
                </p>
              </div>
            </div>

            <div className="space-y-2 font-sans">
              <label className="text-xs font-bold text-gray-300 uppercase">Design Description</label>
              <textarea
                rows={4}
                value={templatePrompt}
                onChange={(e) => setTemplatePrompt(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-2xl p-4 text-white focus:outline-none focus:border-neon-cyan text-sm leading-relaxed resize-none"
                placeholder="e.g. Modern Fiverr Gig cover with high-contrast text, glowing badge, and dark cyber background..."
              />
            </div>

            <button
              onClick={handleGenerateTemplate}
              disabled={isTemplateGenerating}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold uppercase text-sm hover:shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-all flex items-center justify-center gap-2"
            >
              {isTemplateGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Building Interactive Canvas Template...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Template & Open in Designer
                </>
              )}
            </button>
          </div>
        )}

        {/* 5. BRAND ASSISTANT TAB */}
        {activeSubTab === "brand-assistant" && (
          <div className="max-w-3xl mx-auto w-full bg-neutral-950 border border-white/10 rounded-3xl p-8 space-y-6 font-mono text-xs my-auto">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Palette className="w-6 h-6 text-neon-purple" />
              <div>
                <h2 className="font-bold text-white text-sm uppercase">AI Brand Assistant</h2>
                <p className="text-gray-400 font-sans text-xs">
                  Generate full brand identities including color palettes, font pairs, and taglines.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Brand Name</label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-purple text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Industry / Description</label>
                <input
                  type="text"
                  value={brandDesc}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-purple text-sm"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateBrand}
              disabled={isBrandGenerating}
              className="w-full py-4 rounded-2xl bg-neon-purple hover:bg-neon-purple/80 text-white font-bold uppercase text-sm transition-all flex items-center justify-center gap-2"
            >
              {isBrandGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
              <span>Generate & Apply to Global Brand Kit</span>
            </button>
          </div>
        )}

        {/* 6. ASSET GENERATOR TAB */}
        {activeSubTab === "asset-gen" && (
          <div className="max-w-3xl mx-auto w-full bg-neutral-950 border border-white/10 rounded-3xl p-8 space-y-6 font-mono text-xs my-auto">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <Package className="w-6 h-6 text-neon-pink" />
              <div>
                <h2 className="font-bold text-white text-sm uppercase">AI Vector & Asset Generator</h2>
                <p className="text-gray-400 font-sans text-xs">
                  Synthesize icons, 3D shapes, textures, and decorative elements directly into your Cloud Asset Library.
                </p>
              </div>
            </div>

            <div className="space-y-4 font-sans">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Asset Category</label>
                <select
                  value={assetCategory}
                  onChange={(e) => setAssetCategory(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-pink text-sm"
                >
                  <option value="3D Icons">3D Icons</option>
                  <option value="Flat Vector Illustrations">Flat Vector Illustrations</option>
                  <option value="Seamless Textures">Seamless Textures</option>
                  <option value="UI Components">UI Components & Badges</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-300 uppercase">Asset Description</label>
                <textarea
                  rows={3}
                  value={assetPrompt}
                  onChange={(e) => setAssetPrompt(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/15 rounded-xl p-3 text-white focus:outline-none focus:border-neon-pink text-sm resize-none"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setIsAssetGenerating(true);
                setTimeout(() => {
                  setIsAssetGenerating(false);
                  addNotification("Asset Generated", `Created "${assetPrompt}" in Cloud Asset Library.`, "success");
                  setActiveToolId("assets");
                }, 1000);
              }}
              disabled={isAssetGenerating}
              className="w-full py-4 rounded-2xl bg-neon-pink hover:bg-neon-pink/80 text-white font-bold uppercase text-sm transition-all flex items-center justify-center gap-2"
            >
              {isAssetGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Package className="w-5 h-5" />}
              <span>Generate Asset & Save to Library</span>
            </button>
          </div>
        )}

        {/* 7. GENERATION HISTORY TAB */}
        {activeSubTab === "history" && (
          <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 font-mono text-xs space-y-4 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-neon-cyan" />
                <h2 className="font-bold text-white uppercase text-xs">AI Generation History Log</h2>
              </div>
              <span className="text-gray-500 text-[10px]">{history.length} Generations Logged</span>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple font-bold shrink-0">
                        {item.type[0]}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold text-white uppercase">
                          {item.type}
                        </span>
                        <span className="text-gray-500 text-[10px]">{item.date}</span>
                      </div>
                      <p className="text-white text-xs font-sans mt-1 truncate max-w-md">"{item.prompt}"</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.previewUrl && (
                      <button
                        onClick={() => handleSendToDesigner(item.previewUrl!)}
                        className="p-2 rounded-xl bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan hover:text-black transition-all"
                        title="Open in Designer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. FUTURE AI LABS EXPANSION */}
        {activeSubTab === "future-labs" && (
          <div className="flex-1 bg-neutral-950 border border-white/10 rounded-2xl p-6 font-mono text-xs space-y-6 overflow-y-auto custom-scrollbar">
            <div className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-neon-cyan mb-1">
                <Cpu className="w-5 h-5 animate-pulse" />
                <h2 className="font-bold text-sm uppercase">Future AI Labs & Experimental Modules</h2>
              </div>
              <p className="text-gray-400 font-sans text-xs">
                Upcoming AI Studio OS features in early preview access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
              {[
                { title: "AI Video Generator", desc: "Text-to-Video 4K generation", icon: Video },
                { title: "AI Voice & Narration", desc: "Multilingual TTS & Voice cloning", icon: Volume2 },
                { title: "AI Music & Audio Synth", desc: "Background tracks & sound FX", icon: Music },
                { title: "AI 3D Mesh Generator", desc: "Text-to-3D GLTF model generator", icon: Box },
                { title: "AI Website Builder", desc: "Fullstack code & layout generator", icon: Globe },
                { title: "AI Security Audit", desc: "Codebase & compliance auditor", icon: Shield },
              ].map((lab, idx) => {
                const Icon = lab.icon;
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/50 transition-all space-y-3"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xs font-mono uppercase">{lab.title}</h3>
                      <p className="text-gray-400 text-xs mt-0.5">{lab.desc}</p>
                    </div>
                    <button
                      onClick={() => addNotification("Lab Access Requested", `Subscribed to early beta access for ${lab.title}`, "info")}
                      className="w-full py-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white transition-all text-[11px] font-mono"
                    >
                      Request Beta Access
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </WorkspaceShell>
  );
}
