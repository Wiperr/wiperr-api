export class HomeController {
  constructor ($log, WizardHandler, $timeout) {
    'ngInject';
    let self = this;

    self.timeSlot = "";
    self.displayDate = true;
    self.onSetTime = (newDate) => {
      $log.debug(newDate);

      $timeout(() => {
        self.displayDate = false;
        $timeout(() => self.displayDate = true, 100);
      }, 100);

      WizardHandler.wizard().next();
    }
  }
}
