import { useState } from "react";
import ProductInfoBlock from "./ProductInfoBlock";

function ProductDescriptionBlock({
  description,
  howToUse,
  volume,
  ingridients,
}) {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="space-y-4 text-sm text-stone-700">
      <ProductInfoBlock title="Description" value={description} />
      <ProductInfoBlock title="How to use" value={howToUse} />
      <ProductInfoBlock title="Volume" value={volume} />

      <button
        onClick={() => setShowIngredients((v) => !v)}
        className="w-fit text-sm font-semibold text-stone-800 hover:text-pink-600"
      >
        {showIngredients ? "Hide ingredients" : "Show ingredients"}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ${
          showIngredients ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ProductInfoBlock
          title="Ingredients"
          value={ingridients}
          textSize="text-xs sm:text-sm"
        />
      </div>
    </div>
  );
}

export default ProductDescriptionBlock;
