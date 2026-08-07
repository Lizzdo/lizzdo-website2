import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Designer from "../pages/Designer";

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/" element={<Designer />} />
      <Route path="/designer" element={<Designer />} />
      <Route path="/designer-v2" element={<Designer />} />
      <Route path="/studio" element={<Designer />} />
      <Route path="/studio-v2" element={<Designer />} />
      <Route path="/projects" element={<Designer />} />
      <Route path="/assets" element={<Designer />} />
      <Route path="/templates" element={<Designer />} />
      <Route path="/video-editor" element={<Designer />} />
      <Route path="/image-editor" element={<Designer />} />
      <Route path="/ai-tools" element={<Designer />} />
      <Route path="/brand-tools" element={<Designer />} />
      <Route path="/export" element={<Designer />} />
      <Route path="*" element={<Designer />} />
    </Routes>
  );
}
