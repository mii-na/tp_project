// バックエンドの処理
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Singlish Translator Backend is running!",
  });
});

// /translateのURLにPOSTリクエストが来た時の処理
app.post("/translate", (req, res) => {
    const {text} = req.body;

    console.log("Received text:", text);

    res.json({
        original: text,
    });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});