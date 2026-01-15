const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { AzureOpenAI } = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

// Temporary in-memory session history - NOTE: This resets on Vercel function cold starts
//Ideally this should be Redis or a Database for production
const sessions = {};

// Detailed menu data for better AI context
const menuItems = [
    { id: 101, name: "Puzzle Honey Sauced Chicken X French Fries", price: 9000, vendorName: "Item 7 (Go)", description: "Special honey glazed chicken with crispy fries.", image: "/courses/grilled_chicken.png" },
    { id: 102, name: "Jollof Rice & Grilled Chicken", price: 4500, vendorName: "The Place", description: "Classic Nigerian Smokey Jollof with grilled chicken.", image: "/courses/jollof_rice.png" },
    { id: 103, name: "Special Fried Rice", price: 5200, vendorName: "Green Pepper", description: "Loaded with fresh veggies, shrimp and liver.", image: "/courses/jollof_rice.png" },
    { id: 104, name: "Refuel Meal", price: 3500, vendorName: "Chicken Republic", description: "Rice, Spaghetti or Chips with Chicken.", image: "/courses/grilled_chicken.png" },
    { id: 105, name: "Pepperoni Feast", price: 7500, vendorName: "Dominos Pizza", description: "Pepperoni, cheese, and tomato sauce.", image: "/courses/pizza_pepperoni.png" },
    { id: 106, name: "Chocolate Devotion", price: 4000, vendorName: "Cold Stone", description: "Chocolate ice cream with fudge and chips.", image: "/courses/ice_cream.png" },
    { id: 107, name: "Meat Pie", price: 1200, vendorName: "Eric Kayser", description: "Flaky pastry filled with seasoned minced meat.", image: "/courses/meat_pie.png" },
    { id: 108, name: "Seafood Platter", price: 18000, vendorName: "Ocean Basket", description: "Fish, calamari, prawns and mussels.", image: "/courses/seafood_platter.png" },
    { id: 109, name: "Asun (Spicy Goat Meat)", price: 4500, vendorName: "Mega Chicken", description: "Spicy roasted goat meat chopped into bite-sized pieces.", image: "/courses/asun_goat.png" },
    { id: 110, name: "Chicken Club Sandwich", price: 4000, vendorName: "The Place", description: "Three layers of toast, chicken, lettuce, tomato and egg.", image: "/courses/club_sandwich.png" },
    { id: 111, name: "Chicken & Chips", price: 3500, vendorName: "Chicken Republic", description: "Crispy fried chicken with french fries.", image: "/courses/chicken_chips.png" },
    { id: 112, name: "Prawn Pasta", price: 8500, vendorName: "Ocean Basket", description: "Creamy pasta with fresh prawns.", image: "/courses/pasta.png" },
    { id: 113, name: "Croissant", price: 2500, vendorName: "Eric Kayser", description: "Buttery, flaky french pastry.", image: "/courses/croissant.png" },
    { id: 114, name: "Egusi Soup & Pounded Yam", price: 5500, vendorName: "The Place", description: "Rich melon seed soup with pounded yam.", image: "/courses/egusi_soup.png" },
    { id: 115, name: "Grilled Catfish", price: 9000, vendorName: "Mega Chicken", description: "Whole grilled catfish with spicy sauce.", image: "/courses/catfish.png" },
];

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

let client;
if (apiKey && endpoint && deployment) {
    client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
}

