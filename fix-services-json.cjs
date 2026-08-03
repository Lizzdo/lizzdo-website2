const fs = require('fs');

const servicesDir = 'src/content/services';
const serviceFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.json'));

for (const file of serviceFiles) {
  const filePath = `${servicesDir}/${file}`;
  let service = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (service.published === undefined) {
    service.published = true;
  }
  if (service.featured === undefined) {
    service.featured = false;
  }
  
  fs.writeFileSync(filePath, JSON.stringify(service, null, 2));
}

console.log("Updated service files");
