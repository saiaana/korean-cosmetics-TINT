import * as productsService from "../services/products.service.js";

export async function getAllProducts(req, res) {
  try {
    const products = await productsService.getAllProducts();
    res.json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllAdminProducts(req, res) {
  try {
    const products = await productsService.getAllAdminProducts();
    res.json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAdminProductById(req, res) {
  try {
    const product = await productsService.getAdminProductById(
      parseInt(req.params.productId, 10)
    );
    res.json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateProductActiveStatus(req, res) {
  try {
    const { productId } = req.params;
    const { is_active } = req.body;
    
    if (typeof is_active !== "boolean") {
      return res.status(400).json({ error: "is_active must be a boolean" });
    }

    const product = await productsService.updateProductActiveStatus(
      parseInt(productId, 10),
      is_active
    );
    res.json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function updateProduct(req, res) {
  try {
    const product = await productsService.updateProduct(
      parseInt(req.params.productId, 10),
      req.body
    );
    res.json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getAllBrands(req, res) {
  try {
    const brands = await productsService.getAllBrands();
    res.json(brands);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const { category } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await productsService.getProductsByCategory(
      category,
      page,
      limit,
    );
    res.json({
      products: result.products,
      page,
      hasMore: result.hasMore,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getProductsByBrand(req, res) {
  try {
    const { brand } = req.params;
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await productsService.getProductsByBrand(brand, page, limit);
    res.json({
      products: result.products,
      page,
      hasMore: result.hasMore,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getNewProducts(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await productsService.getNewProducts(page, limit);
    res.json({
      products: result.products,
      page,
      hasMore: result.hasMore,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getOnSaleProducts(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await productsService.getOnSaleProducts(page, limit);
    res.json({
      products: result.products,
      page,
      hasMore: result.hasMore,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getBestsellerProducts(req, res) {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);

    const result = await productsService.getBestsellerProducts(page, limit);
    res.json({
      products: result.products,
      page,
      hasMore: result.hasMore,
    });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getProductBySlug(req, res) {
  try {
    const product = await productsService.getProductBySlug(req.params.slug);
    res.json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function searchProducts(req, res) {
  try {
    const products = await productsService.searchProducts(req.query.search);
    res.json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getSimilarProducts(req, res) {
  try {
    const excludeId = req.query.excludeId ? parseInt(req.query.excludeId, 10) : null;
    const products = await productsService.getSimilarProducts(
      req.query.category,
      req.query.brand,
      excludeId,
    );
    res.json(products);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function getCategoriesList(req, res) {
  try {
    const categories = await productsService.getCategoriesList();
    res.json(categories);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}

export async function createProduct(req, res) {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message });
  }
}
