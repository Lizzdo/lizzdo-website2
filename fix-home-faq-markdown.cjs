const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const regex = /\{faq\.answer\}/;
const replacement = `<Markdown>{faq.answer}</Markdown>`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Updated faq.answer in Home.tsx");
} else {
  console.log("Could not find {faq.answer} in Home.tsx");
}
