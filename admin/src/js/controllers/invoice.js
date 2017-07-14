/**
 * Created by Rob on 13-07-2017.
 */
app
  .controller('InvoiceCtrl',
      function($log, $scope, $stateParams, Booking, Customer, Service) {
        $scope.bookings = {
          show: true
        }

        $scope.customer = {
          id: "",
          show: true
      }

        function getCustomerById(id) {

          alert(id);
          Customer.findById({id: id}).$promise.then(function(response) {
            $scope.bookings.customer = response;
            //alert($scope.bookings.customer.firstName);
          });
        }

        function getServiceById(id) {
          Service.findById({id: id}).$promise.then(function(response) {
            $scope.bookings.service = response;
            //alert($scope.bookings.service.name);
          });
        }


      function getBookingsById() {
        var id = $stateParams.bookingId;
        Booking.findById({id: id}).$promise.then(function(response) {
          $scope.bookings = response;
          //alert($scope.customer.id);
          getCustomerById($scope.bookings.customerId);
          getServiceById($scope.bookings.serviceId);
        }, $log.debug);

      }
        getBookingsById();
        //getCustomerById();
    });
