// Libraryの管理（これまでに検出された単語の一覧）
import type { WordInfo } from "../types/WordInfo";
import { getCategoryStyle } from "./Trans_Result";

type Props = {
  library: WordInfo[];
  onWordClick: (word: WordInfo) => void;
};

export default function LibraryPanel({ library, onWordClick }: Props) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">Library</h2>

      <div className="flex flex-wrap gap-3">
        {library.length === 0 ? (
          <p className="text-gray-500">No words yet</p>
        ) : (
          library.map((word) => (
            <button
              key={word.word.toLowerCase()}
              onClick={() => onWordClick(word)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${getCategoryStyle(word.category)}`}
            >
              {word.word}
            </button>
          ))
        )}
      </div>

    </section>
  );
}