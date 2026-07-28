/**
 * Modular Dummy Payment Gateway Service for YUMI DXB Fashion
 * Decoupled Architecture: Simulates real payment flows (Success, Failure, User Cancellation)
 * Easily pluggable with Razorpay, Stripe, PayU, or PayPal SDKs.
 */

const defaultDummyGatewayProvider = {
  name: 'YUMI DXB Dummy Payment Sandbox',
  processPayment: async ({ amount, paymentMethod, simulationOutcome = 'success', customerDetails, cardDetails }) => {
    return new Promise((resolve) => {
      // Simulate realistic payment gateway processing delay (1.2s)
      setTimeout(() => {
        if (simulationOutcome === 'failure') {
          resolve({
            success: false,
            status: 'FAILED',
            errorCode: 'GATEWAY_DECLINED',
            errorMessage: 'Bank authorization declined the transaction. Please check card/UPI details.',
            paymentMethod,
            timestamp: new Date().toISOString()
          });
          return;
        }

        if (simulationOutcome === 'cancelled') {
          resolve({
            success: false,
            cancelled: true,
            status: 'USER_CANCELLED',
            errorMessage: 'Payment transaction was cancelled by the user.',
            paymentMethod,
            timestamp: new Date().toISOString()
          });
          return;
        }

        // Default: Success Outcome
        resolve({
          success: true,
          status: 'SUCCESS',
          transactionId: `TXN-PAY-${Math.floor(10000000 + Math.random() * 90000000)}`,
          paymentMethod,
          amountPaid: amount,
          currency: 'INR',
          bankRefNo: `BANK-REF-${Math.floor(100000 + Math.random() * 900000)}`,
          receiptUrl: `https://yumidxb.com/receipt/TXN-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
          timestamp: new Date().toISOString()
        });
      }, 1200);
    });
  }
};

let activePaymentProvider = defaultDummyGatewayProvider;

export const PaymentGateway = {
  // Provider Plug-in Interface
  setProvider: (customGatewayProvider) => {
    if (customGatewayProvider && typeof customGatewayProvider.processPayment === 'function') {
      activePaymentProvider = customGatewayProvider;
    }
  },
  getProviderName: () => activePaymentProvider.name || 'Dummy Gateway Sandbox',

  processPayment: async (paymentParams) => {
    try {
      if (!paymentParams || !paymentParams.amount) {
        throw new Error('Payment processing requires valid order amount.');
      }
      return await activePaymentProvider.processPayment(paymentParams);
    } catch (err) {
      console.error('[PaymentGateway Error]:', err.message);
      return {
        success: false,
        status: 'ERROR',
        errorMessage: err.message || 'Payment service error encountered.'
      };
    }
  }
};
