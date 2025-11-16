import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (Only logged-in users can create an order)
const addOrderItems = async (req, res) => {
  const { orderItems, shippingAddress, totalPrice } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // --- CRITICAL STEP: Update stock quantity in the database ---
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        if (product.stock < item.qty) {
            res.status(400);
            throw new Error(`Not enough stock for ${product.name}. Only ${product.stock} available.`);
        }
        product.stock -= item.qty; // Decrease the stock
        await product.save();
      } else {
        res.status(404);
        throw new Error(`Product with id ${item.product} not found.`);
      }
    }

    // Once stock is updated, create the new order
    const order = new Order({
      orderItems: orderItems.map(item => ({
        ...item,
        product: item._id, // The ID from the cart item
      })),
      user: req.user._id, // from the `protect` middleware
      shippingAddress,
      totalPrice,
      isPaid: true, // For simulation, we'll assume it's paid immediately
      paidAt: Date.now(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);

  } catch (error) {
    res.status(res.statusCode || 500).json({ message: error.message });
  }
};


// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export { addOrderItems, getMyOrders };