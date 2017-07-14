/*
 * HP Enterprise | TSRnD Bengaluru, India
 * @author: Akshay Kr Singh
 * @date:   2/5/2017
 * @email: akshay.singh@hpe.com
 */

app
  .controller('DashboardController', ['$log', '$scope', 'Booking', 'Customer', '$timeout', 'MailingList', 'CallRequest', 'Coupon',
    function($log, $scope, Booking, Customer, $timeout, MailingList, CallRequest, Coupon) {
      $scope.bookings = {
        count: 0,
        list: [],
        perPage: 10,
        show: true
      };

      $scope.mailingList = {
        list: [],
        perPage: 10,
        show: true,
        email: ""
      };

      $scope.callRequests = {
        list: [],
        perPage: 10,
        show: true
      };

      $scope.coupons = {
        list: [],
        perPage: 10,
        show: true,
        code: "",
        discount: 0
      };

      $scope.customers = {
        count: 0
      };

      function updateBookingCount() {
        Booking.count().$promise.then(function(response) {
          $scope.bookings.count = response.count;
        });
      }

      function getBookings() {
        Booking.find({filter: {include: ["customer", "service"]}}).$promise.then(function(response) {
          $scope.bookings.list = response;
        }, $log.debug);
        updateBookingCount();
      }

      function getMailers() {
        MailingList.find().$promise.then(function(response) {
          $scope.mailingList.list = response;
        }, $log.debug);
      }

      function getCallRequests() {
        CallRequest.find().$promise.then(response => {
          $scope.callRequests.list = response;
        }, $log.debug);
      }

      function getCoupons() {
        Coupon.find().$promise.then(response => {
          $scope.coupons.list = response;
        }, $log.debug);
      }

      getBookings();
      getMailers();
      getCallRequests();
      getCoupons();

      /*Customer.count().$promise.then(function(response) {
       $scope.customers.count = response.count;
       });*/

      $scope.bookings.removeBooking = function(booking) {
        Booking.deleteById({id: booking.id}).$promise.then(function() {
          getBookings();
        }, $log.debug);
      };
      $scope.coupons.removeCoupon = function(coupon) {
        Coupon.deleteById({id: coupon.id}).$promise.then(function() {
          getCoupons();
        }, $log.debug);
      };

      $scope.mailingList.removeMailer = function(mailer) {
        MailingList.deleteById({id: mailer.id}).$promise.then(function() {
          getMailers();
        }, $log.debug);
      };

      $scope.callRequests.removeRequest = function(request) {
        CallRequest.deleteById({id: request.id}).$promise.then(function() {
          getCallRequests();
        }, $log.debug);
      };

      $scope.callRequests.updateRequest = function(request) {
        request.followed = true;
        CallRequest.prototype$updateAttributes(request.id, request).$promise.then(getCallRequests, $log.debug);
      };

      $scope.mailingList.addMailer = function() {
        MailingList.create({email: $scope.mailingList.email, category: "booking-notification"})
          .$promise.then(function() {
          $scope.mailingList.email = "";
          getMailers();
        }, $log.debug);
      };

      $scope.coupons.addCoupon = function() {
        Coupon.create({code: $scope.coupons.code, discount: $scope.coupons.discount})
          .$promise.then(function() {
          $scope.coupons.code = "";
          $scope.coupons.discount = 0;
          getCoupons();
        }, $log.debug);
      };

      $scope.d = [ [1,6.5],[2,6.5],[3,7],[4,8],[5,7.5],[6,7],[7,6.8],[8,7],[9,7.2],[10,7],[11,6.8],[12,7] ];
      $scope.d0_1 = [ [0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7] ];
      $scope.d0_2 = [ [0,4],[1,4.5],[2,7],[3,4.5],[4,3],[5,3.5],[6,6],[7,3],[8,4],[9,3] ];
      $scope.d1_1 = [ [10, 120], [20, 70], [30, 70], [40, 60] ];
      $scope.d1_2 = [ [10, 50],  [20, 60], [30, 90],  [40, 35] ];
      $scope.d1_3 = [ [10, 80],  [20, 40], [30, 30],  [40, 20] ];
      $scope.d2 = [];

      for (var i = 0; i < 20; ++i) {
        $scope.d2.push([i, Math.round( Math.sin(i)*100)/100] );
      }

      $scope.d3 = [
        { label: "iPhone5S", data: 40 },
        { label: "iPad Mini", data: 10 },
        { label: "iPad Mini Retina", data: 20 },
        { label: "iPhone4S", data: 12 },
        { label: "iPad Air", data: 18 }
      ];

      $scope.refreshData = function(){
        $scope.d0_1 = $scope.d0_2;
      };
      $scope.getRandomData = function() {
        var data = [],
          totalPoints = 150;
        if (data.length > 0)
          data = data.slice(1);
        while (data.length < totalPoints) {
          var prev = data.length > 0 ? data[data.length - 1] : 50,
            y = prev + Math.random() * 10 - 5;
          if (y < 0) {
            y = 0;
          } else if (y > 100) {
            y = 100;
          }
          data.push(Math.round(y*100)/100);
        }
        // Zip the generated y values with the x values
        var res = [];
        for (var i = 0; i < data.length; ++i) {
          res.push([i, data[i]])
        }
        return res;
      };
      $scope.d4 = $scope.getRandomData();
    }]);
