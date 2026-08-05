import React from "react";
import PostDesigner from "../../designer/PostDesigner";
import { useStudio } from "../../../context/StudioContext";

export function DesignerWorkspace() {
  const { currentProject } = useStudio();

  // DesignerWorkspace renders the high-performance canvas engine PostDesigner
  return (
    <div className="flex-1 h-full w-full bg-black overflow-hidden relative flex flex-col">
      <PostDesigner key={currentProject?.id || "default-designer"} />
    </div>
  );
}
