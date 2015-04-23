module.exports = function docRoot(server) {
  // Install a `/` route that returns server status
  //var router = server.loopback.Router();
  //console.log('hi, docRoot boot script');
  server.disable('x-powered-by');
  //router.get('/', server.loopback.status());
  //server.use(router);
};
