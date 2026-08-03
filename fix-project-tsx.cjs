const fs = require('fs');
let content = fs.readFileSync('src/pages/Project.tsx', 'utf8');

// First replace the mapping logic
const mapLogicRegex = /const items = rawItems\.map\(\(file: any\) => \(\{[\s\S]*?seo_description: file\.seo_description \|\| ""\s*\}\)\);/;
const newMapLogic = `const items = rawItems.filter((f: any) => f.published !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((file: any) => ({
        id: file.slug,
        title: file.title,
        slug: file.slug,
        category: (() => { const arr = toArray(file.categories); return arr.length ? arr : ["UNCATEGORIZED"]; })(),
        desc: file.description,
        body: file.body,
        image: file.thumbnail || "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?q=80&w=1000",
        gallery: toArray(file.gallery),
        tags: toArray(file.tags),
        software: toArray(file.software),
        technologies: toArray(file.technologies),
        client: file.client || "",
        industry: file.industry || "",
        date: file.date || "",
        duration: file.duration || "",
        role: file.role || "",
        goals: file.goals || "",
        challenges: file.challenges || "",
        solution: file.solution || "",
        results: file.results || "",
        website: file.website || "",
        github: file.github || "",
        download_link: file.download_link || "",
        video: file.video || "",
        videos: toArray(file.videos).map(v => typeof v === 'string' ? v : (v.url || '')),
        seo_title: file.seo_title || "",
        seo_description: file.seo_description || ""
      }));`;
      
content = content.replace(mapLogicRegex, newMapLogic);

// Add missing UI sections to the sidebar or main content
// Let's replace the <div className="space-y-12"> (Sidebar)
// and the <div className="prose..."> (Main body) to include the new fields.

// I'll manually modify the file contents next by looking at the file first.
fs.writeFileSync('src/pages/Project.tsx', content);
console.log("Updated mapping logic");
