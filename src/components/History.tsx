// Historyの管理
type Props = {
  history: string[];
};

export default function HistoryPanel({history}: Props) {
  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

      <h2 className="mb-6 text-2xl font-semibold">History</h2>

      <div className="space-y-3">
      {/* Example */}
      {history.length === 0 ?(
        <p className="text-gray-500">No history yet.</p>
      ):(
        history.map((item, index) => (
          <div
            key={index}
            className="rounded-x1 bg-gray-50 p-4"
          >
            {item}
          </div>
        ))
      )}
      </div>

    </section>
  );
}