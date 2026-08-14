// 翻訳結果
import type { WordInfo } from "../types/WordInfo";

type Props = {
  translation: {
    english: string;
    japanese: string;
    original: string;
  };
  words: WordInfo[];
  onWordClick: (word: WordInfo) => void;
};

export default function Trans_Result({
  translation,
  words,
  onWordClick,
}: Props) {

  // 入力文をスペースで分割
  const tokens = translation.original.split(/\s+/);

  // 表示用の結果
  const result = [];

  // 現在チェックしている位置
  let i = 0;

  while (i < tokens.length) {

    // 現在の単語から記号を除去
    const cleanToken = tokens[i].replace(/[.,!?@]/g, "");

    /*
     先頭の単語を探して候補として保持
     */
    const candidates = words.filter((word) => {

      const firstWord = word.word
        .split(/\s+/)[0]
        .replace(/[.,!?@]/g, "");

      return firstWord.toLowerCase() === cleanToken.toLowerCase();
    });

    let matchedWord: WordInfo | undefined;
    let matchedLength = 0;

    /*
     候補について後続の単語まで一致するか確認
     */
    for (const word of candidates) {

      const wordTokens = word.word.split(/\s+/);

      // 入力側から候補と同じ数の単語を取得
      const inputTokens = tokens
        .slice(i, i + wordTokens.length)
        .map((token) =>
          token.replace(/[.,!?@]/g, "")
        );

      /* すべての単語が一致しているか確認 */
      const isMatch =
        wordTokens.length === inputTokens.length &&
        wordTokens.every(
          (wordToken, index) =>
            wordToken.toLowerCase() ===
            inputTokens[index].toLowerCase()
        );

      if (isMatch) {
        matchedWord = word;
        matchedLength = wordTokens.length;
        break;
      }
    }

    /*複数語の表現が見つかった場合*/
    if (matchedWord) {

      result.push(
        <button
          key={i}
          onClick={() => onWordClick(matchedWord!)}
          className="mx-1 rounded-md bg-blue-100 px-1 text-blue-700 transition hover:bg-blue-200"
        >
          {tokens
            .slice(i, i + matchedLength)
            .join(" ")}
        </button>
      );

      // マッチした単語数だけ一気に進む
      i += matchedLength;

      continue;
    }

    /*
      複数語として一致しなかった場合、 1単語として検索する
     */
    const singleWord = words.find(
      (word) =>
        word.word.toLowerCase() ===
        cleanToken.toLowerCase()
    );

    if (singleWord) {

      result.push(
        <button
          key={i}
          onClick={() => onWordClick(singleWord)}
          className="mx-1 rounded-md bg-blue-100 px-1 text-blue-700 transition hover:bg-blue-200"
        >
          {tokens[i]}
        </button>
      );

    } else {

      /* Singapore-specific wordではない場合 */
      result.push(
        <span
          key={i}
          className="mx-1"
        >
          {tokens[i]}
        </span>
      );
    }

    // 次の単語へ
    i++;
  }

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">
        Translation
      </h2>

      <div className="space-y-6">

        {/* Singlish Original */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-500">
            Singlish
          </h3>

          <p className="text-lg leading-8">
            {result}
          </p>
        </div>

        {/* English Translation */}
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