import type { WordInfo } from "../types/WordInfo";

type Props ={
  translation: {
    english: string;
    japanese: string;
    original: string;
  };
  words: WordInfo[];
  onWordClick: (word: WordInfo) => void;
};

export default function Trans_Result({
  translation, words, onWordClick,
}:Props) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">
        Translation
      </h2>

      {/* Detected Words */}
      <div className="mt-8">
        <h3 className="mb-3 text-sm font-medium text-gray-500">
          Detected Words
        </h3>

        <div className="flex flex-wrap gap-2">
          {words.map((word) => (
            <button
              key={word.word}
              onClick={() => onWordClick(word)}
              className="rounded-full bg-blue-100 px-4 py-2 text-blue-700 transition hover:bg-blue-200"
            >
              {word.word}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">

        {/* Singlish Original */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Original
          </h3>

          <p className="text-lg">
            {translation.original}
          </p>
        </div>

        {/* Enlgish Translation */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            English
          </h3>

          <p className="text-lg">
            {translation.english}
          </p>
        </div>

        {/* Japanese Translation */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Japanese
          </h3>

          <p className="text-lg">
            {translation.japanese}
          </p>
        </div>

      </div>

    </section>
  );
}