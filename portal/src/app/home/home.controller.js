export class HomeController {
  constructor ($log, WizardHandler, moment, $timeout) {
    'ngInject';
    let self = this;

    self.details = {
      timeSlot: "",
      phoneNumber: "",
      email: "",
      name: "",
      address: "",
      "locations": {list: ["Gurgaon"], "selected": "Gurgaon"}
    };

    self.displayDate = true;
    self.displayBookingForm = false;

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

    self.completeBooking = () => {
      $log.debug("booking completed");
      self.toggleBookingForm();
    }
  }
}
