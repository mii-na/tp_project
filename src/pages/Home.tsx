// 全体を管理するスクリプト
import { useState } from "react";
import Header from "../components/Header";
import Translator from "../components/Translator";
import Trans_Result from "../components/Trans_Result";
import History from "../components/History";
import type {WordInfo} from "../types/WordInfo";
import WordModel from "../components/WordModel";

export default function Home() {
 //inputTextの内容(初期値は(""))を読み取ってsetInputTextに書き込む
  const [inputText, setInputText] = useState("");
 //Translationに表示させるのは3言語だから，，，
  const [translation, setTranslation] = useState({
    english: "",
    japanese:"",
    original:"",
  });
  
  const [words, setWords] = useState<WordInfo[]>([]);

  //履歴のため
  const [history, setHistory] = useState<string[]>([]);
  //ポップアップ
  const [isModel, setIsModel] = useState(false);
  //意味
  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);

  //translateボタンクリック時の処理
  const handleTranslate = async () => {
    // サーバにHTTPリクエストの送信
    try{
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // JSONを送るよーって言ってる
        },
        body: JSON.stringify({
          text:inputText, //入力を文字列にして送信
        }),
      });

      // バックエンドからの結果をdataに受け取る
      const data = await response.json();
      console.log("Backend response:", data);

       // Translationに保存
      setTranslation({
        english: data.english,
        japanese: data.japanese,
        original: data.original,
      });

      // 見つけたwordをセット
      setWords(data.words);
      // Historyに記録
      setHistory((prev) => [inputText, ...prev])      

    }catch(error){
      console.error("Translation error:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-5xl space-y-6 p-8">

        {/* 各スクリプトに渡す引数 */}
        <Translator
          inputText={inputText}
          setInputText={setInputText}
          onTranslate={handleTranslate}
        />

        <Trans_Result
          translation={translation}
          words={words}
          onWordClick={(word) => {
            setSelectedWord(word);
            setIsModel(true);
          }}
        />

        <History history={history} />

        <WordModel
            isOpen={isModel}
            onClose={() => setIsModel(false)}
            word={selectedWord}
        />

      </div>
    </main>
  );
}