const fs = require('fs');

const aboutPath = 'src/content/pages/about.json';
let about = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));

// Migrate existing data into new structure
about.company_info = {
  name: "Lizzdo",
  tagline: about.company?.subtitle || "Pioneering the future of digital experiences",
  short_desc: about.story ? String(about.story).substring(0, 100) + "..." : "We specialize in bringing ambitious ideas to life across web, mobile, and 3D platforms.",
  full_story: about.story || "",
  logo: "",
  image: about.company?.image || "",
  location: "Peshawar, Pakistan",
  email: "hello@lizzdo.com",
  phone: "+92 3XX XXXXXXX",
  website: "https://lizzdo.com",
  founded_year: "2020"
};

about.mission_section = {
  title: "OUR PURPOSE",
  heading: "Our Mission",
  description: about.mission || "Our mission is to empower creators and businesses.",
  image: ""
};

about.vision_section = {
  title: "OUR FUTURE",
  heading: "Our Vision",
  description: about.vision || "To be the globally recognized standard.",
  image: ""
};

about.story_section = {
  heading: "CRAFTING REALITY",
  content: about.story || "Founded with a vision to bridge the gap between creative artistry and technical excellence...",
  images: [],
  milestones: [
    {milestone: "2020", desc: "Founded in Peshawar"},
    {milestone: "2022", desc: "Expanded to 3D services"}
  ],
  supporting_text: "We are passionate about design and technology."
};

fs.writeFileSync(aboutPath, JSON.stringify(about, null, 2));
console.log("Updated about.json");

// Now check team files
const teamDir = 'src/content/team';
const teamFiles = fs.readdirSync(teamDir).filter(f => f.endsWith('.json'));

for (const file of teamFiles) {
  const filePath = `${teamDir}/${file}`;
  let teamMember = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (teamMember.active === undefined) {
    teamMember.active = true;
  }
  
  if (teamMember.socials && Array.isArray(teamMember.socials)) {
    for (const social of teamMember.socials) {
      const platform = social.platform ? social.platform.toLowerCase() : '';
      const icon = social.icon ? social.icon.toLowerCase() : '';
      const url = social.url;
      
      if (platform.includes('linkedin') || icon.includes('linkedin')) teamMember.linkedin = url;
      else if (platform.includes('github') || icon.includes('github')) teamMember.github = url;
      else if (platform.includes('instagram') || icon.includes('instagram')) teamMember.instagram = url;
      else if (platform.includes('mail') || icon.includes('mail')) teamMember.email = url;
      else if (platform.includes('globe') || icon.includes('globe') || platform.includes('website')) teamMember.website = url;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(teamMember, null, 2));
}

console.log("Updated team files");

