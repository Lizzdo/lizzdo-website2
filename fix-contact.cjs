const fs = require('fs');
let content = fs.readFileSync('src/pages/Contact.tsx', 'utf8');

// Ensure we get globalData
content = content.replace(
  /export default function Contact\(\) \{/,
  `export default function Contact() {\n  const globalData = useMemo(() => getSingle(import.meta.glob('../content/settings/global.json', { eager: true })), []);`
);

content = content.replace(
  /\{pageData\?\.subtitle\}\n\s*<\/motion\.p>/,
  `{pageData?.subtitle}
          </motion.p>
          {globalData?.company_info && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-future text-sm text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              {globalData.company_info}
            </motion.p>
          )}`
);

fs.writeFileSync('src/pages/Contact.tsx', content);

