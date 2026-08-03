const fs = require('fs');
let content = fs.readFileSync('src/pages/Project.tsx', 'utf8');

// I will just replace the exact lines
content = content.replace(
  /                  <\/div>\n                <\/div>\n              \)\}\n            <\/div>\n\n          <\/div>\n        <\/div>\n      <\/section>/,
  `                  </div>
                </div>
              )}
          </div>
        </div>
      </section>`
);

fs.writeFileSync('src/pages/Project.tsx', content);
console.log("Updated Project.tsx");
