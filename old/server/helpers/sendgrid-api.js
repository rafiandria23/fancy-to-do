"use strict";

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendGrid = (receiver, subject, text = "", html = "") => {
  const message = {
    to: receiver,
    from: process.env.SENDER_EMAIL,
    subject: subject,
    text: text,
    html: html
  };

  sgMail.send(message);
}

module.exports = sendGrid;