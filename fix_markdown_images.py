import json
import os
import glob
import re

def replace_images_in_obj(obj):
    modified = False
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                new_v = re.sub(r'https?://(images\.unsplash\.com|picsum\.photos|i\.postimg\.cc)[^\s")]*', '/lizzdo-logo.png', v)
                if new_v != v:
                    obj[k] = new_v
                    modified = True
            elif isinstance(v, (dict, list)):
                if replace_images_in_obj(v):
                    modified = True
    elif isinstance(obj, list):
        for i in range(len(obj)):
            if isinstance(obj[i], str):
                new_v = re.sub(r'https?://(images\.unsplash\.com|picsum\.photos|i\.postimg\.cc)[^\s")]*', '/lizzdo-logo.png', obj[i])
                if new_v != obj[i]:
                    obj[i] = new_v
                    modified = True
            elif isinstance(obj[i], (dict, list)):
                if replace_images_in_obj(obj[i]):
                    modified = True
    return modified

files_modified = []
for filepath in glob.glob('src/content/**/*.json', recursive=True):
    with open(filepath, 'r') as f:
        try:
            data = json.load(f)
        except:
            continue
            
    if replace_images_in_obj(data):
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
        files_modified.append(filepath)

print("Markdown replaced files:")
for f in files_modified:
    print(f)
