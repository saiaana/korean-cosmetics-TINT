import * as productVariantsService from "../services/productVariants.service.js";

export async function getProductVariants(req, res) {
  try {
    const { productId } = req.params;

    if (!productId || Number.isNaN(Number(productId))) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const result = await productVariantsService.getProductWithVariants(
      Number(productId),
    );

    res.json(result);
  } catch (err) {
    console.error(err);

    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  }
}
