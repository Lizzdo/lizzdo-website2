import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/lib/utils";

import { getSingle } from "../lib/content";

const globalData = getSingle(import.meta.glob('../content/settings/global.json', { eager: true }));
const navLinks = globalData?.nav?.map((item: any) => ({ name: item.label, path: item.url })) || [];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (linkPath: string) => {
    if (linkPath === "/") return location.pathname === "/";
    return location.pathname === linkPath || location.pathname.startsWith(linkPath + "/");
  };

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden", "menu-open");
    } else {
      document.body.classList.remove("overflow-hidden", "menu-open");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-black/90 backdrop-blur-xl border-neon-cyan/30 py-3"
          : "bg-transparent border-transparent py-5"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 group">
          {globalData?.logo ? (
            <img
              src={globalData.logo}
              alt={globalData?.site_name || "LIZZDO"}
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-10 w-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center border border-neon-cyan/50 text-neon-cyan font-display font-bold text-xl group-hover:scale-110 transition-transform duration-500">
              {(globalData?.site_name || "LIZZDO").substring(0, 1)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl tracking-[4px] holo-text leading-none">
              {globalData?.site_name || "LIZZDO"}
            </span>
            <div className="h-[1px] w-0 group-hover:w-full bg-gradient-to-r from-neon-cyan to-transparent transition-all duration-500" />
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={link.path === "/" ? handleHomeClick : undefined}
              className={cn(
                "font-display text-sm tracking-[2px] transition-all hover:text-neon-cyan",
                isActive(link.path)
                  ? "text-neon-cyan font-bold"
                  : "text-white/70"
              )}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/designer"
            className={cn(
              "font-display text-sm tracking-[2px] transition-all hover:text-neon-cyan flex items-center gap-1.5",
              isActive("/designer") ? "text-neon-cyan font-bold" : "text-white/70"
            )}
            title="Legacy Designer V1"
          >
            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
            STUDIO V1
          </Link>

          <Link
            to="/designer-v2"
            className={cn(
              "font-display text-sm tracking-[2px] transition-all flex items-center gap-1.5 px-3 py-1 rounded-lg border border-neon-cyan/40 bg-neon-cyan/10 hover:bg-neon-cyan/20",
              isActive("/designer-v2") || isActive("/studio-v2") ? "text-neon-cyan font-bold shadow-[0_0_12px_rgba(0,245,255,0.4)]" : "text-neon-cyan/80"
            )}
            title="New Professional Designer V2"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            DESIGNER V2 PRO
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase text-xs tracking-[2px] hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] transition-all"
          >
            CONTACT US
          </Link>
          <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/20">
            <Link to="/store" className="text-white hover:text-neon-pink transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-neon-cyan"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    <div
      className={cn(
        "fixed inset-0 w-screen h-screen bg-black z-[999999] p-6 overflow-y-auto flex flex-col items-center justify-center gap-8 transition-all duration-500 md:hidden",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-6 right-6 text-neon-cyan"
      >
        <X size={32} />
      </button>
      {navLinks.map((link) => (
        <Link
          key={link.name}
          to={link.path}
          onClick={(e) => {
            if (link.path === "/") {
              handleHomeClick(e);
            } else {
              setIsOpen(false);
            }
          }}
          className={cn(
            "font-display text-2xl tracking-[4px] transition-all",
            location.pathname === link.path ? "text-neon-cyan" : "text-white"
          )}
        >
          {link.name}
        </Link>
      ))}
      <Link
        to="/designer"
        onClick={() => setIsOpen(false)}
        className={cn(
          "font-display text-2xl tracking-[4px] transition-all flex items-center gap-2",
          location.pathname === "/designer" ? "text-neon-cyan" : "text-white"
        )}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
        DESIGNER V1
      </Link>
      <Link
        to="/designer-v2"
        onClick={() => setIsOpen(false)}
        className={cn(
          "font-display text-2xl tracking-[4px] transition-all flex items-center gap-2 text-neon-cyan",
          location.pathname === "/designer-v2" ? "text-neon-cyan font-bold" : "text-neon-cyan/80"
        )}
      >
        <span className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-pulse"></span>
        DESIGNER V2 PRO
      </Link>
      <Link
        to="/contact"
        onClick={() => setIsOpen(false)}
        className="px-10 py-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-display font-bold uppercase text-lg tracking-[2px]"
      >
        CONTACT US
      </Link>
      <div className="flex items-center gap-8 mt-4 border-t border-white/20 pt-8 w-full justify-center">
        <Link to="/store" onClick={() => setIsOpen(false)} className="text-white hover:text-neon-pink transition-colors cursor-pointer block">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </Link>
      </div>
    </div>
    </>
  );
}
