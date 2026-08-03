const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

const faqLogicRegex = /const faqs = faqs_section\?\.faqs_list\?\.length > 0\n\s*\? faqs_section\.faqs_list\.map\(\(slug: string\) => allFaqs\.find\(\(f: any\) => f\.slug === slug\)\)\.filter\(Boolean\)\n\s*: allFaqs\.sort\(\(a: any, b: any\) => \(a\.order \|\| 0\) - \(b\.order \|\| 0\)\)\.slice\(0, 6\);/;

const replacement = `let faqs = faqs_section?.faqs_list?.length > 0
    ? faqs_section.faqs_list.map((slug: string) => allFaqs.find((f: any) => f.slug === slug)).filter(Boolean)
    : allFaqs.filter((f: any) => f.published !== false && f.featured === true).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, 6);
    
  if (faqs.length === 0) {
    faqs = allFaqs.filter((f: any) => f.published !== false).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, 6);
  }`;

if (faqLogicRegex.test(content)) {
  content = content.replace(faqLogicRegex, replacement);
  
  if (!content.includes('import Markdown')) {
    content = content.replace(/import \{ getCollection, getSingle \} from "\.\.\/lib\/content";/, 'import { getCollection, getSingle } from "../lib/content";\nimport Markdown from "react-markdown";');
  }

  const markdownRegex = /<p\s*className="text-gray-400 font-future leading-relaxed"\s*dangerouslySetInnerHTML=\{\{ __html: faq\.answer \}\}\s*\/>/;
  
  const markdownReplacement = `<div className="text-gray-400 font-future leading-relaxed prose prose-invert prose-cyan max-w-none prose-sm">
                        <Markdown>{faq.answer}</Markdown>
                      </div>`;
  
  if (markdownRegex.test(content)) {
    content = content.replace(markdownRegex, markdownReplacement);
  }

  fs.writeFileSync('src/pages/Home.tsx', content);
  console.log("Updated Home.tsx faqs logic");
} else {
  console.log("Could not find faqs logic in Home.tsx");
}
