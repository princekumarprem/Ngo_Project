import dotenv from "dotenv";
dotenv.config();


import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../model/payment.model.js';
import { sendPaymentSuccessEmail } from '../utils/email.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
  
});



export const createOrder = async (req, res) => {
  try {
    const { amount, name, email } = req.body;

    if (!amount || !name || !email) {
      return res.status(400).json({ message: 'amount, name, email are required' });
    }

    const options = {
      amount: Number(amount) * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);


    await Payment.create({
      name,
      email,
      amount: order.amount,
      currency: order.currency,
      status: 'created',
      razorpayOrderId: order.id,
    });

    return res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Error in createOrder:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ message: 'Invalid signature' });
    }


    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        status: 'paid',
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    try {
      await sendPaymentSuccessEmail({
        name: payment.name,
        email: payment.email,
        amount: payment.amount,
      });
    } catch (emailErr) {
      console.error('Error sending email:', emailErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and email sent',
      payment,
    });
  } catch (err) {
    console.error('Error in verifyPayment:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
