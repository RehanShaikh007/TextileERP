import twilio from "twilio";
import dotenv from 'dotenv'
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromWhatsAppNumber = "whatsapp:+14155238886"; // Twilio Sandbox number
if (!accountSid || !authToken) {
  throw new Error("Twilio Account SID and Auth Token must be set in environment variables.");
}

const client = new twilio(accountSid, authToken);

export async function sendWhatsAppMessage(to, message) {
  try {
    const response = await client.messages.create({
      from: fromWhatsAppNumber,
      to: `whatsapp:${to}`, // dynamically insert phone number
      body: message,
    });

    console.log("WhatsApp message sent:", response.sid);
  } catch (error) {
    console.error("Failed to send WhatsApp:", error);
  }
}

