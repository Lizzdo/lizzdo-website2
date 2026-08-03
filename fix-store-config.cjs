const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newStoreFields = `- name: "store"
    label: "Store Products"
    folder: "src/content/store"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "title"
    slug: "{{slug}}"
    fields:
      - {label: "Product Name", name: "title", widget: "string"}
      - {label: "URL Slug", name: "slug", widget: "string"}
      - {label: "Short Description", name: "description", widget: "text", required: false}
      - {label: "Full Description", name: "body", widget: "markdown", required: false}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Gallery Images", name: "gallery", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false}
      - {label: "Product Preview Video URL", name: "video", widget: "string", required: false}
      - {label: "Categories", name: "category", widget: "list", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Price", name: "price", widget: "number", value_type: "float", required: false}
      - {label: "Sale Price", name: "sale_price", widget: "number", value_type: "float", required: false}
      - {label: "Product Type", name: "product_type", widget: "string", required: false}
      - {label: "SKU", name: "sku", widget: "string", required: false}
      - {label: "Version", name: "version", widget: "string", required: false}
      - {label: "File Size", name: "file_size", widget: "string", required: false}
      - {label: "File Format", name: "format", widget: "string", required: false}
      - {label: "Compatibility", name: "compatibility", widget: "list", required: false}
      - {label: "System Requirements", name: "requirements", widget: "text", required: false}
      - {label: "Features", name: "features", widget: "list", required: false}
      - {label: "Included Files", name: "included_files", widget: "list", required: false}
      - {label: "Documentation URL", name: "documentation", widget: "string", required: false}
      - {label: "Installation Guide URL", name: "installation", widget: "string", required: false}
      - {label: "Download Demo URL", name: "demo_url", widget: "string", required: false}
      - {label: "External URL", name: "external_url", widget: "string", required: false}
      - {label: "Buy Now URL", name: "buy_url", widget: "string", required: false}
      - {label: "Contact for Customization URL", name: "customization_url", widget: "string", required: false}
      - {label: "SEO Title", name: "seo_title", widget: "string", required: false}
      - {label: "SEO Description", name: "seo_description", widget: "text", required: false}
      - {label: "Open Graph Image", name: "og_image", widget: "image", required: false}
      - {label: "Featured Product", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Published/Hide", name: "published", widget: "boolean", default: true, required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
  - name: "blog"`;

const regex = /- name:\s*"store"\s*label:\s*"Store Products"[\s\S]*?- name:\s*"blog"/;
if (regex.test(config)) {
  config = config.replace(regex, newStoreFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated store config in config.yml");
} else {
  console.log("Could not find store section");
}
