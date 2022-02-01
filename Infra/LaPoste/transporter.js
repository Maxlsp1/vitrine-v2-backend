/**
 *  Create Transporter for send mail.
 */


const nodemailer = require("nodemailer");

  let transporter = nodemailer.createTransport({

    host:'172.21.200.18',
    port: 25
    
  })

module.exports = transporter