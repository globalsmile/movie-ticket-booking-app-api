const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUN_DOMAIN || 'sandbox12345.mailgun.org';

// In test mode, we can return a dummy function to avoid actual email sending.
if (process.env.NODE_ENV === 'test') {
  module.exports = {
    sendBookingConfirmation: (booking) => {
      console.log('[Test Mode] Dummy email sent for booking:', booking._id);
    }
  };
} else {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: DOMAIN
  });

  const sendBookingConfirmation = (booking) => {
    const data = {
      from: `Movie Tickets <tickets@${DOMAIN}>`,
      to: booking.userId, // Assuming userId is the email
      subject: 'Booking Confirmation',
      text: `Your booking ${booking._id} is confirmed. Enjoy your movie!`
    };

    mg.messages().send(data, (error, body) => {
      if (error) {
        console.error("Mailgun error:", error);
      } else {
        console.log("Mailgun response:", body);
      }
    });
  };

  module.exports = { sendBookingConfirmation };
}
