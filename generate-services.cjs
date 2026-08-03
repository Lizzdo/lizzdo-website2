const fs = require('fs');
const detailedServicesBase = [
  {
    title: "3D MODELING",
    slug: "3d-modeling",
    category: "Asset Generation",
    icon: "Box",
    color: "neon-cyan",
    features: ["Character Modeling", "Environment Design", "Hard-Surface Props", "PBR Texturing"],
    tech: [
      { name: "Blender", tooltip: "Industry-leading 3D modeling, animation, rendering, rigging, and asset creation software.", iconName: "SiBlender" },
      { name: "ZBrush", tooltip: "The standard for digital sculpting, creating high-poly organic models and characters.", iconName: "Layers" },
      { name: "Substance", tooltip: "Industry standard tool for 3D painting and PBR material authoring.", iconName: "Box" }
    ],
    price: "Starting From $350",
  },
  {
    title: "3D ANIMATION",
    slug: "3d-animation",
    category: "Motion & Rigging",
    icon: "Video",
    color: "neon-purple",
    features: ["Character Rigging", "Keyframe Animation", "VFX & Particles", "Cinematic Trailers"],
    tech: [
      { name: "Cinema 4D", tooltip: "Professional 3D modeling, animation, simulation and rendering software.", iconName: "SiCinema4d" },
      { name: "After Effects", tooltip: "Used for cinematic post-processing, VFX, and motion graphics.", iconName: "Video" },
      { name: "Maya", tooltip: "Industry standard software for 3D animation and character rigging.", iconName: "Video" }
    ],
    price: "Starting From $950",
  },
  {
    title: "ROBLOX DEVELOPMENT",
    slug: "roblox-development",
    category: "Game Engines",
    icon: "Gamepad2",
    color: "neon-green",
    features: ["Map Construction", "Custom Lua Scripts", "UI/UX Design", "Game Optimization"],
    tech: [
      { name: "Roblox Studio", tooltip: "The essential building tool to create experiences on the Roblox platform.", iconName: "SiRobloxstudio" },
      { name: "Lua", tooltip: "Lightweight scripting language used to program game logic and mechanics.", iconName: "SiLua" },
      { name: "Blender", tooltip: "Used for high-quality custom mesh and accessory creation.", iconName: "SiBlender" }
    ],
    price: "Starting From $1,200",
  },
  {
    title: "UNITY & UNREAL",
    slug: "unity-unreal",
    category: "Game Engines",
    icon: "Cpu",
    color: "neon-blue",
    features: ["Level Design", "Shader Development", "Asset Integration", "Optimization"],
    tech: [
      { name: "Unity", tooltip: "Professional game engine used for mobile games, PC games, AR/VR experiences, and simulations.", iconName: "SiUnity" },
      { name: "Unreal Engine", tooltip: "Advanced real-time 3D creation tool for photoreal visuals and immersive experiences.", iconName: "SiUnrealengine" },
      { name: "C#", tooltip: "Primary programming language for developing performant scripts in Unity.", iconName: "Code" }
    ],
    price: "Starting From $1,600",
  },
  {
    title: "3D PRINTING PREP",
    slug: "3d-printing-prep",
    category: "Fabrication",
    icon: "Printer",
    color: "neon-orange",
    features: ["Water-tight Meshes", "Manual Supports", "Scale Validation", "Slicing Profiles"],
    tech: [
      { name: "Lychee Slicer", tooltip: "Advanced resin slicing software for complex 3D prints.", iconName: "Layers" },
      { name: "Cura", tooltip: "Industry standard 3D printer slicing software.", iconName: "Printer" }
    ],
    price: "Starting From $180",
  },
  {
    title: "WEB DEVELOPMENT",
    slug: "web-development",
    category: "Digital Platforms",
    icon: "Code",
    color: "neon-cyan",
    features: ["Custom Web Apps", "E-commerce & Shopify", "High Performance SPAs", "Gaming Portals"],
    tech: [
      { name: "React", tooltip: "Industry-standard UI library for building interactive user interfaces.", iconName: "SiReact" },
      { name: "Next.js", tooltip: "React framework for production grade, optimized applications.", iconName: "SiNextdotjs" },
      { name: "Node.js", tooltip: "Backend runtime environment for fast, scalable network applications.", iconName: "SiNodedotjs" },
      { name: "WordPress", tooltip: "World's most popular content management system.", iconName: "SiWordpress" }
    ],
    price: "Starting From $1,200",
  },
  {
    title: "APP DEVELOPMENT",
    slug: "app-development",
    category: "Digital Platforms",
    icon: "Smartphone",
    color: "neon-purple",
    features: ["iOS App Dev", "Android App Dev", "Cross-Platform Flutter", "Cloud Sync Dev"],
    tech: [
      { name: "Flutter", tooltip: "Google's UI toolkit for natively compiled applications across mobile, web, and desktop.", iconName: "SiFlutter" },
      { name: "React Native", tooltip: "Framework for building native apps using React.", iconName: "SiReact" },
      { name: "Android", tooltip: "Native mobile development.", iconName: "SiAndroid" },
      { name: "Firebase", tooltip: "App development platform.", iconName: "SiFirebase" }
    ],
    price: "Starting From $1,800",
  },
  {
    title: "AI INTEGRATIONS",
    slug: "ai-integrations",
    category: "AI & Data Science",
    icon: "Brain",
    color: "neon-green",
    features: ["LLM API Chatbots", "Computer Vision Tools", "Neural Generation", "Vector Search Databases"],
    tech: [
      { name: "OpenAI", tooltip: "Used for AI assistants, automation systems, chatbots, and intelligent workflows.", iconName: "Brain" },
      { name: "LangChain", tooltip: "Framework for developing applications powered by language models.", iconName: "SiLangchain" },
      { name: "Python", tooltip: "Primary language for data, machine learning, and AI logic integration.", iconName: "SiPython" },
      { name: "TensorFlow", tooltip: "End-to-end open source machine learning platform.", iconName: "SiTensorflow" }
    ],
    price: "Starting From $2,000",
  },
  {
    title: "AI DATA ANALYSIS & PYTHON",
    slug: "ai-data-analysis-python",
    category: "AI & Data Science",
    icon: "Database",
    color: "neon-orange",
    features: ["Scraping & Cleaning", "Machine Learning Training", "Automation Scripts", "FastAPI Handlers"],
    tech: [
      { name: "Python", tooltip: "Primary language for data, machine learning, and automation.", iconName: "SiPython" },
      { name: "FastAPI", tooltip: "Modern, fast web framework for building APIs with Python.", iconName: "SiFastapi" },
      { name: "Pandas", tooltip: "Fast, powerful, flexible data analysis and manipulation tool.", iconName: "SiPandas" }
    ],
    price: "Starting From $1,400",
  }
];

detailedServicesBase.forEach(service => {
  const filePath = `src/content/services/${service.slug}.json`;
  let existingData = {};
  if (fs.existsSync(filePath)) {
    existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  const mergedData = { ...existingData, ...service };
  fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
});
