import React from "react";
import { Link } from "react-router-dom";
import { Calculator, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface EstimatorCTAProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  variant?: "banner" | "card" | "compact";
  className?: string;
}

export default function EstimatorCTA({
  title = "ESTIMATE YOUR PROJECT BUDGET",
  subtitle = "Planning a 3D asset, website, mobile app, game, or custom software solution? Calculate an instant budget range before requesting a proposal.",
  buttonText = "Estimate My Project",
  variant = "banner",
  className = "",
}: EstimatorCTAProps) {
  if (variant === "compact") {
    return (
      <div className={`p-6 rounded-2xl glass-panel border-neon-cyan/20 bg-black/40 flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan shrink-0">
            <Calculator size={18} />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase text-white tracking-wider">{title}</h4>
            <p className="text-gray-400 text-xs font-future line-clamp-1">{subtitle}</p>
          </div>
        </div>
        <Link
          to="/estimator"
          className="shrink-0 px-5 py-2.5 rounded-xl bg-neon-cyan text-black font-display font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,255,0.3)]"
        >
          {buttonText}
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className={`glass-panel p-8 md:p-10 rounded-3xl border-neon-cyan/20 bg-black/50 relative overflow-hidden text-center ${className}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,245,255,0.08),transparent_70%)]" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-[2px]">
            <Sparkles size={12} />
            INSTANT COST ESTIMATOR
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
            {title}
          </h3>
          <p className="text-gray-300 text-sm md:text-base font-future leading-relaxed">
            {subtitle}
          </p>
          <div>
            <Link
              to="/estimator"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs uppercase tracking-[2px] shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_35px_rgba(0,245,255,0.5)] hover:scale-105 transition-all"
            >
              <Calculator size={16} />
              {buttonText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Banner variant
  return (
    <section className={`py-16 md:py-24 relative overflow-hidden border-y border-white/10 bg-black/40 ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,245,255,0.07),transparent_70%)] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-[10px] font-bold uppercase tracking-[3px] shadow-[0_0_15px_rgba(0,245,255,0.15)]">
            <Calculator size={14} />
            INSTANT ESTIMATOR TOOL
          </div>

          <h2 className="text-3xl md:text-5xl font-display font-black text-white uppercase tracking-tight">
            {title}
          </h2>

          <p className="text-gray-300 font-future text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2">
            <Link
              to="/estimator"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 md:py-5 rounded-2xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold text-xs md:text-sm uppercase tracking-[2px] shadow-[0_0_25px_rgba(0,245,255,0.3)] hover:shadow-[0_0_40px_rgba(0,245,255,0.6)] hover:scale-105 transition-all"
            >
              <Calculator size={18} />
              {buttonText}
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
