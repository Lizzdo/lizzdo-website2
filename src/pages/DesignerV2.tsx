import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { V2Project, V2Artboard, WorkspaceConfig, HistoryEntry, V2Tool } from "../types/designerV2";
import { CanvasElement, DesignState } from "../types/designer";
import { createDefaultV2Project, addArtboardToV2Project } from "../utils/designerV2Migration";

import DesignerV2Header from "../components/designer-v2/DesignerV2Header";
import DesignerV2Toolbar from "../components/designer-v2/DesignerV2Toolbar";
import InfiniteCanvasV2 from "../components/designer-v2/InfiniteCanvasV2";
import LayerPanelV2 from "../components/designer-v2/LayerPanelV2";
import AssetManagerV2 from "../components/designer-v2/AssetManagerV2";
import InspectorPanelV2 from "../components/designer-v2/InspectorPanelV2";
import HistoryPanelV2 from "../components/designer-v2/HistoryPanelV2";
import TemplateManagerV2 from "../components/designer-v2/TemplateManagerV2";
import ExportManagerV2Modal from "../components/designer-v2/ExportManagerV2Modal";
import PluginAssistantV2Modal from "../components/designer-v2/PluginAssistantV2Modal";
import V1ImportMigrationModal from "../components/designer-v2/V1ImportMigrationModal";

const LOCAL_STORAGE_KEY = "lizzdo_designer_v2_project";

