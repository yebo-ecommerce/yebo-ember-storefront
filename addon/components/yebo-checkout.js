import Ember from 'ember';
import layout from '../templates/components/yebo-checkout';
/**
  A single page checkout that reactively responds to changes in the
  `yebo.checkouts` service.

 **To Override:** You'll need to run the components generator:

 ```bash
 ember g yebo-ember-storefront-components
 ```

 This will install all of the Yebo Ember Storefront component files into your
 host application at `app/components/yebo-*.js`, ready to be extended or
 overriden.

 @class YeboCheckout
 @namespace Component
 @extends Ember.Component
 */
export default Ember.Component.extend({
  layout: layout,
  action: 'transitionCheckoutState',
  checkoutLoading: false,
  init() {
    this._super();

    this.get('yebo').on('checkoutStarted', () => {
      this.set("checkoutLoading", true);
    });

    this.get('yebo').on('checkoutEnded', () => {
      this.set("checkoutLoading", false);
    });
  },

  orderDidChange: Ember.on('init', Ember.observer('yebo.currentOrder', function() {
    if(this.get("yebo.currentOrder") !== null) {
      this.get('yebo').get('checkouts').trigger('checkoutCalled');
    }
  })),

  actions: {
    transitionCheckoutState: function(stateName) {
      this.sendAction('action', stateName);
    },
    setShipment: function(rateId) {
      // Trigger the event
      this.get('yebo').get('checkouts').trigger('setShipment', rateId);
    },
    checkout: function() {
      // Trigger the event
      this.get('yebo').get('checkouts').trigger('checkout');
    },
    editAddress: function(name) {
      // Trigger the event
      this.get('yebo').get('checkouts').trigger('editAddress', name);
    }
  }
});
