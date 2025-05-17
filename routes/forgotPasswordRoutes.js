import express from 'express';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

let verificationCodes = {}; // In-memory store — use Redis or DB in production

// Send verification code to email
router.post('/send-code', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    verificationCodes[email] = code;
    console.log(code)

    await sendEmail(email, "Your Verification Code", `Your verification code is: ${code}`);

    res.json({ message: "Verification code sent successfully" });
  } catch (err) {
    console.error("Send Code Error:", err.message);
    res.status(500).json({ message: "Failed to send verification code" });
  }
});

//  Verify code
router.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] && verificationCodes[email] === code) {
    return res.json({ message: "Code verified successfully" });
  }
  return res.status(400).json({ message: "Invalid or expired verification code" });
});

//  Reset password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // Let the pre-save hook hash it
    await user.save();

    delete verificationCodes[email];
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Reset Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
