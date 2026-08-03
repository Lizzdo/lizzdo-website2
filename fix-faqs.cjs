const fs = require('fs');

let contentHome = fs.readFileSync('src/pages/Home.tsx', 'utf8');
contentHome = contentHome.replace(
  /const faqs = allFaqs\.slice\(0, 6\);/g,
  `const faqs = allFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).slice(0, 6);`
);
fs.writeFileSync('src/pages/Home.tsx', contentHome);


let contentFaq = fs.readFileSync('src/pages/FAQ.tsx', 'utf8');
contentFaq = contentFaq.replace(
  /const loadedFaqData = useMemo\(\(\) => \{[\s\S]*?\}, \[\]\);/m,
  `const loadedFaqData = useMemo(() => {
    const rawFaqs = getCollection(import.meta.glob('../content/faq/*.json', { eager: true }));
    const sortedFaqs = rawFaqs.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
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
  }, []);`
);
fs.writeFileSync('src/pages/FAQ.tsx', contentFaq);

