import CreateOrderForm from "../components/pages/order/CreateOrderForm";
import OrderSummary from "../components/pages/order/OrderSummary";
import useCreateOrder from "../hooks/useCreateOrder";

function CreateOrder() {
  const {
    formData,
    handleChange,
    isDisabled,
    handleSubmit,
    selectedItems,
    totalPrice,
  } = useCreateOrder();

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4">
      <h1 className="mb-8 text-3xl font-extrabold text-stone-800">Checkout</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_380px]">
        <CreateOrderForm formData={formData} onChange={handleChange} />
        <OrderSummary
          itemsCount={selectedItems.length || 0}
          totalPrice={totalPrice.toFixed(2) || 0}
          isDisabled={isDisabled}
        />
      </div>
    </form>
  );
}

export default CreateOrder;
