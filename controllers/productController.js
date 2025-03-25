// controllers/productController.js
import Product from '../models/Product.js';

// GET all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Fetch all products
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// GET a specific product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// POST a new product (Admin only)
export const createProduct = async (req, res) => {
  const newProduct = new Product({
    name: 'Sample Product ' + Date.now(), // Or whatever data you provide in the request body
    description: 'Sample Description',
    price: 0,
    imageUrl: '/images/default.jpg',
    category: 'Sample Category',
    brand: 'Sample Brand',
    stockQuantity: 10
  });

  try {
    const createdProduct = await newProduct.save();
    res.status(201).json({ message: 'Product created', product: createdProduct });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// PUT (update) a product by ID (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      product.name = req.body.name || product.name;
      product.description = req.body.description || product.description;
      product.price = req.body.price || product.price;
      product.imageUrl = req.body.imageUrl || product.imageUrl;
      product.category = req.body.category || product.category;
      product.brand = req.body.brand || product.brand;
      product.stockQuantity = req.body.stockQuantity || product.stockQuantity;

      const updatedProduct = await product.save();
      res.json({ message: 'Product updated', product: updatedProduct });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};

// DELETE a product by ID (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (product) {
      await product.remove();
      res.json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};