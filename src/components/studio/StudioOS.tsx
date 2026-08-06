import React, { useState, useEffect } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioTopNav } from "./StudioTopNav";
import { StudioSidebar } from "./StudioSidebar";
import { GlobalSearchModal } from "./GlobalSearchModal";
import { QuickActionPanel } from "./QuickActionPanel";
import { NotificationCenterDrawer } from "./NotificationCenterDrawer";

// Import all workspace views
import { DashboardWorkspace } from "./workspaces/DashboardWorkspace";
import { DesignerWorkspace } from "./workspaces/DesignerWorkspace";
import { AIGeneratorWorkspace } from "./workspaces/AIGeneratorWorkspace";
import { VideoEditorWorkspace } from "./workspaces/VideoEditorWorkspace";
import { LogoCreatorWorkspace } from "./workspaces/LogoCreatorWorkspace";
import { ThumbnailCreatorWorkspace } from "./workspaces/ThumbnailCreatorWorkspace";
import { BrandKitWorkspace } from "./workspaces/BrandKitWorkspace";
import { AssetLibraryWorkspace } from "./workspaces/AssetLibraryWorkspace";
import { TemplatesWorkspace } from "./workspaces/TemplatesWorkspace";
import { IconsWorkspace } from "./workspaces/IconsWorkspace";
import { FontsWorkspace } from "./workspaces/FontsWorkspace";
import { AIAssistantWorkspace } from "./workspaces/AIAssistantWorkspace";
import { FileManagerWorkspace } from "./workspaces/FileManagerWorkspace";
import { ProjectsWorkspace } from "./workspaces/ProjectsWorkspace";
import { ImageEditorWorkspace } from "./workspaces/ImageEditorWorkspace";
import { BannerCreatorWorkspace } from "./workspaces/BannerCreatorWorkspace";
import { MockupGeneratorWorkspace } from "./workspaces/MockupGeneratorWorkspace";
import { SettingsWorkspace } from "./workspaces/SettingsWorkspace";

export function StudioOS() {
  const {
    activeToolId,
    isQuickActionOpen,
    setIsQuickActionOpen,
  } = useStudio();

  // Render workspace depending on activeToolId
  const renderWorkspaceContent = () => {
    switch (activeToolId) {
      case "dashboard":
        return <DashboardWorkspace />;
      case "designer":
        return <DesignerWorkspace />;
      case "ai-generator":
        return <AIGeneratorWorkspace />;
      case "video-editor":
        return <VideoEditorWorkspace />;
      case "logo-creator":
        return <LogoCreatorWorkspace />;
      case "thumbnail-creator":
        return <ThumbnailCreatorWorkspace />;
      case "brand-kit":
        return <BrandKitWorkspace />;
      case "asset-library":
      case "assets":
        return <AssetLibraryWorkspace />;
      case "templates":
        return <TemplatesWorkspace />;
      case "icons":
        return <IconsWorkspace />;
      case "fonts":
        return <FontsWorkspace />;
      case "ai-assistant":
        return <AIAssistantWorkspace />;
      case "files":
        return <FileManagerWorkspace />;
      case "projects":
        return <ProjectsWorkspace />;
      case "image-editor":
        return <ImageEditorWorkspace />;
      case "banner-creator":
        return <BannerCreatorWorkspace />;
      case "mockup-generator":
        return <MockupGeneratorWorkspace />;
      case "settings":
        return <SettingsWorkspace />;
      default:
        return <DashboardWorkspace />;
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      {/* GLOBAL TOP NAV BAR */}
      <StudioTopNav />

      {/* BODY WITH SIDEBAR AND MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden relative">
        <StudioSidebar />

        {/* ACTIVE WORKSPACE AREA */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative flex flex-col bg-neutral-950">
          {renderWorkspaceContent()}
        </main>
      </div>

      {/* MODALS AND DRAWERS */}
      <GlobalSearchModal />
      <NotificationCenterDrawer />

      {/* QUICK ACTION MODAL */}
      {isQuickActionOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsQuickActionOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-4xl">
            <QuickActionPanel onClose={() => setIsQuickActionOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
