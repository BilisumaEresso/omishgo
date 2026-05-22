/**
 * Generate a random 6-digit OTP
 * @returns {string} 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Simulate sending OTP via SMS
 * In production, integrate with actual SMS service (Twilio, AWS SNS, etc.)
 *
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise<boolean>} True if send successful
 */
export const sendOTPViaSMS = async (phone, otp) => {
  try {
    // TODO: Integrate with actual SMS service
    // For now, log to console (development only)
    console.log(`🔐 OTP for ${phone}: ${otp}`);
    console.log("📱 In production, this would send via SMS/Twilio/AWS SNS");

    // Simulate successful send
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};
