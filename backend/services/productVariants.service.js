import * as productVariantsRepo from "../repositories/productVariants.repository.js";

export async function getProductWithVariants(productId) {
  const product = await productVariantsRepo.findProductById(productId);

  if (!product) {
    throw {
      status: 404,
      message: "Product not found",
    };
  }

  // If the product has no variants, return an empty array
  if (!product.has_variants) {
    return {
      product,
      variants: [],
    };
  }

  const variants =
    await productVariantsRepo.findVariantsWithImagesByProductId(productId);

  return {
    product,
    variants,
  };
}
