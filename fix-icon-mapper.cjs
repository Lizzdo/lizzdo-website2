const fs = require('fs');
let content = fs.readFileSync('src/components/IconMapper.tsx', 'utf8');

// The function definition was broken
content = content.replace(/const BehanceIcon,\s*DiscordIcon,\s*FiverrIcon,\s*UpworkIcon =/, 'const BehanceIcon =');
// Add to CustomIcons object
content = content.replace(/const CustomIcons: any = \{\s*XIcon,\s*BehanceIcon\s*\};/, 'const CustomIcons: any = {\n  XIcon,\n  BehanceIcon,\n  DiscordIcon,\n  FiverrIcon,\n  UpworkIcon\n};');

fs.writeFileSync('src/components/IconMapper.tsx', content);
console.log("Fixed IconMapper.tsx");
