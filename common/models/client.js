'use strict';

module.exports = function(Client) {
  Client.getUser = (filter, cb) => {
    let Customer = Client.app.models.Customer;
    filter = filter || {};

    Customer.find(filter, (error, users) => {
      cb(error, users);
    });
  };

  Client.getAllUser = () => {
    let Customer = Client.app.models.Customer;

    Customer.find();
  };

  Client.remoteMethod('getUser', {
    accepts: {arg: 'filter', type: 'object', http: {source: 'body'}},
    returns: {arg: 'users', type: 'array', root: true},
    'http': {'verb': 'post', 'path': '/getUser'},
  });
  Client.remoteMethod('getAllUser', {
    accepts: {type: 'object', http: {source: 'body'}},
    returns: {arg: 'users', type: 'array', root: true},
    'http': {'verb': 'post', 'path': '/getAllUser'},
  });
};
