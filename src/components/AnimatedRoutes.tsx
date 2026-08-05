import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Home from "../pages/Home";
import Services from "../pages/Services";
import ServiceDetail from "../pages/ServiceDetail";
import Portfolio from "../pages/Portfolio";
import Project from "../pages/Project";
import Store from "../pages/Store";
import Product from "../pages/Product";
import Blog from "../pages/Blog";
import BlogPost from "../pages/BlogPost";
import About from "../pages/About";
import Clients from "../pages/Clients";
import Contact from "../pages/Contact";
import Estimator from "../pages/Estimator";
import FAQ from "../pages/FAQ";
import Legal from "../pages/Legal";
import Checkout from "../pages/Checkout";
import Designer from "../pages/Designer";
import DesignerV2 from "../pages/DesignerV2";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: "instant" })}
    >
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
        <Route path="/services/:slug" element={<PageWrapper><ServiceDetail /></PageWrapper>} />
        <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
        <Route path="/portfolio/:slug" element={<PageWrapper><Project /></PageWrapper>} />
        <Route path="/store" element={<PageWrapper><Store /></PageWrapper>} />
        <Route path="/store/:slug" element={<PageWrapper><Product /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><Checkout /></PageWrapper>} />
        <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
        <Route path="/blog/:id" element={<PageWrapper><BlogPost /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/clients" element={<PageWrapper><Clients /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/estimator" element={<PageWrapper><Estimator /></PageWrapper>} />
        <Route path="/designer" element={<PageWrapper><Designer /></PageWrapper>} />
        <Route path="/designer-v2" element={<PageWrapper><DesignerV2 /></PageWrapper>} />
        <Route path="/studio" element={<PageWrapper><Designer /></PageWrapper>} />
        <Route path="/studio-v2" element={<PageWrapper><DesignerV2 /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />
        <Route path="/legal/:slug" element={<PageWrapper><Legal /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -15, scale: 0.98 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
}
