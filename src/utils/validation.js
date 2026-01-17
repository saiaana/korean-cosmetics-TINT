export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function areAllFieldsFilled(data) {
  return Object.values(data).every((val) => val !== "");
}

export function isValidPassword(password) {
  const errors = [];
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  if (password.length < 8) {
    errors.push("Password must contain at least 8 characters");
  }

  return errors;
}
