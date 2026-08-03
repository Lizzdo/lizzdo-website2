const fs = require('fs');
let content = fs.readFileSync('src/pages/FAQ.tsx', 'utf8');

if (!content.includes('import Markdown')) {
  content = content.replace(/import \{ getCollection \} from "\.\.\/lib\/content";/, 'import { getCollection } from "../lib/content";\nimport Markdown from "react-markdown";');
}

const loadedDataRegex = /const loadedFaqData = useMemo\(\(\) => \{[\s\S]*?rawFaqs\.sort\(\(a: any, b: any\) => \(a\.order \|\| 0\) - \(b\.order \|\| 0\)\);[\s\S]*?return Object\.values\(grouped\);\n  \}, \[\]\);/;

const replacement = `const loadedFaqData = useMemo(() => {
    const rawFaqs = getCollection(import.meta.glob('../content/faq/*.json', { eager: true }));
    const filteredFaqs = rawFaqs.filter((f: any) => f.published !== false);
    const sortedFaqs = filteredFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    const grouped = sortedFaqs.reduce((acc: any, faq: any) => {
       const cat = faq.category || "General";
       if (!acc[cat]) {
         acc[cat] = {
           id: cat.toLowerCase().replace(/\\s+/g, '-'),
           name: cat,
           icon: "Info",
           items: []
         };
       }
       acc[cat].items.push({ question: faq.question, answer: faq.answer });
       return acc;
    }, {});
    return Object.values(grouped);
  }, []);`;

if (loadedDataRegex.test(content)) {
  content = content.replace(loadedDataRegex, replacement);
} else {
  console.log("Could not find loadedFaqData logic in FAQ.tsx");
}

const markdownRegex = /<div\s*className="font-future text-gray-400 text-sm leading-relaxed whitespace-pre-line mt-4"\s*dangerouslySetInnerHTML=\{\{ __html: item\.answer \}\}\s*\/>/;

const markdownReplacement = `<div className="font-future text-gray-400 text-sm leading-relaxed mt-4 prose prose-invert prose-cyan max-w-none">
                                      <Markdown>{item.answer}</Markdown>
                                    </div>`;

if (markdownRegex.test(content)) {
  content = content.replace(markdownRegex, markdownReplacement);
  fs.writeFileSync('src/pages/FAQ.tsx', content);
  console.log("Updated FAQ.tsx logic");
} else {
  console.log("Could not find dangerouslySetInnerHTML in FAQ.tsx");
}

