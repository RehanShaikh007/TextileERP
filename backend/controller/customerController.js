import Customer from "../models/customerSchema.js";
import { sendWhatsAppMessage } from "../utils/whatsappService.js";
import { WhatsappNotification } from "../models/whatsappNotificationSchema.js";

import WhatsappMessages from "../models/whatsappMessages.js";
export const createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      customerType,
      email,
      phone,
      city,
      creditLimit,
      address,
    } = req.body;

    if (
      !customerName || !customerType || !email || !phone ||
      !city || !creditLimit || !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newCustomer = await Customer.create({
      customerName,
      customerType,
      email,
      phone,
      city,
      creditLimit,
      address,
    });

    /** 🔔 Check Notification Settings **/
    const notificationSettings = await WhatsappNotification.findOne();

    let customerAlertsEnabled = false;
    if (notificationSettings) {
      customerAlertsEnabled = notificationSettings.newCustomers;
    }

    /** 📲 WhatsApp Notification **/
    if (customerAlertsEnabled) {
      const messageText = `🆕 New Customer Added!\n\n👤 Name: ${newCustomer.customerName}\n🏷 Type: ${newCustomer.customerType}\n📧 Email: ${newCustomer.email}\n📞 Phone: ${newCustomer.phone}\n🏙 City: ${newCustomer.city}\n💳 Credit Limit: ${newCustomer.creditLimit}\n📍 Address: ${newCustomer.address}\n\nView details: ${process.env.CLIENT_URL}/customers/${newCustomer._id}`;
      let statusMsg = "Delivered";
      try {
        await sendWhatsAppMessage(process.env.WHATSAPP_NOTIFICATION_NUMBER, messageText);
      } catch (whatsAppError) {
        console.error("WhatsApp Notification Failed (createCustomer):", whatsAppError);
        statusMsg = "Not Delivered";
      }
      await WhatsappMessages.create({
        message: messageText,
        type: "product_update",
        sentToCount: 2,
        status: statusMsg,
      });
    }

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error) {
    console.error("Create Customer Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error,
    });
  }
};

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error('Error fetching customer by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};