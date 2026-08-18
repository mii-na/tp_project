// ヘッダーのUI
import logo from "../materials/favicon.png";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* ロゴとタイトル */}
        <div className="flex items-center gap-3">
          {/* ロゴ*/}
          <img
            src={logo}
            className="h-10 w-10 object-contain"
          />

          <div>
            <h1 className="text-lg font-semibold">
              Singlish Translator
            </h1>

            <p className="text-xs text-gray-500">
              Learn Singlish
            </p>
          </div>
        </div>

      {/* ファビコンの変更 */}
        <link rel="icon" href={logo} />

      </div>
    </header>
  );
}