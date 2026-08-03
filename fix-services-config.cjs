const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newServicesFields = `- name: "services"
    label: "Services"
    folder: "src/content/services"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "title"
    slug: "{{slug}}"
    fields:
      - {label: "Service Title", name: "title", widget: "string"}
      - {label: "URL Slug", name: "slug", widget: "string"}
      - {label: "Short Description", name: "description", widget: "text"}
      - {label: "Full Description", name: "body", widget: "markdown", required: false}
      - {label: "Service Icon", name: "icon", widget: "string", required: false}
      - {label: "Color Theme", name: "color", widget: "string", required: false, default: "neon-cyan"}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Gallery Images", name: "gallery", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false}
      - {label: "Category", name: "category", widget: "string", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Features", name: "features", widget: "list", required: false}
      - {label: "Deliverables", name: "deliverables", widget: "list", required: false}
      - {label: "Software or Technologies Used", name: "tech", widget: "list", fields: [{label: "Name", name: "name", widget: "string"}, {label: "Tooltip", name: "tooltip", widget: "text"}, {label: "Icon Name", name: "iconName", widget: "string"}], required: false}
      - {label: "Estimated Delivery Time", name: "delivery_time", widget: "string", required: false}
      - {label: "Starting Price", name: "price", widget: "string", required: false}
      - {label: "Call-to-Action Button Text", name: "cta_text", widget: "string", required: false}
      - {label: "Call-to-Action Button URL", name: "cta_url", widget: "string", required: false}
      - {label: "Featured Status", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Published or Draft Status", name: "published", widget: "boolean", default: true, required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
      - {label: "SEO Title", name: "seo_title", widget: "string", required: false}
      - {label: "SEO Description", name: "seo_description", widget: "text", required: false}
      - {label: "Open Graph Image", name: "og_image", widget: "image", required: false}
  - name: "portfolio"`;

const regex = /- name:\s*"services"\s*label:\s*"Services"[\s\S]*?- name:\s*"portfolio"/;
if (regex.test(config)) {
  config = config.replace(regex, newServicesFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated services in config.yml");
} else {
  console.log("Could not find services section");
}
