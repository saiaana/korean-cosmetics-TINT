export default function ConfirmModal({
  open,
  title,
  description,
  cancelButtonText,
  confirmButtonText,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <button
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="mb-2 text-center text-lg font-semibold text-gray-900">
          {title}
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">{description}</p>

        <div className="flex gap-3">
          <button
            className="flex-1 rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>

          <button
            className="flex-1 rounded-lg bg-pink-600 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
            onClick={onConfirm}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}
