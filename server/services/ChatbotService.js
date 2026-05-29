const config = require("../config/config");
const { ErrorFactory } = require("../utils/errors");

class ChatbotService {
    static async getAIResponse(message) {
        const apiKey = config.OpenAI.API_KEY;

        // Verify configuration
        if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE" || apiKey.trim() === "") {
            throw ErrorFactory.badRequest("OpenAI API is not configured on this server");
        }

        try {
            // Secure connection to OpenAI Chat Completion API
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: "You are a helpful customer support assistant for ShopEase, a premium e-commerce platform. Keep your answers polite, friendly, and very concise (maximum 2-3 sentences). If a user asks about order status, order tracking, returns, or cancellations, politely ask them to use the specialized tracking and FAQ buttons inside this chatbot interface for real-time secure actions."
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errMsg = errorData.error?.message || `OpenAI API returned status ${response.status}`;
                throw ErrorFactory.internal(`OpenAI service error: ${errMsg}`);
            }

            const data = await response.json();
            return data.choices?.[0]?.message?.content || "I am here to help you with ShopEase. What can I do for you today?";

        } catch (error) {
            throw ErrorFactory.internal(`Chatbot service failed: ${error.message}`);
        }
    }
}

module.exports = ChatbotService;
