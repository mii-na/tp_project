import { useState, useEffect } from "react";
import Header from "../components/Header";
import Translator from "../components/Translator";
import Trans_Result from "../components/Trans_Result";
import History from "../components/History";
import Library from "../components/Library";
import type {WordInfo} from "../types/WordInfo";
import WordModel from "../components/WordModel";

const LIBRARY_STORAGE_KEY = "singlish-translator-library";
const HISTORY_STORAGE_KEY = "singlish-translator-history"; // 追加

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translation, setTranslation] = useState({
    english: "",
    japanese:"",
    original:"",
  });

  const [library, setLibrary] = useState<WordInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LIBRARY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load library from localStorage:", error);
      return [];
    }
  });

  // History: 初期値をlocalStorageから読み込む
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      return [];
    }
  });

  const [isModel, setIsModel] = useState(false);
  const [selectedWord, setSelectedWord] = useState<WordInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // libraryが変化するたびにlocalStorageへ保存
  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.error("Failed to save library to localStorage:", error);
    }
  }, [library]);

  // historyが変化するたびにlocalStorageへ保存
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const addToLibrary = (newWords: WordInfo[]) => {
    setLibrary((prev) => {
      const existingKeys = new Set(
        prev.map((w) => w.word.toLowerCase())
      );

      const uniqueNewWords = newWords.filter(
        (w) => !existingKeys.has(w.word.toLowerCase())
      );

      return [...prev, ...uniqueNewWords];
    });
  };

  const handleTranslate = async () => {
    setIsLoading(true);

    try{
      const response = await fetch("http://localhost:3000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
          knownWords: library.map((w) => w.word),
        }),
      });

      const data = await response.json();
      console.log("Backend response:", data);

      setTranslation({
        english: data.english,
        japanese: data.japanese,
        original: data.original,
      });

      addToLibrary(data.words);

      setHistory((prev) => [inputText, ...prev])      

    }catch(error){
      console.error("Translation error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-5xl space-y-6 p-8">

        <Translator
          inputText={inputText}
          setInputText={setInputText}
          onTranslate={handleTranslate}
          isLoading={isLoading}
        />

        <Trans_Result
          translation={translation}
          words={library}
          onWordClick={(word) => {
            setSelectedWord(word);
            setIsModel(true);
          }}
        />
        
        <Library
          library={library}
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