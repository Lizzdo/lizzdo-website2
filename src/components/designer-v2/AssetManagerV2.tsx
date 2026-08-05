import React, { useState } from "react";
import { FolderKanban, Image as ImageIcon, Sparkles, Upload, Palette, Layers } from "lucide-react";
import { BrandKit } from "../../types/designerV2";

interface AssetManagerV2Props {
  brandKit?: BrandKit;
  onSelectStockImage: (url: string) => void;
  onApplyBrandKit: (brandKit: BrandKit) => void;
}

const STOCK_ASSETS = [
  {
    id: "img-1",
    name: "Cyber Neon Grid",
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop",
    category: "Backgrounds",
  },
  {
    id: "img-2",
    name: "Futuristic Hologram",
    url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    category: "Backgrounds",
  },
  {
    id: "img-3",
    name: "Deep Space Nebula",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    category: "Backgrounds",
  },
  {
    id: "img-4",
    name: "Abstract Circuit Glow",
    url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    category: "Abstract",
  },
];

const PRESET_BRAND_KITS: BrandKit[] = [
  {
    name: "Cyber Neon",
    primaryColor: "#00f5ff",
    secondaryColor: "#a855f7",
    accentColor: "#ff006e",
    backgroundColor: "#0a0e27",
    textColor: "#ffffff",
    headingFont: "Orbitron",
    bodyFont: "Rajdhani",
  },
  {
    name: "Space Gold",
    primaryColor: "#f59e0b",
    secondaryColor: "#10b981",
    accentColor: "#ef4444",
    backgroundColor: "#0b0f19",
    textColor: "#f8fafc",
    headingFont: "Orbitron",
    bodyFont: "Space Mono",
  },
  {
    name: "Hyper Violet",
    primaryColor: "#8b5cf6",
    secondaryColor: "#ec4899",
    accentColor: "#06b6d4",
    backgroundColor: "#090514",
    textColor: "#ffffff",
    headingFont: "Orbitron",
    bodyFont: "Inter",
  },
];

export default function AssetManagerV2({
  brandKit,
  onSelectStockImage,
  onApplyBrandKit,
}: AssetManagerV2Props) {
  const [activeTab, setActiveTab] = useState<"stock" | "brand" | "upload">("stock");

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onSelectStockImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full h-full bg-black/95 text-white p-3 flex flex-col gap-3 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-4 h-4 text-neon-purple" />
          <span className="font-display font-bold uppercase tracking-wider text-xs">Asset Manager</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab("stock")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "stock"
              ? "bg-neon-purple/20 text-neon-purple font-bold border border-neon-purple/50"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Stock Graphics
        </button>

        <button
          onClick={() => setActiveTab("brand")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "brand"
              ? "bg-neon-purple/20 text-neon-purple font-bold border border-neon-purple/50"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Brand Kits
        </button>

        <button
          onClick={() => setActiveTab("upload")}
          className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
            activeTab === "upload"
              ? "bg-neon-purple/20 text-neon-purple font-bold border border-neon-purple/50"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Uploads
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 space-y-3">
        {activeTab === "stock" && (
          <div className="grid grid-cols-2 gap-2">
            {STOCK_ASSETS.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onSelectStockImage(asset.url)}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-neon-cyan cursor-pointer transition-all aspect-video"
              >
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] text-neon-cyan font-bold p-1 text-center transition-opacity">
                  Insert Image
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "brand" && (
          <div className="space-y-3">
            {PRESET_BRAND_KITS.map((kit) => (
              <div
                key={kit.name}
                onClick={() => onApplyBrandKit(kit)}
                className="p-3 rounded-xl border border-white/10 bg-white/5 hover:border-neon-cyan cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-neon-cyan text-xs">{kit.name}</span>
                  <Palette className="w-3.5 h-3.5 text-gray-400" />
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: kit.primaryColor }} />
                  <div className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: kit.secondaryColor }} />
                  <div className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: kit.accentColor }} />
                  <div className="w-5 h-5 rounded-md border border-white/20" style={{ backgroundColor: kit.backgroundColor }} />
                </div>

                <div className="text-[10px] text-gray-400 flex items-center gap-2">
                  <span>Fonts: {kit.headingFont} / {kit.bodyFont}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/20 hover:border-neon-cyan rounded-2xl bg-white/5 text-center gap-3 transition-colors">
            <Upload className="w-8 h-8 text-neon-cyan animate-bounce" />
            <div className="space-y-1">
              <div className="font-bold text-xs text-white">Upload Custom Asset</div>
              <div className="text-[10px] text-gray-400">PNG, JPG, SVG, WebP up to 25MB</div>
            </div>
            <label className="px-4 py-2 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider cursor-pointer hover:bg-neon-cyan/90 transition-colors">
              Browse Files
              <input type="file" accept="image/*" onChange={handleCustomUpload} className="hidden" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
