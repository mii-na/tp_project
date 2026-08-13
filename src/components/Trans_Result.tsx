// 翻訳結果
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

  // 空白で単語ごとに分けてtokens配列に入れる
  const tokens = translation.original.split(" ");

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
            {tokens.map((token,index) => {
              // tokens配列の中の記号を抜いてcleanTokenに代入
              const cleanToken = token.replace(/[.,!?]/g, "");
              //matchedWordにcleanTokenの小文字にしたやつと単語リストの小文字にしたやつが一致するか確認して代入
              const matchedWord = words.find(
                (word) => 
                  word.word.toLowerCase() === cleanToken.toLowerCase()
              );

              //もしmatchedWordがあれば該当箇所をボタンにする
              if(matchedWord){
                return(
                  <button
                  key={index}
                  onClick={() => onWordClick(matchedWord)} //クリックされたらポップアップの呼び出し
                  className="mx-1 rounded-md bg-blue-100 px-1 text-blue-700 transition hover:bg-blue-200"
                  >
                    {token}
                    </button>
                );
              }

              //何もなかったら返す
              return(
                <span key={index} className="mx-1">
                  {token}
                </span>
              );
          })}
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