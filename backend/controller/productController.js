import Product from "../models/productSchema.js";
import { sendWhatsAppMessage, sentToCount } from "../utils/whatsappService.js";
import WhatsappMessages from "../models/whatsappMessages.js";
import { WhatsappNotification } from "../models/whatsappNotificationSchema.js";
import Order from "../models/orderSchema.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();

    console.log("New Product Created:", newProduct);

    /** 🔔 Check Notification Settings **/
    const notificationSettings = await WhatsappNotification.findOne();

    let productUpdatesEnabled = false;
    if (notificationSettings) {
      productUpdatesEnabled = notificationSettings.productUpdates;
    }

    /** 📲 WhatsApp Notification **/
    if (productUpdatesEnabled) {
      const messageText = `🆕 New product added!\n\n📦 Product: *${newProduct.productName}*\n🆔 SKU: ${newProduct.sku}\n📂 Category: ${newProduct.category}\n\nView details: ${process.env.CLIENT_URL}/products/${newProduct._id}`;

      let status = "Delivered";
      try {
        await sendWhatsAppMessage(messageText);
      } catch (whatsAppError) {
        console.error("WhatsApp Notification Failed (createProduct):", whatsAppError);
        status = "Not Delivered";
      }

      // Save message log
      await WhatsappMessages.create({
        message: messageText,
        type: "product_update",
        sentToCount: sentToCount, // or dynamically get from your admin list
        status,
      });
    }

    res.status(201).json({
      success: true,
      message: "Product Created Successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("Error Creating Product:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    /** 🔔 Check Notification Settings **/
    const notificationSettings = await WhatsappNotification.findOne();

    let productUpdatesEnabled = false;
    if (notificationSettings) {
      productUpdatesEnabled = notificationSettings.productUpdates;
    }

    /** 📲 WhatsApp Notification **/
    if (productUpdatesEnabled) {
      const messageText = `✏️ Product Updated!\n\n📦 Product: *${updatedProduct.productName}*\n🆔 SKU: ${updatedProduct.sku}\n📂 Category: ${updatedProduct.category}\n\nCheck the changes here: ${process.env.CLIENT_URL}/products/${updatedProduct._id}`;

      let status = "Delivered";
      try {
        await sendWhatsAppMessage(messageText);
      } catch (whatsAppError) {
        console.error("WhatsApp Notification Failed (updateProduct):", whatsAppError);
        status = "Not Delivered";
      }

      // Save message log
      await WhatsappMessages.create({
        message: messageText,
        type: "product_update",
        sentToCount: sentToCount,
        status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    /** 🔔 Check Notification Settings **/
    const notificationSettings = await WhatsappNotification.findOne();

    let productUpdatesEnabled = false;
    if (notificationSettings) {
      productUpdatesEnabled = notificationSettings.productUpdates;
    }

    /** 📲 WhatsApp Notification **/
    if (productUpdatesEnabled) {
      const messageText = `🗑️ Product Deleted!\n\n📦 Product: *${deletedProduct.productName}*\n🆔 SKU: ${deletedProduct.sku}\n📂 Category: ${deletedProduct.category}`;

      let status = "Delivered";
      try {
        await sendWhatsAppMessage(messageText);
      } catch (whatsAppError) {
        console.error("WhatsApp Notification Failed (deleteProduct):", whatsAppError);
        status = "Not Delivered";
      }

      // Save message log
      await WhatsappMessages.create({
        message: messageText,
        type: "product_update",
        sentToCount: sentToCount,
        status,
      });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get top 5 products based on revenue and quantity sold
export const getTopProducts = async (req, res) => {
  try {
    const pipeline = [
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product", // product name string
          quantity: { $sum: "$orderItems.quantity" },
          revenue: {
            $sum: {
              $multiply: [
                "$orderItems.quantity",
                "$orderItems.pricePerMeters"
              ]
            }
          }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "productName",
          as: "productInfo"
        }
      },
      {
        $project: {
          name: "$_id",
          revenue: 1,
          quantity: 1
        }
      }
    ];

    const data = await Order.aggregate(pipeline);

    // Add random growth between 10.0 and 40.0
    const topProducts = data.map((product) => ({
      name: product.name,
      revenue: product.revenue,
      quantity: product.quantity,
      growth: parseFloat((Math.random() * (40 - 10) + 10).toFixed(1)) // random float
    }));

    res.status(200).json(topProducts);
  } catch (error) {
    console.error("Error fetching top products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET recent orders for a particular product
export const getRecentOrdersByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    // Find the product name from Product collection
    const product = await Product.findById(productId).select("productName");
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Fetch recent orders containing this product
    const orders = await Order.find({
      "orderItems.product": product.productName
    })
      .sort({ orderDate: -1 }) // most recent first
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      product: product.productName,
      recentOrders: orders.map(order => ({
        orderId: order._id,
        customer: order.customer,
        status: order.status,
        orderDate: order.orderDate,
        deliveryDate: order.deliveryDate,
        items: order.orderItems.filter(item => item.product === product.productName)
      })),
    });
  } catch (error) {
    console.error("Error fetching recent orders by product:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Controller to get all product names
export const getAllProductNames = async (req, res) => {
  try {
    const products = await Product.find({}, 'productName'); // Only fetch the productName field
    const productNames = products.map(product => product.productName);
    res.status(200).json({ productNames });
  } catch (error) {
    console.error('Error fetching product names:', error);
    res.status(500).json({ message: 'Server Error: Unable to fetch product names.' });
  }
};