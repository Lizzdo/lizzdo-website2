import React, { forwardRef, useState, useRef } from "react";
import { CanvasStage } from "./CanvasStage";
import { DesignState, CanvasElement } from "../../types/designer";

interface CanvasProps {
  state: DesignState;
  scaleFactor?: number;
  interactive?: boolean;
  selectedElementId?: string | null;
  onSelectElement?: (id: string) => void;
  onUpdateElement?: (id: string, updates: Partial<CanvasElement>) => void;
  onZoomChange?: (zoom: number) => void;
  snapToGrid?: boolean;
  gridSize?: number;
}

export const Canvas = forwardRef<HTMLDivElement, CanvasProps>(
  (
    {
      state,
      scaleFactor = 1,
      interactive = true,
      selectedElementId,
      onSelectElement,
      onUpdateElement,
      onZoomChange,
      snapToGrid = false,
      gridSize = 10,
    },
    ref
  ) => {
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const startPanRef = useRef({ x: 0, y: 0 });

    // Handle Wheel Zoom & Pan
    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.05 : 0.05;
        const newZoom = Math.min(Math.max(scaleFactor + delta, 0.2), 3.0);
        onZoomChange?.(newZoom);
      } else if (isPanning || e.shiftKey) {
        setPanOffset((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    };

    // Handle Spacebar / Drag Panning
    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        setIsPanning(true);
        startPanRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isPanning) {
        setPanOffset({
          x: e.clientX - startPanRef.current.x,
          y: e.clientY - startPanRef.current.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
    };

    return (
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden select-none cursor-default"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      >
        <CanvasStage
          ref={ref}
          state={{
            ...state,
            showGrid: state.showGrid || snapToGrid,
          }}
          scaleFactor={scaleFactor}
          interactive={interactive}
          selectedElementId={selectedElementId || undefined}
          onSelectElement={(id) => onSelectElement?.(id)}
        />
      </div>
    );
  }
);

Canvas.displayName = "Canvas";
