/**
 * Modular Email Service for YUMI DXB Fashion
 * Decoupled Architecture: Allows seamless switching between email providers 
 * (Default Simulator, EmailJS, SendGrid, Resend, AWS SES)
 */

// Email Validation helper using standard RFC 5322 regex pattern
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
};

// Default Simulated Email Provider
const defaultSimulatorProvider = {
  name: 'YUMI DXB Simulated Email Service',
  sendOrderConfirmation: async (orderData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!validateEmail(orderData.customerEmail)) {
          reject(new Error('Invalid recipient email address format.'));
          return;
        }
        resolve({
          success: true,
          messageId: `MSG-CONFIRM-${Math.floor(100000 + Math.random() * 900000)}`,
          recipient: orderData.customerEmail,
          subject: `Order Confirmation #${orderData.orderId} - YUMI DXB Fashion`,
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  },
  sendSupportMessage: async (contactData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!validateEmail(contactData.email)) {
          reject(new Error('Invalid sender email address.'));
          return;
        }
        resolve({
          success: true,
          messageId: `MSG-SUPPORT-${Math.floor(100000 + Math.random() * 900000)}`,
          recipient: 'support@yumidxb.com',
          subject: `New Customer Inquiry from ${contactData.name}`,
          timestamp: new Date().toISOString()
        });
      }, 500);
    });
  },
  sendCancellationNotice: async (orderData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          success: true,
          messageId: `MSG-CANCEL-${Math.floor(100000 + Math.random() * 900000)}`,
          recipient: orderData.customerEmail,
          subject: `Order #${orderData.orderId} Cancellation Notice`,
          timestamp: new Date().toISOString()
        });
      }, 400);
    });
  }
};

let activeProvider = defaultSimulatorProvider;

export const EmailService = {
  // Provider Plug-in Interface
  setProvider: (customProvider) => {
    if (customProvider && typeof customProvider.sendOrderConfirmation === 'function') {
      activeProvider = customProvider;
    }
  },
  getProviderName: () => activeProvider.name || 'Simulated Provider',
  validateEmail,

  sendOrderConfirmation: async (orderData) => {
    try {
      if (!orderData || !orderData.customerEmail) {
        throw new Error('Order data missing recipient email.');
      }
      return await activeProvider.sendOrderConfirmation(orderData);
    } catch (err) {
      console.error('[EmailService Error]:', err.message);
      return { success: false, error: err.message };
    }
  },

  sendSupportMessage: async (contactData) => {
    try {
      if (!contactData || !contactData.email) {
        throw new Error('Contact data missing email address.');
      }
      return await activeProvider.sendSupportMessage(contactData);
    } catch (err) {
      console.error('[EmailService Error]:', err.message);
      return { success: false, error: err.message };
    }
  },

  sendCancellationNotice: async (orderData) => {
    try {
      return await activeProvider.sendCancellationNotice(orderData);
    } catch (err) {
      console.error('[EmailService Error]:', err.message);
      return { success: false, error: err.message };
    }
  }
};
