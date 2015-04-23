'use strict';

function UtilsService($q, Moment) {
  var service;

  /**
   * Public
   */
  service = {
    promisify: _promisify,
    dateAgo: _dateAgo
  };
  return service;

 /**
  * Mimics a Restangular enhanced promise by
  * returning a promise that resolves with the
  * provided value.
  *
  * An additional $object property is also added
  * to the promise object that also stores the
  * provided value.
  *
  * See https://github.com/mgonto/restangular#enhanced-promises
  * @param  {mixed} value
  * @return {Promise}
  */
 function _promisify(value) {
   var deferred = $q.defer();

   deferred.promise.$object = value;

   deferred.resolve(value);

   return deferred.promise;
 }

 function _dateAgo(fromDate, toDate) {
   return new Moment(toDate).from(fromDate);
 }
}

module.exports = ['$q', 'Moment', UtilsService];
