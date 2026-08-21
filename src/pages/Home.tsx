import { useState, useEffect } from "react";
import Header from "../components/Header";
import Translator from "../components/Translator";
import Trans_Result from "../components/Trans_Result";
import History from "../components/History";
import Library from "../components/Library";
import type { WordInfo } from "../types/WordInfo";
import WordModel from "../components/WordModel";

const LIBRARY_STORAGE_KEY = "singlish-translator-library";
const HISTORY_STORAGE_KEY = "singlish-translator-history";

type ActiveTab = "Translator" | "Library";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("Translator");
  const [translation, setTranslation] = useState({
    english: "",
    japanese: "",
    original: "",
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

  useEffect(() => {
    try {
      localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
    } catch (error) {
      console.error("Failed to save library to localStorage:", error);
    }
  }, [library]);

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage:", error);
    }
  }, [history]);

  const addToLibrary = (newWords: WordInfo[]) => {
    setLibrary((prev) => {
      const existingKeys = new Set(prev.map((w) => w.word.toLowerCase()));

      const uniqueNewWords = newWords.filter(
        (w) => !existingKeys.has(w.word.toLowerCase())
      );

      return [...prev, ...uniqueNewWords];
    });
  };

  const handleTranslate = async () => {
    setIsLoading(true);

    try {
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
      setHistory((prev) => [inputText, ...prev]);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWordClick = (word: WordInfo) => {
    setSelectedWord(word);
    setIsModel(true);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="mx-auto max-w-5xl p-8">
        <div className="mb-6 flex justify-center">
          <div className="inline-flex w-full max-w-md rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("Translator")}
              className={`flex-1 rounded-lg px-8 py-3 text-sm font-medium transition ${
                activeTab === "Translator"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Translator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Library")}
              className={`flex-1 rounded-lg px-8 py-3 text-sm font-medium transition ${
                activeTab === "Library"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Library
            </button>
          </div>
        </div>

        {activeTab === "Translator" ? (
          <div className="space-y-6">
            <Translator
              inputText={inputText}
              setInputText={setInputText}
              onTranslate={handleTranslate}
              isLoading={isLoading}
            />

            <Trans_Result
              translation={translation}
              words={library}
              onWordClick={handleWordClick}
            />

            <History history={history} />
          </div>
        ) : (
          <Library library={library} onWordClick={handleWordClick} />
        )}

        <WordModel
          isOpen={isModel}
          onClose={() => setIsModel(false)}
          word={selectedWord}
        />
      </div>
    </main>
  );
}