import Product from '../models/productModel.js';

// @desc    Fetch all PUBLISHED products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: 'Published' });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Artisan
const createProduct = async (req, res) => {
    console.log('--- BACKEND: Data received in req.body ---', JSON.stringify(req.body, null, 2))

try {
    const { name, description, price, category, stock, tags, photos } = req.body;
    
     if (!photos) {
        res.status(400);
        throw new Error('No image URL provided');
    }
  
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            tags,
            photos, // Store as an array
            artisanId: req.user._id, // Get the artisan's ID from the logged-in user
            status: 'Draft', // New products are always drafts by default
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



// ... (getProducts, getProductById, createProduct functions remain the same) ...

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Artisan
// ... (imports and other functions)

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Artisan
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, tags, status, photos } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    // Security Check: Make sure the logged-in user owns this product
    if (product.artisanId.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized to update this product');
    }

    // Update all fields that are provided in the request body
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.tags = tags || product.tags;
    product.status = status || product.status; // This allows us to publish a draft
    
    // Specifically handle the photos array
    if (photos && photos.length > 0) {
        product.photos = photos;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);

  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

// ... (make sure updateProduct is in your exports)


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Artisan
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // --- SECURITY CHECK ---
        if (product.artisanId.toString() !== req.user._id.toString()) {
            res.status(401);
            throw new Error('User not authorized to delete this product');
        }

        await product.deleteOne();
        res.json({ message: 'Product removed successfully' });

    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};
// ... (imports)

// @desc    Get logged in user's products
// @route   GET /api/products/myproducts
// @access  Private/Artisan
const getMyProducts = async (req, res) => {
    try {
        // Find all products where the artisanId matches the logged-in user's ID
        const products = await Product.find({ artisanId: req.user._id });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
const getMyProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // --- SECURITY CHECK ---
        // Ensure the logged-in user is the owner of this product
        if (product.artisanId.toString() !== req.user._id.toString()) {
            res.status(401); // Unauthorized
            throw new Error('Not authorized to access this product');
        }

        res.json(product);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// @desc    Publish a draft product
// @route   PUT /api/products/:id/publish
// @access  Private/Artisan
const publishProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // --- SECURITY CHECK ---
        // Ensure the logged-in user is the owner of this product
        if (product.artisanId.toString() !== req.user._id.toString()) {
            res.status(401); // Unauthorized
            throw new Error('Not authorized to publish this product');
        }

        product.status = 'Published';
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (error) {
        res.status(res.statusCode || 500).json({ message: error.message });
    }
};

// Add the new function to your exports
export { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getMyProducts,
  getMyProductById,
  publishProduct
};
// Add this to your exports at the bottom of the file



// Add the new functions to the export list


// We will add Update and Delete later to keep this simple.
