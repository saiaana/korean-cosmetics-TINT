function InputField({
  label,
  name,
  value,
  type,
  placeholder,
  onChange,
  instructions,
}) {
  return (
    <div>
      <label className="mb-1 mt-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        className="w-full rounded border border-gray-300 p-2 outline-none focus:ring-2 focus:ring-pink-400"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
      <p className="text-xs italic text-gray-500">{instructions}</p>
    </div>
  );
}

export default InputField;
