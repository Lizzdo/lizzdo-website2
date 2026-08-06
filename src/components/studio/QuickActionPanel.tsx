import React, { useRef } from "react";
import { useStudio } from "../../context/StudioContext";
import { StudioToolId } from "../../types/studio";
import {
  Palette,
  Video,
  Sparkles,
  Image as ImageIcon,
  Shield,
  FolderGit2,
  FileText,
  ShoppingBag,
  Share2,
  FolderOpen,
  UploadCloud,
  FileCode,
  X,
  Zap,
} from "lucide-react";

interface QuickActionPanelProps {
  onClose?: () => void;
}

export function QuickActionPanel({ onClose }: QuickActionPanelProps) {
  const {
    createProject,
    openProject,
    projects,
    uploadSharedAsset,
    importProjectJSON,
    setIsQuickActionOpen,
  } = useStudio();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const handleLaunch = (title: string, toolId: StudioToolId) => {
    createProject(title, toolId);
    if (onClose) onClose();
    setIsQuickActionOpen(false);
  };

  const handleOpenRecent = () => {
    if (projects.length > 0) {
      openProject(projects[0].id);
    } else {
      createProject("Untitled Studio Project", "designer");
    }
    if (onClose) onClose();
    setIsQuickActionOpen(false);
  };

  const handleAssetUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => uploadSharedAsset(file));
    }
    if (onClose) onClose();
    setIsQuickActionOpen(false);
  };

  const handleJSONImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) importProjectJSON(text);
      };
      reader.readAsText(file);
    }
    if (onClose) onClose();
    setIsQuickActionOpen(false);
  };

  const actions = [
    {
      id: "designer",
      title: "New Blank Design",
      desc: "Full vector canvas with layers & AI tools",
      icon: Palette,
      color: "from-neon-purple to-neon-pink",
      toolId: "designer" as StudioToolId,
    },
    {
      id: "video",
      title: "New Video Project",
      desc: "Multi-track timeline & video suite",
      icon: Video,
      color: "from-blue-500 to-indigo-600",
      toolId: "video-editor" as StudioToolId,
    },
    {
      id: "thumbnail",
      title: "New YouTube Thumbnail",
      desc: "Clickbait badges & safe margin overlays",
      icon: Sparkles,
      color: "from-amber-500 to-red-500",
      toolId: "thumbnail-creator" as StudioToolId,
    },
    {
      id: "banner",
      title: "New Social Banner",
      desc: "LinkedIn, Twitter & YouTube covers",
      icon: ImageIcon,
      color: "from-emerald-500 to-teal-600",
      toolId: "banner-creator" as StudioToolId,
    },
    {
      id: "logo",
      title: "New Logo Studio",
      desc: "Vector logomark & emblem builder",
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      toolId: "logo-creator" as StudioToolId,
    },
    {
      id: "portfolio",
      title: "New Portfolio Graphic",
      desc: "Showcase grid & project cards",
      icon: FolderGit2,
      color: "from-pink-500 to-rose-600",
      toolId: "portfolio-builder" as StudioToolId,
    },
    {
      id: "blog",
      title: "New Blog Header",
      desc: "Featured images & infographic cards",
      icon: FileText,
      color: "from-violet-500 to-purple-600",
      toolId: "blog-designer" as StudioToolId,
    },
    {
      id: "store",
      title: "New E-Com Graphic",
      desc: "Product mockups & price badges",
      icon: ShoppingBag,
      color: "from-yellow-500 to-amber-600",
      toolId: "store-designer" as StudioToolId,
    },
    {
      id: "social",
      title: "New Social Carousel",
      desc: "Instagram multi-slide & Story builder",
      icon: Share2,
      color: "from-fuchsia-500 to-purple-600",
      toolId: "social-designer" as StudioToolId,
    },
    {
      id: "open_recent",
      title: "Open Recent Project",
      desc: "Resume last edited project instantly",
      icon: FolderOpen,
      color: "from-gray-600 to-gray-800",
      action: handleOpenRecent,
    },
    {
      id: "import_json",
      title: "Import Project JSON",
      desc: "Load project from external file",
      icon: FileCode,
      color: "from-indigo-600 to-cyan-600",
      action: () => jsonInputRef.current?.click(),
    },
    {
      id: "upload_asset",
      title: "Upload Shared Assets",
      desc: "Add logos, photos & fonts to vault",
      icon: UploadCloud,
      color: "from-teal-500 to-emerald-600",
      action: () => fileInputRef.current?.click(),
    },
  ];

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl max-w-4xl w-full mx-auto space-y-6">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAssetUpload}
        className="hidden"
        multiple
        accept="image/*,video/*,audio/*,.ttf,.woff2"
      />
      <input
        type="file"
        ref={jsonInputRef}
        onChange={handleJSONImport}
        className="hidden"
        accept=".json"
      />

      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl text-white tracking-wider uppercase">
              Quick Creator Actions
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Launch new creation suites, import files, or resume recent work
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 12 LAUNCHERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((act) => {
          const IconComp = act.icon;

          return (
            <button
              key={act.id}
              type="button"
              onClick={() => {
                if (act.action) {
                  act.action();
                } else if (act.toolId) {
                  handleLaunch(act.title, act.toolId);
                }
              }}
              className="p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-neon-purple/50 hover:bg-neutral-800/80 transition-all group text-left flex items-start gap-3.5"
            >
              <div
                className={`p-2.5 rounded-xl bg-gradient-to-br ${act.color} text-white shadow-lg shrink-0 group-hover:scale-110 transition-transform`}
              >
                <IconComp className="w-5 h-5" />
              </div>

              <div className="space-y-1 min-w-0">
                <h3 className="font-bold text-xs text-white group-hover:text-neon-purple transition-colors truncate font-mono">
                  {act.title}
                </h3>
                <p className="text-[11px] text-gray-400 leading-tight line-clamp-2">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
