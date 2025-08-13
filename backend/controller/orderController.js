import { sendWhatsAppMessage, sentToCount } from "../utils/whatsappService.js";
import WhatsappMessages from "../models/whatsappMessages.js";
import Order from "../models/orderSchema.js";
import { WhatsappNotification } from "../models/whatsappNotificationSchema.js";

export const createOrder = async (req, res) => {
  try {
    const { customer, status, orderDate, deliveryDate, orderItems, notes } =
      req.body;

    if (
      !customer ||
      !orderDate ||
      !deliveryDate ||
      !orderItems ||
      orderItems.length === 0
    ) {
      return res.status(401).json({
        success: false,
        message: "Missing Required Fields or No Order Items Provided!",
      });
    }

    const newOrder = await Order.create({
      customer,
      status: status || "pending",
      orderDate,
      deliveryDate,
      orderItems,
      notes,
    });

    const notificationSettings = await WhatsappNotification.findOne();

    let orderUpdatesEnabled = false;
    if (notificationSettings) {
      orderUpdatesEnabled = notificationSettings.orderUpdates;
    }
    if (orderUpdatesEnabled) {
      /** 📲 WhatsApp Notification **/
      const messageText = `🆕 New Order Created!\n\n🆔 Order ID: *${newOrder._id}*\n👤 Customer: ${customer}\n📅 Order Date: ${orderDate}\n🚚 Delivery Date: ${deliveryDate}\n📦 Items: ${orderItems
        .map((item) => `${item.productName} (${item.quantity})`)
        .join(", ")}\n\nView details: ${process.env.CLIENT_URL}/orders/${newOrder._id}`;
      let statusMsg = "Delivered";
      try {
        await sendWhatsAppMessage(
          messageText
        );
      } catch (whatsAppError) {
        console.error(
          "WhatsApp Notification Failed (createOrder):",
          whatsAppError
        );
        statusMsg = "Not Delivered";
      }
      await WhatsappMessages.create({
        message: messageText,
        type: "order_update",
        sentToCount: sentToCount,
        status: statusMsg,
      });
    }

    res.status(201).json({
      success: true,
      message: "Order Created Successfully!",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating Order", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
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
        message: "Order not found",
      });
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const notificationSettings = await WhatsappNotification.findOne();

    let orderUpdatesEnabled = false;
    if (notificationSettings) {
      orderUpdatesEnabled = notificationSettings.orderUpdates;
    }

    /** 📲 WhatsApp Notification **/
    if (orderUpdatesEnabled) {
      const messageText = `✏️ Order Updated!\n\n🆔 Order ID: *${updatedOrder._id}*\n👤 Customer: ${updatedOrder.customer}\n📅 Order Date: ${updatedOrder.orderDate}\n🚚 Delivery Date: ${updatedOrder.deliveryDate}\n📦 Items: ${updatedOrder.orderItems
        .map((item) => `${item.productName} (${item.quantity})`)
        .join(", ")}\n\nView details: ${process.env.CLIENT_URL}/orders/${updatedOrder._id}`;
      let statusMsg = "Delivered";
      try {
        await sendWhatsAppMessage(
          messageText
        );
      } catch (whatsAppError) {
        console.error(
          "WhatsApp Notification Failed (updateOrder):",
          whatsAppError
        );
        statusMsg = "Not Delivered";
      }
      await WhatsappMessages.create({
        message: messageText,
        type: "order_update",
        sentToCount: sentToCount,
        status: statusMsg,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
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
        message: "Order not found",
      });
    }

    const notificationSettings = await WhatsappNotification.findOne();

    let orderUpdatesEnabled = false;
    if (notificationSettings) {
      orderUpdatesEnabled = notificationSettings.orderUpdates;
    }

    /** 📲 WhatsApp Notification **/
    if (orderUpdatesEnabled) {
      const messageText = `🗑 Order Deleted!\n\n🆔 Order ID: *${deletedOrder._id}*\n👤 Customer: ${deletedOrder.customer}\n📅 Order Date: ${deletedOrder.orderDate}\n🚚 Delivery Date: ${deletedOrder.deliveryDate}\n📦 Items: ${deletedOrder.orderItems
        .map((item) => `${item.productName} (${item.quantity})`)
        .join(", ")}`;
      let statusMsg = "Delivered";
      try {
        await sendWhatsAppMessage(
          messageText
        );
      } catch (whatsAppError) {
        console.error(
          "WhatsApp Notification Failed (deleteOrder):",
          whatsAppError
        );
        statusMsg = "Not Delivered";
      }
      await WhatsappMessages.create({
        message: messageText,
        type: "order_update",
        sentToCount: sentToCount,
        status: statusMsg,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

// Get total revenue from all orders
export const getTotalRevenue = async (req, res) => {
  try {
    const orders = await Order.find({ status: "delivered" });

    // Calculate total revenue
    const totalRevenue = orders.reduce((orderSum, order) => {
      const orderTotal = order.orderItems.reduce((sum, item) => {
        return sum + (item.quantity * item.pricePerMeters);
      }, 0);
      return orderSum + orderTotal;
    }, 0);

    res.json({ totalRevenue });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({ error: "Failed to calculate total revenue" });
  }
};

// Get count of delivered orders
export const getDeliveredOrdersCount = async (req, res) => {
  try {
    const count = await Order.countDocuments({ status: "delivered" });
    res.json({ deliveredOrdersCount: count });
  } catch (error) {
    console.error("Error counting delivered orders:", error);
    res.status(500).json({ error: "Failed to count delivered orders" });
  }
};