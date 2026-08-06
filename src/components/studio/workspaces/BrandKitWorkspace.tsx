import React, { useState } from "react";
import { BrandWorkspaceHeader } from "../brand/BrandWorkspaceHeader";
import { LogoManagerSection } from "../brand/LogoManagerSection";
import { ColorSystemSection } from "../brand/ColorSystemSection";
import { TypographyManagerSection } from "../brand/TypographyManagerSection";
import { BrandAssetsSection } from "../brand/BrandAssetsSection";
import { BrandTemplatesSection } from "../brand/BrandTemplatesSection";
import { BrandImportExportModal } from "../brand/BrandImportExportModal";

export function BrandKitWorkspace() {
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);

  return (
    <div className="flex-1 bg-black text-white p-6 overflow-y-auto custom-scrollbar font-sans select-none space-y-8">
      {/* BRAND HEADER & PROFILE INFO */}
      <BrandWorkspaceHeader
        onOpenImportExportModal={() => setIsImportExportOpen(true)}
      />

      {/* 1. LOGO MANAGER (12 VARIATIONS) */}
      <LogoManagerSection />

      {/* 2. COLOR SYSTEM & ACCESSIBILITY */}
      <ColorSystemSection />

      {/* 3. TYPOGRAPHY MANAGER & SPECIMEN CANVAS */}
      <TypographyManagerSection />

      {/* 4. REUSABLE BRAND ASSETS */}
      <BrandAssetsSection />

      {/* 5. BRANDED TEMPLATES STARTERS */}
      <BrandTemplatesSection />

      {/* IMPORT / EXPORT MODAL */}
      <BrandImportExportModal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
      />
    </div>
  );
}
