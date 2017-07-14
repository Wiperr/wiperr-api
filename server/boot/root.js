'use strict';

const _ = require("lodash");

module.exports = (server) => {
  // Install a `/` route that returns server status
  let router = server.loopback.Router();
  router.get('/', (req, res) => res.redirect("/home"));
  server.use(router);

  let Customer = server.models.Customer;
  let Role = server.models.Role;
  let RoleMapping = server.models.RoleMapping;

  Customer.find({where: {email: "iron-man@wiperr.com"}}, (error, customerList) => {
    if (error) return console.log(error);

    if (!_.isEmpty(customerList)) {return -1;}

    Customer.create([{
      username: 'administrator',
      email: 'iron-man@wiperr.com',
      password: 'iron-man',
      phoneNumber: "9958858311",
      firstName: "Administrator"
    }], function(err, users) {
      if (err) return console.log(err);

      //create the admin role
      Role.create({
        name: '$ADMIN'
      }, (err, role) => {
        if (err) console.log(err);

        //make bob an admin
        role.principals.create({
          principalType: RoleMapping.USER,
          principalId: users[0].id
        }, err => (err) ? console.log(err) : "");
      });
    });
  });
};
