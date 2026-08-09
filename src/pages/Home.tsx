import { useState } from "react";
import Header from "../components/Header";
import Translator from "../components/Translator";
import Trans_Result from "../components/Trans_Result";
import History from "../components/History";
import WordModel from "../components/WordModel";

export default function Home() {
 //inputTextの内容(初期値は(""))を読み取ってsetInputTextに書き込む
  const [inputText, setInputText] = useState("");
 //Translationに表示させるのは3言語だから，，，
  const [translation, setTranslation] = useState({
    english: "",
    japanese:"",
    original:"",
  });;

  //履歴のため
  const [history, setHistory] = useState<string[]>([]);

  //ポップアップ
  const [isModel, setIsModel] = useState(true);

  //ボタンクリック時に呼び出し，，，
  const handleTranslate = () => {
    // 反映
    setTranslation({
    english: inputText,
    japanese:inputText,
    original:inputText,
  });

  setHistory((prev) => [inputText, ...prev])

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
        />

        <History history={history} />

        <WordModel
            isOpen={isModel}
            onClose={() => setIsModel(false)}
        />

      </div>
    </main>
  );
}