const fs = require('fs');

const data = {
  categories: [
    {
      id: "classic-veg-rolls",
      name: "Classic Veg Rolls",
      items: [
        { name: "Aaloo Roll", beta: 49, baap: 69 },
        { name: "Veggie Roll", beta: 79, baap: 109 },
        { name: "Veggie Korma Roll", beta: 99, baap: 129 },
        { name: "Masala Corn Roll", beta: 99, baap: 129 },
        { name: "Jalapeno Corn Roll", beta: 109, baap: 139 },
        { name: "Hara Bhara Kebab Roll", beta: 159, baap: 189 },
        { name: "Veg Seekh Kebab Roll", beta: 179, baap: 209 }
      ].map(parseVariations)
    },
    {
      id: "soya-veg-rolls",
      name: "Soya Veg Rolls",
      items: [
        { name: "Masala Soya Chaap Roll", beta: 139, baap: 169 },
        { name: "Tandoori Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Achari Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Korma Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Malai Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Makhani Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Butter Soya Chaap Roll", beta: 149, baap: 179 },
        { name: "Afghani Soya Chaap Roll", beta: 149, baap: 179 }
      ].map(parseVariations)
    },
    {
      id: "paneer-veg-rolls",
      name: "Paneer Veg Rolls",
      items: [
        { name: "Paneer Roll", beta: 169, baap: 209 },
        { name: "Paneer Bhurji Roll", beta: 179, baap: 219 },
        { name: "Tandoori Paneer Roll", beta: 189, baap: 229 },
        { name: "Malai Paneer Roll", beta: 189, baap: 229 },
        { name: "Achari Paneer Roll", beta: 189, baap: 229 },
        { name: "Makhani Paneer Roll", beta: 189, baap: 229 },
        { name: "Afghani Paneer Roll", beta: 189, baap: 229 },
        { name: "Korma Paneer Roll", beta: 189, baap: 229 },
        { name: "Butter Paneer Roll", beta: 189, baap: 229 },
        { name: "Schezwan Paneer Roll", beta: 189, baap: 229 },
        { name: "Paneer Shawarma Roll", beta: 189, baap: 229 },
        { name: "Chilly Garlic Paneer Roll", beta: 199, baap: 239 }
      ].map(parseVariations)
    },
    {
      id: "non-veg-rolls",
      name: "Non-Veg Rolls",
      items: [
        { name: "Classic Chicken Roll", beta: 169, baap: 209 },
        { name: "Chicken Shawarma Roll", beta: 179, baap: 219 },
        { name: "Bhuna Chicken Roll", beta: 179, baap: 219 },
        { name: "Chicken Tandoori Roll", beta: 189, baap: 229 },
        { name: "Chicken Korma Roll", beta: 189, baap: 229 },
        { name: "Malai Chicken Roll", beta: 189, baap: 229 },
        { name: "Achari Chicken Roll", beta: 189, baap: 229 },
        { name: "Makhani Chicken Roll", beta: 189, baap: 229 },
        { name: "Afghani Chicken Roll", beta: 199, baap: 239 },
        { name: "Butter Chicken Roll", beta: 199, baap: 239 },
        { name: "Schezwan Chicken Roll", beta: 189, baap: 229 },
        { name: "Chilli Garlic Chicken Roll", beta: 199, baap: 239 },
        { name: "Chicken Seekh Roll", beta: 159, baap: 199 },
        { name: "Mutton Seekh Roll", beta: 189, baap: 229 }
      ].map(parseVariations)
    },
    {
      id: "special-shawarma-rolls",
      name: "Special Shawarma Rolls",
      items: [
        { id: "ssr-1", name: "Doner Chicken Shawarma", price: 149, description: "NEW!!" },
        { id: "ssr-2", name: "Doner Paneer Shawarma", price: 129, description: "NEW!!" }
      ]
    },
    {
      id: "egg-rolls",
      name: "Egg Rolls",
      items: [
        { id: "er-1", name: "Egg Roll", variations: [{ name: "Double Egg", price: 69 }, { name: "Triple Egg", price: 89 }] },
        { id: "er-2", name: "Egg Makhani Roll", variations: [{ name: "Double Egg", price: 89 }, { name: "Triple Egg", price: 109 }] }
      ]
    },
    {
      id: "momos",
      name: "Momos (Classic Steam)",
      items: [
        { id: "m-1", name: "Veg Momo (6 pcs)", price: 79, description: "Classic Steam" },
        { id: "m-2", name: "Soya Veg Momo (6 pcs)", price: 89, description: "Classic Steam" },
        { id: "m-3", name: "Paneer Momo (6 pcs)", price: 119, description: "Classic Steam" },
        { id: "m-4", name: "Chicken Momo (6 pcs)", price: 119, description: "Classic Steam" }
      ]
    },
    {
      id: "fries",
      name: "Fries",
      items: [
        { id: "f-1", name: "Classic Fries", price: 89, description: "" },
        { id: "f-2", name: "Peri Peri Fries", price: 99, description: "" },
        { id: "f-3", name: "Herby Potato Wedges", price: 99, description: "" }
      ]
    },
    {
      id: "biryani",
      name: "Biryani",
      items: [
        { id: "b-1", name: "Veg Biryani (450gm)", price: 239, description: "" },
        { id: "b-2", name: "Chaap Biryani (450gm)", price: 249, description: "" },
        { id: "b-3", name: "Chicken Biryani (480gm)", price: 259, description: "" }
      ]
    },
    {
      id: "desserts",
      name: "Desserts",
      items: [
        { id: "d-1", name: "Choco Lava Cake", price: 99, description: "" },
        { id: "d-2", name: "Classic Nut Brownie", price: 99, description: "" }
      ]
    },
    {
      id: "beverages",
      name: "Beverages",
      items: [
        { id: "bev-1", name: "Aam Panna", price: 79, description: "" },
        { id: "bev-2", name: "Masala Lemonade", price: 79, description: "" },
        { id: "bev-3", name: "Peach Iced Tea", price: 79, description: "" },
        { id: "bev-4", name: "Lemon Iced Tea", price: 79, description: "" },
        { id: "bev-5", name: "Pulse Candy Chatkara", price: 79, description: "" },
        { id: "bev-6", name: "Spicy Chilli Guava", price: 79, description: "" },
        { id: "bev-7", name: "Classic Cold Coffee", price: 99, description: "" },
        { id: "bev-8", name: "Mocha Cold Coffee", price: 109, description: "" },
        { id: "bev-9", name: "Hazelnut Cold Coffee", price: 109, description: "" }
      ]
    },
    {
      id: "add-ons",
      name: "Add-Ons & Dressings",
      items: [
        { id: "add-1", name: "Extra Peri Peri Masala", price: 10, description: "Add-on" },
        { id: "add-2", name: "Amul Butter", price: 10, description: "Add-on" },
        { id: "add-3", name: "Mint Chutney", price: 10, description: "Add-on" },
        { id: "add-4", name: "Wheat Paratha", price: 29, description: "Add-on" },
        { id: "add-5", name: "Extra Egg", price: 20, description: "Add-on" },
        { id: "add-6", name: "Tandoori Delight Dressing", price: 19, description: "Dressing" },
        { id: "add-7", name: "Mayonnaise", price: 19, description: "Dressing" },
        { id: "add-8", name: "Jalapeno Mayonnaise", price: 19, description: "Dressing" }
      ]
    }
  ]
};

function parseVariations(item, index) {
  const prefix = item.name.split(' ').map(w => w[0].toLowerCase()).join('');
  return {
    id: `${prefix}-${index}`,
    name: item.name,
    variations: [
      { name: "Beta (Single)", price: item.beta },
      { name: "Baap (Double)", price: item.baap }
    ]
  };
}

fs.writeFileSync('C:/Users/siddh/OneDrive/Desktop/Rudrapur menu/src/data/menu.json', JSON.stringify(data, null, 2));
console.log("Done");
