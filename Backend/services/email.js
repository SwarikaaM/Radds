const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


// # when using Zoho's SMTP with port 465, the above config doesn't work. The connection is immediately closed by the server. Changing to secure: true and port: 465 works fine. For other providers (like Gmail), secure: false and port 587 is the standard config.
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '465'), // Changed default to 465
//   secure: true, // Changed to true for Zoho port 465
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });


async function sendBookingConfirmation({ name, email, date, time, purpose }) {
  if (!process.env.SMTP_HOST) return; // skip if not configured

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  await transporter.sendMail({
    from: `"Radds Capital" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Consultation Booking Confirmed — Radds Capital',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:32px;">
        <div style="background:#22568f;color:white;padding:16px 24px;border-radius:8px 8px 0 0;">
          <h2 style="margin:0;font-size:18px;">Radds Capital</h2>
          <p style="margin:4px 0 0;font-size:11px;opacity:0.7;">AMFI-Registered Mutual Fund Distributor</p>
        </div>
        <div style="background:#f8fafc;padding:24px;border:1px solid #e2ebf5;border-top:none;border-radius:0 0 8px 8px;">
          <h3 style="color:#22568f;">Your consultation is confirmed ✅</h3>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your consultation with Radds Capital has been successfully booked.</p>
          <table style="width:100%;margin:16px 0;border-collapse:collapse;">
            <tr><td style="padding:8px;background:#fff;border:1px solid #e2ebf5;font-weight:600;">Date</td>
                <td style="padding:8px;background:#fff;border:1px solid #e2ebf5;">${formattedDate}</td></tr>
            <tr><td style="padding:8px;background:#f8fafc;border:1px solid #e2ebf5;font-weight:600;">Time</td>
                <td style="padding:8px;background:#f8fafc;border:1px solid #e2ebf5;">${time}</td></tr>
            <tr><td style="padding:8px;background:#fff;border:1px solid #e2ebf5;font-weight:600;">Duration</td>
                <td style="padding:8px;background:#fff;border:1px solid #e2ebf5;">60 minutes</td></tr>
            ${purpose ? `<tr><td style="padding:8px;background:#f8fafc;border:1px solid #e2ebf5;font-weight:600;">Purpose</td>
                <td style="padding:8px;background:#f8fafc;border:1px solid #e2ebf5;">${purpose}</td></tr>` : ''}
          </table>
          <p style="color:#666;font-size:13px;">Our team will reach out to you shortly with the meeting link or call details.</p>
          <hr style="border:none;border-top:1px solid #e2ebf5;margin:20px 0;">
          <p style="color:#999;font-size:11px;">
            Radds Capital is an AMFI-Registered Mutual Fund Distributor. 
            Mutual Fund investments are subject to market risks. 
            Read all scheme related documents carefully.
          </p>
        </div>
      </div>
    `,
  });
}

module.exports = { sendBookingConfirmation };