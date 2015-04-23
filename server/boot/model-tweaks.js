module.exports = function modelTweaks(server) {

  // We don't want all the built-in models just the way LoopBack provides them.
  // So, we'll step on what's already been loaded up, and do it again.

  // function createModel(definitionJson, customizeFn) {
  //   var Model = server.loopback.createModel(definitionJson);
  //   customizeFn(Model);
  //   return Model;
  // }
  //
  // // don't want all the built-in models
  // server.loopback.Application = createModel(
  //   require('../../common/models/application.json'),
  //   require('../../common/models/application.js'));
  //

};
