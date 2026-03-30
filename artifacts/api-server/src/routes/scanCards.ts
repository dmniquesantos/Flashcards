import { Router } from "express";
import { GoogleGenAI } from "@google/genai";

const router = Router();

router.post("/scan-cards", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body as {
      imageBase64: string;
      mimeType: string;
    };

    if (!imageBase64) {
      res.status(400).json({ error: "imageBase64 é obrigatório" });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey: process.env["AI_INTEGRATIONS_GEMINI_API_KEY"] ?? "",
      httpOptions: {
        baseUrl: process.env["AI_INTEGRATIONS_GEMINI_BASE_URL"],
      },
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: mimeType ?? "image/jpeg",
                data: imageBase64,
              },
            },
            {
              text: `Analise esta imagem e extraia pares de perguntas e respostas para flashcards de estudo.

Retorne APENAS um JSON válido com o seguinte formato, sem texto extra:
{
  "cards": [
    { "question": "pergunta aqui", "answer": "resposta aqui" }
  ]
}

Regras:
- Extraia todas as perguntas e respostas visíveis
- Se for uma lista de conteúdo, crie perguntas relevantes a partir dele
- Seja objetivo e direto
- Mínimo 1 card, máximo 20 cards`,
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        maxOutputTokens: 8192,
      },
    });

    const text = response.text ?? "{}";
    let data: { cards: { question: string; answer: string }[] };

    try {
      data = JSON.parse(text);
    } catch {
      data = { cards: [] };
    }

    res.json(data);
  } catch (err) {
    console.error("scan-cards error:", err);
    res.status(500).json({ error: "Erro ao processar imagem" });
  }
});

export default router;
