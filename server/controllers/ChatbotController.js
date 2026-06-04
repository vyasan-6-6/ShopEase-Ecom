const BaseController = require("./BaseController");
const { ErrorFactory } = require("../utils/errors");
const { ChatbotService } = require("../services");

class ChatbotController extends BaseController {
    // POST /api/chatbot
    static askAI = BaseController.asyncHandler(async (req, res) => {
        const { message } = req.body;

        if (!message || !message.trim()) {
            throw ErrorFactory.badRequest("Message is required");
        }

        const reply = await ChatbotService.getAIResponse(message);

        BaseController.logAction("CHATBOT_AI_QUERY", req.user || { id: "GUEST" }, { messageLength: message.length });
        BaseController.sendSuccess(res, "AI response generated successfully", { reply }, 200);
    });
}

module.exports = ChatbotController;
