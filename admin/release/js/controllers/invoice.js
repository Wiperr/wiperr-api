/**
 * Created by Rob on 13-07-2017.
 */
app
  .controller('InvoiceCtrl',
      function($log, $scope, $stateParams, Booking, Customer, Service, Coupon) {
        $scope.bookings = {
          show: true
        }

        $scope.customer = {
          id: "",
          show: true
      }

      $scope.withoutTax = 0;
        $scope.total = 0;
      $scope.discount = 0;

        function getCustomerById(id) {
          Customer.findById({id: id}).$promise.then(function(response) {
            $scope.bookings.customer = response;
            //alert($scope.bookings.customer.firstName);
          });
        }

        function getServiceById(id) {
          Service.findById({id: id}).$promise.then(function(response) {
            $scope.bookings.service = response;
            alert($scope.bookings.category);
            if($scope.bookings.category == "doorstep") {
              $scope.withoutTax = $scope.bookings.service.price * (1 - ($scope.bookings.service.gst / 100));
              $scope.total = $scope.bookings.service.price;
            }
            else {
              $scope.withoutTax = $scope.bookings.service.priceCentre * (1 - ($scope.bookings.service.gst / 100));
              $scope.total = $scope.bookings.service.priceCentre;
            }
            alert($scope.withoutTax);
          });
        }

        function getCouponById(id) {
          Coupon.findById({id: id}).$promise.then(function(response) {
            if(response.discount > 0)
            $scope.discount = response.discount;
            //alert($scope.discount);
            //alert($scope.netBalance);
          });
        }


      function getBookingsById() {
        var id = $stateParams.bookingId;
        Booking.findById({id: id}).$promise.then(function(response) {
          $scope.bookings = response;
          //alert($scope.customer.id);
          getCustomerById($scope.bookings.customerId);
          getServiceById($scope.bookings.serviceId);
          getCouponById($scope.bookings.couponId);
          //alert($scope.total);
        }, $log.debug);

      }
        getBookingsById();
        //getCustomerById();
    });
