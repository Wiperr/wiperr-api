/*
 * HP Enterprise | TSRnD Bengaluru, India
 * @author: Akshay Kr Singh
 * @date:   2/4/2017
 * @email: akshay.singh@hpe.com
 */
let ejs = require("ejs");
let path = require("path");
let emailTemplates = require("email-templates");
let templateDir = path.resolve("templates");
let nodeMailer = require("nodemailer");
let async = require("async");

module.exports.sendEmail = (options, callback) => {
  let locals = {
    booking: {
      address: options.address,
      firstName: options.firstName,
      timeSlot: options.timeSlot,
      phoneNumber: options.phoneNumber,
      serviceTitle: options.serviceTitle,
      serviceCost: options.serviceCost,
      paymentLink: options.paymentLink
    }
  };

  emailTemplates(templateDir, (error, template) => {
    if (error) return callback(error);

    // create reusable transporter object using the default SMTP transport
    let transporter = nodeMailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'akshay.scythe@gmail.com',
        pass: '12TwelvE19**^!&*'
      }
    });

    async.parallel([
      (next) => {
        template("bookingConfirmation", locals, (error, html) => {
          if (error) {
            console.log(error);
            return next(error);
          }

          let mailOptions = {
            from: '"Akshay Singh" <akshay.scythe@gmail.com>',
            to: options.customerEmail,
            subject: '[Test] Wiperr Booking Confirmation',
            html: html
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return next(error);
            }

            next(null, info);
          });
        });
      },
      (next) => {
        template("bookingNotification", locals, (error, html) => {
          if (error) {
            return next(error);
          }

          let mailOptions = {
            from: '"Akshay Singh" <akshay.scythe@gmail.com>',
            to: options.mailList,
            subject: '[Test] Wiperr Booking Notification',
            html: html
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return next(error);
            }

            next(null, info);
          });
        });
      }
    ], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  });
};
