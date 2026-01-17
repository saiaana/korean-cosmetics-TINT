import InputField from "./InputField";

export default function LoginForm({ formData, onChange }) {
  const fieldRows = [
    [
      { name: "email", label: "Email", type: "email", placeholder: "Email" },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Password",
      },
    ],
  ];

  return (
    <div>
      {fieldRows.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((field) => (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={onChange}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

