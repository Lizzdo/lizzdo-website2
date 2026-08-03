const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /const projects = featured_portfolio\?\.portfolio_list\?\.length > 0[\s\S]*?allProjects\.filter\(\(p: any\) => p\.featured !== false\)\.slice\(0, 3\);/;
const newLogic = `let projects = featured_portfolio?.portfolio_list?.length > 0
    ? featured_portfolio.portfolio_list.map((slug: string) => allProjects.find((p: any) => p.slug === slug)).filter(Boolean)
    : allProjects.filter((p: any) => p.published !== false && p.featured === true).slice(0, 3);
    
  if (projects.length === 0) {
    projects = allProjects.filter((p: any) => p.published !== false).slice(0, 3);
  }`;

content = content.replace(regex, newLogic);
fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Updated Home.tsx portfolio logic properly");
