import json

def fix_file(filepath):
    with open(filepath, 'r') as f:
        data = json.load(f)
        
    modified = False
    
    if filepath.endswith('about.json'):
        if 'company' in data and data['company'].get('image'):
            if data['company']['image'].startswith('http'):
                data['company']['image'] = '/uploads/lizzdo-logo.png'
                modified = True
                
        if 'company_info' in data and data['company_info'].get('image'):
            if data['company_info']['image'].startswith('http'):
                data['company_info']['image'] = '/uploads/lizzdo-logo.png'
                modified = True
                
        # Also clean up empty logo fields if they are useless, but they are strings
        if 'company_info' in data and data['company_info'].get('logo') == '':
            data['company_info']['logo'] = '/uploads/lizzdo-logo.png'
            modified = True
            
    if filepath.endswith('home.json'):
        if 'testimonials' in data and 'list' in data['testimonials']:
            for t in data['testimonials']['list']:
                if 'thumbnail' in t and t['thumbnail'].startswith('http'):
                    t['thumbnail'] = '/uploads/lizzdo-logo.png'
                    modified = True
                    
    if modified:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

fix_file('src/content/pages/about.json')
fix_file('src/content/pages/home.json')
