// backend/utils/mailgun.js
const mailgun = require('mailgun-js');
const DOMAIN = process.env.MAILGUN_DOMAIN;
//const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });

if (process.env.NODE_ENV === 'test') {
  module.exports.sendEmail = async (to, subject, text) => {
    console.log('Skipping email send test environment');
    return { message: 'Email send skipped in test environment' };
  };
} else {
  const sendBookingConfirmation = (booking) => {
    const data = {
      from: `Movie Tickets <tickets@${DOMAIN}>`,
      to: booking.userId, // assuming userId is email; adjust as needed
      subject: 'Your Movie Booking Confirmation',
      text: `Thank you for booking! Your booking ID is ${booking._id}. Enjoy your movie!`
    };

    mg.messages().send(data, (error, body) => {
      if (error) {
        console.error('Mailgun error:', error);
      } else {
        console.log('Booking confirmation sent:', body);
      }
    });
  };

  module.exports = {
    sendBookingConfirmation
  };
};
