import { motion, AnimatePresence } from "motion/react";
import React, { useState, useRef, useEffect } from "react";

export interface TechItem {
  name: string;
  tooltip: string;
  svg: React.ReactNode;
}

export default function TechGrid({ techs }: { techs: TechItem[] }) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close tooltip if tapping outside on mobile
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActiveTooltip(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap gap-3 mt-auto pt-6 border-t border-white/5 relative" ref={containerRef}>
      {techs.map((tech) => (
        <div 
          key={tech.name}
          className="relative group/tech"
          onMouseEnter={() => setActiveTooltip(tech.name)}
          onMouseLeave={() => setActiveTooltip(null)}
        >
          {/* Enhanced Icon Button */}
          <button
            type="button"
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover/tech:text-white group-hover/tech:bg-white/10 group-hover/tech:border-white/20 hover:scale-110 transition-all duration-300 relative overflow-hidden"
            aria-label={tech.name}
            onClick={() => setActiveTooltip(activeTooltip === tech.name ? null : tech.name)}
          >
            {/* Soft Glow internally */}
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/tech:opacity-100 transition-opacity blur-[8px] pointer-events-none"></div>
            <div className="relative z-10 w-5 h-5 flex items-center justify-center">
              {tech.svg}
            </div>
          </button>

          {/* Glassmorphism Tooltip */}
          <AnimatePresence>
            {activeTooltip === tech.name && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 z-50 pointer-events-none"
              >
                <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] shadow-black relative">
                  <div className="font-display font-bold text-xs uppercase tracking-[1px] text-white mb-2 pb-2 border-b border-white/10">
                    {tech.name}
                  </div>
                  <div className="text-gray-400 text-[11px] leading-relaxed font-future">
                    {tech.tooltip}
                  </div>
                  {/* Tooltip triangle pointer */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-black/90 border-t-8 border-x-transparent border-x-8 border-b-0 w-0 h-0 filter drop-shadow-[0_2px_2px_rgba(255,255,255,0.05)]"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
