import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isDesigner = location.pathname.startsWith("/designer") || location.pathname.startsWith("/studio");

  if (isDesigner) {
    return <div className="min-h-screen bg-neutral-950 text-white font-sans overflow-hidden">{children}</div>;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background Effects */}
      <div className="grid-bg" />
      <div className="scanline" />
      
      <Navbar />
      <main className="relative z-10 pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
