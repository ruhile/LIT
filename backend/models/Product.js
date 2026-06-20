import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: true
  },
  colors: [
    {
      name: { type: String, required: true },
      hex: { type: String, required: true }
    }
  ],
  sizes: {
    type: [String],
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'oversized', 'accessories']
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
