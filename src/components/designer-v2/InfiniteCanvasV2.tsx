import React, { useRef, useState, useEffect } from "react";
import { V2Project, WorkspaceConfig } from "../../types/designerV2";
import ArtboardRendererV2 from "./ArtboardRendererV2";

interface InfiniteCanvasV2Props {
  project: V2Project;
  workspace: WorkspaceConfig;
  selectedElementId: string | null;
  onSelectArtboard: (artboardId: string) => void;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElementPosition: (artboardId: string, elementId: string, deltaX: number, deltaY: number) => void;
  onUpdateWorkspace: (updater: (prev: WorkspaceConfig) => WorkspaceConfig) => void;
}

export default function InfiniteCanvasV2({
  project,
  workspace,
  selectedElementId,
  onSelectArtboard,
  onSelectElement,
  onUpdateElementPosition,
  onUpdateWorkspace,
}: InfiniteCanvasV2Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanningRef = useRef(false);
  const panStartPos = useRef({ x: 0, y: 0 });

  // Handle Wheel Zoom & Wheel Pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      onUpdateWorkspace((prev) => ({
        ...prev,
        zoom: Math.min(5.0, Math.max(0.1, Number((prev.zoom * zoomFactor).toFixed(2)))),
      }));
    } else {
      onUpdateWorkspace((prev) => ({
        ...prev,
        panX: prev.panX - e.deltaX,
        panY: prev.panY - e.deltaY,
      }));
    }
  };

  // Canvas Hand Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (workspace.activeTool === "pan" || e.button === 1 || (e as any).spaceKey) {
      isPanningRef.current = true;
      panStartPos.current = { x: e.clientX - workspace.panX, y: e.clientY - workspace.panY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanningRef.current) {
      onUpdateWorkspace((prev) => ({
        ...prev,
        panX: e.clientX - panStartPos.current.x,
        panY: e.clientY - panStartPos.current.y,
      }));
    }
  };

  const handleMouseUp = () => {
    isPanningRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-[#070a13] cursor-${
        workspace.activeTool === "pan" ? "grab active:cursor-grabbing" : "default"
      }`}
    >
      {/* Grid Pattern Background */}
      {workspace.showGrid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0, 245, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: `${20 * workspace.zoom}px ${20 * workspace.zoom}px`,
            backgroundPosition: `${workspace.panX}px ${workspace.panY}px`,
          }}
        />
      )}

      {/* Infinite Transform Stage Container */}
      <div
        className="absolute inset-0 origin-top-left transition-transform duration-75"
        style={{
          transform: `translate(${workspace.panX}px, ${workspace.panY}px) scale(${workspace.zoom})`,
        }}
      >
        {project.artboards.map((artboard) => (
          <div
            key={artboard.id}
            style={{
              position: "absolute",
              left: `${artboard.x}px`,
              top: `${artboard.y}px`,
            }}
          >
            <ArtboardRendererV2
              artboard={artboard}
              isSelectedArtboard={artboard.id === project.activeArtboardId}
              selectedElementId={selectedElementId}
              showWireframe={workspace.showWireframe}
              showGrid={false}
              scaleFactor={workspace.zoom}
              onSelectArtboard={onSelectArtboard}
              onSelectElement={onSelectElement}
              onUpdateElementPosition={onUpdateElementPosition}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
