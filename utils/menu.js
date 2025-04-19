// utils/menu.js
function getMenuForCanteen(slug) {
  switch (slug) {
    case "fet":
      return [
        { name: "Samosa", price: 10 },
        { name: "Noodles", price: 40 },
        { name: "Tea", price: 10 },
      ];
    case "central":
      return [
        { name: "Rice Plate", price: 60 },
        { name: "Dal Makhani", price: 50 },
        { name: "Roti", price: 5 },
      ];
    case "castro":
      return [
        { name: "Pasta", price: 50 },
        { name: "Sandwich", price: 25 },
        { name: "Coffee", price: 20 },
      ];
    case "law":
      return [
        { name: "Idli Sambhar", price: 30 },
        { name: "Dosa", price: 45 },
        { name: "Vada", price: 15 },
      ];
    case "architecture":
      return [
        { name: "Pizza Slice", price: 55 },
        { name: "Cold Coffee", price: 30 },
        { name: "Garlic Bread", price: 25 },
      ];
    default:
      return [];
  }
}

module.exports = { getMenuForCanteen };
