import { getCollection } from "../lib/content";
import { 
  Globe, ShoppingCart, Cpu, Bot, Smartphone, Cloud, 
  Gamepad2, MonitorPlay, SquareTerminal, Box, User,
  Package, Building, Film, Printer, Shirt, Hexagon,
  Briefcase, TrendingUp, FileText, Component, Layout
} from "lucide-react";

export const categories = [
  { id: "web-dev", name: "Web Development", icon: Globe },
  { id: "e-commerce", name: "E-Commerce", icon: ShoppingCart },
  { id: "ai-automation", name: "AI & Automation", icon: Cpu },
  { id: "ai-agents", name: "AI Agents", icon: Bot },
  { id: "mobile-apps", name: "Mobile App Development", icon: Smartphone },
  { id: "open-source", name: "Open Source Development", icon: Cloud },
  { id: "unity-dev", name: "Unity Development", icon: Gamepad2 },
  { id: "unreal-engine", name: "Unreal Engine Development", icon: MonitorPlay },
  { id: "wordpress-dev", name: "WordPress Development", icon: FileText },
  { id: "shopify-dev", name: "Shopify Development", icon: ShoppingCart },
  { id: "ui-ux-design", name: "UI/UX Design", icon: Layout },
  { id: "digital-transformation", name: "Digital Transformation", icon: Building }
];

const rawArticles = getCollection(import.meta.glob('../content/knowledge/*.json', { eager: true }));

export const articles = rawArticles.map((article: any) => ({
  id: article.slug,
  title: article.title || '',
  category: article.category || '',
  description: article.description || '',
  readTime: article.readTime || "5 min read",
  author: article.author || "LIZZDO Team",
  date: article.date || "2026-01-01"
}));
