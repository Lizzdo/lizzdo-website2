import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { StudioProject } from "../../../types/studio";
import {
  X,
  ExternalLink,
  Save,
  Clock,
  Layers,
  HardDrive,
  Download,
  Share2,
  Trash2,
  RotateCcw,
  Tag,
  Folder,
  Award,
  Plus,
  Check,
  Sparkles,
  Link2,
  Archive,
  FileCode,
  Zap,
  AlertCircle,
  Copy,
  Edit2,
} from "lucide-react";

interface ProjectInspectorDrawerProps {
  project: StudioProject | null;
  onClose: () => void;
}

export function ProjectInspectorDrawer({ project, onClose }: ProjectInspectorDrawerProps) {
  const {
    openProject,
    updateProject,
    folders,
    brandKits,
    createVersionCheckpoint,
    restoreVersion,
    duplicateVersionAsProject,
    exportProjectZIP,
    exportProjectJSON,
    shareProject,
    deleteProject,
    restoreProjectFromTrash,
    permanentlyDeleteProject,
    relinkProjectAsset,
    compressProjectAssets,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<"overview" | "versions" | "assets" | "exports">("overview");

  // Metadata edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(project?.title || "");
  const [editDescription, setEditDescription] = useState(project?.description || "");
  const [newTagInput, setNewTagInput] = useState("");

  // Checkpoint input state
  const [checkpointNote, setCheckpointNote] = useState("");

  // Asset relink input state
  const [relinkUrlMap, setRelinkUrlMap] = useState<Record<string, string>>({});

  if (!project) return null;

  const handleSaveMetadata = () => {
    updateProject(project.id, {
      title: editTitle.trim() || project.title,
      description: editDescription.trim(),
    });
    setIsEditingTitle(false);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTagInput.trim()) {
      e.preventDefault();
      const tagClean = newTagInput.trim().toLowerCase();
      if (!project.tags.includes(tagClean)) {
        updateProject(project.id, {
          tags: [...project.tags, tagClean],
        });
      }
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateProject(project.id, {
      tags: project.tags.filter((t) => t !== tagToRemove),
    });
  };

  const handleCreateCheckpoint = (e: React.FormEvent) => {
    e.preventDefault();
    createVersionCheckpoint(project.id, checkpointNote);
    setCheckpointNote("");
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[450px] bg-neutral-900 border-l border-white/10 shadow-2xl z-50 flex flex-col font-sans text-white custom-scrollbar overflow-y-auto">
      {/* DRAWER HEADER */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center text-neon-purple shrink-0 font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-bold text-sm text-white truncate">Project Inspector</h3>
            <p className="text-[10px] text-gray-400 font-mono">ID: {project.id}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* THUMBNAIL / LIVE PREVIEW CARD */}
      <div className="p-5 bg-neutral-950 border-b border-white/10 shrink-0 space-y-3">
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-white/10 group flex items-center justify-center">
          {project.thumbnailUrl ? (
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-4 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono text-gray-400">Canvas Preset ({project.width}x{project.height})</p>
            </div>
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={() => openProject(project.id)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold text-xs shadow-lg flex items-center gap-2 hover:scale-105 transition-all"
            >
              <ExternalLink className="w-4 h-4" /> Open in Editor
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-neutral-800 border border-neon-purple/50 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveMetadata}
                  className="p-1 rounded bg-neon-purple text-white text-xs font-bold"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">{project.title}</h4>
                <button
                  type="button"
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
            <p className="text-[11px] text-gray-400 font-mono mt-0.5">
              {project.platform} • {project.fileSize} • v{project.version || "1.0.0"}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openProject(project.id)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-neon-purple/30 border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            Launch <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* INSPECTOR TABS */}
      <div className="flex items-center border-b border-white/10 bg-neutral-900 px-4 font-mono text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`py-3 px-3 font-bold border-b-2 transition-all ${
            activeTab === "overview"
              ? "border-neon-purple text-neon-purple"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Details
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("versions")}
          className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            activeTab === "versions"
              ? "border-neon-purple text-neon-purple"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Versions
          <span className="px-1.5 py-0.2 rounded-full bg-white/10 text-[9px]">
            {project.versions?.length || 1}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("assets")}
          className={`py-3 px-3 font-bold border-b-2 transition-all ${
            activeTab === "assets"
              ? "border-neon-purple text-neon-purple"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Linked Assets
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("exports")}
          className={`py-3 px-3 font-bold border-b-2 transition-all ${
            activeTab === "exports"
              ? "border-neon-purple text-neon-purple"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Exports
        </button>
      </div>

      {/* TAB CONTENTS */}
      <div className="p-5 flex-1 space-y-5 custom-scrollbar overflow-y-auto">
        {activeTab === "overview" && (
          <div className="space-y-4 font-mono text-xs">
            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                onBlur={handleSaveMetadata}
                placeholder="Add project notes, brief summary, or client instructions..."
                className="w-full h-20 bg-neutral-950 border border-white/10 rounded-xl p-2.5 text-xs text-gray-200 focus:border-neon-purple focus:outline-none custom-scrollbar"
              />
            </div>

            {/* FOLDER & STATUS & BRAND KIT */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Folder</label>
                <select
                  value={project.folderId || ""}
                  onChange={(e) => {
                    const selectedF = folders.find((f) => f.id === e.target.value);
                    updateProject(project.id, {
                      folderId: selectedF?.id,
                      folder: selectedF?.name || "General",
                    });
                  }}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="">General</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-gray-400">Status</label>
                <select
                  value={project.status}
                  onChange={(e) => updateProject(project.id, { status: e.target.value as any })}
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="in_progress">In Progress</option>
                  <option value="exported">Exported</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            {/* BRAND KIT */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400">Associated Brand Kit</label>
              <select
                value={project.brandKitId || ""}
                onChange={(e) => updateProject(project.id, { brandKitId: e.target.value })}
                className="w-full bg-neutral-950 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
              >
                {brandKits.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </div>

            {/* TAGS EDITOR */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-400">Tags</label>
              <div className="flex flex-wrap gap-1.5 bg-neutral-950 border border-white/10 p-2.5 rounded-xl">
                {project.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded-lg bg-white/10 text-gray-300 text-[10px] flex items-center gap-1 group"
                  >
                    #{t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-gray-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="+ add tag (Enter)"
                  className="bg-transparent text-xs text-gray-200 focus:outline-none w-24"
                />
              </div>
            </div>

            {/* METADATA GRID */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-white/10 space-y-2 text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>Tool / Editor:</span>
                <span className="text-white font-bold">{project.toolId}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Dimensions:</span>
                <span className="text-white font-bold">{project.width} x {project.height} px</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Owner:</span>
                <span className="text-white font-bold">{project.owner || "You"}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Created Date:</span>
                <span className="text-gray-300">{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Last Modified:</span>
                <span className="text-gray-300">{new Date(project.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* VERSIONS TAB */}
        {activeTab === "versions" && (
          <div className="space-y-4 font-mono text-xs">
            {/* CREATE CHECKPOINT FORM */}
            <form onSubmit={handleCreateCheckpoint} className="p-3 bg-black/40 border border-white/10 rounded-2xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-neon-purple block">Save Version Checkpoint</span>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={checkpointNote}
                  onChange={(e) => setCheckpointNote(e.target.value)}
                  placeholder="e.g., Finalized logo layout & typography"
                  className="flex-1 bg-neutral-950 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-neon-purple hover:bg-neon-purple/80 text-white font-bold flex items-center gap-1 shrink-0"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              </div>
            </form>

            {/* VERSION TIMELINE */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Version History</span>

              <div className="space-y-2">
                {(project.versions || []).map((ver) => (
                  <div
                    key={ver.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-white/10 space-y-1.5 hover:border-neon-purple/40 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-neon-purple/20 text-neon-purple font-bold text-[10px]">
                        v{ver.versionNumber}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {new Date(ver.timestamp).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-gray-200 font-sans">{ver.note || "Version snapshot"}</p>

                    <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => restoreVersion(project.id, ver.id)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 text-[10px] font-bold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" /> Restore
                      </button>

                      <button
                        type="button"
                        onClick={() => duplicateVersionAsProject(project.id, ver.id)}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 text-[10px] font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Clone
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LINKED ASSETS TAB */}
        {activeTab === "assets" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-gray-400">Project Assets</span>
              <button
                type="button"
                onClick={() => compressProjectAssets(project.id)}
                className="px-2.5 py-1 rounded-xl bg-neon-purple/20 border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/30 text-[10px] font-bold flex items-center gap-1"
              >
                <Zap className="w-3 h-3" /> Compress Vault
              </button>
            </div>

            {(project.linkedAssets || []).length === 0 ? (
              <div className="p-6 text-center bg-neutral-950 rounded-2xl border border-white/10 text-gray-400 space-y-1">
                <Link2 className="w-6 h-6 mx-auto text-gray-600" />
                <p>No external linked assets attached.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(project.linkedAssets || []).map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 bg-neutral-950 rounded-xl border border-white/10 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-white/5 text-cyan-400">
                          <Link2 className="w-3.5 h-3.5" />
                        </span>
                        <div>
                          <p className="font-bold text-xs text-white">{asset.name}</p>
                          <p className="text-[10px] text-gray-400">{asset.type} • {asset.sizeStr || "1.0 MB"}</p>
                        </div>
                      </div>

                      {asset.isMissing ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[9px] font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Missing
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                          Linked
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={relinkUrlMap[asset.id] !== undefined ? relinkUrlMap[asset.id] : asset.url}
                        onChange={(e) => setRelinkUrlMap({ ...relinkUrlMap, [asset.id]: e.target.value })}
                        placeholder="New asset URL"
                        className="flex-1 bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => relinkProjectAsset(project.id, asset.id, relinkUrlMap[asset.id] || asset.url)}
                        className="px-2.5 py-1 rounded-lg bg-white/10 text-white font-bold text-[10px] hover:bg-neon-purple"
                      >
                        Relink
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* EXPORTS LOG TAB */}
        {activeTab === "exports" && (
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[10px] uppercase font-bold text-gray-400 block">Export History Log</span>

            {(project.exportHistory || []).length === 0 ? (
              <div className="p-6 text-center bg-neutral-950 rounded-2xl border border-white/10 text-gray-400">
                <Download className="w-6 h-6 mx-auto text-gray-600 mb-1" />
                No export records yet.
              </div>
            ) : (
              <div className="space-y-2">
                {(project.exportHistory || []).map((exp) => (
                  <div
                    key={exp.id}
                    className="p-3 bg-neutral-950 rounded-xl border border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple font-bold text-[10px]">
                        {exp.format}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(exp.timestamp).toLocaleString()} • {exp.resolution}
                      </p>
                    </div>

                    <span className="text-gray-300 font-bold text-xs">{exp.sizeStr}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DRAWER FOOTER ACTIONS */}
      <div className="p-4 bg-neutral-950 border-t border-white/10 shrink-0 space-y-2 font-mono text-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => exportProjectZIP(project.id)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-neon-purple/20 text-gray-200 hover:text-neon-purple font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Archive className="w-4 h-4 text-neon-purple" /> Export ZIP Package
          </button>

          <button
            type="button"
            onClick={() => exportProjectJSON(project.id)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <FileCode className="w-4 h-4 text-cyan-400" /> Save JSON
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => shareProject(project.id)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-200 hover:text-white font-bold flex items-center justify-center gap-1.5 transition-all"
          >
            <Share2 className="w-4 h-4 text-amber-400" /> Share Link
          </button>

          {project.isDeleted ? (
            <button
              type="button"
              onClick={() => restoreProjectFromTrash(project.id)}
              className="px-3 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-500/30 transition-all"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" /> Restore
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                deleteProject(project.id);
                onClose();
              }}
              className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold flex items-center justify-center gap-1.5 hover:bg-rose-500/20 transition-all"
            >
              <Trash2 className="w-4 h-4 text-rose-400" /> Trash Project
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
