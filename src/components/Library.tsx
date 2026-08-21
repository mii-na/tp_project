// Libraryの管理（これまでに検出された単語の一覧）
import { useMemo, useState } from "react";
import type { WordInfo } from "../types/WordInfo";
import { getCategoryStyle } from "./Trans_Result";

type Props = {
  library: WordInfo[];
  onWordClick: (word: WordInfo) => void;
};

export default function LibraryPanel({ library, onWordClick }: Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Libraryに実際に存在するカテゴリだけをフィルターとして表示
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(library.map((word) => word.category).filter(Boolean))
    );

    return ["All", ...uniqueCategories];
  }, [library]);

  // Libraryの内容が変わって選択中のカテゴリがなくなった場合はAllとして扱う
  const activeCategory = categories.includes(selectedCategory)
    ? selectedCategory
    : "All";

  // 選択されたカテゴリに合わせて表示する単語を絞り込む
  const filteredWords = useMemo(() => {
    if (activeCategory === "All") {
      return library;
    }

    return library.filter((word) => word.category === activeCategory);
  }, [library, activeCategory]);

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Library</h2>
        {library.length > 0 && (
          <span className="text-sm text-gray-500">
            {filteredWords.length} {filteredWords.length === 1 ? "word" : "words"}
          </span>
        )}
      </div>

      {library.length === 0 ? (
        <p className="text-gray-500">No words yet</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  activeCategory === category
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {filteredWords.length === 0 ? (
            <p className="py-8 text-center text-gray-500">
              No words in this category.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredWords.map((word) => (
                <button
                  key={word.word.toLowerCase()}
                  type="button"
                  onClick={() => onWordClick(word)}
                  className="group rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {word.word}
                    </h3>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getCategoryStyle(
                        word.category
                      )}`}
                    >
                      {word.category}
                    </span>
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-gray-600">
                    {word.meaning}
                  </p>

                  <p className="mt-4 text-xs font-medium text-gray-400 transition group-hover:text-gray-600">
                    View details
                  </p>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
