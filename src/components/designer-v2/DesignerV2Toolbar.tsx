import React from "react";
import {
  MousePointer,
  Hand,
  LayoutGrid,
  Type,
  Image,
  Square,
  Sparkles,
  BadgeAlert,
  Frame,
  FileCode,
  Component,
  Wand2,
  Layers,
  FolderKanban,
  Sliders,
  Palette,
  History,
} from "lucide-react";
import { V2Tool, WorkspaceConfig } from "../../types/designerV2";

interface DesignerV2ToolbarProps {
  workspace: WorkspaceConfig;
  onSelectTool: (tool: V2Tool) => void;
  onToggleLeftPanel: (tab?: WorkspaceConfig["leftPanelTab"]) => void;
  onToggleRightPanel: (tab?: WorkspaceConfig["rightPanelTab"]) => void;
  onAddTextElement: () => void;
  onAddShapeElement: (shapeType: "rect" | "circle" | "glow-card" | "line") => void;
  onAddBadgeElement: () => void;
  onAddButtonElement: () => void;
  onAddImageElement: () => void;
}

export default function DesignerV2Toolbar({
  workspace,
  onSelectTool,
  onToggleLeftPanel,
  onToggleRightPanel,
  onAddTextElement,
  onAddShapeElement,
  onAddBadgeElement,
  onAddButtonElement,
  onAddImageElement,
}: DesignerV2ToolbarProps) {
  const primaryTools: { id: V2Tool; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: "select", label: "Select / Transform", icon: <MousePointer className="w-4 h-4" />, shortcut: "V" },
    { id: "pan", label: "Hand Pan", icon: <Hand className="w-4 h-4" />, shortcut: "H / Space" },
    { id: "artboard", label: "Artboard Tool", icon: <LayoutGrid className="w-4 h-4" />, shortcut: "A" },
  ];

  return (
    <aside className="w-14 bg-black/95 backdrop-blur-xl border-r border-neon-cyan/20 flex flex-col items-center py-3 gap-4 z-30 select-none text-white">
      {/* Selection & Canvas Tools */}
      <div className="flex flex-col gap-1 w-full px-2">
        {primaryTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              workspace.activeTool === tool.id
                ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.3)]"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            {tool.icon}
          </button>
        ))}
      </div>

      <div className="w-8 h-[1px] bg-white/10" />

      {/* Creation Tools */}
      <div className="flex flex-col gap-1 w-full px-2">
        <button
          onClick={() => {
            onSelectTool("text");
            onAddTextElement();
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.activeTool === "text"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Add Text Layer (T)"
        >
          <Type className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onSelectTool("image");
            onAddImageElement();
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.activeTool === "image"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Upload or Stock Image Layer (I)"
        >
          <Image className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onSelectTool("shape");
            onAddShapeElement("rect");
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.activeTool === "shape"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Add Geometric Shape / Card (R)"
        >
          <Square className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onSelectTool("badge");
            onAddBadgeElement();
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.activeTool === "badge"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Add Cyber Tag / Badge (B)"
        >
          <BadgeAlert className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            onSelectTool("button");
            onAddButtonElement();
          }}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.activeTool === "button"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Add Action Button (U)"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </div>

      <div className="w-8 h-[1px] bg-white/10" />

      {/* Side Docked Panels Toggles */}
      <div className="flex flex-col gap-1 w-full px-2 mt-auto">
        <button
          onClick={() => onToggleLeftPanel("layers")}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.leftPanelOpen && workspace.leftPanelTab === "layers"
              ? "bg-neon-purple/20 text-neon-purple border border-neon-purple"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Layers Tree (L)"
        >
          <Layers className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleLeftPanel("assets")}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.leftPanelOpen && workspace.leftPanelTab === "assets"
              ? "bg-neon-purple/20 text-neon-purple border border-neon-purple"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Asset Manager & Brand Kits"
        >
          <FolderKanban className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleRightPanel("inspector")}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.rightPanelOpen && workspace.rightPanelTab === "inspector"
              ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="Property Inspector"
        >
          <Sliders className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleLeftPanel("history")}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            workspace.leftPanelOpen && workspace.leftPanelTab === "history"
              ? "bg-neon-purple/20 text-neon-purple border border-neon-purple"
              : "text-gray-400 hover:bg-white/10 hover:text-white"
          }`}
          title="History Timeline"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
