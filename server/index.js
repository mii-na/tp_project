// バックエンドの処理，AI部分の実装
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { error } from "node:console";

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
                    //model: "poolside/laguna-xs-2.1:free",
                    //model: "nvidia/nemotron-3-nano-30b-a3b:free",
                    //model: "openrouter/free",
                    model: "google/gemma-4-26b-a4b-it:free",
                    
                    //失敗したときに次使うモデルたち
                    models:[
                        "google/gemma-4-26b-a4b-it:free",
                        "poolside/laguna-xs-2.1:free",
                        "nvidia/nemotron-3-nano-30b-a3b:free"
                    ],

                    //思考を最小限に
                    reasoning:{
                        effort: "minimal" 
                    },

                    // プロンプト
                    messages:[
                        {
                            role:"user",
                            //content: `Translate the following Singlish into standard English. Singlish: ${text}`,
                            content:  `Analyze the input and return ONLY valid JSON.
                            Tasks:
                            1. Translate Singlish into natural Standard English.
                            2. Translate it into natural Japanese.
                            3. Detect Singapore-specific words, expressions, slang, food, places, transportation, and organizations.
                            4. Explain each detected item with meaning, origin, culture, and an example.

                            Rules:
                            - Do not detect ordinary English words.
                            - Detect only words or expressions actually present in the input.
                            - Keep multi-word expressions together. For example, "steady pom pi pi" is ONE expression.
                            - The "word" field must exactly match the text in the input.
                            - Treat "lah", "lor", "leh", and "meh" as Singlish.
                            - Examples of Singapore-related terms include "makan", "chope", "shiok", "paiseh", "steady pom pi pi", "laksa", "Bugis", "MRT", and "NUS".
                            - Do not invent origins or cultural information. If uncertain, say "Uncertain".
                            - Remove Singlish particles such as "lah" from the Standard English translation when they do not add essential meaning.
                            - Preserve Singaporean proper nouns such as Bugis, Orchard, Lau Pa Sat, and NUS.
                            - Japanese should be a natural translation of the English meaning, not a word-for-word translation.

                            Categories must be exactly:
                            "Singlish", "Slang", "Food", "Place", "Transportation", or "Organization".

                            JSON format:
                            {
                            "english": "Standard English translation",
                            "japanese": "Japanese translation",
                            "words": [
                                {
                                "word": "detected word",
                                "category": "category",
                                "meaning": "meaning",
                                "origin": "origin",
                                "culture": "cultural background",
                                "example": "example sentence"
                                }
                            ]
                            }

                            JSON requirements:
                            - Return ONLY JSON.
                            - No Markdown or code fences.
                            - The output must be directly parseable by JSON.parse().
                            - Every item in "words" must be an object.
                            - Never put a standalone string in "words".
                            - No trailing commas.
                            - If nothing is detected, use "words": [].

                            Input:
                            ${text}`
                        },
                    ],
                }),
            }
        );

        // 入力をターミナルに表示
        const data = await response.json();
        console.log("OpenRouter response:", data);

        // エラー発生時の対応
        if(!response.ok){
            console.error("Invalid API error:", data);

            return res.status(response.status).json({
                error: data.error?.message || "OpenRouter request failed",
            });
        }

        if(!data.choices || !data.choices[0]){
            console.error("Invalid OpenRouter response:", data);

            return res.status(500).json({
                error: "Invalid response from OpenRouter",
            });
        }

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