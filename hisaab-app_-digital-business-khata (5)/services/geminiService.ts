
import { GoogleGenAI, Type } from "@google/genai";
import { Sale, Product, Expense, BulkOffer } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-3-flash-preview";

export async function analyzeScannedProduct(base64Image: string): Promise<{ name: string; category: string; price: number } | null> {
  const prompt = `
    Analyze this image of a retail product. 
    Identify the product name, its general category (e.g., Grocery, Snacks, Dairy, Personal Care), and estimate its typical retail price in Indian Rupees (₹) for a small shop.
    Return the result strictly in JSON format.
  `;

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64Image,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            price: { type: Type.NUMBER }
          },
          required: ["name", "category", "price"]
        }
      }
    });

    const text = response.text;
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error("AI Scan Error:", error);
    return null;
  }
}

export async function getBusinessInsights(sales: Sale[], inventory: Product[], expenses: Expense[]) {
  const prompt = `
    Analyze the following financial data for "Hisaab App" (a small business tracker).
    Currency is Indian Rupees (₹).
    
    Sales Data: ${JSON.stringify(sales.slice(-15))} 
    Recent Expenses: ${JSON.stringify(expenses.slice(-10))}
    Inventory: ${JSON.stringify(inventory)}

    Provide a concise business analysis for the shop owner:
    1. A short summary of profit/loss performance.
    2. Three specific tips to save money on expenses or increase sales.
    3. The overall financial trend (up, down, or stable).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            trend: { type: Type.STRING, enum: ['up', 'down', 'stable'] }
          },
          required: ["summary", "recommendations", "trend"]
        }
      }
    });

    const textOutput = response.text;
    return textOutput ? JSON.parse(textOutput) : null;
  } catch (error) {
    return null;
  }
}

export async function getBulkMarketOffers(category?: string): Promise<BulkOffer[]> {
  const prompt = `
    Generate 5 realistic bulk wholesale offers for a small Indian shopkeeper.
    Focus on food items: Rice, Wheat, Oil, Biscuits, Spices.
    Include: Item Name, Unit (e.g. 50kg Bag), Bulk Price (Wholesale), MRP (Retail), Min Quantity, Category, distance from shop (1km - 5km), and a valid-looking Indian Mobile Number for the seller (starting with 9, 8, or 7).
    Language: English. Output in JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              name: { type: Type.STRING },
              unit: { type: Type.STRING },
              bulkPrice: { type: Type.NUMBER },
              mrp: { type: Type.NUMBER },
              minQty: { type: Type.NUMBER },
              savings: { type: Type.NUMBER },
              category: { type: Type.STRING },
              distance: { type: Type.STRING },
              sellerPhone: { type: Type.STRING }
            },
            required: ["id", "name", "unit", "bulkPrice", "mrp", "minQty", "savings", "category", "distance", "sellerPhone"]
          }
        }
      }
    });
    return response.text ? JSON.parse(response.text) : [];
  } catch (error) {
    return [
      { id: 'm1', name: 'Basmati Rice Premium', unit: '25kg Bag', bulkPrice: 1800, mrp: 2400, minQty: 5, savings: 600, category: 'Grains', distance: '1.2km', sellerPhone: '9812345670' },
      { id: 'm2', name: 'Fortune Mustard Oil', unit: '15L Tin', bulkPrice: 1950, mrp: 2200, minQty: 2, savings: 250, category: 'Oil', distance: '3.5km', sellerPhone: '7044332211' }
    ];
  }
}

export async function getBulkProfitProjection(offer: BulkOffer, qty: number): Promise<string> {
  const prompt = `
    Business Logic: 
    Item: ${offer.name}
    Bulk Buy Price: ₹${offer.bulkPrice}
    Retail MRP: ₹${offer.mrp}
    Quantity: ${qty} units (${offer.unit})

    Tell the shopkeeper in 1 punchy Hinglish sentence how much "shudh munafa" (pure profit) they will make if they sell all ${qty} units at MRP. Mention the total profit figure.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text?.trim() || "Is deal se aapka profit margin double ho jayega!";
  } catch (error) {
    return "Great deal for your inventory!";
  }
}

export async function getRandomBusinessTip() {
  const prompt = `
    Generate one creative, random business growth tip for a small Indian shopkeeper.
    Language: Hinglish. Tone: Encouraging. Max 15 words.
  `;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text?.trim() || "Bikri badhane ke liye items ko sahi se display karein!";
  } catch (error) {
    return "Aaj ki tip: Pending Udhaar ke liye polite reminder bhejein. 📈";
  }
}

export async function getProductAdvice(product: Product, salesCount: number): Promise<string> {
  const prompt = `
    Product: ${product.name}
    Category: ${product.category}
    Price: ₹${product.price}
    Recent Sales Count: ${salesCount}

    Provide a short (max 15 words) and catchy business advice for this specific product in Hinglish.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text?.trim() || "Is product ki sales badhane ke liye displays check karein!";
  } catch (error) {
    return "Tip: Customer feedback lein is product par. 📦";
  }
}
