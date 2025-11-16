import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    // This creates a direct link to the User who created the product.
    // It's like a foreign key in a traditional database.
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This tells Mongoose to link to the 'User' model
    },
    name: {
      type: String,
      required: true,
    },
    photos: {
      type: [String], // An array of strings (image paths)
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    tags: {
      type: [String], // Defines an array of strings
      default: [],
    },
    // We will add image URLs and materials later to keep this simple for now
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;