import mongoose from "mongoose";

const whatsappMessagesSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  sentToCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Delivered",
  },
}, { timestamps: true });

const WhatsappMessage = mongoose.model("WhatsappMessage", whatsappMessagesSchema);
export default WhatsappMessage;
