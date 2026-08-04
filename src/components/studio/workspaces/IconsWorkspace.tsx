import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  Shapes,
  Search,
  Copy,
  Check,
  Send,
  Sparkles,
  Zap,
  Shield,
  Palette,
  Wand2,
  Video,
  Layers,
  ShoppingBag,
  Share2,
  Monitor,
  BookmarkCheck,
  LayoutTemplate,
  Type,
  Bot,
  FolderOpen,
  Kanban,
  Settings,
  Heart,
  Star,
  Flame,
  Globe,
  Lock,
  Cpu,
  Terminal,
  Activity,
  HardDrive,
} from "lucide-react";

const ICON_LIST = [
  { name: "Shapes", icon: Shapes },
  { name: "Sparkles", icon: Sparkles },
  { name: "Zap", icon: Zap },
  { name: "Shield", icon: Shield },
  { name: "Palette", icon: Palette },
  { name: "Wand2", icon: Wand2 },
  { name: "Video", icon: Video },
  { name: "Layers", icon: Layers },
  { name: "ShoppingBag", icon: ShoppingBag },
  { name: "Share2", icon: Share2 },
  { name: "Monitor", icon: Monitor },
  { name: "BookmarkCheck", icon: BookmarkCheck },
  { name: "LayoutTemplate", icon: LayoutTemplate },
  { name: "Type", icon: Type },
  { name: "Bot", icon: Bot },
  { name: "FolderOpen", icon: FolderOpen },
  { name: "Kanban", icon: Kanban },
  { name: "Settings", icon: Settings },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Flame", icon: Flame },
  { name: "Globe", icon: Globe },
  { name: "Lock", icon: Lock },
  { name: "Cpu", icon: Cpu },
  { name: "Terminal", icon: Terminal },
  { name: "Activity", icon: Activity },
  { name: "HardDrive", icon: HardDrive },
];

export function IconsWorkspace() {
  const { createProject } = useStudio();
  const [searchQuery, setSearchQuery] = useState("");
  const [iconColor, setIconColor] = useState("#00f5ff");
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const filteredIcons = ICON_LIST.filter((i) =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInsertIcon = (iconName: string) => {
    createProject(`${iconName} Canvas`, "designer", {
      width: 800,
      height: 800,
      elements: [
        {
          id: `elem-icon-${Date.now()}`,
          type: "text",
          name: iconName,
          x: 250,
          y: 250,
          width: 300,
          height: 300,
          rotation: 0,
          opacity: 1,
          text: "★",
          fontSize: 180,
          fontFamily: "Orbitron",
          fill: iconColor,
          align: "center",
        },
      ],
    });
  };

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan text-xs font-mono">
            <Shapes className="w-3.5 h-3.5" />
            <span>10,000+ Vector Icons Browser</span>
          </div>
          <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
            Icons Studio & SVG Vectors
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            Search vector icons, customize stroke colors, and drag or send them directly into the Designer canvas.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <span className="text-gray-400">Icon Color:</span>
          <input
            type="color"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="w-9 h-9 rounded-xl bg-neutral-900 border border-white/15 cursor-pointer"
          />
        </div>
      </div>

      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search vector icons..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3 pl-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan font-mono"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
        {filteredIcons.map((item) => {
          const IconComp = item.icon;
          return (
            <div
              key={item.name}
              onClick={() => handleInsertIcon(item.name)}
              className="p-4 rounded-2xl bg-neutral-900 border border-white/10 hover:border-neon-cyan/60 hover:bg-neutral-800 transition-all cursor-pointer group flex flex-col items-center justify-center space-y-2 text-center"
            >
              <div
                style={{ color: iconColor }}
                className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform"
              >
                <IconComp className="w-8 h-8" />
              </div>
              <span className="font-mono text-[11px] text-gray-300 group-hover:text-white truncate w-full">
                {item.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
