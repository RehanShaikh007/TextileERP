// routes/whatsappMessage.routes.js
import express from "express";
import { createWhatsappMessage, getWhatsappMessages } from "../controller/whatsappMessages.js";

const router = express.Router();

// POST - Create a new message
router.post("/", createWhatsappMessage);

// GET - Get paginated messages
router.get("/", getWhatsappMessages);

export default router;
