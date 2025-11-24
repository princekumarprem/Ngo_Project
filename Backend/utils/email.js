import dotenv from "dotenv";
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPaymentSuccessEmail = async ({ name, email, amount }) => {
  const formattedAmount = (amount / 100).toFixed(2);

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: '🙏 Thank You for Supporting Our Mission!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333;">
        
        <h2 style="color: #0A7E8C;">Dear ${name},</h2>

        <p>On behalf of our entire NGO team, we extend our heartfelt gratitude for your generous contribution.</p>

        <p>Your support means a lot to us and will directly help in transforming lives and creating a positive impact in the community.</p>

        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0;">💳 Donation Details</h3>
          <p style="margin: 5px 0;"><strong>Donor Name:</strong> ${name}</p>
          <p style="margin: 5px 0;"><strong>Amount Donated:</strong> ₹${formattedAmount}</p>
          <p style="margin: 5px 0;"><strong>Status:</strong> Successful ✔️</p>
        </div>

        <p>Every contribution, big or small, brings us closer to our mission. Your donation will be used responsibly and transparently to support those in need.</p>

        <p>If you have any questions or wish to know more about how your donation is being utilized, please feel free to reply to this email.</p>

        <br/>

        <p>With gratitude,<br/>
        <strong>Your NGO Team</strong><br/>
        (Registered & Verified Non-Profit Organization)</p>

        <hr style="margin: 30px 0;"/>

        <p style="font-size: 12px; color: #777;">
          You received this email because you made a donation on our platform.
          If you believe this was a mistake, please contact us immediately.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

