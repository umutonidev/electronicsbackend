// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: false }, // URL to the product image
  category: { type: String, required: true },
  brand: { type: String },
  stockQuantity: { type: Number, default: 0 },
  // Add more fields as needed (e.g., specifications, ratings, etc.)
}, {
  timestamps: true // Automatically add createdAt and updatedAt timestamps
});

const Product = mongoose.model('Product', productSchema);

export default Product;