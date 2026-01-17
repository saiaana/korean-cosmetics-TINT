import { useNavigate } from "react-router-dom";
import ROUTES from "../../../constants/routes";

const styles = {
  footer: "sticky bottom-0 z-20 mt-10 border-t backdrop-blur",
  content: "mx-auto flex max-w-4xl items-center justify-between px-4 pt-4",
  totalContainer: "flex flex-col",
  messageContainer: "h-6",

  totalLabel: "text-sm font-medium text-stone-500",
  totalPrice: (isDisabled) =>
    `text-2xl font-extrabold ${isDisabled ? "text-stone-400" : "text-pink-600"}`,
  message: (isDisabled) =>
    `text-center text-sm text-stone-500 transition-opacity duration-200 ${
      isDisabled ? "opacity-100" : "opacity-0"
    }`,

  button: (isDisabled) =>
    `h-12 w-56 rounded-xl text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
      isDisabled
        ? "cursor-not-allowed bg-stone-200 text-stone-400"
        : "bg-pink-600 text-white hover:bg-pink-700 hover:shadow-lg"
    }`,
};

function CartFooter({ totalPrice }) {
  const navigate = useNavigate();
  const isDisabled = totalPrice <= 0;

  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.totalContainer}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalPrice(isDisabled)}>
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <button
          disabled={isDisabled}
          onClick={() => navigate(ROUTES.createOrder)}
          className={styles.button(isDisabled)}
        >
          Proceed to order
        </button>
      </div>
      <div className={styles.messageContainer}>
        <p className={styles.message(isDisabled)}>
          Select at least one item to proceed
        </p>
      </div>
    </div>
  );
}

export default CartFooter;
