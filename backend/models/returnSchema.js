import mongoose from "mongoose";

const PRODUCTS = [
  "Premium Cotton Base",
  "Silk Blend Base",
  "Polyester Mix Blend",
  "Cotton Designer Print",
];

const returnSchema = new mongoose.Schema({
    order: {
        type: String,
        required: true,
    },
    product:{
        type: String,
        enum: PRODUCTS,
        required: true,
    },
    color:{
        type: String,
        required: true,
    },
    quantityInMeters:{
        type: Number,
        required: true,
    },
    returnReason:{
        type: String,
        required: true,
    },
    isApprove: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const Return = mongoose.model('Return', returnSchema);
export default Return;