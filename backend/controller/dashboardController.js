import Product from "../models/productSchema.js";
import Order from "../models/orderSchema.js";
import Customer from "../models/customerSchema.js";
import Stock from "../models/stockScehma.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();

    // Get active orders count (orders that are not delivered or cancelled)
    const activeOrders = await Order.countDocuments({
      status: { $nin: ["delivered", "cancelled"] }
    });

    // Get total customers count
    const totalCustomers = await Customer.countDocuments();

    // Get low stock items count
    const lowStockItems = await Stock.countDocuments({ status: "low" });

    // Mock change percentages and trends for now
    // In a real application, you would calculate these based on historical data
    const productChange = "+10%";
    const productTrend = "up";
    const orderChange = "+5%";
    const orderTrend = "up";
    const customerChange = "+8%";
    const customerTrend = "up";
    const stockChange = "-2%";
    const stockTrend = "down";

    // Return dashboard statistics
    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        activeOrders,
        totalCustomers,
        lowStockItems,
        productChange,
        productTrend,
        orderChange,
        orderTrend,
        customerChange,
        customerTrend,
        stockChange,
        stockTrend
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    // Get the 5 most recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(5); // Limit to 5 results

    // Format the orders for the frontend
    const formattedOrders = recentOrders.map(order => {
      // Calculate total amount from order items
      const totalAmount = order.orderItems.reduce((sum, item) => {
        return sum + (item.quantity * item.pricePerMeters);
      }, 0);

      // Get the first product from order items for display
      const firstProduct = order.orderItems[0];
      
      // Format order ID as ORD-XXX where XXX is a number
      const orderId = order._id.toString();
      // Extract only numeric digits from the ID
      const numericChars = orderId.replace(/[^0-9]/g, '');
      // Use the last 3 digits, or pad with zeros if less than 3 digits
      const lastThreeDigits = numericChars.slice(-3).padStart(3, '0');
      const formattedId = `ORD-${lastThreeDigits}`;
      
      return {
        id: formattedId,
        originalId: order._id, // Keep original ID for reference
        customer: order.customer,
        product: firstProduct ? firstProduct.product : 'N/A',
        quantity: firstProduct ? `${firstProduct.quantity}${firstProduct.unit}` : 'N/A',
        status: order.status,
        priority: getPriorityFromDate(order.deliveryDate), // Helper function to determine priority
        amount: `₹${totalAmount.toLocaleString('en-IN')}`
      };
    });

    res.status(200).json({
      success: true,
      recentOrders: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};

// Helper function to determine priority based on delivery date
function getPriorityFromDate(deliveryDate) {
  const today = new Date();
  const delivery = new Date(deliveryDate);
  const daysUntilDelivery = Math.ceil((delivery - today) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDelivery <= 3) {
    return "high";
  } else if (daysUntilDelivery <= 7) {
    return "medium";
  } else {
    return "low";
  }
}

export const getLatestProducts = async (req, res) => {
  try {
    // Get the 5 most recently added products
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 }) // Sort by creation date, newest first
      .limit(5); // Limit to 5 results

    // Format the products for the frontend
    const formattedProducts = latestProducts.map(product => {
      return {
        id: product._id,
        name: product.productName,
        category: product.category || 'Uncategorized',
        createdAt: product.createdAt
      };
    });

    res.status(200).json({
      success: true,
      latestProducts: formattedProducts
    });
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
};

export const getStockAlerts = async (req, res) => {
  try {
    // Get the 5 most recent low or out of stock items
    const stockAlerts = await Stock.find({
      status: { $in: ["low", "out"] }
    })
      .sort({ updatedAt: -1 }) // Sort by update date, newest first
      .limit(5); // Limit to 5 results

    // Format the stock alerts for the frontend
    const formattedAlerts = stockAlerts.map(stock => {
      // Get the actual product name from stockDetails if available
      let productName = "Unknown Product";
      let stockTypeLabel = "";
      
      // Log the stock details for debugging
      console.log('Stock Type:', stock.stockType);
      console.log('Stock Details:', JSON.stringify(stock.stockDetails));
      console.log('Stock Document:', JSON.stringify(stock.toObject()));
      
      try {
        // Get the stock details as a plain JavaScript object
        const stockObj = stock.toObject();
        const details = stockObj.stockDetails || {};
        
        // Extract product name based on stock type
        if (stock.stockType === "Gray Stock") {
          // For Gray Stock
          productName = details.product || "Unknown Product";
          stockTypeLabel = `${details.factory || ""} Gray Stock`;
        } else if (stock.stockType === "Design Stock") {
          // For Design Stock
          productName = details.product || "Unknown Product";
          stockTypeLabel = `${details.design || ""} Design`;
        } else if (stock.stockType === "Factory Stock") {
          // For Factory Stock
          productName = details.product || "Unknown Product";
          stockTypeLabel = `${details.processingFactory || ""} Factory Stock`;
        } else {
          // Default case
          productName = "Unknown Product";
          stockTypeLabel = stock.stockType;
        }
        
        // If product name is still unknown, try to find it in other places
        if (productName === "Unknown Product") {
          // Try to get product from variants
          if (stockObj.variants && stockObj.variants.length > 0 && stockObj.variants[0].product) {
            productName = stockObj.variants[0].product;
          }
          
          // Try to get from additionalInfo
          if (productName === "Unknown Product" && stockObj.addtionalInfo && stockObj.addtionalInfo.product) {
            productName = stockObj.addtionalInfo.product;
          }
          
          // Last resort: use one of the predefined products
          if (productName === "Unknown Product") {
            productName = "Premium Cotton Base";
          }
        }
      } catch (error) {
        console.error('Error extracting product name:', error);
        productName = "Premium Cotton Base"; // Default to a known product
        stockTypeLabel = stock.stockType || "Unknown Type";
      }
      
      // Get quantity and unit from the first variant if available
      let quantity = "0";
      let unit = "";
      if (stock.variants && stock.variants.length > 0) {
        quantity = stock.variants[0].quantity.toString();
        unit = stock.variants[0].unit;
      }
      
      return {
        product: productName,
        stockTypeLabel: stockTypeLabel,
        current: `${quantity}${unit}`,
        minimum: "100", // Hardcoded minimum for now
        severity: stock.status === "out" ? "critical" : "warning",
        stockType: stock.stockType
      };
    });

    res.status(200).json({
      success: true,
      stockAlerts: formattedAlerts
    });
  } catch (error) {
    console.error("Error fetching stock alerts:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error
    });
  }
}
