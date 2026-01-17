export default function OrderInputField({
  label,
  placeholder,
  required = true,
  className = "",
  name,
  value,
  onChange,
  type = "text",
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={name}
        className="mb-1 text-sm font-semibold text-stone-700"
      >
        {label}
        {required && <span className="ml-1 text-pink-600">*</span>}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-11 rounded-md border border-stone-300 px-3 text-sm text-stone-900 transition-all duration-200 placeholder:text-stone-400 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
      />
    </div>
  );
}

