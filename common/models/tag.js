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

  /**
   * Get tags based on input filter
   */
  Tag.tagsIndex = function(input, request, callback) {

    return Tag.find({
      where: {
        text: {
          like: '%' + input + '%'
        }
      }
    }, function   (error, data) {
      console.log(error || data)
      return callback(null, data);
    });
  };

};
