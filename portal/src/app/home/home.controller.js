export class HomeController {
  constructor ($log, WizardHandler, moment, $scope, $services, Booking, CallRequest, toastr) {
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
      "locations": {list: ["Gurgaon"], "selected": "Gurgaon"},
      selectedService: {}
    };

    self.displayDate = true;
    self.displayBookingForm = false;
    self.displayRequestCall = false;
    self.isBooking = false;
    self.services = $services;
    self.toDisplayDate = "";

    self.onSetTime = () => {
      let formattedDate = self.details.date.toString().replace("00:00:00", `${self.defaults.time[self.details.time]}:00`);
      let momentDate = moment(formattedDate);
      self.details.toDisplayDate = momentDate.format("dddd, MMMM Do YYYY, h:mm:ss a");
      self.details.timeSlot = momentDate.toISOString();
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
      }
    };

    self.requestCall = () => {
      self.toggleCallRequestForm();
      CallRequest.create(self.callRequestDetails).$promise.then(() => {
        toastr.success('Thank you', `Wiperr will connect with you shortly.`);
        clearDetails();
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
