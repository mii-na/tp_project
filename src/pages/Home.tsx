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
  });;
  //履歴のため
  const [history, setHistory] = useState<string[]>([]);
  //ポップアップ
  const [isModel, setIsModel] = useState(false);
  //意味
  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);

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

  const dummyWords: WordInfo[] = [
  {
    word: "makan",
    category: "Singlish",
    meaning: "To eat",
    origin: "Malay",
    culture: "Commonly used in Singapore and Malaysia.",
    example: "Let's makan together!",
  },
  {
    word: "lah",
    category: "Singlish",
    meaning: "A sentence-final particle used to add emphasis or friendliness.",
    origin: "Chinese dialects and other local languages",
    culture: "One of the most recognizable features of Singlish.",
    example: "Can lah!",
  },
  {
    word: "Bugis",
    category: "Place",
    meaning: "A district in Singapore.",
    origin: "Bugis people of Indonesia",
    culture: "Known for shopping, food, and Bugis MRT.",
    example: "Let's meet at Bugis.",
  },
];

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
          words={dummyWords}
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