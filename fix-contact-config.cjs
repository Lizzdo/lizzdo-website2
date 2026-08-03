const fs = require('fs');
let config = fs.readFileSync('public/admin/config.yml', 'utf8');

const regexContact = /- file: "src\/content\/pages\/contact\.json"\s*label: "Contact Page"\s*name: "contact"\s*fields:[\s\S]*?(?=\s*- name: "settings")/g;

const newContactFields = `- file: "src/content/pages/contact.json"
        label: "Contact Page"
        name: "contact"
        fields:
          - {label: "Contact Page Heading", name: "headline", widget: "string"}
          - {label: "Contact Description", name: "subtitle", widget: "text"}
          - {label: "Company Name", name: "companyName", widget: "string", required: false}
          - {label: "Contact Email", name: "email", widget: "string", required: false}
          - {label: "Phone Number", name: "phone", widget: "string", required: false}
          - {label: "WhatsApp Number", name: "whatsapp", widget: "string", required: false}
          - {label: "Office Address", name: "location", widget: "text", required: false}
          - {label: "Google Maps Embed URL", name: "googleMapsUrl", widget: "string", required: false}
          - {label: "Business Hours", name: "hours", widget: "text", required: false}
          - {label: "Contact Form Title", name: "formTitle", widget: "string", required: false}
          - {label: "Contact Form Description", name: "formDescription", widget: "text", required: false}
          - {label: "Socials", name: "socials", widget: "list", fields: [{label: "Name", name: "name", widget: "string"}, {label: "URL", name: "url", widget: "string"}, {label: "Icon", name: "icon", widget: "string"}], required: false}`;

config = config.replace(regexContact, newContactFields);

const regexGlobal = /- name: "settings"\s*label: "Global Settings"\s*files:\s*- file: "src\/content\/settings\/global\.json"\s*label: "Global Settings"\s*name: "global"\s*fields:[\s\S]*?(?=\n\s*$)/g;

const newGlobalFields = `- name: "settings"
    label: "Global Settings"
    files:
      - file: "src/content/settings/global.json"
        label: "Global Settings"
        name: "global"
        fields:
          - {label: "Website Name", name: "site_name", widget: "string"}
          - {label: "Website Tagline", name: "tagline", widget: "string", required: false}
          - {label: "Company Name", name: "company_name", widget: "string", required: false}
          - {label: "Company Description", name: "company_info", widget: "text", required: false}
          - {label: "Logo", name: "logo", widget: "image", required: false}
          - {label: "Favicon", name: "favicon", widget: "image", required: false}
          - {label: "Default SEO Title", name: "default_title", widget: "string", required: false}
          - {label: "Default SEO Description", name: "default_description", widget: "text", required: false}
          - {label: "Default Open Graph Image", name: "default_og_image", widget: "image", required: false}
          - {label: "Copyright Text", name: "copyright", widget: "string", required: false}
          - {label: "Footer Text", name: "footer_text", widget: "text", required: false}
          - {label: "Navigation Menu", name: "nav", widget: "list", fields: [
              {label: "Label", name: "label", widget: "string"},
              {label: "URL", name: "url", widget: "string"}
            ]}
          - {label: "Footer Menu", name: "footer_nav", widget: "list", fields: [
              {label: "Label", name: "label", widget: "string"},
              {label: "URL", name: "url", widget: "string"}
            ], required: false}
          - {label: "Social Media Links", name: "social", widget: "list", fields: [
              {label: "Platform", name: "platform", widget: "string"},
              {label: "Icon", name: "icon", widget: "string"},
              {label: "URL", name: "url", widget: "string"}
            ], required: false}
          - {label: "Google Analytics ID", name: "ga_id", widget: "string", required: false}
          - {label: "Google Tag Manager ID", name: "gtm_id", widget: "string", required: false}`;

if (regexGlobal.test(config)) {
  console.log("matched global");
  config = config.replace(regexGlobal, newGlobalFields);
} else {
  // If no match found, append the new settings if settings is not found or replace what we have
  const backupRegex = /- name: "settings"[\s\S]*/;
  if (backupRegex.test(config)) {
    config = config.replace(backupRegex, newGlobalFields);
  }
}

fs.writeFileSync('public/admin/config.yml', config);
console.log("Updated config.yml");
