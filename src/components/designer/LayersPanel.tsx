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
  FolderOpen,
  GripVertical,
  Scissors,
  Box,
  Layout,
  Ungroup,
  Edit2,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart as AlignTop,
  AlignVerticalJustifyCenter as AlignMiddle,
  AlignVerticalJustifyEnd as AlignBottom,
  SlidersHorizontal,
  Plus,
  Sparkles,
  ArrowRight,
  Circle,
  Star,
  Triangle,
} from "lucide-react";

interface Props {
  state: DesignState;
  selectedElementId: string | null;
  selectedElementIds?: string[];
  onSelectElement: (id: string | null) => void;
  onSelectMultipleElements?: (ids: string[]) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: "up" | "down") => void;
  onMoveLayerToTop?: (id: string) => void;
  onMoveLayerToBottom?: (id: string) => void;
  onReorderLayers?: (draggedId: string, targetId: string, position?: "before" | "after") => void;
  onGroupSelected?: () => void;
  onUngroupSelected?: () => void;
  onAlignSelected?: (type: "left" | "center-h" | "right" | "top" | "center-v" | "bottom") => void;
  onDistributeSelected?: (type: "horizontal" | "vertical") => void;
  onBatchLock?: (locked: boolean) => void;
  onBatchHide?: (visible: boolean) => void;
  onBatchDelete?: () => void;
  onBatchDuplicate?: () => void;
}

