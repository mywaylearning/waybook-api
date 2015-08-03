'use strict';

module.exports = function(Tag) {

  /**
   * @see http://apidocs.strongloop.com/loopback/#persistedmodel-findorcreate
   */
  Tag.createTag = function(text, callback) {
    var where = {
      text: text
    };

    return Tag.findOrCreate(where, callback);
  };
};
