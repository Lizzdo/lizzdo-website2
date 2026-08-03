const fs = require('fs');
let content = fs.readFileSync('src/components/DocumentHead.tsx', 'utf8');

const regexFavicon = /\{globalData\?\.favicon && <link rel="icon" href=\{globalData\.favicon\} \/>\}/;
const replacementFavicon = `<link rel="icon" type="image/x-icon" href={globalData?.favicon || "/favicon.ico"} />
      <link rel="shortcut icon" href={globalData?.favicon || "/favicon.ico"} />
      <link rel="apple-touch-icon" href={globalData?.favicon || "/apple-touch-icon.png"} />`;

if (regexFavicon.test(content)) {
  content = content.replace(regexFavicon, replacementFavicon);
  fs.writeFileSync('src/components/DocumentHead.tsx', content);
  console.log("Updated DocumentHead.tsx favicon");
} else {
  console.log("Favicon pattern not found in DocumentHead.tsx");
}
