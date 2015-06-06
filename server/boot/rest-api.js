module.exports = function mountRestApi(server) {
  // We don't use the stock LoopBack REST API, because we like
  // APIs that are a little more intuitive than a bare-ass ORM
  // interface exposed over REST.
  //var restApiRoot = server.get('restApiRoot');
  server.middleware('routes:after', '/', server.loopback.rest());
};
