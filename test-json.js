import fs from 'fs';
const obj = JSON.parse(fs.readFileSync('src/content/store/sci-fi-modular-corridors.json'));
console.log(obj.title);
