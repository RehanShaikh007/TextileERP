import Stock from "../models/stockScehma.js";

export const createStock = async (req, res) => {
  try {
    const { stockType, status, variants, stockDetails, addtionalInfo } = req.body;

    if (!stockType || !variants ||variants.length === 0 || !stockDetails || stockDetails.length === 0 || !addtionalInfo || addtionalInfo.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required stock fields.",
      });
    }

    const newStock = await Stock.create({
      stockType,
      status: status || "available",
      variants,
      stockDetails,
      addtionalInfo,
    });

    res.status(200).json({
      success: true,
      message: "Stock added successfully!",
      stock: newStock,
    });
  } catch (error) {
    console.error("Stock Creation Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error,
    });
  }
};

export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json({
      success: true,
      stocks,
    });
  } catch (error) {
    console.error('Error fetching stocks:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }
    res.status(200).json({
      success: true,
      stock,
    });
  } catch (error) {
    console.error('Error fetching stock by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const updateStock = async (req, res) => {
  try {
    const updatedStock = await Stock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      stock: updatedStock,
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const deleteStock = async (req, res) => {
  try {
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting stock:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};
