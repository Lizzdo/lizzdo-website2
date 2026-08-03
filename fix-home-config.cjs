const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newHomeFields = `        name: "home"
        fields:
          - {label: "Hero Section", name: "hero", widget: "object", fields: [
              {label: "Headline", name: "headline", widget: "string"},
              {label: "Highlighted Text", name: "highlight", widget: "string", required: false},
              {label: "Subtitle", name: "subtitle", widget: "string", required: false},
              {label: "Description", name: "description", widget: "text", required: false},
              {label: "Primary Button Text", name: "primary_btn", widget: "string"},
              {label: "Primary Button URL", name: "primary_url", widget: "string"},
              {label: "Secondary Button Text", name: "secondary_btn", widget: "string", required: false},
              {label: "Secondary Button URL", name: "secondary_url", widget: "string", required: false},
              {label: "Hero Image or Media", name: "hero_image", widget: "image", required: false}
            ]}
          - {label: "Featured Services Section", name: "featured_services", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Selected Services", name: "services_list", widget: "relation", collection: "services", search_fields: ["title"], value_field: "slug", display_fields: ["title"], multiple: true, required: false},
              {label: "Button Text", name: "btn_text", widget: "string", required: false},
              {label: "Button URL", name: "btn_url", widget: "string", required: false}
            ]}
          - {label: "Featured Portfolio Section", name: "featured_portfolio", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Selected Portfolio", name: "portfolio_list", widget: "relation", collection: "portfolio", search_fields: ["title"], value_field: "slug", display_fields: ["title"], multiple: true, required: false},
              {label: "Button Text", name: "btn_text", widget: "string", required: false},
              {label: "Button URL", name: "btn_url", widget: "string", required: false}
            ]}
          - {label: "Featured Clients Section", name: "featured_clients", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Selected Clients", name: "clients_list", widget: "relation", collection: "clients", search_fields: ["title"], value_field: "slug", display_fields: ["title"], multiple: true, required: false}
            ]}
          - {label: "Statistics", name: "statistics", widget: "list", fields: [
              {label: "Value", name: "value", widget: "string"},
              {label: "Label", name: "label", widget: "string"},
              {label: "Icon", name: "icon", widget: "string", required: false}
            ]}
          - {label: "Testimonials Section", name: "testimonials", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Testimonials List", name: "list", widget: "list", fields: [
                {label: "Client Name", name: "author", widget: "string"},
                {label: "Job Title or Company", name: "role", widget: "string", required: false},
                {label: "Profile Image", name: "thumbnail", widget: "image", required: false},
                {label: "Testimonial Text", name: "quote", widget: "text"},
                {label: "Rating", name: "rating", widget: "number", value_type: "int", min: 1, max: 5, required: false}
              ], required: false}
            ]}
          - {label: "FAQs Section", name: "faqs", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Selected FAQs", name: "faqs_list", widget: "relation", collection: "faq", search_fields: ["question"], value_field: "slug", display_fields: ["question"], multiple: true, required: false},
              {label: "Button Text", name: "btn_text", widget: "string", required: false},
              {label: "Button URL", name: "btn_url", widget: "string", required: false}
            ]}
          - {label: "Featured Blog Section", name: "featured_blog", widget: "object", fields: [
              {label: "Title", name: "title", widget: "string"},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Selected Blogs", name: "blog_list", widget: "relation", collection: "blog", search_fields: ["title"], value_field: "slug", display_fields: ["title"], multiple: true, required: false},
              {label: "Button Text", name: "btn_text", widget: "string", required: false},
              {label: "Button URL", name: "btn_url", widget: "string", required: false}
            ]}
          - {label: "Call to Action", name: "cta", widget: "object", fields: [
              {label: "Headline", name: "headline", widget: "string"},
              {label: "Description", name: "description", widget: "text", required: false},
              {label: "Button Text", name: "btn_text", widget: "string"},
              {label: "Button URL", name: "btn_url", widget: "string"},
              {label: "Background Image", name: "bg_image", widget: "image", required: false}
            ]}
      - file: "src/content/pages/about.json"`;

const regex = /name:\s+"home"\s*fields:\s*-\s*\{label:\s*"Hero Section"[\s\S]*?- file:\s*"src\/content\/pages\/about.json"/;
if (regex.test(config)) {
  console.log("Found home section, replacing...");
  config = config.replace(regex, newHomeFields);
  fs.writeFileSync('public/admin/config.yml', config);
} else {
  console.log("Could not find home section in config.yml. Writing current config to debug.txt");
  fs.writeFileSync('debug.txt', config);
}
