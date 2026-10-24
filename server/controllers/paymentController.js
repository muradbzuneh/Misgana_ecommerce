
let stripeInstance = null;

const getStripe = () => {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables. Please check your .env file."
      );
    }
    stripeInstance = require("stripe")(secretKey);
  }
  return stripeInstance;
};

const createPaymentIntent = async (req, res) => {
  const totalAmount = parseInt(req.query.totalAmount);
  if (totalAmount !== null && totalAmount > 0) {
    try {
      const stripe = getStripe();
      const paymentIntents = await stripe.paymentIntents.create({
        amount: totalAmount,
        currency: "usd",
      });
      const clientSecret = await paymentIntents.client_secret;
      const paymentIntentsId = await paymentIntents.id;
      res.status(201).json({
        success: true,
        message: "Payment have successfully Created.",
        clientSecret: clientSecret,
        paymentIntentsId: paymentIntentsId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Error: ${error.message || error}`,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Please provide a valid total amount for the payment.",
    });
  }
};

module.exports = {
  createPaymentIntent,
};
