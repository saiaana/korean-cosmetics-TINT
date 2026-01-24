import { Link } from "react-router-dom";
import ROUTES from "../../../constants/routes";
import { formatDate } from "../../../utils/helpers";

export default function OrderCard({ order }) {

  const formattedDate = formatDate(order.created_at);

  return (
    <Link
      to={ROUTES.orderConfirmation(order.id)}
      key={order.id}
      className="flex cursor-pointer justify-between rounded-lg bg-white p-4 shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <p className="font-semibold">Order №: {order.id}</p>
      <p>
        Date:{" "}
        {formattedDate}
        {/* {new Date(order.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })} */}
      </p>
    </Link>
  );
}
