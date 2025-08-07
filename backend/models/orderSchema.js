import mongoose from "mongoose";

const CUSTOMER = ["Rajesh Textiles", "Fashion Hub", "Style Point", "Modern Fabrics"];
const PRODUCTS = [
  "Premium Cotton Base",
  "Silk Blend Base",
  "Polyester Mix Blend",
  "Cotton Designer Print",
];

// order Items Schema
const orderItemsSchema = new mongoose.Schema({
   product:{
        type: String,
        enum: PRODUCTS,
        required: true,
      },
      color:{
        type: String,
        required: true,
      },
      quantity:{
        type: Number,
        required: true,
      },
      unit:{
        type: String,
        enum: ["METERS", "SETS"],
        required: true,
      },
      pricePerMeters:{
        type: Number,
        required: true,
      },
},{_id: false});

const orderSchema = new mongoose.Schema({
 // Customer Information
   customer:{
    type: String,
    enum: CUSTOMER,
    required: true,
   },
   orderDate:{
    type: Date,
    required: true,
   },
   deliveryDate:{
    type: Date,
    required: true,
   },
 // Order Items
   orderItems: [orderItemsSchema],
// Order Notes
   notes:{
    type: String,
   },
},{timestamps: true});

const Order = mongoose.model('Order', orderSchema);
export default Order;