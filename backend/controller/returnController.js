import Return from "../models/returnSchema.js";
import Order from "../models/orderSchema.js";

export const createReturn = async(req, res) =>{
    try {
        const {order, product, color, quantityInMeters, returnReason} = req.body;

        if(!order || !product || !color || !quantityInMeters || !returnReason){
            return res.status(401).json({
                success: false,
                message: 'Missing Required Field!'
            })
        }

        // Get order details to extract customer name
        const orderDetails = await Order.findById(order);
        if (!orderDetails) {
            return res.status(404).json({
                success: false,
                message: 'Order not found!'
            })
        }

        // Generate Return ID
        const returnsCount = await Return.countDocuments();
        const returnId = `RET-${String(returnsCount + 1).padStart(3, '0')}`;

        const newReturn = await Return.create({
           id: returnId,
           order,
           orderId: order,
           customer: orderDetails.customer,
           product,
           color,
           quantityInMeters,
           returnReason
        })

        return res.status(201).json({
            success: true,
            message: 'Return request created successfully!',
            return: newReturn,
        })

    } catch (error) {
        console.error('Error while creating return request', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error
        })
    }
}

export const getAllReturns = async (req, res) => {
  try {
    const returns = await Return.find();
    res.status(200).json({
      success: true,
      returns,
    });
  } catch (error) {
    console.error('Error fetching returns:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const getReturnById = async (req, res) => {
  try {
    const ret = await Return.findById(req.params.id);
    if (!ret) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }
    res.status(200).json({
      success: true,
      return: ret,
    });
  } catch (error) {
    console.error('Error fetching return by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const updateReturn = async (req, res) => {
  try {
    const updatedReturn = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedReturn) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Return updated successfully',
      return: updatedReturn,
    });
  } catch (error) {
    console.error('Error updating return:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const deleteReturn = async (req, res) => {
  try {
    const deletedReturn = await Return.findByIdAndDelete(req.params.id);
    if (!deletedReturn) {
      return res.status(404).json({
        success: false,
        message: 'Return not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Return deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting return:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};