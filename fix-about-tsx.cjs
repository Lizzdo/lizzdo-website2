const fs = require('fs');

let content = fs.readFileSync('src/pages/About.tsx', 'utf8');

// Update destructuring
content = content.replace(
  /const \{ company, story, mission, vision, stats, values \} = pageData \|\| \{\};/,
  `const { 
    company, story, mission, vision, stats, values,
    company_info, mission_section, vision_section, story_section, timeline
  } = pageData || {};`
);

// Hero Section
content = content.replace(
  /\{company\?\.headline\?\.split\(' '\)\.slice\(0, -1\)\.join\(' '\)\} <span className="holo-text">\{company\?\.headline\?\.split\(' '\)\.slice\(-1\)\.join\(' '\)\}<\/span>/,
  `{company_info?.name || company?.headline?.split(' ').slice(0, -1).join(' ')} <span className="holo-text">{company_info?.tagline || company?.headline?.split(' ').slice(-1).join(' ')}</span>`
);

content = content.replace(
  /\{company\?\.subtitle\}/,
  `{company_info?.short_desc || company?.subtitle}`
);

// Story Section Header & Details
content = content.replace(
  /<h2 className="font-display text-4xl md:text-5xl font-bold mb-8 uppercase">\s*CRAFTING REALITY\s*<\/h2>/,
  `<h2 className="font-display text-4xl md:text-5xl font-bold mb-8 uppercase">
              {story_section?.heading || "CRAFTING REALITY"}
            </h2>`
);

content = content.replace(
  /\{story && <div className="prose prose-invert prose-neon max-w-none mb-6"><Markdown>\{story\}<\/Markdown><\/div>\}\s*\{mission && <div className="prose prose-invert prose-neon max-w-none mb-6"><h3>Our Mission<\/h3><Markdown>\{mission\}<\/Markdown><\/div>\}\s*\{vision && <div className="prose prose-invert prose-neon max-w-none"><h3>Our Vision<\/h3><Markdown>\{vision\}<\/Markdown><\/div>\}/,
  `{(story_section?.content || story) && <div className="prose prose-invert prose-neon max-w-none mb-6"><Markdown>{story_section?.content || story}</Markdown></div>}
              {(mission_section?.description || mission) && <div className="prose prose-invert prose-neon max-w-none mb-6"><h3>{mission_section?.heading || "Our Mission"}</h3><Markdown>{mission_section?.description || mission}</Markdown></div>}
              {(vision_section?.description || vision) && <div className="prose prose-invert prose-neon max-w-none"><h3>{vision_section?.heading || "Our Vision"}</h3><Markdown>{vision_section?.description || vision}</Markdown></div>}`
);

content = content.replace(
  /src=\{company\?\.image \|\| "https:\/\/i\.postimg\.cc\/Gpz7xr1k\/pose10\.png"\}/,
  `src={company_info?.image || company?.image || "https://i.postimg.cc/Gpz7xr1k/pose10.png"}`
);
content = content.replace(
  /alt=\{company\?\.headline\}/,
  `alt={company_info?.name || company?.headline}`
);

content = content.replace(
  /\{toArray\(pageData\?\.timeline\)\.map/,
  `{toArray(timeline || pageData?.timeline).map`
);

content = content.replace(
  /\{allTeamMembers\.map\(\(member: any, i: number\) => \(/,
  `{allTeamMembers.filter((m: any) => m.active !== false).map((member: any, i: number) => (`
);

content = content.replace(
  /\{member\.socials && member\.socials\.length > 0 && \(\s*<div className="flex items-center gap-3">\s*\{member\.socials\.map\(\(social: any, j: number\) => \(\s*<a key=\{j\} href=\{social\.url\} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">\s*<IconMapper name=\{social\.icon \|\| 'Link'\} size=\{18\} \/>\s*<\/a>\s*\)\)\}\s*<\/div>\s*\)\}/,
  `{((member.socials && member.socials.length > 0) || member.linkedin || member.github || member.instagram || member.email || member.website) && (
                  <div className="flex flex-wrap justify-center items-center gap-3">
                    {member.socials?.map((social: any, j: number) => (
                      <a key={'social-'+j} href={social.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name={social.icon || 'Link'} size={18} />
                      </a>
                    ))}
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Linkedin" size={18} />
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Github" size={18} />
                      </a>
                    )}
                    {member.instagram && (
                      <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Instagram" size={18} />
                      </a>
                    )}
                    {member.website && (
                      <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Globe" size={18} />
                      </a>
                    )}
                    {member.email && (
                      <a href={\`mailto:\${member.email}\`} className="text-gray-500 hover:text-neon-cyan transition-colors">
                        <IconMapper name="Mail" size={18} />
                      </a>
                    )}
                  </div>
                )}`
);

fs.writeFileSync('src/pages/About.tsx', content);
console.log("Updated About.tsx");
