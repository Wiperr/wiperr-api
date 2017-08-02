/**
 * Created by Rob on 13-07-2017.
 */
app
  .controller('InvoiceCtrl',
    function ($log, $scope, $stateParams, Booking, Customer, Service, Coupon, Client) {

      $scope.bookings = {
        show: true
      };

      $scope.customer = {
        id: "",
        show: true
      };

      $scope.withoutTax = 0;
      $scope.total = 0;
      $scope.discount = 0;
      $scope.balance = 0;
      $scope.netTotal = 0;
      $scope.discountPercentage = 0;

      function getCustomerById(id) {
        Client.getUser(null, {where: {id: id}}).$promise.then(function (response) {
          $scope.bookings.customer = response[0];
        });
      }

      function getServiceById(id) {
        Service.findById({id: id}).$promise.then(function (response) {
          $scope.bookings.service = response;
          if ($scope.bookings.category === "doorstep") {
            $scope.withoutTax = $scope.bookings.service.price / (1 + ($scope.bookings.service.gst / 100));
            $scope.total = $scope.bookings.service.price;
          } else {
            $scope.withoutTax = $scope.bookings.service.priceCentre / (1 + ($scope.bookings.service.gst / 100));
            $scope.total = $scope.bookings.service.priceCentre;
          }
        });
      }

      function getCouponById(id) {

        var discount = $stateParams.discount;
        if(discount > 0)
        {
          $scope.discount = discount;
        }
        else {
          alert(id);
          Coupon.findById({id: id}).$promise.then(function (response) {
            if ($scope.discountPercentage > 0) {
              $scope.discount = $scope.withoutTax * response.discount / 100;
              alert($scope.discount);
              //alert($scope.netBalance);
            }
          });
        }
      }

      function calculation(gst) {

        $scope.netTotal = $scope.balance*(1+(gst/100));
      }


      function getBookingsById() {
        var id = $stateParams.bookingId;
        Booking.findById({id: id}).$promise.then(function (response) {
          $scope.bookings = response;
          //alert($scope.bookings.couponId);
          getCustomerById($scope.bookings.customerId);
          getServiceById($scope.bookings.serviceId);
          getCouponById($scope.bookings.couponId);
        }, $log.debug);

      }

      getBookingsById();
      //getCustomerById();
      $scope.sendInvoiceEmail = function() {
        form = $('#invoice-form');
        html2canvas(form,{
          onrendered: function(canvas) {
            var imageURL = canvas.toDataURL("image/png");
            Booking.invoiceEmail({
              bookingId: $stateParams.bookingId,
              dataURL: imageURL
            }).$promise.then((response) => {
              alert('Email sent successfully');
            });
          }
        });
      }
    });


