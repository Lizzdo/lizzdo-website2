import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('src/pages/Clients.tsx', 'utf-8');
const regex = /const clientsData = (\[.*?\]);\n\nexport/s;
const match = content.match(regex);

if (match) {
  // It's a JS object array string. Let's write a temporary script to export it.
  const code = `export const clientsData = ${match[1]};`;
  fs.writeFileSync('temp-clients-data.js', code);
} else {
  console.log("Could not find clientsData");
}
