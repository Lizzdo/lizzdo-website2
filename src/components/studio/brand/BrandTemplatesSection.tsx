import React from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Layout,
  Plus,
  ArrowRight,
  Sparkles,
  Smartphone,
  Monitor,
  Share2,
  Briefcase,
  Store,
  BookOpen,
} from "lucide-react";

interface PresetItem {
  id: string;
  name: string;
  platform: string;
  dimensions: string;
  width: number;
  height: number;
  toolId: any;
  icon: any;
}

const BRAND_TEMPLATE_PRESETS: PresetItem[] = [
  { id: "tmpl-ig", name: "Instagram Square Post", platform: "Instagram", dimensions: "1080x1080", width: 1080, height: 1080, toolId: "social-designer", icon: Smartphone },
  { id: "tmpl-story", name: "Instagram / TikTok Story", platform: "Social Stories", dimensions: "1080x1920", width: 1080, height: 1920, toolId: "social-designer", icon: Smartphone },
  { id: "tmpl-yt", name: "YouTube Tech Thumbnail", platform: "YouTube", dimensions: "1280x720", width: 1280, height: 720, toolId: "thumbnail-creator", icon: Monitor },
  { id: "tmpl-banner", name: "YouTube Channel Header", platform: "YouTube", dimensions: "2560x1440", width: 2560, height: 1440, toolId: "banner-creator", icon: Monitor },
  { id: "tmpl-fb", name: "Facebook Page Banner", platform: "Facebook", dimensions: "1200x630", width: 1200, height: 630, toolId: "social-designer", icon: Share2 },
  { id: "tmpl-li", name: "LinkedIn Profile Cover", platform: "LinkedIn", dimensions: "1584x396", width: 1584, height: 396, toolId: "social-designer", icon: Briefcase },
  { id: "tmpl-x", name: "X / Twitter Header", platform: "X", dimensions: "1500x500", width: 1500, height: 500, toolId: "social-designer", icon: Share2 },
  { id: "tmpl-fiverr", name: "Fiverr Gig Cover Image", platform: "Fiverr", dimensions: "1280x769", width: 1280, height: 769, toolId: "portfolio-builder", icon: Briefcase },
  { id: "tmpl-biz", name: "Business Card Lockup", platform: "Print", dimensions: "1050x600", width: 1050, height: 600, toolId: "logo-creator", icon: Briefcase },
  { id: "tmpl-pres", name: "Presentation Slide 16:9", platform: "Presentation", dimensions: "1920x1080", width: 1920, height: 1080, toolId: "doc-designer", icon: Monitor },
  { id: "tmpl-store", name: "Store Hero Web Banner", platform: "E-Commerce", dimensions: "1920x800", width: 1920, height: 800, toolId: "store-designer", icon: Store },
  { id: "tmpl-blog", name: "Blog Article Header", platform: "Blog", dimensions: "1200x630", width: 1200, height: 630, toolId: "blog-designer", icon: BookOpen },
];

export const BrandTemplatesSection: React.FC = () => {
  const { activeBrandKit, createProject, applyBrandKitToDesign } = useStudio();

  const handleStartBrandedDesign = (preset: PresetItem) => {
    // Initial design state with brand colors, title, and logo
    const primaryLogo = activeBrandKit.logoVariants[0]?.url || "/lizzdo-logo.png";
    const initialDesign = {
      title: `${activeBrandKit.brandName} - ${preset.name}`,
      width: preset.width,
      height: preset.height,
      background: {
        type: "solid" as const,
        solidColor: activeBrandKit.colors.background,
      },
      elements: [
        {
          id: `logo-${Date.now()}`,
          name: "Brand Logo",
          type: "image",
          visible: true,
          locked: false,
          x: 60,
          y: 60,
          width: 120,
          height: 120,
          rotation: 0,
          opacity: 1,
          src: primaryLogo,
          url: primaryLogo,
        },
        {
          id: `title-${Date.now()}`,
          name: "Main Title",
          type: "text",
          visible: true,
          locked: false,
          x: 200,
          y: 80,
          width: preset.width - 260,
          height: 80,
          rotation: 0,
          opacity: 1,
          text: activeBrandKit.brandName,
          fontSize: 36,
          fontFamily: activeBrandKit.typography.heading.fontFamily,
          color: activeBrandKit.colors.primary,
          alignment: "top-left",
        },
        {
          id: `tagline-${Date.now()}`,
          name: "Sub Tagline",
          type: "text",
          visible: true,
          locked: false,
          x: 200,
          y: 130,
          width: preset.width - 260,
          height: 40,
          rotation: 0,
          opacity: 1,
          text: activeBrandKit.tagline,
          fontSize: 18,
          fontFamily: activeBrandKit.typography.body.fontFamily,
          color: activeBrandKit.colors.text,
          alignment: "top-left",
        },
      ],
    };

    const finalDesign = applyBrandKitToDesign(initialDesign as any, activeBrandKit);

    createProject(`${activeBrandKit.brandName} - ${preset.name}`, preset.toolId, finalDesign);
  };

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-base tracking-wider uppercase text-white flex items-center gap-2">
            <Layout className="w-5 h-5 text-neon-cyan" /> Branded Template Starters
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Start a new design across any platform pre-themed with <strong className="text-white">{activeBrandKit.brandName}</strong> colors, logos, and fonts.
          </p>
        </div>
      </div>

      {/* TEMPLATE PRESETS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {BRAND_TEMPLATE_PRESETS.map((preset) => {
          const IconComp = preset.icon;

          return (
            <div
              key={preset.id}
              className="p-4 rounded-2xl bg-black border border-white/10 hover:border-neon-cyan/50 space-y-3 group transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-neon-cyan uppercase font-bold">
                    {preset.platform}
                  </span>
                  <span className="text-gray-500">{preset.dimensions}</span>
                </div>

                <div className="h-24 rounded-xl bg-neutral-950 border border-white/5 p-3 flex flex-col justify-between relative overflow-hidden group-hover:border-neon-cyan/30 transition-all">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeBrandKit.colors.primary }}
                    />
                    <span className="font-display text-xs font-bold text-white truncate">
                      {activeBrandKit.brandName}
                    </span>
                  </div>

                  <span className="font-mono text-[11px] font-bold text-gray-300 truncate">
                    {preset.name}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleStartBrandedDesign(preset)}
                className="w-full py-2 rounded-xl bg-white/5 hover:bg-neon-cyan/20 hover:text-neon-cyan text-gray-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/10 group-hover:border-neon-cyan/40"
              >
                <Sparkles className="w-3.5 h-3.5 text-neon-cyan" /> Start Design
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
