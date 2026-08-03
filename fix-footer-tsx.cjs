const fs = require('fs');
let content = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// The user requested Footer Menu. Let's just use navLinks for quick links, and footer_nav for resources/legal
const regexQuickLinks = /\{\(globalData\?\.footer\?\.quick_links \|\| \["Services", "About", "Contact"\]\)\.map\(\(item: any\) => \([\s\S]*?\}\)\)\}/;
const replacementQuickLinks = `{(navLinks.slice(0, 5)).map((item: any) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-neon-cyan transition-colors font-future tracking-[1px]"
                  >
                    {item.name.toUpperCase()}
                  </Link>
                </li>
              ))}`;
content = content.replace(regexQuickLinks, replacementQuickLinks);

const regexResources = /\{\(globalData\?\.footer\?\.resources \|\| \["FAQ", "Portfolio", "Blog"\]\)\.map\(\(item: any\) => \([\s\S]*?\}\)\)\}/;
const replacementResources = `{(globalData?.footer_nav || []).map((item: any) => (
                <li key={item.label}>
                  <Link
                    to={item.url}
                    className="text-gray-400 hover:text-neon-cyan transition-colors font-future tracking-[1px]"
                  >
                    {item.label.toUpperCase()}
                  </Link>
                </li>
              ))}`;
content = content.replace(regexResources, replacementResources);

fs.writeFileSync('src/components/Footer.tsx', content);
console.log("Updated Footer.tsx logic");
