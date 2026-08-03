const fs = require('fs');
const path = require('path');

const storeDir = 'src/content/store';
const files = fs.readdirSync(storeDir);

for (const file of files) {
  if (file.endsWith('.json')) {
    const filePath = path.join(storeDir, file);
    let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (content.published === undefined) {
      content.published = true;
    }
    if (content.order === undefined) {
      content.order = 0;
    }
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
}
console.log("Updated store json files");
