'use strict';

let moment = require("moment");
let _ = require("lodash");
let uuid = require("node-uuid");
let Utilities = require("../../Utilities");
let request = require("request-promise");

module.exports = function(Booking) {
  Booking.book = (req, res, info, cb) => {
    let Customer = Booking.app.models.Customer;
    let Service = Booking.app.models.Service;
    let Credential = Booking.app.models.Credential;
    let Coupon = Booking.app.models.Coupon;

    //TODO update if email address has changed in request for customer
    Customer.find({where: {or: [{phoneNumber: info.phoneNumber}, {email: info.email}]}}, (error, customerQuery) => {
      if (error) return cb(error);

      let customerCreatePromise;

      function createBooking(customer) {
        Booking.create({
          timeSlot: info.timeSlot,
          location: info.location,
          address: info.address,
          category: info.category || "doorstep",
          customerId: customer.id,
          serviceId: info.serviceId,
          couponId: info.couponId
        }, (error, booking) => {
          if (error) return cb(error);

          console.log("New Booking Created", booking.id);

          Service.findById(info.serviceId).then(service => {
            //TODO refactor
            let priceKey = (booking.category === "centre") ? "priceCentre" : "price";
            let finalAmount = parseInt(service[priceKey], 10);

            Coupon.find({id: booking.couponId}).then(coupon => {
              if (!_.isEmpty(coupon) && !_.isUndefined(booking.couponId)) {
                finalAmount = finalAmount - ((finalAmount * coupon[0].discount) / 100);
              }

              let razorPay = {
                line_items: [{
                  name: service.name,
                  amount: finalAmount * 100,
                }],
                currency: "INR",
                type: "link",
                sms_notify: 0,
                email_notify: 0,
                receipt: booking.id
              };

              Credential.findById("razorPay").then(razorCred => {
                if (_.isEmpty(razorCred)) {
                  console.log("No Service Credentials found for Razor Pay");
                  let err = new Error("Ops! Something is not right.");
                  err.statusCode = 404;
                  return cb(err);
                }

                let razorRequester = request.defaults({
                  baseUrl: "https://api.razorpay.com/v1",
                  auth: {
                    user: razorCred.apiKey,
                    pass: razorCred.secretKey
                  }
                });

                razorRequester.post({
                  url: "/invoices",
                  json: razorPay
                }).then((razorResponse) => {
                  console.log("Razor Payment URL generated", razorResponse.short_url);
                  return booking.payment.create({
                    method: "razor",
                    amount: finalAmount,
                    paid: false,
                    paymentLink: razorResponse.short_url
                  }).then(() => {
                    return cb(null, booking);
                  }).catch(cb);
                }).catch(cb);
              }).catch(cb);
            }).catch(cb);
          }).catch(cb);
        });
      }

      function createCustomer() {
        customerCreatePromise = Customer.create({
          email: info.email,
          firstName: info.firstName,
          password: uuid.v4(),
          phoneNumber: info.phoneNumber
        });

        customerCreatePromise.then((response) => {
          console.log("New Customer Created", response.email);
          createBooking(response);
        }).catch(console.log);
      }

      if (_.isEmpty(customerQuery)) {
        createCustomer({});
      } else {
        createBooking(customerQuery[0]);
      }
    });
  };

  Booking.observe("after save", (ctx, next) => {
    let instance = ctx.instance;
    let MailingList = Booking.app.models.MailingList;

    Booking.findById(instance.id, {include: ["customer", "service"]}, (error, booking) => {
      if (error) {
        console.log(error);
        return next();
      }

      if (_.isEmpty(booking._payment)) {
        return next();
      }

      MailingList.find({where: {category: "booking-notification"}}, (error, mailers) => {
        if (error) {
          console.log(error);
          //TODO save mail not-sent field
          return -1;
        }

        let mailList = "";
        _.each(mailers, (mailer, index) => {
          mailList += mailer.email + ((mailers.length - 1 === index) ? "" : ",");
        });

        let customerInfo = booking.customer();
        let serviceInfo = booking.service();
        let paymentInfo = booking._payment;

        Utilities.sendEmail({
          address: booking.address,
          firstName: customerInfo.firstName,
          phoneNumber: customerInfo.phoneNumber,
          serviceTitle: serviceInfo.name,
          serviceCost: paymentInfo.amount,
          bookingLocation: booking.category === 'centre' ?
            'H64 (Behind M2K White House), Sushant Lok 3, Sector 57, Gurgaon' : 'Doorstep',
          category: booking.category,
          mailList: mailList,
          customerEmail: customerInfo.email,
          timeSlot: booking.timeSlot,
          paymentLink: booking._payment.paymentLink,
          type: "bookingRequest"
        }, (error, infos) => {
          if (error) {
            console.log(error);
            //TODO save mail not-sent field
            return -1;
          }

          _.each(infos, (info) => {
            console.log('Message %s sent: %s', info.messageId, info.response);
          });

          //TODO save mail sent field
        });
      });

      next();
    });
  });

  Booking.remoteMethod("book", {
    accepts: [
      {arg: "req", type: "object", http: {source: "req"}},
      {arg: "res", type: "object", http: {source: "res"}},
      {
        arg: "info",
        type: "object",
        required: true,
        http: {source: "body"},
        default: '{\n' +
        ' "firstName": "string",\n ' +
        '"phoneNumber": "string",\n ' +
        '"email": "string",\n ' +
        '"serviceId": "string",\n ' +
        '"timeSlot": "string",\n ' +
        '"location": "string",\n ' +
        '"address": "string"\n}'
      }
    ],
    returns: {type: "object", root: true},
    http: {path: "/book", verb: "post"}
  });
  Booking.invoiceEmail = (req, res, info, cb) => {
    Booking.findById(info.bookingId, {include: ["customer", "service"]}, (error, booking) => {
      if (error) {
        console.log(error);
        return next();
      }
      let customerInfo = booking.customer();
      let serviceInfo = booking.service();
      let serviceName = "";
      if(serviceInfo){
        serviceName = serviceInfo.name;
      };
      console.log("sending email to", customerInfo.firstName + " for service : - " + serviceName);
      Utilities.sendEmail({
          mailList: customerInfo.email,
          firstName: customerInfo.firstName,
          serviceName: serviceName,
          invoiceImage: info.dataURL,
          type: "invoice"
        }, (error, info) => {
          if (error) return next(error);
          console.log('Message %s sent: %s', info.messageId, info.response);
      });
    });

  };
  Booking.remoteMethod("invoiceEmail", {
    accepts: [
      {arg: "req", type: "object", http: {source: "req"}},
      {arg: "res", type: "object", http: {source: "res"}},
      {
        arg: "info",
        type: "object",
        required: true,
        http: {source: "body"},
        default: '{\n' +
        '"bookingId": "string",\n ' +
        '"dataURL": "string"\n}'
      }
    ],
    returns: {type: "object", root: true},
    //http: {path: "/invoiceEmail", verb: "post"}
  });
};
