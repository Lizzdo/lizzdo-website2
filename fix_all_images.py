import json
import os
import glob

def replace_images_in_obj(obj):
    modified = False
    if isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(v, str):
                if 'unsplash.com' in v or 'picsum.photos' in v or 'postimg.cc' in v:
                    obj[k] = '/lizzdo-logo.png'
                    modified = True
            elif isinstance(v, (dict, list)):
                if replace_images_in_obj(v):
                    modified = True
    elif isinstance(obj, list):
        for i in range(len(obj)):
            if isinstance(obj[i], str):
                if 'unsplash.com' in obj[i] or 'picsum.photos' in obj[i] or 'postimg.cc' in obj[i]:
                    obj[i] = '/lizzdo-logo.png'
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

print("Modified files:")
for f in files_modified:
    print(f)
