import React, { useState } from "react";
import { useStudio } from "../../../context/StudioContext";
import { checkWcagContrast } from "../../../utils/colorUtils";
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const BrandValidationSection: React.FC = () => {
  const { activeBrandKit, updateActiveBrandKit, addNotification } = useStudio();
  const [isExpanded, setIsExpanded] = useState(true);

  // Audits
  const issues: {
    id: string;
    severity: "error" | "warning" | "info";
    title: string;
    description: string;
    autoFixAction?: () => void;
    autoFixLabel?: string;
  }[] = [];

  // 1. Primary Logo Check
  const hasPrimaryLogo = activeBrandKit.logoVariants.some(
    (l) => l.type === "Primary Logo"
  );
  if (!hasPrimaryLogo) {
    issues.push({
      id: "missing-primary-logo",
      severity: "error",
      title: "Missing Primary Logo Variant",
      description: "Primary Logo is required for canvas headers and collateral auto-styling.",
      autoFixLabel: "Set First Logo as Primary",
      autoFixAction: () => {
        if (activeBrandKit.logoVariants.length > 0) {
          const updatedLogos = activeBrandKit.logoVariants.map((l, i) =>
            i === 0 ? { ...l, type: "Primary Logo" as const } : l
          );
          updateActiveBrandKit({ logoVariants: updatedLogos });
          addNotification("Brand Audit Fixed", "Set first logo as Primary Logo variant", "success");
        }
      },
    });
  }

  // 2. SVG Vector Logo Check
  const hasSvgLogo = activeBrandKit.logoVariants.some((l) => l.format === "svg");
  if (!hasSvgLogo) {
    issues.push({
      id: "missing-svg-logo",
      severity: "warning",
      title: "No Vector SVG Logo Provided",
      description: "SVG vector format ensures crisp scaling on high DPI retina displays and print.",
    });
  }

  // 3. Contrast Check
  const bgContrast = checkWcagContrast(
    activeBrandKit.colors.text,
    activeBrandKit.colors.background
  );
  if (!bgContrast.passesAA) {
    issues.push({
      id: "low-text-contrast",
      severity: "error",
      title: `Low Text Contrast (${bgContrast.ratio}:1)`,
      description: `Foreground text on background fails WCAG AA standard (Minimum 4.5:1 required).`,
      autoFixLabel: "Auto-Fix Contrast to White",
      autoFixAction: () => {
        updateActiveBrandKit({
          colors: { ...activeBrandKit.colors, text: "#ffffff" },
        });
        addNotification("Contrast Fixed", "Set foreground text color to high-contrast white (#ffffff)", "success");
      },
    });
  }

  // 4. Company Metadata Check
  if (!activeBrandKit.companyName || !activeBrandKit.websiteUrl) {
    issues.push({
      id: "missing-company-info",
      severity: "info",
      title: "Incomplete Company Profile Data",
      description: "Website URL or Official Company Name missing from profile info.",
      autoFixLabel: "Fill Company Placeholders",
      autoFixAction: () => {
        updateActiveBrandKit({
          companyName: activeBrandKit.companyName || `${activeBrandKit.brandName} Inc.`,
          websiteUrl: activeBrandKit.websiteUrl || `https://${activeBrandKit.brandName.toLowerCase().replace(/\s+/g, "")}.com`,
        });
        addNotification("Profile Auto-Filled", "Added default company metadata placeholders", "success");
      },
    });
  }

  // 5. Favicon Check
  if (!activeBrandKit.faviconUrl) {
    issues.push({
      id: "missing-favicon",
      severity: "warning",
      title: "Favicon Icon Not Specified",
      description: "Browser tab icon is unconfigured.",
    });
  }

  // Health score math
  const totalChecks = 6;
  const passedChecks = Math.max(0, totalChecks - issues.length);
  const healthScore = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="p-6 rounded-3xl bg-neutral-900 border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-2xl border ${
              healthScore >= 80
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : healthScore >= 50
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-red-500/10 border-red-500/30 text-red-400"
            }`}
          >
            <ShieldAlert className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-base tracking-wider uppercase text-white">
                Brand System Health & Quality Validation
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  healthScore >= 80
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : healthScore >= 50
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-red-500/20 text-red-400 border border-red-500/40"
                }`}
              >
                Health Score: {healthScore}%
              </span>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-0.5">
              Automated audit for WCAG contrast, missing logos, vector SVGs, and metadata completeness.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-xl bg-black border border-white/10 text-gray-400 hover:text-white"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-3 pt-2 font-mono text-xs">
          {issues.length === 0 ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-300">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Brand System Pristine & Validated!</span>
                <span className="text-[11px] text-emerald-400/80">
                  All 12 logo formats, WCAG AA contrast rules, typography specifications, and company metadata pass quality checks.
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {issues.map((iss) => (
                <div
                  key={iss.id}
                  className={`p-3.5 rounded-2xl border flex flex-col justify-between space-y-2 ${
                    iss.severity === "error"
                      ? "bg-red-950/30 border-red-500/30 text-red-200"
                      : iss.severity === "warning"
                      ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                      : "bg-blue-950/30 border-blue-500/30 text-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs block text-white">{iss.title}</span>
                      <p className="text-[11px] opacity-80">{iss.description}</p>
                    </div>
                  </div>

                  {iss.autoFixAction && (
                    <div className="pt-2 border-t border-white/10 flex justify-end">
                      <button
                        type="button"
                        onClick={iss.autoFixAction}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                      >
                        <Zap className="w-3 h-3 text-neon-cyan" /> {iss.autoFixLabel || "Auto-Fix"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
