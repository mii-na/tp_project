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

  // 入力文をスペース(\s+により，1個以上連続している空白)で分割して配列に代入
  const tokens = translation.original.split(/\s+/);
  // 表示用の結果
  const result = [];

  let i = 0;
  while (i < tokens.length) {

    // 現在の単語から記号を除去
    const cleanToken = tokens[i].replace(/[\p{P}]/gu, "");

    // words配列の中から条件に合う要素だけを取り出す，words配列の各要素をword変数に代入
    const candidates = words.filter((word) => {
      
      // word変数空白と記号の削除
      const firstWord = word.word
        .split(/\s+/)[0]
        .replace(/[\p{P}]/gu, "");

      // firstWordとcleanTokenが一致していればtrueで返す
      return firstWord.toLowerCase() === cleanToken.toLowerCase();
    });

    let matchedWord: WordInfo | undefined; //WordInfoが入るかもしれないほぼnull
    let matchedLength = 0;

    // 候補について後続の単語まで一致するか確認
    // candidatesに入っている要素を1つずつ調べる
    for (const word of candidates) {

      const wordTokens = word.word.split(/\s+/);

      // 複数後の単語を分割
      const inputTokens = tokens
        .slice(i, i + wordTokens.length)
        .map((token) =>
          token.replace(/[\p{P}]/gu, "")
        );

      // すべての単語が一致しているか確認 
      const isMatch =
        wordTokens.length === inputTokens.length && //単語数が一致しているか
        wordTokens.every( // 配列の中身が一致するか全単語を比較
          (wordToken, index) =>
            wordToken.toLowerCase() ===
            inputTokens[index].toLowerCase()
        );

      // 単語が全て一致したら記録して何単語かも保存
      if (isMatch) {
        matchedWord = word;
        matchedLength = wordTokens.length;
        break;
      }
    }

    // 複数語の表現が見つかった場合
    if (matchedWord) {

      result.push( // result配列の最後に要素を追加
        <button
          key={i}
          onClick={() => onWordClick(matchedWord!)}
          className={`mx-1 rounded-md px-1 transition ${getCategoryStyle(matchedWord.category)}`}
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

    // 複数語として一致しなかった場合、 1単語として検索する 
    const singleWord = words.find(
      (word) =>
        word.word.toLowerCase() ===
        cleanToken.toLowerCase()
    );
    
    // 単語が見つかったら，ボタンを追加
    if (singleWord) {
      result.push(
        <button
          key={i}
          onClick={() => onWordClick(singleWord)}
          className={`mx-1 rounded-md px-1 transition ${getCategoryStyle(singleWord.category)}`}
        >
          {tokens[i]}
        </button>
      );

    } else {
      // singlishではない場合は普通の文字として表示
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

// 単語によって色を分ける処理
function getCategoryStyle(category: string) {
  switch (category) {
    case "Singlish":
      return "bg-blue-100 text-blue-700";
    case "Slang":
      return "bg-red-100 text-red-700";
    case "Food":
      return "bg-green-100 text-green-700";
    case "Place":
      return "bg-yellow-100 text-yellow-700";
    case "Transportation":
      return "bg-purple-100 text-purple-700";
    case "Organization":
      return "bg-pink-100 text-pink-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}