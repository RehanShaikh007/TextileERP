import Order from "../models/orderSchema.js";

export const createOrder = async(req, res) => {
    try {
        const {customer, orderDate, deliveryDate, orderItems, notes} = req.body;

        if(!customer || !orderDate || !deliveryDate || !orderItems || orderItems.length === 0){
            return res.status(401).json({
                success: false,
                message: 'Missing Required Fields or No Order Items Provided!'
            })
        }

        const newOrder = await Order.create({
            customer,
            orderDate,
            deliveryDate,
            orderItems,
            notes
        });

        res.status(201).json({
            success: true,
            message: "Order Created Successfully!",
            order: newOrder,
        })

    } catch (error) {
        console.error('Error creating Order', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error
        })
    }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};