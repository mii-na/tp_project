type Props ={
  translation: {
    english: string;
    japanese: string;
    original: string;
  };
};
export default function Trans_Result({
  translation,
}:Props) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">
        Translation
      </h2>

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