import React from "react";
import {
  MousePointer,
  Hand,
  Crop,
  PenTool,
  Brush,
  Eraser,
  Pipette,
  Paintbrush,
  Square,
  Type,
  Minus,
  ZoomIn,
  MessageSquare,
  Sparkles,
  Layers,
  Wand2,
  Sliders,
  Maximize2,
  Layout,
  Scissors,
  Grid,
  ShieldCheck,
} from "lucide-react";

export type ToolMode =
  | "select"
  | "hand"
  | "artboard"
  | "crop"
  | "pen"
  | "brush"
  | "eraser"
  | "eyedropper"
  | "gradient"
  | "shape"
  | "text"
  | "watermark"
  | "line"
  | "bg-remover"
  | "comment";

interface Props {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  onAddElement: (type: any) => void;
}

export function LeftToolRail({ activeTool, onSelectTool, onAddElement }: Props) {
  const tools: Array<{
    id: ToolMode;
    label: string;
    shortcut: string;
    icon: React.ElementType;
    action?: () => void;
  }> = [
    { id: "select", label: "Select Tool", shortcut: "V", icon: MousePointer },
    { id: "hand", label: "Pan / Hand Tool", shortcut: "H", icon: Hand },
    { id: "artboard", label: "Artboard Tool", shortcut: "F", icon: Layout },
    { id: "crop", label: "Crop Canvas", shortcut: "C", icon: Crop },
    {
      id: "text",
      label: "Text Tool (Click for Point, Drag for Box)",
      shortcut: "T",
      icon: Type,
    },
    {
      id: "watermark",
      label: "Watermark & Branding",
      shortcut: "K",
      icon: ShieldCheck,
      action: () => onAddElement("watermark"),
    },
    {
      id: "shape",
      label: "Shape / Frame Tool",
      shortcut: "R",
      icon: Square,
      action: () => onAddElement("shape"),
    },
    { id: "pen", label: "Vector Pen Tool", shortcut: "P", icon: PenTool },
    { id: "brush", label: "Brush & Pencil", shortcut: "B", icon: Brush },
    { id: "eraser", label: "Eraser Tool", shortcut: "E", icon: Eraser },
    { id: "eyedropper", label: "Eyedropper Color Picker", shortcut: "I", icon: Pipette },
    { id: "gradient", label: "Gradient & Fill", shortcut: "G", icon: Paintbrush },
    { id: "bg-remover", label: "AI Background Remover", shortcut: "W", icon: Wand2 },
    { id: "comment", label: "Comment / Notes", shortcut: "M", icon: MessageSquare },
  ];

  return (
    <div className="w-12 bg-neutral-900/90 border-r border-white/10 flex flex-col items-center py-2 gap-1 select-none z-30 shrink-0 text-gray-400">
      {tools.map((t) => {
        const Icon = t.icon;
        const isActive = activeTool === t.id;

        return (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              onSelectTool(t.id);
              if (t.action) t.action();
            }}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all relative group ${
              isActive
                ? "bg-neon-cyan/20 border border-neon-cyan text-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.3)] font-bold"
                : "hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-4 h-4" />

            {/* TOOLTIP ON HOVER */}
            <div className="absolute left-full ml-2 px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/20 text-[10px] font-mono text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex items-center gap-2 shadow-xl">
              <span>{t.label}</span>
              <kbd className="px-1 rounded bg-white/20 text-[9px] text-neon-cyan font-bold">
                {t.shortcut}
              </kbd>
            </div>
          </button>
        );
      })}
    </div>
  );
}
