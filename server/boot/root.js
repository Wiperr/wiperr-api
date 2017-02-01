'use strict';

module.exports = (server) => {
  // Install a `/` route that returns server status
  let router = server.loopback.Router();
  router.get('/', (req, res) => res.redirect("/portal"));
  server.use(router);
};
