import React from "react";
import {
  MousePointer,
  PlusCircle,
  ShieldCheck,
  Package,
  Palette,
  LayoutTemplate,
  Sparkles,
  Upload,
  History,
  Wand2,
  Hand,
  Crop,
  Type,
  Square,
  PenTool,
  Brush,
  Sliders,
  HelpCircle,
} from "lucide-react";

export type SidebarTab =
  | "elements"
  | "watermark"
  | "my-objects"
  | "brand"
  | "presets"
  | "assets"
  | "uploads"
  | "history"
  | "ai";

export type ToolMode =
  | "select"
  | "hand"
  | "crop"
  | "text"
  | "shape"
  | "pen"
  | "brush"
  | SidebarTab;

interface Props {
  activeTool: ToolMode;
  activeSidebarTab: SidebarTab | null;
  leftSidebarOpen: boolean;
  onSelectSidebarTab: (tab: SidebarTab) => void;
  onSelectCanvasTool: (tool: ToolMode) => void;
  onToggleSidebar: () => void;
  onOpenShortcuts?: () => void;
}

export function LeftToolRail({
  activeTool,
  activeSidebarTab,
  leftSidebarOpen,
  onSelectSidebarTab,
  onSelectCanvasTool,
  onToggleSidebar,
  onOpenShortcuts,
}: Props) {
  // 10 Primary Authoritative Navigation Tools in exact specified order
  const primaryNavTools: Array<{
    id: SidebarTab | "select";
    label: string;
    shortLabel: string;
    shortcut: string;
    icon: React.ElementType;
    description: string;
  }> = [
    {
      id: "select",
      label: "Select Tool",
      shortLabel: "Select",
      shortcut: "V",
      icon: MousePointer,
      description: "Direct manipulation, transform, and move canvas objects",
    },
    {
      id: "elements",
      label: "Insert Elements",
      shortLabel: "Insert",
      shortcut: "A",
      icon: PlusCircle,
      description: "Add point text, paragraph boxes, shapes, badges, buttons & logos",
    },
    {
      id: "watermark",
      label: "Watermark Studio",
      shortLabel: "Watermark",
      shortcut: "K",
      icon: ShieldCheck,
      description: "Single & tiled watermarks, opacity, positioning, signatures & logos",
    },
    {
      id: "my-objects",
      label: "My Objects Library",
      shortLabel: "My Objects",
      shortcut: "O",
      icon: Package,
      description: "Saved reusable custom elements and pre-made design modules",
    },
    {
      id: "brand",
      label: "Brand Kits & Styles",
      shortLabel: "Brand",
      shortcut: "B",
      icon: Palette,
      description: "Active brand colors, typography rules, logos & 1-click brand apply",
    },
    {
      id: "presets",
      label: "Presets & Templates",
      shortLabel: "Presets",
      shortcut: "P",
      icon: LayoutTemplate,
      description: "Social media canvas dimensions & fully editable multi-layer compositions",
    },
    {
      id: "assets",
      label: "Asset Library",
      shortLabel: "Assets",
      shortcut: "S",
      icon: Sparkles,
      description: "Icons, cyber HUD decorations, textures, badges & vector graphics",
    },
    {
      id: "uploads",
      label: "Upload & Media",
      shortLabel: "Upload",
      shortcut: "U",
      icon: Upload,
      description: "Upload images, SVGs, transparent PNG cutouts & auto-silhouette masks",
    },
    {
      id: "history",
      label: "History & Timeline",
      shortLabel: "History",
      shortcut: "H",
      icon: History,
      description: "Visual undo/redo timeline snapshots and state restoration",
    },
    {
      id: "ai",
      label: "AI Tools & Smart Stylizer",
      shortLabel: "AI Tools",
      shortcut: "X",
      icon: Wand2,
      description: "AI Background Remover, color palette harmony & smart composition",
    },
  ];

  return (
    <nav
      id="designer-left-tool-rail"
      aria-label="Designer Tools"
      className="w-16 bg-neutral-950/95 border-r border-white/10 flex flex-col items-center py-2.5 select-none z-30 shrink-0 text-gray-400 justify-between h-full shadow-2xl backdrop-blur-md"
    >
      {/* TOP PRIMARY NAVIGATION TOOLS */}
      <div className="flex flex-col items-center gap-1.5 w-full px-1.5 overflow-y-auto custom-scrollbar no-scrollbar">
        {primaryNavTools.map((t) => {
          const Icon = t.icon;
          const isSelectTool = t.id === "select";
          const isActive = isSelectTool
            ? activeTool === "select" && !leftSidebarOpen
            : leftSidebarOpen && activeSidebarTab === t.id;

          return (
            <button
              key={t.id}
              id={`tool-btn-${t.id}`}
              type="button"
              onClick={() => {
                if (isSelectTool) {
                  onSelectCanvasTool("select");
                } else {
                  onSelectSidebarTab(t.id as SidebarTab);
                }
              }}
              className={`w-full py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all relative group ${
                isActive
                  ? "bg-neon-cyan/20 border border-neon-cyan/60 text-neon-cyan shadow-[0_0_15px_rgba(0,245,255,0.25)] font-bold"
                  : "hover:bg-white/10 hover:text-white border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 transition-transform ${isActive ? "scale-110 text-neon-cyan" : "group-hover:scale-110"}`} />
              <span className="text-[9px] font-mono tracking-tight leading-none text-center truncate max-w-full">
                {t.shortLabel}
              </span>

              {/* ACTIVE GLOW INDICATOR BAR */}
              {isActive && (
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-neon-cyan rounded-r-full shadow-[0_0_8px_#00f5ff]" />
              )}

              {/* TOOLTIP ON HOVER */}
              <div className="absolute left-full ml-3 px-3 py-1.5 rounded-xl bg-neutral-900/95 border border-white/20 text-[11px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 flex flex-col gap-0.5 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{t.label}</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/20 text-[9px] text-neon-cyan font-bold font-mono">
                    {t.shortcut}
                  </kbd>
                </div>
                <span className="text-[10px] text-gray-400 font-sans">{t.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* BOTTOM UTILITY SHORTCUTS */}
      <div className="flex flex-col items-center gap-1.5 w-full px-1.5 pt-2 border-t border-white/10 shrink-0">
        <button
          type="button"
          onClick={() => onSelectCanvasTool("hand")}
          className={`w-full py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all relative group ${
            activeTool === "hand"
              ? "bg-amber-400/20 border border-amber-400/50 text-amber-300 font-bold"
              : "hover:bg-white/10 hover:text-white"
          }`}
        >
          <Hand className="w-4 h-4" />
          <span className="text-[8px] font-mono">Pan</span>
          <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
            Pan Canvas <kbd className="text-amber-400 font-bold ml-1">Space / H</kbd>
          </div>
        </button>

        {onOpenShortcuts && (
          <button
            type="button"
            onClick={onOpenShortcuts}
            className="w-full py-1.5 rounded-xl flex flex-col items-center justify-center gap-0.5 hover:bg-white/10 hover:text-white transition-all relative group"
            title="Keyboard Shortcuts"
          >
            <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
            <span className="text-[8px] font-mono text-gray-400">Keys</span>
            <div className="absolute left-full ml-3 px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
              Keyboard Shortcuts <kbd className="text-neon-cyan font-bold ml-1">?</kbd>
            </div>
          </button>
        )}
      </div>
    </nav>
  );
}

