import OrderInputField from "../../ui/forms/OrderInputField";

function CreateOrderForm({ formData, onChange }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold text-stone-800">
        Customer information
      </h2>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <OrderInputField
            name="firstName"
            label="First name"
            placeholder="First name"
            value={formData.firstName}
            onChange={onChange}
          />

          <OrderInputField
            name="lastName"
            label="Last name"
            placeholder="Last name"
            value={formData.lastName}
            onChange={onChange}
          />

          <OrderInputField
            name="email"
            label="E-mail"
            placeholder="example@email.com"
            value={formData.email}
            onChange={onChange}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <OrderInputField
            name="address"
            label="Address"
            placeholder="Street, building, apartment"
            value={formData.address}
            onChange={onChange}
            className="md:col-span-2"
          />

          <OrderInputField
            name="city"
            label="City"
            placeholder="City"
            value={formData.city}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

export default CreateOrderForm;
