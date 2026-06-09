const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

const generateSummary = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ message: "Transcript missing" });
        }

       const prompt = 
`You are a professional meeting assistant.

Convert the transcript into a CLEAN, PROFESSIONAL meeting report.

FORMAT STRICTLY LIKE THIS:


 MEETING SUMMARY:
 ━━━━━━━━━━━━━━━━━━

• Write a short professional summary (2-3 lines max)


 KEY DISCUSSIONS:
 ━━━━━━━━━━━━━━━━━━

• Use bullet points
• Only important points


 DECISIONS MADE:
 ━━━━━━━━━━━━━━━━━━

• Clearly mention decisions (if none, write "No formal decisions were made")


 ACTION ITEMS:
 ━━━━━━━━━━━━━━━━━━

• Task + owner (if not available, mention "Not assigned")

RULES:
- Do NOT repeat same sentences
- Do NOT write casual conversation
- Make it formal and professional
- Keep it concise

transcript:
${text}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();

        res.json({ summary });
        console.log("gemini:", process.env.GEMINI_API_KEY);

    } catch (error) {
        console.log("Gemini error", error);
        res.status(500).json({ message: error.message,
            stack: error.stack
         });
    }
};

module.exports = { generateSummary };