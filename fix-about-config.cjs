const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const newAboutFields = `      - file: "src/content/pages/about.json"
        label: "About Page"
        name: "about"
        fields:
          - {label: "Company Information", name: "company_info", widget: "object", fields: [
              {label: "Company Name", name: "name", widget: "string", required: false},
              {label: "Company Tagline", name: "tagline", widget: "string", required: false},
              {label: "Short Company Description", name: "short_desc", widget: "text", required: false},
              {label: "Full Company Story", name: "full_story", widget: "text", required: false},
              {label: "Company Logo", name: "logo", widget: "image", required: false},
              {label: "Company Image", name: "image", widget: "image", required: false},
              {label: "Company Location", name: "location", widget: "string", required: false},
              {label: "Company Email", name: "email", widget: "string", required: false},
              {label: "Company Phone Number", name: "phone", widget: "string", required: false},
              {label: "Company Website", name: "website", widget: "string", required: false},
              {label: "Founded Year", name: "founded_year", widget: "string", required: false}
            ]}
          - {label: "Mission Section", name: "mission_section", widget: "object", fields: [
              {label: "Section Title", name: "title", widget: "string", required: false},
              {label: "Mission Heading", name: "heading", widget: "string", required: false},
              {label: "Mission Description", name: "description", widget: "text", required: false},
              {label: "Mission Image or Icon", name: "image", widget: "image", required: false}
            ]}
          - {label: "Vision Section", name: "vision_section", widget: "object", fields: [
              {label: "Section Title", name: "title", widget: "string", required: false},
              {label: "Vision Heading", name: "heading", widget: "string", required: false},
              {label: "Vision Description", name: "description", widget: "text", required: false},
              {label: "Vision Image or Icon", name: "image", widget: "image", required: false}
            ]}
          - {label: "Company Story Section", name: "story_section", widget: "object", fields: [
              {label: "Section Heading", name: "heading", widget: "string", required: false},
              {label: "Full Story Content", name: "content", widget: "markdown", required: false},
              {label: "Images", name: "images", widget: "list", field: {label: "Image", name: "image", widget: "image"}, required: false},
              {label: "Important Milestones", name: "milestones", widget: "list", fields: [{label: "Milestone", name: "milestone", widget: "string"}, {label: "Description", name: "desc", widget: "text"}], required: false},
              {label: "Supporting Text", name: "supporting_text", widget: "text", required: false}
            ]}
          - {label: "Company Timeline", name: "timeline", widget: "list", fields: [
              {label: "Year or Date", name: "year", widget: "string"},
              {label: "Title", name: "title", widget: "string"},
              {label: "Description", name: "description", widget: "text"},
              {label: "Image or Icon", name: "image", widget: "image", required: false},
              {label: "Display Order", name: "order", widget: "number", value_type: "int", required: false, default: 0}
            ]}
          - {label: "Legacy Company Info (Do not remove, for backwards compatibility)", name: "company", widget: "object", fields: [
              {label: "Headline", name: "headline", widget: "string", required: false},
              {label: "Subtitle", name: "subtitle", widget: "text", required: false},
              {label: "Image", name: "image", widget: "image", required: false}
            ], required: false}
          - {label: "Legacy Stats", name: "stats", widget: "list", fields: [{label: "Label", name: "label", widget: "string"}, {label: "Value", name: "value", widget: "string"}], required: false}
          - {label: "Legacy Values", name: "values", widget: "list", fields: [{label: "Title", name: "title", widget: "string"}, {label: "Icon", name: "icon", widget: "string"}, {label: "Description", name: "desc", widget: "text"}], required: false}
          - {label: "Legacy Story", name: "story", widget: "markdown", required: false}
          - {label: "Legacy Mission", name: "mission", widget: "markdown", required: false}
          - {label: "Legacy Vision", name: "vision", widget: "markdown", required: false}
      - file: "src/content/pages/services.json"`;

const aboutRegex = /- file:\s*"src\/content\/pages\/about\.json"[\s\S]*?- file:\s*"src\/content\/pages\/services\.json"/;
if (aboutRegex.test(config)) {
  config = config.replace(aboutRegex, newAboutFields);
} else {
  console.log("Could not find about section");
}

const teamRegex = /- name:\s*"team"\s*label:\s*"Team Members"[\s\S]*?name:\s*"faq"/;
const newTeamFields = `- name: "team"
    label: "Team Members"
    folder: "src/content/team"
    create: true
    extension: "json"
    format: "json"
    identifier_field: "name"
    slug: "{{slug}}"
    fields:
      - {label: "Display Order", name: "order", widget: "number", value_type: "int", default: 0, required: false}
      - {label: "Active Status", name: "active", widget: "boolean", default: true, required: false}
      - {label: "Full Name", name: "name", widget: "string"}
      - {label: "Job Title or Position", name: "role", widget: "string"}
      - {label: "Short Biography", name: "bio", widget: "text"}
      - {label: "Profile Photo", name: "thumbnail", widget: "image", required: false}
      - {label: "Email", name: "email", widget: "string", required: false}
      - {label: "LinkedIn URL", name: "linkedin", widget: "string", required: false}
      - {label: "GitHub URL", name: "github", widget: "string", required: false}
      - {label: "Instagram URL", name: "instagram", widget: "string", required: false}
      - {label: "Website URL", name: "website", widget: "string", required: false}
      - {label: "Legacy Social Links", name: "socials", widget: "list", fields: [{label: "Platform", name: "platform", widget: "string"}, {label: "URL", name: "url", widget: "string"}, {label: "Icon", name: "icon", widget: "string"}], required: false}
  - name: "faq"`;

if (teamRegex.test(config)) {
  config = config.replace(teamRegex, newTeamFields);
} else {
  console.log("Could not find team section");
}

fs.writeFileSync('public/admin/config.yml', config);
console.log("Updated config.yml");
