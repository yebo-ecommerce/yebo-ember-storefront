import Ember from 'ember';
const { service } = Ember.inject;

export default Ember.Component.extend({
  productsGrid: service(),
  actions: {
    changePage(page) {
      // TODO: maybe validate here
      this.get('productsGrid').set('selected.page', page)
      this.sendAction('updateUrl', { page: page })
    },
    changeSort(sort) {
      // TODO: maybe validate here
      this.get('productsGrid').set('selected.sort', sort)
      this.sendAction('updateUrl', { sort: sort })
    },
    showAddProdCart(variant, quantity) {
      this.sendAction('showAddProdCart', variant, quantity)
    },

    addToCart(product){
      this.sendAction('addToCart', product.get('master'), 1, true)
    },

    addToCartNotRedirect(product){
      this.sendAction('addToCart', product.get('master'), 1, false)
    }
  }
});

