import express from 'express';
const router = express.Router();
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getMyProducts, getMyProductById  } from '../controllers/productController.js';
import { protect, isArtisan } from '../middleware/authMiddleware.js';

// --- Public Routes ---
// Anyone can view all products or a single product

router.route('/myproducts').get(protect, isArtisan, getMyProducts);

// --- NEW ROUTE ---
// This secure route gets a single product for editing. MUST BE BEFORE '/:id'
router.route('/myproducts/:id').get(protect, isArtisan, getMyProductById);

// This is the public route for viewing a single product
router.route('/:id')
  .get(getProductById)
  
// This route for a single product should be after
router.route('/:id')
  .get(getProductById)
  // ... (put and delete)
router.get('/', getProducts);


// --- Private/Artisan Route ---
// To create a product, you must be logged in (`protect`) AND be an artisan (`isArtisan`)
router.post('/', protect, isArtisan, createProduct);
router.put('/:id', protect, isArtisan, updateProduct);
router.delete('/:id', protect, isArtisan, deleteProduct);

export default router;