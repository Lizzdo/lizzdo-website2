const fs = require('fs');

let content = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

// Replace the logo logic
content = content.replace(
  /<img\s+src="https:\/\/lizzdo\.com\/wp-content\/uploads\/2026\/04\/lizzdo-v1\.png"\s+alt="LIZZDO"\s+className="h-10 w-auto group-hover:scale-110 transition-transform duration-500"\s+referrerPolicy="no-referrer"\s+\/>/m,
  `{globalData?.logo ? (
            <img
              src={globalData.logo}
              alt={globalData?.site_name || "LIZZDO"}
              className="h-10 w-auto group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="h-10 w-10 bg-neon-cyan/20 rounded-lg flex items-center justify-center border border-neon-cyan/50 text-neon-cyan font-display font-bold text-xl group-hover:scale-110 transition-transform duration-500">
              {(globalData?.site_name || "LIZZDO").substring(0, 1)}
            </div>
          )}`
);

content = content.replace(/LIZZDO/g, `{globalData?.site_name || "LIZZDO"}`);
// Specifically this one needs brackets around if we do it blind. So let's be careful. Let's not blindly replace LIZZDO everywhere.
fs.writeFileSync('src/components/Navbar.tsx', content);

