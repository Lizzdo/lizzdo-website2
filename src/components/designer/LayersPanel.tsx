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
  ChevronsUp,
  ChevronsDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Search,
  FolderPlus,
  Folder,
  GripVertical,
  Scissors,
  Box,
  Layout,
  Ungroup,
  Group as GroupIcon,
} from "lucide-react";

interface Props {
  state: DesignState;
  selectedElementId: string | null;
  selectedElementIds?: string[];
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onMoveLayerToTop?: (id: string) => void;
  onMoveLayerToBottom?: (id: string) => void;
  onReorderLayers?: (draggedId: string, targetId: string) => void;
  onGroupSelected?: () => void;
  onUngroupSelected?: () => void;
}

export function LayersPanel({
  state,
  selectedElementId,
  selectedElementIds = [],
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
  onMoveLayerToTop,
  onMoveLayerToBottom,
  onReorderLayers,
  onGroupSelected,
  onUngroupSelected,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);

  // Render top layer first (reverse of z-index array)
  const elements = [...state.elements].reverse();
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

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggedId;
    if (sourceId && sourceId !== targetId && onReorderLayers) {
      onReorderLayers(sourceId, targetId);
    }
    setDraggedId(null);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case "text":
        return <Type className="w-3.5 h-3.5 text-neon-cyan shrink-0" />;
      case "badge":
        return <Tag className="w-3.5 h-3.5 text-neon-purple shrink-0" />;
      case "image":
        return <ImageIcon className="w-3.5 h-3.5 text-neon-pink shrink-0" />;
      case "button":
        return <MousePointer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "logo":
        return <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
      case "shape":
        return <Square className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case "mask":
        return <Scissors className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      case "group":
        return <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
      case "frame":
        return <Box className="w-3.5 h-3.5 text-blue-400 shrink-0" />;
      default:
        return <Layout className="w-3.5 h-3.5 text-gray-400 shrink-0" />;
    }
  };

  return (
    <div className="space-y-3 font-sans select-none text-xs text-gray-300">
      {/* HEADER & GROUP ACTION BAR */}
      <div className="flex items-center justify-between">
        <span className="font-display font-bold uppercase text-[11px] text-white flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-neon-purple" /> Layer Stack ({state.elements.length})
        </span>

        <div className="flex items-center gap-1">
          {onGroupSelected && (
            <button
              type="button"
              onClick={onGroupSelected}
              className="p-1 rounded bg-black/60 border border-white/10 hover:border-purple-500 text-gray-300 hover:text-white transition-all flex items-center gap-1 text-[10px]"
              title="Group Selected Layers"
            >
              <FolderPlus className="w-3 h-3 text-purple-400" /> Group
            </button>
          )}
          {onUngroupSelected && (
            <button
              type="button"
              onClick={onUngroupSelected}
              className="p-1 rounded bg-black/60 border border-white/10 hover:border-amber-500 text-gray-300 hover:text-white transition-all flex items-center gap-1 text-[10px]"
              title="Ungroup Selected"
            >
              <Ungroup className="w-3 h-3 text-amber-400" /> Ungroup
            </button>
          )}
        </div>
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

      {/* LAYERS LIST WITH DRAG AND DROP */}
      <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredElements.map((el) => {
          const isSelected = selectedElementId === el.id || selectedElementIds.includes(el.id);
          const isVisible = el.visible !== false;
          const isLocked = el.locked === true;

          return (
            <div
              key={el.id}
              draggable
              onDragStart={(e) => handleDragStart(e, el.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, el.id)}
              onClick={() => onSelectElement(el.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                draggedId === el.id ? "opacity-40" : ""
              } ${
                isSelected
                  ? "bg-neon-purple/20 border-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                  : "bg-black/40 border-white/10 hover:border-white/20 text-gray-300"
              }`}
            >
              {/* DRAG HANDLE & ICON & NAME */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <GripVertical className="w-3 h-3 text-gray-600 hover:text-gray-300 cursor-grab shrink-0" />
                {getItemIcon(el.type)}

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
                    className={`font-mono text-xs truncate font-medium ${el.isGroup ? "text-purple-300 font-bold" : ""}`}
                    title="Double click to rename layer"
                  >
                    {el.name}
                  </span>
                )}
              </div>

              {/* ACTION CONTROLS */}
              <div className="flex items-center gap-0.5 shrink-0">
                {/* HIDE / SHOW TOGGLE */}
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

                {/* MOVE TO TOP */}
                {onMoveLayerToTop && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerToTop(el.id);
                    }}
                    className="p-1 text-gray-500 hover:text-white"
                    title="Move to Top"
                  >
                    <ChevronsUp className="w-3 h-3" />
                  </button>
                )}

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

                {/* MOVE TO BOTTOM */}
                {onMoveLayerToBottom && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMoveLayerToBottom(el.id);
                    }}
                    className="p-1 text-gray-500 hover:text-white"
                    title="Move to Bottom"
                  >
                    <ChevronsDown className="w-3 h-3" />
                  </button>
                )}

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
