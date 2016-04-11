import Ember from 'ember';
import config from 'yebo-ember-storefront/defaults'
/**
 * Make a substring of given string
 *
 * @param {String}(Required)  The initial value for the range
 * @param {Integer}(Required) Quantity of caracteres of short version
 * @param {String}(Options) Append to the end of string
 *
 * @usage
 * {{excerpt "long string" 4}}
 */

export default Ember.Helper.helper(function(params, hash) {
  let time = params[0];
  let string = params[1] || 'l';

  if(typeof moment === "undefined") {
    console.warn('moment.js is now a dependency, please upgrade you dependecies');
    return time
  }

  if(typeof time === "undefined" || time === null) {
    return null
  }

  return moment(time).utcOffset(config.utcOffset).format(string);
});
