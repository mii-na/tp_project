// バックエンドの処理
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
                    model: "openrouter/free", // 無料版のモデルを使用

                    // プロンプト
                    messages:[
                        {
                            role:"user",
                            //content: `Translate the following Singlish into standard English. Singlish: ${text}`,
                            content: `Analyze the following sentence and return ONLY valid JSON.

                                        Your tasks are:

                                        1. Translate the Singlish sentence into natural Standard English.
                                        2. Translate the Singlish sentence into natural Japanese.
                                        3. Identify Singapore-specific words, expressions, slang, food names, place names, transportation names, and organization names.
                                        4. For each identified word, explain its meaning, origin, cultural background, and provide an example sentence.

                                        Important rules:

                                        - Do not identify ordinary English words as Singapore-specific words.
                                        - Keep proper nouns such as Singapore place names when appropriate.
                                        - "lah", "lor", "leh", and "meh" should be considered Singlish expressions.
                                        - Words such as "makan", "chope", "shiok", and "paiseh" should be considered Singapore-related expressions when appropriate.
                                        - Do not invent words that are not present in the input.
                                        - If there are no Singapore-specific words, return an empty words array.
                                        - The "word" field must contain the exact word or expression found in the input.
                                        - Return ONLY JSON. Do not include Markdown, explanations, or code fences.

                                        Translation rules:

                                        - Translate the sentence into natural Standard English.
                                        - Do not preserve Singlish particles such as "lah", "lor", "leh", or "meh" in the English translation unless necessary for meaning.
                                        - Preserve proper nouns such as "Bugis", "Orchard", and "Singapore" exactly as they appear.
                                        - Do not transliterate or modify Singapore place names.
                                        - Translate the Japanese sentence naturally.
                                        - Preserve proper nouns in their original form or use their standard Japanese representation when appropriate.
                                        - Do not invent information about the origin or cultural background of a word.
                                        - If the origin or cultural background is uncertain, clearly indicate that it is uncertain.

                                        Required JSON format:

                                        {
                                        "english": "Standard English translation",
                                        "japanese": "Japanese translation",
                                        "words": [
                                            {
                                            "word": "detected word",
                                            "category": "Singlish | Slang | Food | Place | Transportation | Organization",
                                            "meaning": "meaning",
                                            "origin": "origin",
                                            "culture": "cultural background",
                                            "example": "example sentence"
                                            }
                                        ]
                                        }

                                        Input sentence:
                                        ${text}`,
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