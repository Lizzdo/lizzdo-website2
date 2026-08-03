import os
import re

filepath = 'src/lib/content.ts'
with open(filepath, 'r') as f:
    content = f.read()

# find export const getCollection
# and replace its return statement
# return collection.sort(sortByOrder);

if 'return collection.sort(sortByOrder);' not in content:
    content = content.replace('  return Object.keys(collectionGlob).map((key) => {', '  const collection = Object.keys(collectionGlob).map((key) => {')
    content = content.replace('    };\n  });\n};', '    };\n  });\n  return collection.sort(sortByOrder);\n};')

with open(filepath, 'w') as f:
    f.write(content)

