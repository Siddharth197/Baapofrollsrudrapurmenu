const fs = require('fs');
const path = require('path');

const menuPath = 'C:/Users/siddh/OneDrive/Desktop/Rudrapur menu/src/data/menu.json';
const data = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

// Slugify function
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Map over all categories and items
data.categories = data.categories.map(cat => {
  cat.items = cat.items.map(item => {
    // Generate the image URL based on the item's name
    const slug = slugify(item.name);
    return {
      ...item,
      image: `/images/${slug}.jpg`
    };
  });
  return cat;
});

fs.writeFileSync(menuPath, JSON.stringify(data, null, 2));
console.log("menu.json successfully updated with dynamic image links!");
