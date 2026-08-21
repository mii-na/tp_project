// バックエンドの処理，AI部分の実装
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 試すモデルのリスト（優先順）
const MODELS = [
  "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "poolside/laguna-xs-2.1:free",
  "openrouter/free",
];

// タイムアウト秒数
const TIMEOUT_MS = 30000;

// サーバの動作確認用
app.get("/", (req, res) => {
  res.json({
    message: "Singlish Translator Backend is running!",
  });
});

// 1つのモデルにリクエストを送る関数（タイムアウト付き）
async function callModel(model, prompt) {
  const controller = new AbortController();

  // TIMEOUT_MS経過したらリクエストを中断
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        // .envファイルに保存したAPIキーを取得
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          reasoning: {
            effort: "minimal",
          },
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
        signal: controller.signal, // AbortControllerと連携
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `Model ${model} failed`);
    }

    if (!data.choices || !data.choices[0]) {
      throw new Error(`Invalid response from ${model}`);
    }

    return data.choices[0].message.content;

  } finally {
    // 成功・失敗にかかわらずタイマーを解除
    clearTimeout(timeoutId);
  }
}

// /translateのURLにPOSTリクエストが来た時の処理
app.post("/translate", async (req, res) => {
  const { text, knownWords = [] } = req.body; // 既知単語リストを受け取る
  const startTime = Date.now();

  console.log("Received text:", text);
  console.log("Known words count:", knownWords.length);

  // 既知単語を除外するための一文を組み立てる
  const knownWordsSection = knownWords.length > 0
    ? `\n\nThe following words/expressions are ALREADY known and explained in a separate library. Do NOT include them in the "words" output, even if they appear in the input:\n${knownWords.join(", ")}\n\nOnly include NEW Singapore-specific words/expressions that are NOT in this list.`
    : "";

  const prompt = `Analyze the input and return ONLY valid JSON.
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
  ${knownWordsSection}

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
  ${text}`;

  let result = null;
  let lastError = null;

  // モデルを順番に試す
  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}`);
      const modelStartTime = Date.now();

      result = await callModel(model, prompt);

      console.log(
        `Model ${model} succeeded in`,
        Date.now() - modelStartTime,
        "ms"
      );

      break; // 成功したらループを抜ける

    } catch (error) {
      // タイムアウトかどうかを判定
      if (error.name === "AbortError") {
        console.warn(`Model ${model} timed out after ${TIMEOUT_MS}ms`);
      } else {
        console.warn(`Model ${model} failed:`, error.message);
      }

      lastError = error;
      // 次のモデルへ
      continue;
    }
  }

  // 全モデル失敗した場合
  if (!result) {
    console.error("All models failed:", lastError);
    return res.status(500).json({
      error: "Failed to translate: all models failed or timed out",
    });
  }

  // JSONパース処理
  try {
    console.log("AI response:", result);
    const parsedResult = JSON.parse(result);

    res.json({
      original: text,
      english: parsedResult.english,
      japanese: parsedResult.japanese,
      words: parsedResult.words,
    });

    const endTime = Date.now();
    console.log("Total response time:", endTime - startTime, "ms");

  } catch (error) {
    console.error("JSON parse error:", error);
    res.status(500).json({
      error: "Failed to parse AI response",
    });
  }
});

// バックエンドをポート番号3000に展開
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});