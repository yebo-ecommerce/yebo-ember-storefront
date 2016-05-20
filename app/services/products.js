import Ember from 'ember';

/**
 * Service used to list the products from the store.
 */
export default Ember.Service.extend(Ember.Evented, {
  /**
* Yebo main service reference
*/
  yebo: Ember.inject.service('yebo'),

    /**
  * Current Query
  */
  currentQuery: null,

    /**
  * This methods returns an promise that resolves an array of products
  * that are the result of an query executed in the Yebo API.
  *
  * @method
  * @public
  * @param {YeboSDK.Products} query An instance of the YeboSDK.Products or the
  * options that will be used to create a new instance of this class
  * @return {Promise} The result of the query and the meta information
  */
  search(query) {
    // Yebo Store
    let store = this.get('yebo').store;

    // Check if the query is the YeboSDK Object
    if( query === undefined ) {
      query = new YeboSDK.Products();
    }

    // Set it to the currentQuery
    this.set('currentQuery', query);

    // Return a Promise
    return new Ember.RSVP.Promise((resolve, reject) => {
      // Execute the query
      query.execute().then(res => {
        const meta = res.meta
        delete res.meta

        // Push the records to ember
        store.pushPayload(res)

        // Return material
        let promises = {
          products: res.products.map(p => store.peekRecord('product', p.id)),
          meta: meta
        }

        // Resolve with the result
        resolve(Ember.RSVP.hash(promises));
      }).catch((error) => {
        // Log it
        console.log('Error on serialization')

        // Error!
        reject(error)
      });
    });
  },

    /**
  * This method return the possible filters that can applied to the
  * products that match the query passed.
  *
  * @method
  * @public
  * @param {YeboSDK.Products} query An instance of the YeboSDK.Products or the
  * options that will be used to create a new instance of this class
  * @return {Promise} The result with the aggregations
  */
  aggs(query) {
  }
});
