const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newFaqFields = `- name: "faq"
    label: "FAQs"
    folder: "src/content/faq"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "question"
    slug: "{{slug}}"
    fields:
      - {label: "Question", name: "question", widget: "string"}
      - {label: "Answer", name: "answer", widget: "markdown"}
      - {label: "Category", name: "category", widget: "string"}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
      - {label: "Featured FAQ", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Published/Hide", name: "published", widget: "boolean", default: true, required: false}
  - name: "pages"`;

const regex = /- name:\s*"faq"\s*label:\s*"FAQs"[\s\S]*?- name:\s*"pages"/;
if (regex.test(config)) {
  config = config.replace(regex, newFaqFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated faq config in config.yml");
} else {
  console.log("Could not find faq section");
}
