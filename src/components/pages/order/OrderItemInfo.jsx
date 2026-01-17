import { Link } from "react-router-dom";
import { getImageUrl } from "../../../utils/helpers";
import { getProductUrl } from "../../../utils/products/getProductUrl";
import ImageWithLoader from "../../ui/ImageWithLoader";

function OrderItemInfo({ order }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-stone-800">Order items</h2>

      <div className="space-y-4">
        {order.items.map((item, index) => {
          return (
            <Link
              aria-label={`View product ${item.title}`}
              key={
                item.variant_id
                  ? `${item.product_id}-${item.variant_id}`
                  : `${item.product_id}-${index}`
              }
              to={getProductUrl(
                item.product_id,
                item.title,
                item.variant_id || null,
              )}
              className="group flex items-center gap-4 rounded-xl border border-stone-200 p-4 transition-all duration-300 hover:bg-stone-50 hover:shadow-sm"
            >
              <ImageWithLoader
                src={getImageUrl(item.image_url)}
                alt={item.title}
                className="h-20 w-20 rounded-lg border object-cover"
              />

              <div className="flex flex-1 flex-col gap-1">
                <p className="text-sm font-semibold uppercase text-stone-800">
                  {item.variant_title
                    ? `${item.title} - ${item.variant_title}`
                    : item.title}
                </p>

                <div className="flex items-center gap-2 text-sm">
                  {item.on_sale && item.original_price ? (
                    <>
                      <span className="font-semibold text-pink-600">
                        ${Number(item.final_price).toFixed(2)}
                      </span>
                      <span className="text-stone-400 line-through">
                        ${Number(item.original_price).toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold">
                      ${Number(item.final_price).toFixed(2)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-500">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </p>
              </div>

              <div className="text-right text-sm font-semibold text-stone-800">
                ${(Number(item.final_price) * item.quantity).toFixed(2)}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default OrderItemInfo;
