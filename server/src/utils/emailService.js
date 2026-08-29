import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create standard SMTP transporter or mock logger depending on config availability
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('SMTP credentials not configured. Outgoing email alerts will be mocked (logged to console).');
    return {
      sendMail: async (options) => {
        console.log('\n--- [MOCKED EMAIL SERVICE] ---');
        console.log(`From:    ${options.from}`);
        console.log(`To:      ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Content Preview:\n${options.text.substring(0, 300)}`);
        console.log('-------------------------------\n');
        return { messageId: 'mocked-email-message-id' };
      },
    };
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const transporter = createTransporter();

/**
 * Sends a notification email to the admin team upon new lead capture.
 * Wrapped in try-catch to guarantee that SMTP failure does not disrupt DB storage.
 */
export const sendAdminInquiryNotification = async (inquiry) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@cwfcorporation.com',
    to: process.env.EMAIL_TO_NOTIFY || 'admin@cwfcorporation.com',
    subject: `New Lead Inquiry - ${inquiry.name} (${inquiry.serviceInterested})`,
    text: `
New Lead Captured from CWF Website:

Lead Details:
------------------------------------------
Name:               ${inquiry.name}
Phone:              ${inquiry.phone}
Email:              ${inquiry.email || 'N/A'}
Property Type:      ${inquiry.propertyType}
Service Interested: ${inquiry.serviceInterested}
Source:             ${inquiry.source}
Message:
${inquiry.message}
------------------------------------------

Regards,
CWF Consulting Corporation Notification System
    `,
    html: `
<h2>New Lead Captured - CWF Consulting Corporation</h2>
<p>A new lead has been submitted via the website contact form.</p>
<table border="1" cellpadding="8" style="border-collapse: collapse; border: 1px solid #ddd;">
  <tr bgcolor="#f2f2f2"><td><strong>Field</strong></td><td><strong>Value</strong></td></tr>
  <tr><td><strong>Name</strong></td><td>${inquiry.name}</td></tr>
  <tr><td><strong>Phone</strong></td><td>${inquiry.phone}</td></tr>
  <tr><td><strong>Email</strong></td><td>${inquiry.email || 'N/A'}</td></tr>
  <tr><td><strong>Property Type</strong></td><td>${inquiry.propertyType}</td></tr>
  <tr><td><strong>Service</strong></td><td>${inquiry.serviceInterested}</td></tr>
  <tr><td><strong>Source</strong></td><td>${inquiry.source}</td></tr>
  <tr><td><strong>Message</strong></td><td>${inquiry.message}</td></tr>
</table>
<p><a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/leads">Go to Admin Dashboard</a></p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Admin lead notification sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Admin lead email notification failed: ${error.message}`);
  }
};

/**
 * Sends an auto-acknowledgment response email to the customer who made the inquiry.
 * Wrapped in try-catch to safeguard database operations from SMTP faults.
 */
export const sendCustomerAcknowledge = async (inquiry) => {
  if (!inquiry.email) return;

  const mailOptions = {
    from: process.env.EMAIL_FROM || 'no-reply@cwfcorporation.com',
    to: inquiry.email,
    subject: 'We have received your waterproofing inquiry - CWF Consulting Corporation',
    text: `
Dear ${inquiry.name},

Thank you for reaching out to CWF Consulting Corporation, Pune. We have received your inquiry regarding our "${inquiry.serviceInterested}" waterproofing solutions.

Our technical expert will review your requirements and get in touch with you at ${inquiry.phone} shortly to schedule a site inspection.

Your Inquiry message:
"${inquiry.message}"

Best regards,
Customer Relations Team
CWF Consulting Corporation, Pune
    `,
    html: `
<h3>Thank you for reaching out to CWF Consulting Corporation, Pune!</h3>
<p>Dear ${inquiry.name},</p>
<p>We have successfully received your inquiry regarding our <strong>${inquiry.serviceInterested}</strong> waterproofing services.</p>
<p>One of our technical experts will review your request and contact you at <strong>${inquiry.phone}</strong> shortly to schedule a detailed site-visit and consultation.</p>
<br/>
<p>Best regards,</p>
<p><strong>Customer Relations Team</strong><br/>CWF Consulting Corporation, Pune</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Customer auto-acknowledgment sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Customer auto-acknowledgment email failed: ${error.message}`);
  }
};
