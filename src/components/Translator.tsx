// 入力エリアのUI
type Props = {
  inputText: string;
  setInputText: (text: string) => void;
  onTranslate: ()=> void;
};

export default function Translator({
  inputText,
  setInputText,
  onTranslate,
}: Props) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

        {/* タイトル */}
        <h2 className="mb-6 text-2xl font-semibold">
          Shinglish Translator
        </h2>

        {/* 入力部分 */}
        <textarea
        className="h-40 w-full resize-none rounded-2xl border border-gray-300 p-4 outline-none focus:border-blue-500"
        placeholder="Type your Singlish sentence..."
        value={inputText}
        onChange={(e)=>setInputText(e.target.value)} //現在の入力欄の内容をinputTextに保存・更新
        />

        
        <div className="mt-6 flex items-center justify-between">
        
        {/* 言語選択 */}
        {/* <select className="rounded-xl border border-gray-300 px-4 py-2">

            <option>Singlish</option>

            <option>Japanese</option>

        </select> */}

        {/* Translateボタン */}
        <button 
        className="rounded-full bg-blue-500 px-6 py-3 font-medium text-white transition hover:bg-blue-600"
        onClick={onTranslate}>

            Translate

        </button>

      </div>

    </section>
  );
}