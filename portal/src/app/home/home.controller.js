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
      Booking.book({
        firstName: self.details.firstName,
        phoneNumber: self.details.phoneNumber,
        email: self.details.email,
        serviceId: self.details.selectedService.id,
        timeSlot: self.details.timeSlot,
        location: self.details.locations,
        address: self.details.address
      }).$promise.then((response) => {
        $log.debug(response);
        self.toggleBookingForm();
      });
    }
  }
}
