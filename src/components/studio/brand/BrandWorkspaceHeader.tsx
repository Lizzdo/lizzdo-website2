import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import {
  BookmarkCheck,
  Plus,
  Trash2,
  Download,
  Upload,
  CheckCircle2,
  Sparkles,
  Globe,
  Mail,
  Building,
  FileText,
  ChevronDown,
  Layers,
  Copy,
  Check,
} from "lucide-react";

interface Props {
  onOpenImportExportModal: () => void;
}

export const BrandWorkspaceHeader: React.FC<Props> = ({ onOpenImportExportModal }) => {
  const {
    brandKits,
    activeBrandId,
    activeBrandKit,
    setActiveBrandId,
    createBrandKit,
    updateActiveBrandKit,
    deleteBrandKit,
    applyBrandKitToDesign,
    currentProject,
    updateProject,
    addNotification,
  } = useStudio();

  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const handleCreateBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    createBrandKit(newBrandName.trim(), newCompanyName.trim());
    setNewBrandName("");
    setNewCompanyName("");
    setIsCreateModalOpen(false);
  };

  const handleApplyToCanvas = () => {
    if (!currentProject || !currentProject.data) {
      addNotification("Applied to Brand Kit", "Brand Kit settings synced! Open a design project in Designer V1 to auto-style canvas.", "info");
      setIsApplied(true);
      setTimeout(() => setIsApplied(false), 2000);
      return;
    }

    const updatedDesign = applyBrandKitToDesign(currentProject.data, activeBrandKit);
    updateProject(currentProject.id, { data: updatedDesign });
    addNotification("Brand Kit Applied", `Applied "${activeBrandKit.brandName}" to active canvas "${currentProject.title}"`, "success");
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* TOP ACTION BAR */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-6 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ backgroundColor: activeBrandKit.colors.primary }}
        />

        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono">
            <BookmarkCheck className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="text-gray-300">Central Single Source of Truth</span>
            <span className="px-1.5 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan text-[10px] font-bold">
              {brandKits.length} Brand Kits
            </span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-display font-black text-2xl md:text-3xl tracking-wider text-white uppercase">
              Brand Kit & Design System
            </h1>
          </div>
          <p className="text-xs text-gray-400 font-mono max-w-2xl">
            Manage logo variations, multi-format color palettes, typography specs, and social assets. Click <strong className="text-white">Apply Brand Kit</strong> to auto-theme every design across Studio.Lizzdo.com.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          {/* BRAND SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
              className="px-4 py-2.5 rounded-xl bg-black border border-white/15 hover:border-neon-cyan text-white text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-md"
            >
              <div
                className="w-3 h-3 rounded-full border border-white/20"
                style={{ backgroundColor: activeBrandKit.colors.primary }}
              />
              <span className="max-w-[140px] truncate">{activeBrandKit.brandName}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {isBrandDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-neutral-900 border border-white/15 shadow-2xl p-2 z-50 space-y-1 font-mono text-xs">
                <div className="px-3 py-1.5 text-[10px] text-gray-500 uppercase font-bold tracking-wider">
                  Switch Brand Kit
                </div>
                {brandKits.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => {
                      setActiveBrandId(b.id);
                      setIsBrandDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between transition-all ${
                      b.id === activeBrandId
                        ? "bg-white/10 text-white font-bold border border-white/20"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: b.colors.primary }}
                      />
                      <span className="truncate">{b.brandName}</span>
                    </div>
                    {b.id === activeBrandId && <Check className="w-3.5 h-3.5 text-neon-cyan" />}
                  </button>
                ))}

                <div className="border-t border-white/10 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBrandDropdownOpen(false);
                      setIsCreateModalOpen(true);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-bold flex items-center gap-2 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Brand</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* IMPORT / EXPORT BUTTON */}
          <button
            type="button"
            onClick={onOpenImportExportModal}
            className="px-4 py-2.5 rounded-xl bg-black border border-white/15 hover:border-neon-purple text-gray-300 hover:text-white text-xs font-mono flex items-center gap-2 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-neon-purple" />
            <span>Import / Export</span>
          </button>

          {/* APPLY BRAND KIT BUTTON */}
          <button
            type="button"
            onClick={handleApplyToCanvas}
            className={`px-5 py-2.5 rounded-xl text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
              isApplied
                ? "bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
                : "bg-gradient-to-r from-neon-cyan via-neon-purple to-pink-500 hover:shadow-[0_0_25px_rgba(0,245,255,0.6)]"
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Applied!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Apply Brand Kit
              </>
            )}
          </button>

          {/* DELETE BRAND KIT BUTTON */}
          {brandKits.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete Brand Kit "${activeBrandKit.brandName}"?`)) {
                  deleteBrandKit(activeBrandKit.id);
                }
              }}
              title="Delete this Brand Kit"
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* BRAND DETAILS EDIT FORM */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="font-display font-bold text-sm tracking-wider uppercase text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-neon-cyan" /> Brand Profile Information
          </h2>
          <span className="text-[10px] font-mono text-gray-400">
            Last updated: {new Date(activeBrandKit.updatedAt).toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
          {/* BRAND NAME */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider block">Brand Name</label>
            <input
              type="text"
              value={activeBrandKit.brandName}
              onChange={(e) => updateActiveBrandKit({ brandName: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-white font-bold text-sm focus:border-neon-cyan focus:outline-none"
            />
          </div>

          {/* COMPANY NAME */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider block">Company Name</label>
            <input
              type="text"
              value={activeBrandKit.companyName}
              onChange={(e) => updateActiveBrandKit({ companyName: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-gray-200 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          {/* WEBSITE URL */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-neon-cyan" /> Website URL
            </label>
            <input
              type="text"
              value={activeBrandKit.websiteUrl}
              onChange={(e) => updateActiveBrandKit({ websiteUrl: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          {/* TAGLINE */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-2">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider block">Brand Tagline</label>
            <input
              type="text"
              value={activeBrandKit.tagline}
              onChange={(e) => updateActiveBrandKit({ tagline: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          {/* EMAIL SIGNATURE */}
          <div className="space-y-1.5">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider flex items-center gap-1">
              <Mail className="w-3 h-3 text-neon-purple" /> Email Signature Text
            </label>
            <input
              type="text"
              value={activeBrandKit.emailSignature}
              onChange={(e) => updateActiveBrandKit({ emailSignature: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-gray-300 focus:border-neon-cyan focus:outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-3">
            <label className="text-gray-400 uppercase text-[10px] tracking-wider block">
              Brand Description & Guidelines
            </label>
            <textarea
              rows={2}
              value={activeBrandKit.description}
              onChange={(e) => updateActiveBrandKit({ description: e.target.value })}
              className="w-full bg-black border border-white/15 rounded-xl p-3 text-gray-300 focus:border-neon-cyan focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* CREATE BRAND MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-neutral-900 border border-white/20 p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="font-display font-bold text-lg text-white uppercase flex items-center gap-2">
                <Plus className="w-5 h-5 text-neon-cyan" /> Create New Brand Kit
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBrand} className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase text-[10px]">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cyberpunk Labs"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-400 uppercase text-[10px]">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Lizzdo Inc."
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:border-neon-cyan focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase"
                >
                  Create Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
