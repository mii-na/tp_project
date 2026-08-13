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
                            content: `Translate the following Singlish into standard English. Singlish: ${text}`,
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

        // resに原文と回答を保存
        res.json({
            original: text,
            english: result,
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