import json
with open('src/content/pages/home.json', 'r') as f:
    data = json.load(f)

data['statistics'] = [
    {
      "label": "Digital Assets Created",
      "value": "2,000+"
    },
    {
      "label": "Projects Delivered",
      "value": "1,000+"
    },
    {
      "label": "Client Satisfaction",
      "value": "98%"
    },
    {
      "label": "Years Experience",
      "value": "7+"
    }
]

with open('src/content/pages/home.json', 'w') as f:
    json.dump(data, f, indent=2)
