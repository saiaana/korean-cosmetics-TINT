export default function AuthFormLayout({
  title,
  children,
  onSubmit,
  isLoading,
  error,
  submit,
  footer,
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
        <h2 className="mb-6 text-center text-3xl font-bold text-pink-600">
          {title}
        </h2>
        {error && (
          <div className="mb-4 rounded bg-red-100 p-3 text-sm text-pink-600">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 text-center text-sm text-stone-500">
            Loading...
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <fieldset disabled={isLoading} className="space-y-4">
            {children}
            {submit}
          </fieldset>
        </form>
        {footer && (
          <p className="mt-4 text-center text-sm text-gray-600">{footer}</p>
        )}
      </div>
    </div>
  );
}
