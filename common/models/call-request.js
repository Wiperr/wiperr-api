'use strict';

let Utilities = require("../../Utilities");
let _ = require("lodash");

module.exports = function(CallRequest) {
  CallRequest.observe("after save", (ctx, next) => {
    let key = ctx.instance ? "instance":"data";
    let instance = ctx[key], MailingList = CallRequest.app.models.MailingList;

    MailingList.find({where: {category: "booking-notification"}}, (error, mailers) => {
      if (error) return next(error);

      let mailList = "";
      _.each(mailers, (mailer, index) => {
        mailList += mailer.email + ((mailers.length - 1 === index) ? "" : ",");
      });

      Utilities.sendEmail({
        mailList: mailList,
        firstName: instance.name,
        phoneNumber: instance.phoneNumber,
        type: "requestCall"
      }, (error, info) => {
        if (error) return next(error);

        console.log('Message %s sent: %s', info.messageId, info.response);
        next();
      });
    });
  });
};
