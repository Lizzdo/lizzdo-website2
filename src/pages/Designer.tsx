import React from "react";
import DocumentHead from "../components/DocumentHead";
import { StudioProvider } from "../context/StudioContext";
import { EcosystemProvider } from "../context/EcosystemContext";
import { StudioOS } from "../components/studio/StudioOS";

export default function Designer() {
  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <DocumentHead
        title="Studio.Lizzdo.com - Unified Creative Operating System"
        description="Modular creative suite connecting vector design, AI generators, video timelines, brand kits, mockups, and asset management in one seamless workspace."
      />
      <StudioProvider>
        <EcosystemProvider>
          <StudioOS />
        </EcosystemProvider>
      </StudioProvider>
    </div>
  );
}


