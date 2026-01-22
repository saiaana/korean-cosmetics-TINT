import db from "../db.js";
import * as userRepo from "../repositories/user.repository.js";
import * as orderRepo from "../repositories/order.repository.js";

export async function getOrderById(orderId) {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  const items = await orderRepo.findOrderItems(orderId);

  return {
    id: order.id,
    total: order.total,
    status: order.status,
    created_at: order.created_at,
    customer: {
      firstName: order.first_name,
      lastName: order.last_name,
      email: order.email,
      address: order.address,
      city: order.city,
    },
    items,
  };
}

export async function getOrdersByUser(firebaseUid) {
  const user = await userRepo.findByFirebaseUid(firebaseUid);
  if (!user) {
    return [];
  }

  return orderRepo.findOrdersByUserId(user.id);
}

export async function createOrder({ firebaseUid, customer, items }) {
  if (
    !customer?.firstName ||
    !customer?.lastName ||
    !customer?.email ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw { status: 400, message: "Invalid order data" };
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const user = await userRepo.findByFirebaseUid(firebaseUid, client);
    if (!user) {
      throw { status: 404, message: "User not found" };
    }

    await userRepo.updateUserProfile(
      client,
      user.id,
      customer.firstName,
      customer.lastName,
      customer.email,
    );

    const total = items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );

    const orderId = await orderRepo.createOrder(
      client,
      user.id,
      total,
      customer.address,
      customer.city,
    );

    await orderRepo.createOrderItems(client, orderId, items);

    // Decrease stock of products after order creation
    await orderRepo.updateStockAfterOrder(client, items);

    await client.query("COMMIT");
    return orderId;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getAllOrders() {
  return orderRepo.findAllOrders();
}

export async function updateOrderStatus(orderId, status) {
  // Валидация статуса
  const validStatuses = [
    "created",
    "pending",
    "paid",
    "cancelled",
    "in progress",
    "out for delivery",
    "delivered",
  ];

  if (!validStatuses.includes(status)) {
    throw { status: 400, message: "Invalid order status" };
  }

  const order = await orderRepo.updateOrderStatus(orderId, status);
  if (!order) {
    throw { status: 404, message: "Order not found" };
  }

  return order;
}
