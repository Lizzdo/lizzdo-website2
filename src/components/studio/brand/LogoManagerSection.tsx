import React, { useState, useRef } from "react";
import { useStudio } from "../../../context/StudioContext";
import { LogoType, LogoVariant } from "../../../types/brandKit";
import {
  Image as ImageIcon,
  Upload,
  Download,
  Trash2,
  Edit2,
  Check,
  Eye,
  Plus,
  ShieldCheck,
  FileCode,
  FileText,
  Sparkles,
  Layers,
} from "lucide-react";

const ALL_LOGO_TYPES: { type: LogoType; description: string; defaultFormat: "png" | "svg" | "ai" | "pdf" }[] = [
  { type: "Primary Logo", description: "Main brand mark used for website header and primary collateral", defaultFormat: "png" },
  { type: "Secondary Logo", description: "Alternative lockup or secondary badge version", defaultFormat: "png" },
  { type: "Icon Only / Mark", description: "Favicon, app icon, social avatar square mark", defaultFormat: "png" },
  { type: "Horizontal Logo", description: "Wide layout header, banner or navigation bar logo", defaultFormat: "png" },
  { type: "Vertical Logo", description: "Stacked lockup for poster, packaging, or vertical cards", defaultFormat: "png" },
  { type: "Light Version", description: "High contrast version optimized for dark backgrounds", defaultFormat: "png" },
  { type: "Dark Version", description: "High contrast version optimized for light/white backgrounds", defaultFormat: "png" },
  { type: "Monochrome Version", description: "Single-color black or white silhouette version", defaultFormat: "png" },
  { type: "Transparent PNG", description: "Alpha channel transparent PNG for overlays", defaultFormat: "png" },
  { type: "SVG Vector Logo", description: "Scalable vector graphics SVG format for high DPI crispness", defaultFormat: "svg" },
  { type: "AI / EPS Vector Logo", description: "Adobe Illustrator / vector source for print production", defaultFormat: "ai" },
  { type: "PDF Vector Logo", description: "Vector PDF document lockup for press and corporate distribution", defaultFormat: "pdf" },
];

