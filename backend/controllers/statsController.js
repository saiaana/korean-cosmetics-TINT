import * as statsService from "../services/stats.service.js";

export async function getPopularProducts(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const products = await statsService.getPopularProducts(limit);
    res.json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
