const fs = require('fs');

const portfolioDir = 'src/content/portfolio';
if (fs.existsSync(portfolioDir)) {
  const portfolioFiles = fs.readdirSync(portfolioDir).filter(f => f.endsWith('.json'));

  for (const file of portfolioFiles) {
    const filePath = `${portfolioDir}/${file}`;
    let project = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (project.published === undefined) {
      project.published = true;
    }
    if (project.featured === undefined) {
      project.featured = false;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(project, null, 2));
  }

  console.log("Updated portfolio files");
}
