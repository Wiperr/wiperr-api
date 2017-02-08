export class HomeController {
  constructor ($log, WizardHandler, moment, $scope, $services, Booking) {
    'ngInject';
    let self = this;

    self.defaults = {time: {1: '10:30', 2: '14:00', 3: '16:30'}};
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
    self.services = $services;
    self.toDisplayDate = "";

    self.onSetTime = () => {
      let time = moment(`${self.details.date} ${self.defaults.time[self.details.time]}`);
      self.details.toDisplayDate = time.format("dddd, MMMM Do YYYY, h:mm:ss a");
      self.details.timeSlot = time.toISOString();
      WizardHandler.wizard().next();
    };

    function clearDetails() {
      self.details.address = "";
      self.details.email = "";
      self.details.firstName = "";
      self.details.phoneNumber = "";
      self.details.timeSlot = "";
      self.details.selectedService = {};
    }

    self.toggleBookingForm = () => {
      self.displayBookingForm = !self.displayBookingForm;
    };

    self.selectService = (serviceId) => {
      let service = _.find(self.services, {id: serviceId});

      if (service) {
        self.details.selectedService = service;
      }
    };

    self.completeBooking = () => {
      self.toggleBookingForm();
      Booking.book({
        firstName: self.details.firstName,
        phoneNumber: self.details.phoneNumber,
        email: self.details.email,
        serviceId: self.details.selectedService.id,
        timeSlot: self.details.timeSlot,
        location: self.details.locations,
        address: self.details.address
      }).$promise.then(() => {
        if (!self.displayBookingForm) {
          clearDetails();
        }
      });
    }
  }
}
