const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newClientsFields = `- name: "clients"
    label: "Clients"
    folder: "src/content/clients"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "title"
    slug: "{{slug}}"
    fields:
      - {label: "Client Name", name: "title", widget: "string"}
      - {label: "Company Logo", name: "clientLogoUrl", widget: "image", required: false}
      - {label: "Cover Image", name: "coverImage", widget: "image", required: false}
      - {label: "Company Website", name: "websiteLink", widget: "string", required: false}
      - {label: "Company Description", name: "description", widget: "text", required: false}
      - {label: "Industry", name: "industry", widget: "string", required: false}
      - {label: "Country", name: "country", widget: "string", required: false}
      - {label: "Project Completed", name: "project", widget: "string", required: false}
      - {label: "Project Category", name: "category", widget: "string", required: false}
      - {label: "Completion Date", name: "completionDate", widget: "string", required: false}
      - {label: "Testimonial", name: "review", widget: "text", required: false}
      - {label: "Client Contact Name", name: "contactName", widget: "string", required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
      - {label: "Featured Client", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Published/Hide", name: "published", widget: "boolean", default: true, required: false}
  - name: "team"`;

const regex = /- name:\s*"clients"\s*label:\s*"Clients"[\s\S]*?- name:\s*"team"/;
if (regex.test(config)) {
  config = config.replace(regex, newClientsFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated clients config in config.yml");
} else {
  console.log("Could not find clients section");
}
