import React from "react";
import DocumentHead from "../components/DocumentHead";
import PostDesigner from "../components/designer/PostDesigner";

export default function Designer() {
  return (
    <div className="min-h-screen bg-black">
      <DocumentHead
        title="Post & Cover Designer - Lizzdo"
        description="Design professional, high-resolution post covers, portfolio cards, and social media banners with the built-in Lizzdo Post & Cover Designer."
      />
      <PostDesigner />
    </div>
  );
}
