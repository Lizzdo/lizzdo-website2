import React, { useState } from "react";
import { CanvasElement, DesignState } from "../../types/designer";
import {
  Layers,
  Type,
  Tag,
  Image as ImageIcon,
  MousePointer,
  Shield,
  Square,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Search,
  FolderPlus,
  Folder,
} from "lucide-react";

interface Props {
  state: DesignState;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
}

export function LayersPanel({
  state,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const elements = [...state.elements].reverse(); // Render top layer first
  const filteredElements = elements.filter((el) =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (el: CanvasElement) => {
    setEditingId(el.id);
    setEditingName(el.name);
  };

  const saveRename = (el: CanvasElement) => {
    if (editingName.trim()) {
      onUpdateElement({ ...el, name: editingName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-3 font-sans select-none text-xs text-gray-300">
      {/* HEADER & SEARCH */}
      <div className="flex items-center justify-between">
        <span className="font-display font-bold uppercase text-[11px] text-white flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-neon-purple" /> Layer Tree ({state.elements.length})
        </span>
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Filter layers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple"
        />
        <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* LAYERS LIST */}
      <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredElements.map((el) => {
          const isSelected = selectedElementId === el.id;
          const isVisible = el.visible !== false;
          const isLocked = el.locked === true;

          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                isSelected
                  ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "bg-black/40 border-white/10 hover:border-white/20 text-gray-300"
              }`}
            >
              {/* ICON + NAME */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {el.type === "text" && <Type className="w-3.5 h-3.5 text-neon-cyan shrink-0" />}
                {el.type === "badge" && <Tag className="w-3.5 h-3.5 text-neon-purple shrink-0" />}
                {el.type === "image" && <ImageIcon className="w-3.5 h-3.5 text-neon-pink shrink-0" />}
                {el.type === "button" && <MousePointer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                {el.type === "logo" && <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                {el.type === "shape" && <Square className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}

                {editingId === el.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveRename(el)}
                    onKeyDown={(e) => e.key === "Enter" && saveRename(el)}
                    autoFocus
                    className="bg-black/80 border border-neon-purple rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <span
                    onDoubleClick={() => startRename(el)}
                    className="font-mono text-xs truncate font-medium"
                    title="Double click to rename layer"
                  >
                    {el.name}
                  </span>
                )}
              </div>

              {/* CONTROLS */}
              <div className="flex items-center gap-1 shrink-0">
                {/* HIDE / EYE TOGGLE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement({ ...el, visible: !isVisible });
                  }}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    isVisible ? "text-neon-cyan" : "text-gray-600"
                  }`}
                  title={isVisible ? "Hide Layer" : "Show Layer"}
                >
                  {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                </button>

                {/* LOCK TOGGLE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateElement({ ...el, locked: !isLocked });
                  }}
                  className={`p-1 rounded hover:bg-white/10 transition-colors ${
                    isLocked ? "text-amber-400" : "text-gray-500"
                  }`}
                  title={isLocked ? "Unlock Layer" : "Lock Layer"}
                >
                  {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>

                {/* MOVE UP */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(el.id, "up");
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Move Up"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>

                {/* MOVE DOWN */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveLayer(el.id, "down");
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                  title="Move Down"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* DUPLICATE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateElement(el.id);
                  }}
                  className="p-1 text-gray-400 hover:text-neon-cyan"
                  title="Duplicate Layer"
                >
                  <Copy className="w-3 h-3" />
                </button>

                {/* DELETE */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteElement(el.id);
                  }}
                  className="p-1 text-red-400 hover:text-red-300"
                  title="Delete Layer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
