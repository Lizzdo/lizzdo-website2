const fs = require('fs');
const path = require('path');

const dir = 'src/content/faq';
if (fs.existsSync(dir)) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.json')) {
      const filePath = path.join(dir, file);
      let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      let modified = false;
      if (content.published === undefined) {
        content.published = true;
        modified = true;
      }
      if (content.featured === undefined) {
        content.featured = false;
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      }
    }
  }
  console.log("Updated faq json files");
}
