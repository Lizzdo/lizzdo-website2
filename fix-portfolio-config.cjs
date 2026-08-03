const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newPortfolioFields = `- name: "portfolio"
    label: "Portfolio Projects"
    folder: "src/content/portfolio"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "title"
    slug: "{{slug}}"
    fields:
      - {label: "Project Title", name: "title", widget: "string"}
      - {label: "URL Slug", name: "slug", widget: "string"}
      - {label: "Short Description", name: "description", widget: "text", required: false}
      - {label: "Full Description", name: "body", widget: "markdown", required: false}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Gallery Images", name: "gallery", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false}
      - {label: "Project Video URL (YouTube/Vimeo)", name: "video", widget: "string", required: false}
      - {label: "Legacy Videos", name: "videos", widget: "list", field: {label: "Video URL", name: "url", widget: "string"}, required: false}
      - {label: "Categories", name: "categories", widget: "list", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Client Name", name: "client", widget: "string", required: false}
      - {label: "Industry", name: "industry", widget: "string", required: false}
      - {label: "Software Used", name: "software", widget: "list", required: false}
      - {label: "Technologies", name: "technologies", widget: "list", required: false}
      - {label: "Project Date", name: "date", widget: "string", required: false}
      - {label: "Project Duration", name: "duration", widget: "string", required: false}
      - {label: "My Role", name: "role", widget: "string", required: false}
      - {label: "Project Goals", name: "goals", widget: "text", required: false}
      - {label: "Challenges", name: "challenges", widget: "text", required: false}
      - {label: "Solution", name: "solution", widget: "text", required: false}
      - {label: "Results", name: "results", widget: "text", required: false}
      - {label: "External Website", name: "website", widget: "string", required: false}
      - {label: "GitHub Repository", name: "github", widget: "string", required: false}
      - {label: "Download Files", name: "download_link", widget: "string", required: false}
      - {label: "SEO Title", name: "seo_title", widget: "string", required: false}
      - {label: "SEO Description", name: "seo_description", widget: "text", required: false}
      - {label: "Open Graph Image", name: "og_image", widget: "image", required: false}
      - {label: "Featured Project", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Published/Hide", name: "published", widget: "boolean", default: true, required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
  - name: "store"`;

const regex = /- name:\s*"portfolio"\s*label:\s*"Portfolio Projects"[\s\S]*?- name:\s*"store"/;
if (regex.test(config)) {
  config = config.replace(regex, newPortfolioFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated portfolio config");
} else {
  console.log("Could not find portfolio section");
}
