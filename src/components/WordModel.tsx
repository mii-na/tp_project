type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WordModal({
  isOpen,
  onClose,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-[500px] rounded-3xl bg-white p-8 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            makan
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>

        </div>

        <div className="space-y-5">

          <div>
            <h3 className="font-semibold text-gray-500">
              Category
            </h3>

            <p>Food</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Meaning
            </h3>

            <p>To eat</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Origin
            </h3>

            <p>Malay</p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Cultural Background
            </h3>

            <p>
              Commonly used in Singapore and Malaysia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-500">
              Example
            </h3>

            <p>
              Let's makan together!
            </p>
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-xl bg-blue-500 py-3 text-white hover:bg-blue-600"
        >
          Close
        </button>

      </div>

    </div>
  );
}