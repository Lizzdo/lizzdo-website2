const fs = require('fs');

const globalPath = 'src/content/settings/global.json';
if (fs.existsSync(globalPath)) {
  let content = JSON.parse(fs.readFileSync(globalPath, 'utf8'));
  
  if (!content.company_name) content.company_name = "Lizzdo";
  if (!content.tagline) content.tagline = "Creative Studio";
  
  if (content.seo) {
    if (!content.default_title) content.default_title = content.seo.default_title;
    if (!content.default_description) content.default_description = content.seo.default_description;
    if (!content.default_og_image) content.default_og_image = content.seo.default_og_image;
    delete content.seo;
  }
  
  if (!content.footer_nav) {
    content.footer_nav = [
      {"label": "Terms of Service", "url": "/terms"},
      {"label": "Privacy Policy", "url": "/privacy"}
    ];
  }
  
  fs.writeFileSync(globalPath, JSON.stringify(content, null, 2));
  console.log("Updated global.json");
}

const contactPath = 'src/content/pages/contact.json';
if (fs.existsSync(contactPath)) {
  let content = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
  
  if (content.emails && content.emails.length > 0) {
    content.email = content.emails[0];
    delete content.emails;
  }
  
  if (!content.companyName) content.companyName = "Lizzdo Studio";
  if (!content.whatsapp) content.whatsapp = "";
  if (!content.googleMapsUrl) content.googleMapsUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m2!1s0x38d917b90f0e79cf%3A0xa816b2637f8ce5da!2sPeshawar%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1714154425439!5m2!1sen!2s";
  if (!content.formTitle) content.formTitle = "Send us a Message";
  if (!content.formDescription) content.formDescription = "We'll get back to you as soon as possible.";
  
  fs.writeFileSync(contactPath, JSON.stringify(content, null, 2));
  console.log("Updated contact.json");
}
