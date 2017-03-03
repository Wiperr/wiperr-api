export class HomeController {
  constructor ($log, WizardHandler, moment, $document, $uibModal, $services, Booking, CallRequest, toastr, Coupon, $timeout) {
    'ngInject';
    let self = this;

    self.defaults = {
      time: {1: '10:30', 2: '14:00', 3: '16:30'},
      date: {
        options: {
          minDate: new Date(),
          formatDay: 'dd',
          formatMonth: 'MM',
          formatYear: 'yyyy'
        }
      }
    };

    self.modelTemplates = {
      "privacyPolicy": "privacy_policy.html",
      "termsConditions": "terms_conditions.html",
      "cancellationPolicy": "cancellation_policy.html"
    };

    self.callRequestDetails = {
      "name": "",
      "phoneNumber": "",
      "followed": false
    };

    self.details = {
      date: "",
      time: "1",
      timeSlot: "",
      phoneNumber: "",
      email: "",
      firstName: "",
      address: "",
      couponCode: "",
      afterDiscount: 0,
      "locations": {list: ["Gurgaon"], "selected": "Gurgaon"},
      selectedService: {},
      selectedCoupon: {}
    };

    self.displayDate = true;
    self.displayBookingForm = false;
    self.displayRequestCall = false;
    self.isBooking = false;
    self.couponDetailsFetchStatus = "not-fetched";
    self.couponDetailsFetchStatusText = "";
    self.services = $services;
    self.toDisplayDate = "";

    self.onSetTime = () => {
      let formattedDate = self.details.date.toString().replace("00:00:00", `${self.defaults.time[self.details.time]}:00`);
      let momentDate = moment(formattedDate);
      self.details.toDisplayDate = momentDate.format("dddd, MMMM Do YYYY, h:mm:ss a");
      self.details.timeSlot = self.details.toDisplayDate;
      WizardHandler.wizard().next();
    };

    function clearDetails() {
      self.details.address = "";
      self.details.email = "";
      self.details.firstName = "";
      self.details.phoneNumber = "";
      self.details.timeSlot = "";
      self.details.selectedService = {};
      self.callRequestDetails.name = "";
      self.callRequestDetails.phoneNumber = "";
    }

    self.toggleCallRequestForm = () => {
      self.displayRequestCall = !self.displayRequestCall;
      if (self.displayBookingForm) {self.displayBookingForm = !self.displayBookingForm;}
    };

    self.toggleBookingForm = () => {
      self.displayBookingForm = !self.displayBookingForm;
      if (self.displayRequestCall) {self.displayRequestCall = !self.displayRequestCall;}
    };

    self.selectService = (serviceId) => {
      let service = _.find(self.services, {id: serviceId});

      if (!self.displayBookingForm) {self.displayBookingForm = !self.displayBookingForm;}

      if (service) {
        self.details.selectedService = service;
        self.details.afterDiscount = self.details.selectedService.price;
      }
    };

    self.applyCouponCode = () => {
      self.couponDetailsFetchStatus = "fetching";
      self.couponDetailsFetchStatusText = "";
      Coupon.find({filter: {where: {code: self.details.couponCode}}}).$promise.then(response => {
        $log.debug(response);

        if (_.isEmpty(response)) {
          self.couponDetailsFetchStatus = "fetch-error";
          self.couponDetailsFetchStatusText = "Invalid Coupon Code";
          return $timeout(() => {
            self.couponDetailsFetchStatus = "not-fetched";
          }, 2000);
        }

        self.couponDetailsFetchStatus = "fetched";
        self.details.selectedCoupon = response[0];

        self.details.afterDiscount = parseInt(self.details.selectedService.price) - ((parseInt(self.details.selectedService.price, 10) * self.details.selectedCoupon.discount) / 100);
      }, error => {
        $log.debug(error);
        self.couponDetailsFetchStatus = "fetch-error";
        self.couponDetailsFetchStatusText = "Invalid Coupon Code";
        $timeout(() => {
          self.couponDetailsFetchStatus = "not-fetched";
        }, 2000);
      });
    };

    self.requestCall = () => {
      self.toggleCallRequestForm();
      CallRequest.create(self.callRequestDetails).$promise.then(() => {
        toastr.success('Thank you', `We will contact you shortly!`);
        clearDetails();
      });
    };

    self.openBox = (type, size, parentSelector) => {
      let parentElem = parentSelector ?
        angular.element($document[0].querySelector('.home-page ' + parentSelector)) : undefined;

      $uibModal.open({
        animation: true,
        ariaLabelledBy: 'modal-title',
        ariaDescribedBy: 'modal-body',
        templateUrl: self.modelTemplates[type],
        size: size,
        appendTo: parentElem
      });
    };

    self.completeBooking = () => {
      self.toggleBookingForm();
      self.isBooking = true;
      Booking.book({
        firstName: self.details.firstName,
        phoneNumber: self.details.phoneNumber,
        email: self.details.email,
        serviceId: self.details.selectedService.id,
        couponId: self.details.selectedCoupon.id,
        timeSlot: self.details.timeSlot,
        location: self.details.locations,
        address: self.details.address
      }).$promise.then((response) => {
        self.isBooking = false;
        toastr.success('Thank you', `Your booking for ${response.timeSlot} is confirmed`);
        if (!self.displayBookingForm) {
          clearDetails();
        }
      });
    }
  }
}
