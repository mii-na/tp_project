// バックエンドの処理，AI部分の実装
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Singlish Translator Backend is running!",
  });
});

// /translateのURLにPOSTリクエストが来た時の処理
app.post("/translate", async(req, res) => {
    const {text} = req.body;
    const startTime = Date.now();

    // 入力された文字列を取得して表示
    console.log("Received text:", text);

    // OpenRouterのAIにHTTPリクエストを送る
    try{
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method:"POST",

                // .envに保存したAPIキーを取得
                headers:{
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                },

                body: JSON.stringify({
                    //model: "openrouter/free", // 無料版のモデルを使用
                    model: "poolside/laguna-xs-2.1:free",

                    reasoning:{
                        effort: "minimal" //思考を最小限に
                    },

                    // プロンプト
                    messages:[
                        {
                            role:"user",
                            //content: `Translate the following Singlish into standard English. Singlish: ${text}`,
                            content: `Analyze the input sentence and return ONLY valid JSON.

Tasks:
1. Translate Singlish into natural Standard English.
2. Translate Singlish into natural Japanese.
3. Detect Singapore-specific words or expressions that actually appear in the input.

Detect only:
- Singlish expressions: lah, lor, leh, meh, etc.
- Singapore-related slang: chope, shiok, paiseh, etc.
- Food-related words: makan, kaya toast, laksa, etc.
- Singapore place names: Bugis, Orchard, etc.
- Singapore transportation names: MRT, EZ-Link, etc.
- Singapore organization names: NUS, NTU, etc.

Rules:
- Do NOT detect ordinary English words.
- Do NOT invent words.
- "word" must exactly match the text in the input.
- If no Singapore-specific words are found, return [].
- Preserve Singapore place names in the English translation.
- Remove Singlish particles such as "lah", "lor", "leh", and "meh" from the English translation when they do not affect the meaning.
- Japanese must be a natural translation of the English translation.
- Do not invent information about word origins or cultural background.
- If the origin or cultural background is uncertain, say "Uncertain".

For each detected word, provide:
- meaning
- origin
- cultural background
- example

Return ONLY JSON. No Markdown. No explanations.

JSON format:
{
  "english": "English translation",
  "japanese": "Japanese translation",
  "words": [
    {
      "word": "exact word from input",
      "category": "Singlish | Slang | Food | Place | Transportation | Organization",
      "meaning": "meaning",
      "origin": "origin",
      "culture": "cultural background",
      "example": "example sentence"
    }
  ]
}

Input:
${text}`
                        },
                    ],
                }),
            }
        );

        
        const data = await response.json();
        console.log("OpenRouter response:", data);

        // AIの回答をresultに保存
        const result = data.choices[0].message.content;

        // AIの回答を表示
        console.log("AI response:", result);

        const parsedResult = JSON.parse(result);

        // resに原文と回答を保存
        res.json({
            original: text,
            english: parsedResult.english,
            japanese: parsedResult.japanese,
            words: parsedResult.words,
        });

        const endTime = Date.now();

        console.log(
            "OpenRouter response time:",
            endTime-startTime,
            "ms"
        );

    // エラー処理
    }catch(error){
        console.error("OpenRouter error:", error);

        res.status(500).json({
            error: "Failed to translate",
        });
    }
});

// バックエンドをポート番号3000に展開
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});