import InputField from "./InputField";

function SignUpForm({ formData, onChange }) {
  const fieldRows = [
    [
      { name: "email", label: "Email", type: "email", placeholder: "Email" },
      {
        name: "firstName",
        label: "First Name",
        type: "text",
        placeholder: "First Name",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
        placeholder: "Last Name",
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: "Password",
        instructions:
          "Password must contain minimum 8 symbols including 1 uppercase letter and 1 special character",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
        placeholder: "Confirm Password",
      },
    ],
  ];

  return (
    <>
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
              instructions={field.instructions || ""}
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default SignUpForm;
