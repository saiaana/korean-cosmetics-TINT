export default function SubmitButton({ isLoading, text, loadingText }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full rounded bg-pink-600 py-2 font-semibold text-white transition hover:bg-pink-700"
    >
      {isLoading ? loadingText : text}
    </button>
  );
}