const systemPrompt = `You are Chowpal, the official AI food assistant for Chowdeck in Lagos, Nigeria.

**DATA SOURCE:**
You have access to the following MENU ITEMS from top Lagos restaurants (The Place, Mega Chicken, Ocean Basket, etc.):
${JSON.stringify(menuItems)}

**CORE INSTRUCTIONS:**
1. **Food Recommendations**:
    - Suggest items explicitly from the MENU ITEMS list above.
    - If suggesting specific items, you MUST append a JSON array of their IDs at the VERY end of your response like this: \` ||| [102, 114]\`
    - Do not invent items. If you can't find a perfect match, suggest the closest option or ask for clarification.

2. **Meal Planning**:
    - If asked for a "Weekly Meal Plan", provide a CONCISE plan (Mon-Fri).
    - Format: "**Day**: Lunch Item, Dinner Item".
    - KEEP IT SHORT to avoid timeouts.
    - Example:
      **Mon**: Jollof Rice (Lunch), Meat Pie (Dinner)
    - Append recommended item IDs at the end.

3. **Topic Restrictions**:
    - You ONLY discuss food, drinks, dining, and Chowdeck ordering.
    - Politely refuse off-topic questions (e.g., "I'm just a food foodie! Ask me about Jollof instead.").

4. **Tone**: 
    - Friendly, helpful, Nigerian-aware (knows what Egusi, Asun, etc. are).
    - Concise but descriptive.

**RESPONSE FORMAT REMINDER:**
[Your helpful text response with markdown formatting] ||| [Array of Item IDs]
`;

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history = [], sessionId = 'default' } = req.body;

        if (!client) {
            return res.status(200).json({ text: "I'm having trouble confirming my identity (API Key missing). I can't chat right now, but you can still order items!" });
        }

        console.log(`[INFO] Processing message: "${message.substring(0, 50)}..."`);

        const messages = [
            { role: "system", content: systemPrompt }
        ];

        const relevantHistory = history.slice(-10);
        relevantHistory.forEach(h => {
            messages.push({ role: h.sender === 'user' ? 'user' : 'assistant', content: h.text });
        });

        messages.push({ role: "user", content: message });

        const MAX_RETRIES = 3;
        let lastError = null;

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            try {
                const result = await client.chat.completions.create({
                    messages: messages,
                    model: deployment,
                    max_tokens: 800
                });

                const text = result.choices[0].message.content;
                const parts = text.split('|||');
                const displayText = parts[0].trim();
                let recommendedItems = [];

                if (parts.length > 1) {
                    try {
                        const ids = JSON.parse(parts[1].trim());
                        recommendedItems = menuItems.filter(item => ids.includes(item.id));
                    } catch (e) {
                        console.warn("Failed to parse JSON IDs from AI response");
                    }
                }

                if (!sessions[sessionId]) sessions[sessionId] = [];
                const newEntryUser = { id: Date.now(), text: message, sender: 'user', timestamp: new Date() };
                const newEntryAi = { id: Date.now() + 1, text: displayText, sender: 'ai', timestamp: new Date(), cards: recommendedItems };

                sessions[sessionId].push(newEntryUser);
                sessions[sessionId].push(newEntryAi);

                return res.json({ text: displayText, cards: recommendedItems });

            } catch (retryError) {
                lastError = retryError;
                const isRateLimit = retryError.status === 429;

                if (isRateLimit && attempt < MAX_RETRIES - 1) {
                    const waitTime = (attempt + 1) * 2000;
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                } else if (!isRateLimit) {
                    throw retryError;
                }
            }
        }
        throw lastError;

    } catch (error) {
        console.error("[ERROR] Chat endpoint failed:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        const isRateLimit = error.status === 429;
        if (isRateLimit) {
            res.json({ text: "I'm getting a lot of questions! Give me a second.", cards: menuItems.slice(0, 3) });
        } else {
            res.json({ text: "Brain freeze! Check out the menu below.", cards: [] });
        }
    }
});

app.get('/api/history', (req, res) => {
    const { sessionId = 'default' } = req.query;
    const history = sessions[sessionId] || [];
    res.json(history);
});

app.post('/api/session/new', (req, res) => {
    const { sessionId = 'default' } = req.body;
    sessions[sessionId] = [];
    res.json({ success: true, message: "Started new conversation" });
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    // Check if port is already in use logic or just listen
    // Actually, Vercel just imports 'app'. We export it. 
    // If running with `node api/index.js`, we want it to listen.
    // But `npm run dev` in Vite handles frontend.
    // For local backend testing:
    if (require.main === module) {
        app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
    }
}

module.exports = app;
