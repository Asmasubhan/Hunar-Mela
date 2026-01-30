import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error('Missing Gemini API key');
}

const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export const generateProductDescription = async (productName, category, material, regionCulture, imageFile = null) => {
  let prompt = `Generate a short artistic description and a cultural background paragraph for a handicraft product.
Product: ${productName}
Category: ${category}
Material: ${material}
Region/Culture: ${regionCulture}

Output format:
Description: [short artistic description]
Background: [cultural background paragraph]`;

  try {
    if (imageFile) {
      // Convert image file to base64
      const imageData = await fileToGenerativePart(imageFile);

      const visionPrompt = `Analyze this handicraft image and provide details about its appearance, style, craftsmanship, and any visible cultural elements. Then generate a description and background based on both the provided information and your analysis of the image.

Product: ${productName}
Category: ${category}
Material: ${material}
Region/Culture: ${regionCulture}

Please provide:
Description: [short artistic description incorporating visual analysis]
Background: [cultural background paragraph]`;

      const result = await model.generateContent([visionPrompt, imageData]);
      const response = result.response.text();

      const lines = response.split('\n');
      const description = lines.find(line => line.startsWith('Description:'))?.replace('Description:', '').trim();
      const background = lines.find(line => line.startsWith('Background:'))?.replace('Background:', '').trim();
      return { description, background };
    } else {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      const lines = response.split('\n');
      const description = lines.find(line => line.startsWith('Description:'))?.replace('Description:', '').trim();
      const background = lines.find(line => line.startsWith('Background:'))?.replace('Background:', '').trim();
      return { description, background };
    }
  } catch (error) {
    console.error('Error generating description:', error);
    return { description: '', background: '' };
  }
};

const fileToGenerativePart = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const getChatbotResponse = async (userMessage) => {
  const prompt = `You are a helpful chatbot for an ecommerce website selling handicrafts and paintings. Answer only website-related questions. If the question is not related to the website, say "I'm sorry, I can only assist with questions about our handicrafts and paintings website."

User question: ${userMessage}`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error getting chatbot response:', error);
    return "I'm sorry, I can't respond right now.";
  }
};