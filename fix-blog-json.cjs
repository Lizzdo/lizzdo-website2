const fs = require('fs');
const path = require('path');

const dir = 'src/content/blog';
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
      if (content.order === undefined) {
        content.order = 0;
        modified = true;
      }
      if (typeof content.category === 'string') {
        content.category = [content.category];
        modified = true;
      }
      
      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      }
    }
  }
  console.log("Updated blog json files");
}