export default function DesignerV2() {
  // 1. Initial State Load (Local Storage or Default)
  const [project, setProject] = useState<V2Project>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.artboards && parsed.version === "2.0") {
          return parsed;
        }
      }
    } catch (e) {
      /* ignore storage error */
    }
    return createDefaultV2Project();
  });

  // 2. Workspace Config
  const [workspace, setWorkspace] = useState<WorkspaceConfig>({
    zoom: 1,
    panX: 100,
    panY: 80,
    showGrid: true,
    gridSize: 40,
    showSnapGuides: true,
    showWireframe: false,
    showSafeMargins: false,
    theme: "dark",
    activeTool: "select",
    leftPanelTab: "layers",
    rightPanelTab: "inspector",
    leftPanelOpen: true,
    rightPanelOpen: true,
  });

  // 3. Active Selection State
  const [selectedElementId, setSelectedElementId] = useState<string | null>("badge-1");

  // 4. History Undo/Redo Stack
  const [historyStack, setHistoryStack] = useState<HistoryEntry[]>(() => [
    {
      id: "hist-0",
      timestamp: new Date().toLocaleTimeString(),
      description: "Initial Project Load",
      projectSnapshot: createDefaultV2Project(),
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // 5. Modals State
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPluginModal, setShowPluginModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Active Artboard Object
  const activeArtboard =
    project.artboards.find((a) => a.id === project.activeArtboardId) || project.artboards[0];

  // Save Project Snapshot to History & LocalStorage
  const pushHistorySnapshot = useCallback(
    (newProject: V2Project, description: string) => {
      setProject(newProject);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProject));
      } catch (e) {
        /* storage limit fallback */
      }

      setHistoryStack((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        const entry: HistoryEntry = {
          id: "hist-" + Date.now(),
          timestamp: new Date().toLocaleTimeString(),
          description,
          projectSnapshot: newProject,
        };
        return [...sliced, entry];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Undo / Redo Handler
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const targetSnapshot = historyStack[prevIndex].projectSnapshot;
      setHistoryIndex(prevIndex);
      setProject(targetSnapshot);
    }
  };

  const handleRedo = () => {
    if (historyIndex < historyStack.length - 1) {
      const nextIndex = historyIndex + 1;
      const targetSnapshot = historyStack[nextIndex].projectSnapshot;
      setHistoryIndex(nextIndex);
      setProject(targetSnapshot);
    }
  };

  // Keyboard Shortcuts Listener (Ctrl+Z, Ctrl+Y, Delete, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
        handleRedo();
      } else if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedElementId && activeArtboard) {
          handleDeleteElement(selectedElementId);
        }
      } else if (e.key === "Escape") {
        setSelectedElementId(null);
      } else if (e.key.toLowerCase() === "v") {
        setWorkspace((prev) => ({ ...prev, activeTool: "select" }));
      } else if (e.key.toLowerCase() === "h") {
        setWorkspace((prev) => ({ ...prev, activeTool: "pan" }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, activeArtboard, historyIndex, historyStack]);

  // Update Element Attributes
  const handleUpdateElement = (elementId: string, updates: Partial<CanvasElement>) => {
    if (!activeArtboard) return;

    const updatedElements = activeArtboard.state.elements.map((el) =>
      el.id === elementId ? { ...el, ...updates } : el
    );

    const updatedProject: V2Project = {
      ...project,
      updatedAt: new Date().toISOString(),
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: updatedElements,
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Updated Layer Attributes");
  };

  // Update Element Position Delta (Drag)
  const handleUpdateElementPosition = (
    artboardId: string,
    elementId: string,
    deltaX: number,
    deltaY: number
  ) => {
    setProject((prev) => {
      const updatedArtboards = prev.artboards.map((ab) => {
        if (ab.id !== artboardId) return ab;
        const updatedElements = ab.state.elements.map((el) => {
          if (el.id !== elementId) return el;
          return {
            ...el,
            x: Math.min(95, Math.max(-10, Number((el.x + deltaX).toFixed(2)))),
            y: Math.min(95, Math.max(-10, Number((el.y + deltaY).toFixed(2)))),
          };
        });
        return {
          ...ab,
          state: {
            ...ab.state,
            elements: updatedElements,
          },
        };
      });

      return {
        ...prev,
        artboards: updatedArtboards,
      };
    });
  };

  // Add Elements Handlers
  const handleAddTextElement = () => {
    if (!activeArtboard) return;
    const newEl: CanvasElement = {
      id: "text-" + Date.now(),
      name: "New Text Layer",
      type: "text",
      visible: true,
      locked: false,
      x: 20,
      y: 40,
      width: 60,
      height: 15,
      text: "LIZZDO CYBER TEXT",
      fontFamily: "Orbitron",
      fontWeight: "bold",
      fontSize: 32,
      color: "#ffffff",
      gradientText: true,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, newEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Added Text Layer");
    setSelectedElementId(newEl.id);
  };

  const handleAddShapeElement = (shapeType: "rect" | "circle" | "glow-card" | "line") => {
    if (!activeArtboard) return;
    const newEl: CanvasElement = {
      id: "shape-" + Date.now(),
      name: `${shapeType.toUpperCase()} Layer`,
      type: "shape",
      visible: true,
      locked: false,
      x: 30,
      y: 30,
      width: 40,
      height: 30,
      shapeType,
      bg: "rgba(0, 245, 255, 0.15)",
      borderColor: "#00f5ff",
      borderRadius: 12,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, newEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, `Added ${shapeType} Shape`);
    setSelectedElementId(newEl.id);
  };

  const handleAddBadgeElement = () => {
    if (!activeArtboard) return;
    const newEl: CanvasElement = {
      id: "badge-" + Date.now(),
      name: "Cyber Tag",
      type: "badge",
      visible: true,
      locked: false,
      x: 20,
      y: 15,
      width: 25,
      height: 7,
      text: "NEW CYBER TAG",
      bg: "rgba(0, 245, 255, 0.15)",
      textColor: "#00f5ff",
      borderColor: "#00f5ff",
      borderRadius: 8,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, newEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Added Badge Layer");
    setSelectedElementId(newEl.id);
  };

  const handleAddButtonElement = () => {
    if (!activeArtboard) return;
    const newEl: CanvasElement = {
      id: "btn-" + Date.now(),
      name: "Action Button",
      type: "button",
      visible: true,
      locked: false,
      x: 20,
      y: 65,
      width: 25,
      height: 10,
      text: "LAUNCH APP",
      textColor: "#ffffff",
      borderRadius: 12,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, newEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Added Button Layer");
    setSelectedElementId(newEl.id);
  };

  const handleAddImageElement = () => {
    if (!activeArtboard) return;
    const stockUrl =
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop";

    const newEl: CanvasElement = {
      id: "img-" + Date.now(),
      name: "Stock Image Layer",
      type: "image",
      visible: true,
      locked: false,
      x: 25,
      y: 25,
      width: 50,
      height: 40,
      url: stockUrl,
      borderRadius: 16,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, newEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Added Image Layer");
    setSelectedElementId(newEl.id);
  };

  const handleDeleteElement = (elementId: string) => {
    if (!activeArtboard) return;
    const updatedElements = activeArtboard.state.elements.filter((e) => e.id !== elementId);
    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: updatedElements,
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Deleted Layer");
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
  };

  const handleDuplicateElement = (elementId: string) => {
    if (!activeArtboard) return;
    const target = activeArtboard.state.elements.find((e) => e.id === elementId);
    if (!target) return;

    const dupEl: CanvasElement = {
      ...target,
      id: "dup-" + Date.now(),
      name: `${target.name || "Layer"} Copy`,
      x: target.x + 5,
      y: target.y + 5,
      zIndex: activeArtboard.state.elements.length + 1,
    };

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: [...ab.state.elements, dupEl],
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Duplicated Layer");
    setSelectedElementId(dupEl.id);
  };

  const handleReorderElementZIndex = (elementId: string, direction: "up" | "down") => {
    if (!activeArtboard) return;
    const els = [...activeArtboard.state.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    const idx = els.findIndex((e) => e.id === elementId);
    if (idx === -1) return;

    if (direction === "up" && idx < els.length - 1) {
      const temp = els[idx].zIndex;
      els[idx].zIndex = els[idx + 1].zIndex;
      els[idx + 1].zIndex = temp;
    } else if (direction === "down" && idx > 0) {
      const temp = els[idx].zIndex;
      els[idx].zIndex = els[idx - 1].zIndex;
      els[idx - 1].zIndex = temp;
    }

    const updatedProject: V2Project = {
      ...project,
      artboards: project.artboards.map((ab) =>
        ab.id === activeArtboard.id
          ? {
              ...ab,
              state: {
                ...ab.state,
                elements: els,
              },
            }
          : ab
      ),
    };

    pushHistorySnapshot(updatedProject, "Reordered Z-Index");
  };

  // Add New Artboard Handler
  const handleNewArtboard = () => {
    const updated = addArtboardToV2Project(project, {
      id: "social-post",
      name: "Instagram Square",
      width: 1080,
      height: 1080,
    });
    pushHistorySnapshot(updated, "Added New Artboard");
  };

  // Save Project File Download
  const handleSaveProjectFile = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-v2.lizzdo.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#070a13] text-white overflow-hidden select-none font-sans">
      {/* Top Header Navigation */}
      <DesignerV2Header
        project={project}
        workspace={workspace}
        onUpdateProject={(updater) => pushHistorySnapshot(updater(project), "Renamed Project")}
        onUpdateWorkspace={(updater) => setWorkspace(updater)}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < historyStack.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenExportModal={() => setShowExportModal(true)}
        onOpenPluginModal={() => setShowPluginModal(true)}
        onOpenImportModal={() => setShowImportModal(true)}
        onOpenTemplateModal={() => setShowTemplateModal(true)}
        onNewArtboard={handleNewArtboard}
        onSaveProject={handleSaveProjectFile}
      />

      {/* Main Workspace Row */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar */}
        <DesignerV2Toolbar
          workspace={workspace}
          onSelectTool={(tool) => setWorkspace((prev) => ({ ...prev, activeTool: tool }))}
          onToggleLeftPanel={(tab) =>
            setWorkspace((prev) => ({
              ...prev,
              leftPanelOpen: prev.leftPanelTab === tab ? !prev.leftPanelOpen : true,
              leftPanelTab: tab || prev.leftPanelTab,
            }))
          }
          onToggleRightPanel={(tab) =>
            setWorkspace((prev) => ({
              ...prev,
              rightPanelOpen: prev.rightPanelTab === tab ? !prev.rightPanelOpen : true,
              rightPanelTab: tab || prev.rightPanelTab,
            }))
          }
          onAddTextElement={handleAddTextElement}
          onAddShapeElement={handleAddShapeElement}
          onAddBadgeElement={handleAddBadgeElement}
          onAddButtonElement={handleAddButtonElement}
          onAddImageElement={handleAddImageElement}
        />

        {/* Dockable Left Panel */}
        {workspace.leftPanelOpen && (
          <aside className="w-72 bg-black/95 border-r border-neon-cyan/20 z-20 flex flex-col">
            {workspace.leftPanelTab === "layers" && activeArtboard && (
              <LayerPanelV2
                artboard={activeArtboard}
                selectedElementId={selectedElementId}
                onSelectElement={setSelectedElementId}
                onUpdateElement={handleUpdateElement}
                onDeleteElement={handleDeleteElement}
                onDuplicateElement={handleDuplicateElement}
                onReorderElementZIndex={handleReorderElementZIndex}
              />
            )}

            {workspace.leftPanelTab === "assets" && (
              <AssetManagerV2
                brandKit={project.brandKit}
                onSelectStockImage={(url) => {
                  if (!activeArtboard) return;
                  const newEl: CanvasElement = {
                    id: "img-" + Date.now(),
                    name: "Inserted Asset",
                    type: "image",
                    visible: true,
                    locked: false,
                    x: 20,
                    y: 20,
                    width: 60,
                    height: 50,
                    url,
                    borderRadius: 16,
                    zIndex: activeArtboard.state.elements.length + 1,
                  };
                  const updatedProject: V2Project = {
                    ...project,
                    artboards: project.artboards.map((ab) =>
                      ab.id === activeArtboard.id
                        ? {
                            ...ab,
                            state: {
                              ...ab.state,
                              elements: [...ab.state.elements, newEl],
                            },
                          }
                        : ab
                    ),
                  };
                  pushHistorySnapshot(updatedProject, "Inserted Stock Asset");
                  setSelectedElementId(newEl.id);
                }}
                onApplyBrandKit={(kit) => {
                  const updatedProject: V2Project = {
                    ...project,
                    brandKit: kit,
                  };
                  pushHistorySnapshot(updatedProject, "Applied Brand Kit");
                }}
              />
            )}

            {workspace.leftPanelTab === "history" && (
              <HistoryPanelV2
                historyStack={historyStack}
                historyIndex={historyIndex}
                onRestoreHistoryIndex={(idx) => {
                  setHistoryIndex(idx);
                  setProject(historyStack[idx].projectSnapshot);
                }}
              />
            )}
          </aside>
        )}

        {/* Main Infinite Canvas Center View */}
        <main className="flex-1 relative h-full overflow-hidden">
          <InfiniteCanvasV2
            project={project}
            workspace={workspace}
            selectedElementId={selectedElementId}
            onSelectArtboard={(id) =>
              setProject((prev) => ({
                ...prev,
                activeArtboardId: id,
              }))
            }
            onSelectElement={setSelectedElementId}
            onUpdateElementPosition={handleUpdateElementPosition}
            onUpdateWorkspace={(updater) => setWorkspace(updater)}
          />
        </main>

        {/* Dockable Right Inspector Panel */}
        {workspace.rightPanelOpen && activeArtboard && (
          <aside className="w-80 bg-black/95 border-l border-neon-cyan/20 z-20 flex flex-col">
            <InspectorPanelV2
              artboard={activeArtboard}
              selectedElementId={selectedElementId}
              onUpdateElement={handleUpdateElement}
              onUpdateArtboardState={(artboardId, updates) => {
                const updatedProject: V2Project = {
                  ...project,
                  artboards: project.artboards.map((ab) =>
                    ab.id === artboardId
                      ? {
                          ...ab,
                          state: {
                            ...ab.state,
                            ...updates,
                          },
                        }
                      : ab
                  ),
                };
                pushHistorySnapshot(updatedProject, "Updated Artboard Settings");
              }}
            />
          </aside>
        )}
      </div>

      {/* Modals */}
      {showExportModal && activeArtboard && (
        <ExportManagerV2Modal
          state={activeArtboard.state}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showPluginModal && activeArtboard && (
        <PluginAssistantV2Modal
          state={activeArtboard.state}
          onUpdateElements={(els) => {
            const updatedProject: V2Project = {
              ...project,
              artboards: project.artboards.map((ab) =>
                ab.id === activeArtboard.id
                  ? {
                      ...ab,
                      state: {
                        ...ab.state,
                        elements: els,
                      },
                    }
                  : ab
              ),
            };
            pushHistorySnapshot(updatedProject, "Applied AI Plugin Transformations");
            setShowPluginModal(false);
          }}
          onClose={() => setShowPluginModal(false)}
        />
      )}

      {showTemplateModal && (
        <TemplateManagerV2
          onSelectTemplate={(tplState) => {
            if (!activeArtboard) return;
            const updatedProject: V2Project = {
              ...project,
              artboards: project.artboards.map((ab) =>
                ab.id === activeArtboard.id
                  ? {
                      ...ab,
                      state: {
                        ...tplState,
                        id: ab.state.id,
                        width: ab.width,
                        height: ab.height,
                      },
                    }
                  : ab
              ),
            };
            pushHistorySnapshot(updatedProject, "Loaded Template");
          }}
          onClose={() => setShowTemplateModal(false)}
        />
      )}

      {showImportModal && (
        <V1ImportMigrationModal
          onImportProject={(importedProj) => {
            pushHistorySnapshot(importedProj, "Imported V1 Design");
            setShowImportModal(false);
          }}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  );
}