export const LogoManagerSection: React.FC = () => {
  const { activeBrandKit, updateActiveBrandKit, addNotification } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedUploadType, setSelectedUploadType] = useState<LogoType>("Primary Logo");
  const [editingLogoId, setEditingLogoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [previewLogo, setPreviewLogo] = useState<LogoVariant | null>(null);

  // Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      const ext = file.name.split(".").pop()?.toLowerCase() || "png";
      const format: "png" | "svg" | "ai" | "pdf" =
        ext === "svg" ? "svg" : ext === "ai" ? "ai" : ext === "pdf" ? "pdf" : "png";

      const newVariant: LogoVariant = {
        id: `logo-${Date.now()}`,
        type: selectedUploadType,
        name: `${activeBrandKit.brandName} ${selectedUploadType}`,
        url: dataUrl,
        format,
        dimensions: "1024x1024",
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        updatedAt: new Date().toISOString().split("T")[0],
      };

      // Replace existing or add
      const existing = activeBrandKit.logoVariants.filter((l) => l.type !== selectedUploadType);
      updateActiveBrandKit({
        logoVariants: [newVariant, ...existing],
      });

      addNotification("Logo Updated", `Uploaded new ${selectedUploadType} for ${activeBrandKit.brandName}`, "success");
    };

    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUploadForType = (type: LogoType) => {
    setSelectedUploadType(type);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleSaveName = (logoId: string) => {
    if (!editingName.trim()) return;
    const nextLogos = activeBrandKit.logoVariants.map((l) =>
      l.id === logoId ? { ...l, name: editingName.trim() } : l
    );
    updateActiveBrandKit({ logoVariants: nextLogos });
    setEditingLogoId(null);
  };

  const handleDeleteLogo = (logoId: string) => {
    const nextLogos = activeBrandKit.logoVariants.filter((l) => l.id !== logoId);
    updateActiveBrandKit({ logoVariants: nextLogos });
    addNotification("Logo Removed", "Logo variation removed from Brand Kit", "info");
  };

  const handleSetWatermarkLogo = (logoId: string) => {
    updateActiveBrandKit({
      watermark: {
        ...activeBrandKit.watermark,
        logoId,
      },
    });
    addNotification("Watermark Set", "Selected logo is now used for brand watermark overlays", "success");
  };

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.svg,.ai,.pdf"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="font-display font-bold text-base tracking-wider uppercase text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neon-cyan" /> Multi-Format Logo Manager
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Store and manage 12 logo variations (Vector SVG, Transparent PNG, Dark/Light mode, Print AI/PDF).
          </p>
        </div>

        <button
          type="button"
          onClick={() => triggerUploadForType("Primary Logo")}
          className="px-4 py-2 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 text-xs font-mono font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Logo File
        </button>
      </div>

      {/* 12 LOGO VARIANT TILES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_LOGO_TYPES.map(({ type, description }) => {
          const variant = activeBrandKit.logoVariants.find((l) => l.type === type);
          const isWatermark = activeBrandKit.watermark.logoId === variant?.id && variant !== undefined;

          return (
            <div
              key={type}
              className={`p-4 rounded-2xl bg-black border transition-all flex flex-col justify-between space-y-3 group ${
                variant
                  ? "border-white/15 hover:border-neon-cyan/50 shadow-md"
                  : "border-dashed border-white/10 opacity-70 hover:opacity-100 hover:border-white/30"
              }`}
            >
              {/* TOP HEADER */}
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="font-bold text-white uppercase tracking-wider">{type}</span>
                {variant && (
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 uppercase font-bold text-[9px]">
                    {variant.format}
                  </span>
                )}
              </div>

              {/* LOGO PREVIEW CANVAS */}
              <div
                className={`h-32 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/5 ${
                  type === "Light Version" || type === "Monochrome Version"
                    ? "bg-neutral-800"
                    : "bg-neutral-950"
                }`}
              >
                {variant ? (
                  <img
                    src={variant.url}
                    alt={variant.name}
                    className="max-h-24 max-w-[85%] object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="text-center p-3 space-y-2">
                    <p className="text-[10px] font-mono text-gray-500">{description}</p>
                    <button
                      type="button"
                      onClick={() => triggerUploadForType(type)}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-mono font-bold inline-flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3 text-neon-cyan" /> Add {type}
                    </button>
                  </div>
                )}

                {/* WATERMARK BADGE */}
                {isWatermark && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple border border-neon-purple/40 text-[9px] font-mono font-bold flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" /> Watermark Logo
                  </span>
                )}
              </div>

              {/* FOOTER ACTIONS IF VARIANT EXISTS */}
              {variant ? (
                <div className="space-y-2 pt-1">
                  {editingLogoId === variant.id ? (
                    <div className="flex items-center gap-1 font-mono text-xs">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 bg-neutral-900 border border-white/20 rounded-lg px-2 py-1 text-white text-[11px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveName(variant.id)}
                        className="p-1 rounded bg-neon-cyan/20 text-neon-cyan"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-gray-300 font-bold truncate max-w-[130px]">{variant.name}</span>
                      <span className="text-gray-500">{variant.fileSize || "180 KB"}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] font-mono">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingLogoId(variant.id);
                          setEditingName(variant.name);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Rename"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      <a
                        href={variant.url}
                        download={`${variant.name}.${variant.format}`}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSetWatermarkLogo(variant.id)}
                        className={`p-1.5 rounded-lg text-xs ${
                          isWatermark
                            ? "bg-neon-purple/20 text-neon-purple"
                            : "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                        }`}
                        title="Use as Watermark"
                      >
                        <ShieldCheck className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => triggerUploadForType(type)}
                        className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 font-bold"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLogo(variant.id)}
                        className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};
