import { Router } from "express";
import auth, { AuthReq } from "../middleware/auth";
import OpenAI from "openai";

const router = Router();
router.use(auth);

router.post("/", async (req: AuthReq, res) => {
  const { message } = req.body;
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const stream = await openai.chat.completions.create({
    model: "o3",
    stream: true,
    messages: [
      { role: "system", content: "You are a combined meal-suggestion and idea-organiser assistant." },
      { role: "user", content: message }
    ]
  });

  res.setHeader("Content-Type", "text/event-stream");
  for await (const chunk of stream) {
    res.write(`data: ${JSON.stringify(chunk.choices[0].delta)}

`);
  }
  res.end();
});

export default router;
