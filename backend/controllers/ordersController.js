import * as orderService from "../services/order.service.js";

export async function getOrderById(req, res) {
  try {
    const order = await orderService.getOrderById(req.params.orderId);
    res.json(order);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getOrdersByUser(req, res) {
  try {
    const orders = await orderService.getOrdersByUser(req.params.firebaseUid);
    res.json(orders);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function createOrder(req, res) {
  try {
    const orderId = await orderService.createOrder({
      firebaseUid: req.user.uid,
      customer: req.body.customer,
      items: req.body.items,
    });

    res.status(201).json({
      message: "Order created",
      orderId,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllOrders(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const result = await orderService.getAllOrders(page, limit);
    res.json(result);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const order = await orderService.updateOrderStatus(orderId, status);
    res.json(order);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
