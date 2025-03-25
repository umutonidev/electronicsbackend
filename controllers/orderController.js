// controllers/orderController.js
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const order = new Order({
            orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
            shippingAddress: req.body.shippingAddress,
            paymentMethod: req.body.paymentMethod,
            itemsPrice: req.body.itemsPrice,
            shippingPrice: req.body.shippingPrice,
            taxPrice: req.body.taxPrice,
            totalPrice: req.body.totalPrice,
            user: req.user._id,
        });

        const createdOrder = await order.save();

        //Update product stock after order is placed
        for(const item of req.body.orderItems){
            const product = await Product.findById(item._id); //Use _id from cart items
            if(product){
                product.stockQuantity -= item.quantity;
                await product.save();
            } else {
                console.warn(`Product with id ${item._id} not found while updating stock`);
                //Consider how to handle this.  Maybe cancel the order, or alert the admin.
            }
        }

        res.status(201).send({ message: 'New Order Created', order: createdOrder });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to create order', error: error.message });
    }
};

// Get order by ID
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email'); // Populate user details
        if (order) {
            res.send(order);
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch order', error: error.message });
    }
};

// Update order to paid
export const updateOrderToPaid = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updatedOrder = await order.save();
            res.send({ message: 'Order Paid', order: updatedOrder });
        } else {
            res.status(404).send({ message: 'Order Not Found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to update order', error: error.message });
    }
};

// Get order history for a user
export const getOrderHistory = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); // Sort by createdAt descending
        res.send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch order history', error: error.message });
    }
};

//Admin routes
// Get all orders (Admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'firstName lastName'); // Populate user details
        res.send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to fetch orders', error: error.message });
    }
};

//Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to delete order', error: error.message });
  }
};

//Deliver Order API
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to deliver order', error: error.message });
  }
};