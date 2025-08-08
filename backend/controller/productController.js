import Product from "../models/productSchema.js";
import { sendWhatsAppMessage } from "../utils/whatsappService.js";
import WhatsappMessages from "../models/whatsappMessages.js";

export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();

    console.log("New Product Created:", newProduct);

    const messageText = `🆕 New product added!\n\n📦 Product: *${newProduct.productName}*\n🆔 SKU: ${newProduct.sku}\n📂 Category: ${newProduct.category}\n\nView details: ${process.env.CLIENT_URL}/products/${newProduct._id}`;

    let status = "Delivered";
    try {
      await sendWhatsAppMessage(process.env.WHATSAPP_NOTIFICATION_NUMBER, messageText);
    } catch (whatsAppError) {
      console.error("WhatsApp Notification Failed (createProduct):", whatsAppError);
      status = "Not Delivered";
    }

    // Save message log
    await WhatsappMessages.create({
      message: messageText,
      sentToCount: 2, // or dynamically get from your admin list
      status,
    });

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

    const messageText = `✏️ Product Updated!\n\n📦 Product: *${updatedProduct.productName}*\n🆔 SKU: ${updatedProduct.sku}\n📂 Category: ${updatedProduct.category}\n\nCheck the changes here: ${process.env.CLIENT_URL}/products/${updatedProduct._id}`;

    let status = "Delivered";
    try {
      await sendWhatsAppMessage(process.env.WHATSAPP_NOTIFICATION_NUMBER, messageText);
    } catch (whatsAppError) {
      console.error("WhatsApp Notification Failed (updateProduct):", whatsAppError);
      status = "Not Delivered";
    }

    // Save message log
    await WhatsappMessages.create({
      message: messageText,
      sentToCount: 2,
      status,
    });

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

    const messageText = `🗑️ Product Deleted!\n\n📦 Product: *${deletedProduct.productName}*\n🆔 SKU: ${deletedProduct.sku}\n📂 Category: ${deletedProduct.category}`;

    let status = "Delivered";
    try {
      await sendWhatsAppMessage(process.env.WHATSAPP_NOTIFICATION_NUMBER, messageText);
    } catch (whatsAppError) {
      console.error("WhatsApp Notification Failed (deleteProduct):", whatsAppError);
      status = "Not Delivered";
    }

    // Save message log
    await WhatsappMessages.create({
      message: messageText,
      sentToCount: 2,
      status,
    });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};
