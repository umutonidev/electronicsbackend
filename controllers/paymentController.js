// controllers/paymentController.js

export const getPaymentKeys = (req, res) => {
    res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_...' }); // Replace with your key
  };