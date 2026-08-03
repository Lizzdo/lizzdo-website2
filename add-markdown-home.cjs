const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!content.includes('import Markdown')) {
  content = content.replace(/import \{ getSingle, getCollection, toArray \} from "\.\.\/lib\/content";/, 'import { getSingle, getCollection, toArray } from "../lib/content";\nimport Markdown from "react-markdown";');
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Added Markdown to Home.tsx");
} else {
  console.log("Markdown already imported");
}
