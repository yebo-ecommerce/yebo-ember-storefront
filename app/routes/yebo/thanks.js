import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
/**
  The thanks route.

  @class Thanks
  @namespace Route
  @extends Ember.Component
  */
export default Ember.Route.extend(AuthenticatedRouteMixin, {
  model: function() {
    const number = this.get("yebo").lastOrder;
    // Return a promise
    return new Ember.RSVP.Promise((resolve, reject) => {
      // Get the user
      this.get("sessionAccount.user").then((currentUser) => {
        // Get the user token
        let token = currentUser.get("token");

        // Yebo Store
        let store = this.get('yebo').store;

        // Get the order
        YeboSDK.Store.fetch(`orders/${number}`, { token: token, completed: true }, 'GET').then((res) => {
          // Push the records to the ember
          store.pushPayload(res);

          // Resolve passing the order
          resolve(store.peekRecord('order', res.order.number));
        }).catch((err) => {
          // Go back to home
          this.transitionTo('yebo.orders.index');
        });
      });
    });
  },

  redirect: function(model) {
    // TODO: if order empty redirect to ? when route is checkout
    // if(this.get("yebo.orderId") === null){
    //   // redirect if order not completed
    //   this.transitionTo('yebo.signin');
    // }
  },
});
