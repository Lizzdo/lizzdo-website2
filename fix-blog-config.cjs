const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newBlogFields = `- name: "blog"
    label: "Blog Posts"
    folder: "src/content/blog"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "title"
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Slug", name: "slug", widget: "string"}
      - {label: "Featured Image", name: "thumbnail", widget: "image", required: false}
      - {label: "Gallery Images", name: "gallery", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false}
      - {label: "Author", name: "author", widget: "string", required: false}
      - {label: "Author Photo", name: "author_photo", widget: "image", required: false}
      - {label: "Publish Date", name: "date", widget: "datetime"}
      - {label: "Last Updated", name: "last_updated", widget: "datetime", required: false}
      - {label: "Short Description", name: "description", widget: "text", required: false}
      - {label: "Full Content", name: "body", widget: "markdown", required: false}
      - {label: "Categories", name: "category", widget: "list", required: false}
      - {label: "Tags", name: "tags", widget: "list", required: false}
      - {label: "Featured Post", name: "featured", widget: "boolean", default: false, required: false}
      - {label: "Reading Time", name: "readTime", widget: "string", required: false}
      - {label: "Table of Contents", name: "toc", widget: "boolean", default: false, required: false}
      - {label: "Related Posts", name: "related_posts", widget: "list", required: false}
      - {label: "SEO Title", name: "seo_title", widget: "string", required: false}
      - {label: "SEO Description", name: "seo_description", widget: "text", required: false}
      - {label: "Open Graph Image", name: "og_image", widget: "image", required: false}
      - {label: "Canonical URL", name: "canonical_url", widget: "string", required: false}
      - {label: "Published/Draft Status", name: "published", widget: "boolean", default: true, required: false}
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
  - name: "clients"`;

const regex = /- name:\s*"blog"\s*label:\s*"Blog Posts"[\s\S]*?- name:\s*"clients"/;
if (regex.test(config)) {
  config = config.replace(regex, newBlogFields);
  fs.writeFileSync('public/admin/config.yml', config);
  console.log("Updated blog config in config.yml");
} else {
  console.log("Could not find blog section");
}
