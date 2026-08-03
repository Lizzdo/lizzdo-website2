import { getCollection } from "../lib/content";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  items: FAQItem[];
}

const rawFaqs = getCollection(import.meta.glob('../content/faq/*.json', { eager: true }));

const allFaqs = rawFaqs.map((faq: any) => ({
  question: faq.question || '',
  answer: faq.answer || '',
  category: faq.category || ''
}));

const baseCategories = [
  { id: "general", name: "General Questions", icon: "Info" },
  { id: "web-dev", name: "Website Development", icon: "Globe" },
  { id: "ecommerce", name: "E-Commerce Development", icon: "ShoppingCart" },
  { id: "ai-automation", name: "AI & Automation", icon: "Cpu" },
  { id: "ai-agents", name: "AI Agents & Chatbots", icon: "Bot" },
  { id: "mobile-dev", name: "Mobile App Development", icon: "Smartphone" },
  { id: "saas-dev", name: "SaaS Development", icon: "Cloud" },
  { id: "unity-dev", name: "Unity Development", icon: "Gamepad2" },
  { id: "unreal-dev", name: "Unreal Engine Development", icon: "MonitorPlay" },
  { id: "roblox-dev", name: "Roblox Development", icon: "SquareTerminal" },
  { id: "game-dev", name: "Game Development", icon: "Swords" },
  { id: "3d-modeling", name: "3D Modeling", icon: "Box" },
  { id: "character-design", name: "Character Design", icon: "UserSquircle" },
  { id: "product-vis", name: "Product Visualization", icon: "Package" },
  { id: "arch-vis", name: "Architectural Visualization", icon: "Building" },
  { id: "animation-vfx", name: "Animation & VFX", icon: "Film" },
  { id: "3d-printing", name: "3D Printing", icon: "Printer" },
  { id: "digital-fashion", name: "Digital Fashion & CLO3D", icon: "Shirt" },
  { id: "nft-web3", name: "NFT & Web3", icon: "Hexagon" },
  { id: "uiux-design", name: "UI/UX Design", icon: "Layout" },
  { id: "cloud-backend", name: "Cloud & Backend Systems", icon: "Server" },
  { id: "maintenance", name: "Maintenance & Support", icon: "Wrench" }
];

export const faqData: FAQCategory[] = baseCategories.map(cat => ({
  ...cat,
  items: allFaqs.filter((faq: any) => faq.category === cat.id).map((faq: any) => ({
    question: faq.question,
    answer: faq.answer
  }))
})).filter(cat => cat.items.length > 0);
