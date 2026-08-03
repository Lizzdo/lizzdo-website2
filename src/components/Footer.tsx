import React, { useMemo } from "react";
import { getSingle, toArray } from "../lib/content";
import { IconMapper } from "./IconMapper";
import { Link, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from "lucide-react";



export default function Footer() {
  const globalData = useMemo(() => getSingle(import.meta.glob('../content/settings/global.json', { eager: true })), []);
  const navLinks = globalData?.nav?.map((item: any) => ({ name: item.label, path: item.url })) || [];
  const location = useLocation();

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <>
      <footer className="bg-black/50 backdrop-blur-xl border-t border-neon-cyan/20 py-16 relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 shrink-0">
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-3 mb-6 group">
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
            <p className="text-gray-400 mb-8 font-future max-w-sm leading-relaxed pr-4">
              {globalData?.footer_text || "Transforming visions into digital reality with cutting-edge web development, AI integration, and immersive experiences. Building the future, one pixel at a time."}
            </p>
            <div className="flex flex-wrap gap-4">
              {toArray(globalData?.social).map(({ icon, url, platform }: any, i: number) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-neon-cyan/20 hover:border-neon-cyan transition-all group"
                  title={platform}
                >
                  <div className="text-gray-400 group-hover:text-neon-cyan transition-colors">
                    <IconMapper name={icon} size={18} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold mb-6 text-neon-cyan tracking-[2px]">QUICK LINKS</h4>
            <ul className="space-y-4">
              {(globalData?.footer?.quick_links || [
                { label: "Home", url: "/" },
                { label: "Services", url: "/services" },
                { label: "About", url: "/about" },
                { label: "Contact", url: "/contact" }
              ]).map((item: any, idx: number) => {
                const label = typeof item === 'string' ? item : (item.label || item.name || "");
                const path = typeof item === 'string' 
                  ? (item.toLowerCase() === 'home' ? '/' : `/${item.toLowerCase().replace(/\s+/g, '-')}`)
                  : (item.url || item.path || `/${label.toLowerCase().replace(/\s+/g, '-')}`);
                return (
                  <li key={idx}>
                    <Link
                      to={path}
                      className="text-gray-400 hover:text-neon-cyan transition-colors font-future tracking-[1px]"
                    >
                      {label.toUpperCase()}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold mb-6 text-neon-cyan tracking-[2px]">RESOURCES</h4>
            <ul className="space-y-4">
              {(globalData?.footer?.resources || [
                { label: "Project Estimator", url: "/estimator" },
                { label: "Post & Cover Designer", url: "/designer" },
                { label: "Portfolio", url: "/portfolio" },
                { label: "Clients", url: "/clients" },
                { label: "Store", url: "/store" },
                { label: "Blog", url: "/blog" },
                { label: "FAQ", url: "/faq" }
              ]).map((item: any, idx: number) => {
                const label = typeof item === 'string' ? item : (item.label || item.name || "");
                const path = typeof item === 'string' 
                  ? `/${item.toLowerCase().replace(/\s+/g, '-')}`
                  : (item.url || item.path || `/${label.toLowerCase().replace(/\s+/g, '-')}`);
                return (
                  <li key={idx}>
                    <Link
                      to={path}
                      className="text-gray-400 hover:text-neon-cyan transition-colors font-future tracking-[1px] flex items-center gap-1.5"
                    >
                      {label.toUpperCase()}
                      {(path === "/estimator" || path === "/designer") && (
                        <span className="px-1.5 py-0.5 rounded text-[8px] bg-neon-cyan/20 border border-neon-cyan/40 text-neon-cyan font-mono leading-none">
                          TOOL
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-bold mb-6 text-neon-cyan tracking-[2px]">CONTACT</h4>
            <ul className="space-y-4 text-gray-400 font-future">
              <li className="flex items-start gap-3">
                <MapPin className="text-neon-cyan shrink-0" size={18} />
                <span>{globalData?.contact?.location}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-neon-cyan shrink-0" size={18} />
                <a href={`mailto:${globalData?.contact?.email}`} className="hover:text-neon-cyan transition-colors">{globalData?.contact?.email}</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-neon-cyan shrink-0" size={18} />
                <a href={`tel:${globalData?.contact?.phone?.replace(/\s/g, '')}`} className="hover:text-neon-cyan transition-colors">
                  {globalData?.contact?.phone || "+92 300 0000000"}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="font-mono text-[10px] text-gray-500 uppercase tracking-[3px]">
            {globalData?.copyright || `© ${new Date().getFullYear()} ${globalData?.site_name || "LIZZDO"} • ALL RIGHTS RESERVED`}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] font-mono uppercase tracking-[1px]">
            <Link to="/legal/terms-of-service" className="text-gray-500 hover:text-neon-cyan transition-colors">Terms of Service</Link>
            <Link to="/legal/privacy-policy" className="text-gray-500 hover:text-neon-cyan transition-colors">Privacy Policy</Link>
            <Link to="/legal/data-compliance" className="text-gray-500 hover:text-neon-cyan transition-colors">Data Compliance</Link>
            <Link to="/legal/cookie-policy" className="text-gray-500 hover:text-neon-cyan transition-colors">Cookie Policy</Link>
            <Link to="/legal/acceptable-use" className="text-gray-500 hover:text-neon-cyan transition-colors">AUP</Link>
            <Link to="/legal/disclaimer" className="text-gray-500 hover:text-neon-cyan transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
      </footer>
    </>
  );
}
