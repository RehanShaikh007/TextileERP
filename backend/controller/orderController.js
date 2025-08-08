import { sendWhatsAppMessage } from "../utils/whatsappService.js";
import WhatsappMessages from "../models/whatsappMessages.js";
import Order from "../models/orderSchema.js";

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

    /** 📲 WhatsApp Notification **/
    const messageText = `🆕 New Order Created!\n\n🆔 Order ID: *${newOrder._id}*\n👤 Customer: ${customer}\n📅 Order Date: ${orderDate}\n🚚 Delivery Date: ${deliveryDate}\n📦 Items: ${orderItems
      .map((item) => `${item.productName} (${item.quantity})`)
      .join(", ")}\n\nView details: ${process.env.CLIENT_URL}/orders/${newOrder._id}`;
    let statusMsg = "Delivered";
    try {
      await sendWhatsAppMessage(
        process.env.WHATSAPP_NOTIFICATION_NUMBER,
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
      sentToCount: 2,
      status: statusMsg,
    });

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

    /** 📲 WhatsApp Notification **/
    const messageText = `✏️ Order Updated!\n\n🆔 Order ID: *${updatedOrder._id}*\n👤 Customer: ${updatedOrder.customer}\n📅 Order Date: ${updatedOrder.orderDate}\n🚚 Delivery Date: ${updatedOrder.deliveryDate}\n📦 Items: ${updatedOrder.orderItems
      .map((item) => `${item.productName} (${item.quantity})`)
      .join(", ")}\n\nView details: ${process.env.CLIENT_URL}/orders/${updatedOrder._id}`;
    let statusMsg = "Delivered";
    try {
      await sendWhatsAppMessage(
        process.env.WHATSAPP_NOTIFICATION_NUMBER,
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
      sentToCount: 2,
      status: statusMsg,
    });

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

    /** 📲 WhatsApp Notification **/
    const messageText = `🗑 Order Deleted!\n\n🆔 Order ID: *${deletedOrder._id}*\n👤 Customer: ${deletedOrder.customer}\n📅 Order Date: ${deletedOrder.orderDate}\n🚚 Delivery Date: ${deletedOrder.deliveryDate}\n📦 Items: ${deletedOrder.orderItems
      .map((item) => `${item.productName} (${item.quantity})`)
      .join(", ")}`;
    let statusMsg = "Delivered";
    try {
      await sendWhatsAppMessage(
        process.env.WHATSAPP_NOTIFICATION_NUMBER,
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
      sentToCount: 2,
      status: statusMsg,
    });

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
