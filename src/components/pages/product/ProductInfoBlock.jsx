export default function ProductInfoBlock({
  title,
  value,
  textSize = "text-sm sm:text-base",
}) {
  return (
    <div className={`${textSize}`}>
      <p className="font-bold">{title}: </p>
      <p className="mt-1 text-gray-700">{value}</p>
    </div>
  );
}

