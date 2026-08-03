import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
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