export function LayersPanel({
  state,
  selectedElementId,
  selectedElementIds = [],
  onSelectElement,
  onSelectMultipleElements,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onMoveLayer,
  onMoveLayerToTop,
  onMoveLayerToBottom,
  onReorderLayers,
  onGroupSelected,
  onUngroupSelected,
  onAlignSelected,
  onDistributeSelected,
  onBatchLock,
  onBatchHide,
  onBatchDelete,
  onBatchDuplicate,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "images" | "text" | "shapes" | "groups">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ id: string; position: "before" | "after" } | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  // Active selected IDs normalization
  const currentSelectedIds =
    selectedElementIds.length > 0
      ? selectedElementIds
      : selectedElementId
      ? [selectedElementId]
      : [];

  // Group elements and unparented elements
  const allElements = state.elements || [];
  // Render top layer first (visual stack in descending z-order)
  const sortedStack = [...allElements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  // Filter elements
  const filteredElements = sortedStack.filter((el) => {
    // Search match
    if (searchQuery.trim()) {
      const matchName = el.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchText = el.text ? el.text.toLowerCase().includes(searchQuery.toLowerCase()) : false;
      if (!matchName && !matchText) return false;
    }

    // Type filter match
    if (activeFilter === "images") return el.type === "image" || el.type === "logo";
    if (activeFilter === "text") return el.type === "text" || el.type === "badge" || el.type === "button";
    if (activeFilter === "shapes") return el.type === "shape" || el.type === "arrow" || el.type === "path";
    if (activeFilter === "groups") return el.isGroup || !!el.groupId;
    return true;
  });

  const toggleGroupExpand = (groupId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: prev[groupId] === undefined ? false : !prev[groupId],
    }));
  };

  const startRename = (el: CanvasElement, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingId(el.id);
    setEditingName(el.name);
  };

  const saveRename = (el: CanvasElement) => {
    if (editingName.trim()) {
      onUpdateElement({ ...el, name: editingName.trim() });
    }
    setEditingId(null);
  };

  // Multi-selection layer click handling (Ctrl/Cmd or Shift)
  const handleLayerClick = (el: CanvasElement, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Toggle selection in multi-select array
      const exists = currentSelectedIds.includes(el.id);
      const nextIds = exists
        ? currentSelectedIds.filter((id) => id !== el.id)
        : [...currentSelectedIds, el.id];
      onSelectMultipleElements?.(nextIds);
      if (nextIds.length === 1) onSelectElement(nextIds[0]);
      else if (nextIds.length === 0) onSelectElement(null);
    } else if (e.shiftKey && currentSelectedIds.length > 0) {
      // Range selection
      const lastSelectedId = currentSelectedIds[currentSelectedIds.length - 1];
      const idx1 = filteredElements.findIndex((item) => item.id === lastSelectedId);
      const idx2 = filteredElements.findIndex((item) => item.id === el.id);
      if (idx1 !== -1 && idx2 !== -1) {
        const start = Math.min(idx1, idx2);
        const end = Math.max(idx1, idx2);
        const rangeIds = filteredElements.slice(start, end + 1).map((item) => item.id);
        const combined = Array.from(new Set([...currentSelectedIds, ...rangeIds]));
        onSelectMultipleElements?.(combined);
        onSelectElement(el.id);
      } else {
        onSelectElement(el.id);
        onSelectMultipleElements?.([el.id]);
      }
    } else {
      // Normal single selection
      onSelectElement(el.id);
      onSelectMultipleElements?.([el.id]);
    }
  };

  // Drag & Drop handling
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    const position = e.clientY < midY ? "before" : "after";
    setDropTarget({ id: targetId, position });
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggedId;
    if (sourceId && sourceId !== targetId && onReorderLayers) {
      const position = dropTarget?.position || "after";
      onReorderLayers(sourceId, targetId, position);
    }
    setDraggedId(null);
    setDropTarget(null);
  };

  // Helper icon for each element type
  const getItemIcon = (el: CanvasElement) => {
    if (el.isGroup) {
      const isExpanded = expandedGroups[el.id] !== false;
      return isExpanded ? (
        <FolderOpen className="w-3.5 h-3.5 text-neon-purple shrink-0" />
      ) : (
        <Folder className="w-3.5 h-3.5 text-neon-purple shrink-0" />
      );
    }

    switch (el.type) {
      case "text":
        return <Type className="w-3.5 h-3.5 text-neon-cyan shrink-0" />;
      case "badge":
        return <Tag className="w-3.5 h-3.5 text-neon-purple shrink-0" />;
      case "button":
        return <MousePointer className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
      case "image":
        return el.url ? (
          <img
            src={el.url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-4 h-4 rounded object-cover border border-white/20 shrink-0"
          />
        ) : (
          <ImageIcon className="w-3.5 h-3.5 text-neon-pink shrink-0" />
        );
      case "logo":
        return el.url ? (
          <img
            src={el.url}
            alt=""
            referrerPolicy="no-referrer"
            className="w-4 h-4 rounded object-contain border border-amber-400/40 shrink-0 bg-black/40"
          />
        ) : (
          <Shield className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        );
      case "shape":
        if (el.shapeType === "circle" || el.shapeType === "ellipse") {
          return <Circle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
        }
        if (el.shapeType === "star") {
          return <Star className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
        }
        if (el.shapeType === "triangle") {
          return <Triangle className="w-3.5 h-3.5 text-purple-400 shrink-0" />;
        }
        return <Square className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
      case "arrow":
      case "line":
        return <ArrowRight className="w-3.5 h-3.5 text-neon-cyan shrink-0" />;
      case "path":
      case "draw":
        return <Scissors className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
      default:
        return <Layout className="w-3.5 h-3.5 text-gray-400 shrink-0" />;
    }
  };

  const isMultiSelecting = currentSelectedIds.length > 1;

  return (
    <div className="space-y-3 font-sans select-none text-xs text-gray-300">
      {/* 1. HEADER & STACK SUMMARY */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-display font-bold uppercase text-[11px] text-white tracking-wider flex items-center gap-1.5">
              Layers Stack
            </h3>
            <span className="text-[10px] font-mono text-gray-400">
              {allElements.length} {allElements.length === 1 ? "layer" : "layers"}
              {currentSelectedIds.length > 0 && ` • ${currentSelectedIds.length} selected`}
            </span>
          </div>
        </div>

        {/* QUICK GROUP / UNGROUP ACTIONS */}
        <div className="flex items-center gap-1">
          {isMultiSelecting && onGroupSelected && (
            <button
              type="button"
              onClick={onGroupSelected}
              className="px-2 py-1 rounded-lg bg-neon-purple/20 border border-neon-purple/50 text-white hover:bg-neon-purple/30 transition-all flex items-center gap-1 text-[10px] font-mono font-bold shadow-lg animate-pulse"
              title="Group Selected Layers (Ctrl+G)"
            >
              <FolderPlus className="w-3 h-3 text-neon-purple" /> Group ({currentSelectedIds.length})
            </button>
          )}

          {currentSelectedIds.some((id) => allElements.find((e) => e.id === id)?.isGroup) && onUngroupSelected && (
            <button
              type="button"
              onClick={onUngroupSelected}
              className="px-2 py-1 rounded-lg bg-amber-400/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400/30 transition-all flex items-center gap-1 text-[10px] font-mono font-bold"
              title="Ungroup (Ctrl+Shift+G)"
            >
              <Ungroup className="w-3 h-3" /> Ungroup
            </button>
          )}
        </div>
      </div>

      {/* 2. MULTI-SELECTION BATCH ACTION BAR (VISIBLE WHEN 2+ ITEMS SELECTED) */}
      {isMultiSelecting && (
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-850 to-neutral-900 border border-neon-purple/40 rounded-xl p-2.5 space-y-2 shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between text-[10px] font-mono text-gray-300">
            <span className="text-neon-purple font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Multi-Selection Tools
            </span>
            <span className="text-gray-400">{currentSelectedIds.length} Objects Active</span>
          </div>

          {/* Alignment Strip */}
          {onAlignSelected && (
            <div className="grid grid-cols-6 gap-1 bg-black/60 p-1 rounded-lg border border-white/10 text-gray-300">
              <button
                type="button"
                onClick={() => onAlignSelected("left")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Left"
              >
                <AlignLeft className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onAlignSelected("center-h")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Center Horizontally"
              >
                <AlignCenter className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onAlignSelected("right")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Right"
              >
                <AlignRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onAlignSelected("top")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Top"
              >
                <AlignTop className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onAlignSelected("center-v")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Middle Vertically"
              >
                <AlignMiddle className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => onAlignSelected("bottom")}
                className="p-1 hover:bg-white/10 hover:text-neon-cyan rounded flex justify-center"
                title="Align Bottom"
              >
                <AlignBottom className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Distribution & Batch Controls */}
          <div className="flex items-center justify-between gap-1 pt-1">
            {onDistributeSelected && currentSelectedIds.length >= 3 && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onDistributeSelected("horizontal")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-gray-300 hover:text-white"
                  title="Distribute Horizontal Spacing"
                >
                  Dist. Horiz
                </button>
                <button
                  type="button"
                  onClick={() => onDistributeSelected("vertical")}
                  className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-mono text-gray-300 hover:text-white"
                  title="Distribute Vertical Spacing"
                >
                  Dist. Vert
                </button>
              </div>
            )}

            <div className="flex items-center gap-1 ml-auto">
              {onBatchDuplicate && (
                <button
                  type="button"
                  onClick={onBatchDuplicate}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-neon-cyan"
                  title="Duplicate All Selected"
                >
                  <Copy className="w-3 h-3" />
                </button>
              )}
              {onBatchLock && (
                <button
                  type="button"
                  onClick={() => onBatchLock(true)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-gray-300 hover:text-amber-400"
                  title="Lock All Selected"
                >
                  <Lock className="w-3 h-3" />
                </button>
              )}
              {onBatchDelete && (
                <button
                  type="button"
                  onClick={onBatchDelete}
                  className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300"
                  title="Delete All Selected"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. SEARCH & TYPE FILTER CHIPS */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search layers by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-xl px-2.5 py-1.5 pl-8 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-colors font-mono"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-[10px]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 custom-scrollbar text-[10px] font-mono">
          {[
            { id: "all", label: "All" },
            { id: "images", label: "Images" },
            { id: "text", label: "Text" },
            { id: "shapes", label: "Shapes" },
            { id: "groups", label: "Groups" },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id as any)}
              className={`px-2 py-0.5 rounded-lg border transition-all whitespace-nowrap ${
                activeFilter === f.id
                  ? "bg-neon-purple/20 border-neon-purple text-white font-bold"
                  : "bg-black/40 border-white/10 text-gray-400 hover:text-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. LAYERS LIST WITH DRAG & DROP & NESTED GROUPS */}
      <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
        {filteredElements.length === 0 ? (
          <div className="py-8 text-center bg-black/30 rounded-2xl border border-dashed border-white/10 p-4 space-y-2">
            <Layers className="w-6 h-6 text-gray-600 mx-auto" />
            <p className="text-xs text-gray-400 font-mono">No layers match current filter</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-[10px] text-neon-cyan hover:underline"
              >
                Reset Search Query
              </button>
            )}
          </div>
        ) : (
          filteredElements.map((el) => {
            const isSelected = currentSelectedIds.includes(el.id);
            const isVisible = el.visible !== false;
            const isLocked = el.locked === true;
            const isGroup = el.isGroup === true;
            const isChildOfGroup = !!el.groupId;
            const isExpanded = expandedGroups[el.id] !== false;
            const isDropTargetBefore = dropTarget?.id === el.id && dropTarget.position === "before";
            const isDropTargetAfter = dropTarget?.id === el.id && dropTarget.position === "after";

            return (
              <div key={el.id} className="relative">
                {/* Visual Insertion Indicator (Drop Before) */}
                {isDropTargetBefore && (
                  <div className="h-0.5 w-full bg-neon-cyan shadow-[0_0_8px_#00f5ff] rounded-full my-0.5" />
                )}

                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, el.id)}
                  onDragOver={(e) => handleDragOver(e, el.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, el.id)}
                  onClick={(e) => handleLayerClick(el, e)}
                  className={`group relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                    isChildOfGroup ? "ml-4 border-dashed" : ""
                  } ${draggedId === el.id ? "opacity-30 scale-95" : ""} ${
                    isSelected
                      ? "bg-neon-purple/25 border-neon-purple text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]"
                      : "bg-black/50 border-white/10 hover:border-white/25 text-gray-300 hover:bg-black/70"
                  }`}
                >
                  {/* LEFT: DRAG GRIP + EXPAND CHEVRON + ICON + NAME */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <GripVertical className="w-3 h-3 text-gray-600 group-hover:text-gray-300 cursor-grab shrink-0" />

                    {isGroup && (
                      <button
                        type="button"
                        onClick={(e) => toggleGroupExpand(el.id, e)}
                        className="p-0.5 hover:bg-white/10 rounded text-purple-300"
                        title={isExpanded ? "Collapse Group" : "Expand Group"}
                      >
                        {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
                      </button>
                    )}

                    <div className="shrink-0">{getItemIcon(el)}</div>

                    {editingId === el.id ? (
                      <div className="flex items-center gap-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => saveRename(el)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveRename(el);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          autoFocus
                          className="bg-black border border-neon-purple rounded px-1.5 py-0.5 text-xs text-white focus:outline-none w-full font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => saveRename(el)}
                          className="p-1 text-neon-cyan hover:bg-white/10 rounded shrink-0"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onDoubleClick={(e) => startRename(el, e)}
                        className="flex items-center gap-1.5 min-w-0 flex-1 truncate"
                        title="Double-click to rename"
                      >
                        <span
                          className={`font-mono text-xs truncate font-medium ${
                            isGroup ? "text-purple-300 font-bold" : isSelected ? "text-white" : "text-gray-300"
                          }`}
                        >
                          {el.name}
                        </span>

                        {/* Subtle opacity badge if not 100% */}
                        {el.opacity !== undefined && el.opacity < 1 && (
                          <span className="text-[9px] font-mono px-1 rounded bg-white/5 text-gray-400 shrink-0">
                            {Math.round(el.opacity * 100)}%
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RIGHT: ACTION CONTROLS */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {/* EDIT NAME BUTTON */}
                    {editingId !== el.id && (
                      <button
                        type="button"
                        onClick={(e) => startRename(el, e)}
                        className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 text-gray-400 hover:text-white transition-opacity"
                        title="Rename Layer"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}

                    {/* HIDE / SHOW TOGGLE */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdateElement({ ...el, visible: !isVisible });
                      }}
                      className={`p-1 rounded hover:bg-white/10 transition-colors ${
                        isVisible ? "text-neon-cyan" : "text-gray-600 hover:text-gray-400"
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
                        isLocked ? "text-amber-400" : "text-gray-600 hover:text-gray-400"
                      }`}
                      title={isLocked ? "Unlock Layer" : "Lock Layer"}
                    >
                      {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    </button>

                    {/* MOVE LAYER UP (BRING FORWARD) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, "up");
                      }}
                      className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded"
                      title="Bring Forward"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>

                    {/* MOVE LAYER DOWN (SEND BACKWARD) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMoveLayer(el.id, "down");
                      }}
                      className="p-1 text-gray-500 hover:text-white hover:bg-white/10 rounded"
                      title="Send Backward"
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
                      className="p-1 text-gray-500 hover:text-neon-cyan hover:bg-white/10 rounded"
                      title="Duplicate Layer (Ctrl+D)"
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
                      className="p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded"
                      title="Delete Layer (Delete)"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Visual Insertion Indicator (Drop After) */}
                {isDropTargetAfter && (
                  <div className="h-0.5 w-full bg-neon-cyan shadow-[0_0_8px_#00f5ff] rounded-full my-0.5" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 5. QUICK SHORTCUTS FOOTER NOTE */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[9px] font-mono text-gray-500">
        <span>Click to select • Drag to reorder</span>
        <span>Ctrl+G to Group • Del to remove</span>
      </div>
    </div>
  );
}
