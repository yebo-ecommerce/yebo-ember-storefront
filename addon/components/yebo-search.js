// Dependencies
import Ember from 'ember';
import layout from '../templates/components/yebo-search';
const { getOwner } = Ember;

/**
  The search form

  @class YeboDetails
  @namespace Component
  @extends Ember.Component
*/
export default Ember.Component.extend({
  layout: layout,

  // The text that is going to be searched
  searchText: '',

  customPlaceholder: Ember.computed('placeholder', function(){
    return this.placeholder || "Buscar"
  }),

  actions: {
    /**
     * Transition to the /products route with param search
     */
    search: function() {
      // Search Text
      let searchText = this.get('searchText');

      // Check if the searchText is higher than 2
      // @todo Show some kind of error
      if( searchText.length < 3 )
        return;

      // Get the current controller
      let controller = getOwner(this).lookup('controller:application');

      // Transition to the products page
      controller.transitionToRoute('yebo.products', { queryParams: { search: searchText } });
    }
  }
});
