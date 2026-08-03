import os
import glob
import re

sort_order_code = "import { sortByOrder } from \"../lib/content\";"

def replace_sort_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # We want to replace:
    # .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
    # .sort((a, b) => (a.order || 0) - (b.order || 0))
    # etc...
    # with .sort(sortByOrder)
    
    original_content = content

    content = re.sub(r'\.sort\([^)]*\)\s*=>\s*\(a\.order\s*\|\|\s*0\)\s*-\s*\(b\.order\s*\|\|\s*0\)\)', '.sort(sortByOrder)', content)
    # the regex above might be too strict. 
    # Let's just use string replacement for common variants.

    variants = [
        ".sort((a: any, b: any) => (a.order || 0) - (b.order || 0))",
        ".sort((a, b) => (a.order || 0) - (b.order || 0))",
        ".sort((a: any, b: any) => {\n        if (a.order !== b.order && a.order !== undefined && b.order !== undefined) {\n          return (a.order || 0) - (b.order || 0);\n        }\n        return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();\n      })"
    ]

    for v in variants:
        if v in content:
            content = content.replace(v, ".sort(sortByOrder)")
            
    # Home.tsx has:
    # allPosts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    # replace with allPosts.sort(sortByOrder)
    content = content.replace(".sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())", ".sort(sortByOrder)")
    content = content.replace(".sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())", ".sort(sortByOrder)")
    
    # Blog.tsx uses a multiline sort:
    if filepath.endswith("Blog.tsx"):
        # We know Blog.tsx has that complex sort block
        # Let's find the .sort((a: any, b: any) => { ... }) block and replace it
        # The easiest way is regex
        content = re.sub(r'\.sort\(\(a:\s*any,\s*b:\s*any\)\s*=>\s*\{[^}]*\}\)', '.sort(sortByOrder)', content)
        
    if content != original_content:
        # add import if not present
        if 'import { sortByOrder }' not in content:
            if 'import { getCollection } from "../lib/content";' in content:
                content = content.replace('import { getCollection } from "../lib/content";', 'import { getCollection, sortByOrder } from "../lib/content";')
            elif 'import { getSingle, getCollection } from "../lib/content";' in content:
                content = content.replace('import { getSingle, getCollection } from "../lib/content";', 'import { getSingle, getCollection, sortByOrder } from "../lib/content";')
            elif 'import { getSingle, getCollection, toArray } from "../lib/content";' in content:
                content = content.replace('import { getSingle, getCollection, toArray } from "../lib/content";', 'import { getSingle, getCollection, toArray, sortByOrder } from "../lib/content";')
            elif 'import { getCollection, getSingle, toArray } from "../lib/content";' in content:
                content = content.replace('import { getCollection, getSingle, toArray } from "../lib/content";', 'import { getCollection, getSingle, toArray, sortByOrder } from "../lib/content";')
            elif 'import { getCollection, getSingle } from "../lib/content";' in content:
                content = content.replace('import { getCollection, getSingle } from "../lib/content";', 'import { getCollection, getSingle, sortByOrder } from "../lib/content";')
            elif 'import { getCollection, toArray } from "../lib/content";' in content:
                content = content.replace('import { getCollection, toArray } from "../lib/content";', 'import { getCollection, toArray, sortByOrder } from "../lib/content";')
            else:
                content = 'import { sortByOrder } from "../lib/content";\n' + content

        with open(filepath, 'w') as f:
            f.write(content)
        print("Updated:", filepath)


for filepath in glob.glob('src/**/*.tsx', recursive=True):
    replace_sort_in_file(filepath)
for filepath in glob.glob('src/**/*.ts', recursive=True):
    replace_sort_in_file(filepath)

