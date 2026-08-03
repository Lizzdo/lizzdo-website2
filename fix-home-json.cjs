const fs = require('fs');

const home = JSON.parse(fs.readFileSync('src/content/pages/home.json', 'utf8'));

// Hero Section
if (home.hero) {
  // Extract highlighted text if not already present
  if (home.hero.headline && !home.hero.highlight) {
    const parts = home.hero.headline.split(' ');
    if (parts.length > 2) {
      home.hero.highlight = parts.slice(-2).join(' ');
      home.hero.headline = parts.slice(0, -2).join(' ');
    }
  }
}

// Testimonials
if (home.testimonials && !home.testimonials.list) {
  // Provide some sample testimonials based on existing content structure if possible, or just defaults
  home.testimonials.list = [
    {
      author: "Jane Doe",
      role: "CEO, TechCorp",
      quote: "Lizzdo completely transformed our digital presence. Their attention to detail is unmatched.",
      rating: 5,
      thumbnail: "https://picsum.photos/seed/t1/300/300"
    },
    {
      author: "John Smith",
      role: "Marketing Director",
      quote: "The 3D experiences they built for our campaign doubled our engagement rate.",
      rating: 5,
      thumbnail: "https://picsum.photos/seed/t2/300/300"
    },
    {
      author: "Alice Johnson",
      role: "Startup Founder",
      quote: "A truly visionary team. They understood our brand immediately.",
      rating: 5,
      thumbnail: "https://picsum.photos/seed/t3/300/300"
    }
  ];
}

fs.writeFileSync('src/content/pages/home.json', JSON.stringify(home, null, 2));
console.log("Updated home.json");
