export class HomeController {
  constructor ($log, WizardHandler, moment, $timeout, $services, Booking) {
    'ngInject';
    let self = this;

    self.details = {
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

    self.onSetTime = (newDate) => {
      self.details.timeSlot = newDate;
      $timeout(() => {
        self.displayDate = false;
        $timeout(() => self.displayDate = true, 100);
      }, 100);

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
      if (!self.displayBookingForm) {
        clearDetails();
      }
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
      }).$promise.then((response) => {

      });
    }
  }
}
