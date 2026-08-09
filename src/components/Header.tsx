export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Logo & Title */}
        <div className="flex items-center gap-3">

          <div>
            <h1 className="text-lg font-semibold">
              Singlish Translator
            </h1>

            <p className="text-xs text-gray-500">
              Learn Singapore English
            </p>
          </div>
        </div>

        {/* Navigation Button*/}
        <nav className="flex gap-8">
          <button className="text-gray-700 hover:text-blue-600 transition">
            Home
          </button>

          <button className="text-gray-700 hover:text-blue-600 transition">
            History
          </button>
        </nav>

      </div>
    </header>
  );
}