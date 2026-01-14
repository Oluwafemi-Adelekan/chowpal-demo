// Comprehensive mock data for Chowpal demo
export const vendors = [
    {
        id: 1,
        name: "Green Pepper",
        image: "/courses/jollof_rice.png",
        rating: "4.8",
        deliveryTime: "20-30m",
        categories: ["Chinese", "Rice"],
        location: "Lekki Phase 1"
    },
    {
        id: 2,
        name: "Item 7 (Go)",
        image: "/courses/grilled_chicken.png",
        rating: "4.5",
        deliveryTime: "30-45m",
        categories: ["Grill", "Rice"],
        location: "Surulere"
    },
    {
        id: 3,
        name: "Cold Stone",
        image: "/courses/ice_cream.png",
        rating: "4.9",
        deliveryTime: "15-25m",
        categories: ["Ice Cream", "Dessert"],
        location: "Victoria Island"
    },
    {
        id: 4,
        name: "Chicken Republic",
        image: "/courses/grilled_chicken.png",
        rating: "4.2",
        deliveryTime: "25-35m",
        categories: ["Fast Food", "Chicken"],
        location: "Yaba"
    },
    {
        id: 5,
        name: "The Place",
        image: "/courses/jollof_rice.png",
        rating: "4.4",
        deliveryTime: "35-50m",
        categories: ["Nigerian", "Continental"],
        location: "Ikeja"
    },
    {
        id: 6,
        name: "Mega Chicken",
        image: "/courses/chicken_chips.png",
        rating: "4.3",
        deliveryTime: "40-50m",
        categories: ["Fast Food", "Local"],
        location: "Lekki"
    },
    {
        id: 7,
        name: "Ocean Basket",
        image: "/courses/seafood_platter.png",
        rating: "4.7",
        deliveryTime: "45-60m",
        categories: ["Seafood", "Sushi"],
        location: "Victoria Island"
    },
    {
        id: 8,
        name: "Eric Kayser",
        image: "/courses/croissant.png",
        rating: "4.6",
        deliveryTime: "20-40m",
        categories: ["Pastries", "French"],
        location: "Ikoyi"
    }
];

export const sections = [
    { title: "Your Favourites", vendors: [vendors[0], vendors[3], vendors[2]] },
    { title: "Recommended for you", vendors: [vendors[4], vendors[6], vendors[1], vendors[7]] },
    { title: "Popular in Lagos", vendors: [vendors[5], vendors[0], vendors[2], vendors[4]] },
    { title: "Fastest Delivery", vendors: [vendors[2], vendors[0], vendors[3], vendors[7]] }
];

export const categories = [
    { name: "Rice", image: "/courses/jollof_rice.png" },
    { name: "Pasta", image: "/courses/pasta.png" },
    { name: "Fast Food", image: "/courses/burger.png" },
    { name: "Seafood", image: "/courses/seafood_platter.png" },
    { name: "Healthy", image: "/courses/grilled_chicken.png" },
];

// Expanded menu items matching the vendors
export const menuItems = [
    { id: 101, name: "Puzzle Honey Sauced Chicken X French Fries", price: 9000, vendorName: "Item 7 (Go)", description: "Special honey glazed chicken with crispy fries.", image: "/courses/grilled_chicken.png", type: "Main" },
    { id: 102, name: "Jollof Rice & Grilled Chicken", price: 4500, vendorName: "The Place", description: "Classic Nigerian Smokey Jollof with grilled chicken.", image: "/courses/jollof_rice.png", type: "Main" },
    { id: 103, name: "Special Fried Rice", price: 5200, vendorName: "Green Pepper", description: "Loaded with fresh veggies, shrimp and liver.", image: "/courses/jollof_rice.png", type: "Main" },
    { id: 104, name: "Refuel Meal", price: 3500, vendorName: "Chicken Republic", description: "Rice, Spaghetti or Chips with Chicken.", image: "/courses/grilled_chicken.png", type: "Main" },
    { id: 105, name: "Pepperoni Feast", price: 7500, vendorName: "Dominos Pizza", description: "Pepperoni, cheese, and tomato sauce.", image: "/courses/pizza_pepperoni.png", type: "Main" },
    { id: 106, name: "Chocolate Devotion", price: 4000, vendorName: "Cold Stone", description: "Chocolate ice cream with fudge and chips.", image: "/courses/ice_cream.png", type: "Dessert" },
    { id: 107, name: "Meat Pie", price: 1200, vendorName: "Eric Kayser", description: "Flaky pastry filled with seasoned minced meat.", image: "/courses/meat_pie.png", type: "Snack" },
    { id: 108, name: "Seafood Platter", price: 18000, vendorName: "Ocean Basket", description: "Fish, calamari, prawns and mussels.", image: "/courses/seafood_platter.png", type: "Main" },
    { id: 109, name: "Asun (Spicy Goat Meat)", price: 4500, vendorName: "Mega Chicken", description: "Spicy roasted goat meat chopped into bite-sized pieces.", image: "/courses/asun_goat.png", type: "Side" },
    { id: 110, name: "Chicken Club Sandwich", price: 4000, vendorName: "The Place", description: "Three layers of toast, chicken, lettuce, tomato and egg.", image: "/courses/club_sandwich.png", type: "Main" },
    { id: 111, name: "Chicken & Chips", price: 3500, vendorName: "Chicken Republic", description: "Crispy fried chicken with french fries.", image: "/courses/chicken_chips.png", type: "Main" },
    { id: 112, name: "Prawn Pasta", price: 8500, vendorName: "Ocean Basket", description: "Creamy pasta with fresh prawns.", image: "/courses/pasta.png", type: "Main" },
    { id: 113, name: "Croissant", price: 2500, vendorName: "Eric Kayser", description: "Buttery, flaky french pastry.", image: "/courses/croissant.png", type: "Snack" },
    { id: 114, name: "Egusi Soup & Pounded Yam", price: 5500, vendorName: "The Place", description: "Rich melon seed soup with pounded yam.", image: "/courses/egusi_soup.png", type: "Main" },
    { id: 115, name: "Grilled Catfish", price: 9000, vendorName: "Mega Chicken", description: "Whole grilled catfish with spicy sauce.", image: "/courses/catfish.png", type: "Main" },
];
