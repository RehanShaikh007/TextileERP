import Product from "../models/productSchema.js";
import { sendWhatsAppMessage } from "../utils/whatsappService.js";

export const createProduct = async(req, res) => {
    try {
        const productData = req.body;

        const newProduct = new Product(productData);
        await newProduct.save();

        console.log('New Product Created:', newProduct);
        
        
        res.status(201).json({
            success: true,
            message: 'Product Created Successfully!',
            product : newProduct,
        })
    } catch (error) {
        console.error('Error Creating Product:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error
        })
    }
}

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error
    });
  }
}

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    // console.log('Product Updated:', updatedProduct);
    await sendWhatsAppMessage(
            process.env.WHATSAPP_NOTIFICATION_NUMBER,`product : ${updatedProduct.productName} has updated. View Changes at ${process.env.CLIENT_URL}/products/${updatedProduct._id}`)
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error,
    });
  }
};

// export const uploadProductImages = async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'No files uploaded' 
//       });
//     }

//     // Upload to Cloudinary
//     const uploadResults = await uploadToCloudinary(req.files);
    
//     // Clean up local files
//     await cleanUpFiles(req.files.map(file => file.path));

//     res.status(200).json({
//       success: true,
//       images: uploadResults
//     });
//   } catch (error) {
//     console.error('Image upload error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Image upload failed',
//       error: error.message
//     });
//   }
// };